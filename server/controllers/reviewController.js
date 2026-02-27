const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Item = require('../models/Item');
const User = require('../models/User');

// ── Submit a Review ──────────────────────────────────────
// POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { itemId, rating, feedback, role } = req.body;

  if (!itemId || !rating || !role) {
    res.status(400);
    throw new Error('itemId, rating and role are required');
  }

  const item = await Item.findById(itemId).populate('owner');

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Item must be Gifted to allow reviews
  if (item.status !== 'Gifted') {
    res.status(400);
    throw new Error('Reviews only allowed after item is marked as Gifted');
  }

  const reviewerId = req.user._id.toString();
  const ownerId = item.owner._id.toString();

  // Determine reviewer and reviewee based on role
  let revieweeId;

  if (role === 'buyer_to_seller') {
    // Buyer rates seller — reviewer must NOT be the owner
    if (reviewerId === ownerId) {
      res.status(403);
      throw new Error('Owner cannot rate themselves as buyer');
    }
    revieweeId = ownerId;
  } else if (role === 'seller_to_buyer') {
    // Seller rates buyer — reviewer MUST be the owner
    if (reviewerId !== ownerId) {
      res.status(403);
      throw new Error('Only the seller can submit a seller_to_buyer review');
    }
    // For seller_to_buyer we use item's zipCode users
    // We find who interacted — for now reviewee is passed in body
    if (!req.body.revieweeId) {
      res.status(400);
      throw new Error('revieweeId required for seller_to_buyer review');
    }
    revieweeId = req.body.revieweeId;
  } else {
    res.status(400);
    throw new Error('Invalid role');
  }

  // Check reviewer is not rating themselves
  if (reviewerId === revieweeId) {
    res.status(400);
    throw new Error('Cannot rate yourself');
  }

  // Check duplicate review
  const existing = await Review.findOne({
    item: itemId,
    reviewer: reviewerId,
    role,
  });

  if (existing) {
    res.status(400);
    throw new Error('You have already submitted a review for this transaction');
  }

  // Create review
  const review = await Review.create({
    item: itemId,
    reviewer: reviewerId,
    reviewee: revieweeId,
    rating: Number(rating),
    feedback: feedback || '',
    role,
  });

  // Update reviewee's average rating
  const allReviews = await Review.find({ reviewee: revieweeId });
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await User.findByIdAndUpdate(revieweeId, {
    averageRating: Math.round(avgRating * 10) / 10,
    totalRatings: allReviews.length,
  });

  const populated = await review.populate([
    { path: 'reviewer', select: 'name badge' },
    { path: 'reviewee', select: 'name badge' },
  ]);

  res.status(201).json(populated);
});

// ── Get Reviews FOR a User ───────────────────────────────
// GET /api/reviews/user/:userId
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate('reviewer', 'name badge')
    .populate('item', 'title category')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// ── Get Reviews FOR an Item ──────────────────────────────
// GET /api/reviews/item/:itemId
const getItemReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ item: req.params.itemId })
    .populate('reviewer', 'name badge')
    .populate('reviewee', 'name badge')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// ── Check if current user can review ────────────────────
// GET /api/reviews/can-review/:itemId
const canReview = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const reviewerId = req.user._id.toString();
  const ownerId = item.owner.toString();
  const isOwner = reviewerId === ownerId;

  // Determine which role this user can submit
  const role = isOwner ? 'seller_to_buyer' : 'buyer_to_seller';

  // Check if already reviewed
  const existing = await Review.findOne({
    item: req.params.itemId,
    reviewer: reviewerId,
    role,
  });

  res.json({
    canReview: item.status === 'Gifted' && !existing,
    isOwner,
    role,
    alreadyReviewed: !!existing,
    itemStatus: item.status,
  });
});

module.exports = { createReview, getUserReviews, getItemReviews, canReview };
