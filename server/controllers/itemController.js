const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');
const User = require('../models/User');


// CREATE ITEM
const createItem = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    category,
    itemCategory,
    sustainabilityRating,
    price
  } = req.body;


  if (
    !title ||
    !description ||
    !category ||
    !sustainabilityRating
  ) {

    res.status(400);
    throw new Error(
      'Please fill all required fields'
    );

  }


  const image = req.file
    ? req.file.path
    : '';


  const item = await Item.create({

    title,
    description,
    category,

    itemCategory:
      itemCategory || 'Other',

    image,

    sustainabilityRating:
      Number(sustainabilityRating),

    price:
      category === 'Lend'
        ? Number(price) || 0
        : 0,

    owner:
      req.user._id,

    zipCode:
      req.user.zipCode,

    isApproved:
      false

  });


  res.status(201).json(item);

});


// ✅ UPDATED GET ITEMS WITH ADMIN ZIP SUPPORT
const getItems = asyncHandler(async (req, res) => {

  const {
    category,
    status
  } = req.query;


  let filter = {};


  // ADMIN LOGIC
  if (req.user.isAdmin) {

    if (
      req.user.adminZipCodes &&
      req.user.adminZipCodes.length > 0
    ) {

      filter.zipCode = {

        $in:
          req.user.adminZipCodes

      };

    }

    // else → adminZipCodes empty
    // admin sees ALL items

  }


  // NORMAL USER LOGIC
  else {

    filter.zipCode =
      req.user.zipCode;

    filter.isApproved =
      true;

  }


  // CATEGORY FILTER
  if (
    category &&
    category !== 'All'
  ) {

    filter.category =
      category;

  }


  // STATUS FILTER
  if (
    status &&
    status !== 'All'
  ) {

    filter.status =
      status;

  }


  const items =
    await Item.find(filter)

      .populate(
        'owner',
        'name email badge phone averageRating totalRatings'
      )

      .sort({
        createdAt: -1
      });


  res.json(items);

});


// GET ITEM BY ID
const getItemById = asyncHandler(async (req, res) => {

  const item =
    await Item.findById(
      req.params.id
    )

      .populate(
        'owner',
        'name email badge zipCode phone averageRating totalRatings'
      );


  if (!item) {

    res.status(404);

    throw new Error(
      'Item not found'
    );

  }


  const isOwner =
    item.owner._id.toString()
    === req.user._id.toString();


  const isAdmin =
    req.user.isAdmin;


  if (
    !item.isApproved &&
    !isOwner &&
    !isAdmin
  ) {

    res.status(403);

    throw new Error(
      'This item is pending approval'
    );

  }


  if (
    !isAdmin &&
    item.zipCode !==
      req.user.zipCode
  ) {

    res.status(403);

    throw new Error(
      'Access denied: Item not in your locality'
    );

  }


  res.json(item);

});


// UPDATE ITEM
const updateItem = asyncHandler(async (req, res) => {

  const item =
    await Item.findById(
      req.params.id
    );


  if (!item) {

    res.status(404);

    throw new Error(
      'Item not found'
    );

  }


  if (
    item.owner.toString()
    !== req.user._id.toString()
  ) {

    res.status(403);

    throw new Error(
      'Not authorized'
    );

  }


  const previousStatus =
    item.status;


  const newStatus =
    req.body.status ||
    item.status;


  item.title =
    req.body.title ||
    item.title;


  item.description =
    req.body.description ||
    item.description;


  item.category =
    req.body.category ||
    item.category;


  item.itemCategory =
    req.body.itemCategory ||
    item.itemCategory;


  item.sustainabilityRating =
    req.body.sustainabilityRating ||
    item.sustainabilityRating;


  item.status =
    newStatus;


  item.price =
    item.category === 'Lend'
      ? Number(req.body.price) >= 0
        ? Number(req.body.price)
        : item.price
      : 0;


  if (req.file) {

    item.image =
      req.file.path;

  }


  const updatedItem =
    await item.save();


  if (
    previousStatus !== 'Gifted' &&
    newStatus === 'Gifted'
  ) {

    const user =
      await User.findById(
        req.user._id
      );


    user.greenPoints += 20;


    user.totalCO2Saved +=
      item.estimatedCO2Saved;


    user.updateBadge();


    await user.save();

  }


  res.json(updatedItem);

});


// DELETE ITEM
const deleteItem = asyncHandler(async (req, res) => {

  const item =
    await Item.findById(
      req.params.id
    );


  if (!item) {

    res.status(404);

    throw new Error(
      'Item not found'
    );

  }


  if (
    item.owner.toString()
    !== req.user._id.toString()
  ) {

    res.status(403);

    throw new Error(
      'Not authorized'
    );

  }


  await item.deleteOne();


  res.json({

    message:
      'Item removed successfully'

  });

});


// GET MY ITEMS
const getMyItems = asyncHandler(async (req, res) => {

  const items =
    await Item.find({

      owner:
        req.user._id

    })

      .sort({

        createdAt: -1

      });


  res.json(items);

});


module.exports = {

  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems

};