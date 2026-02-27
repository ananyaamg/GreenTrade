const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');


// ─────────────────────────────────────────────
// PROTECT ROUTES (LOGIN REQUIRED)
// ─────────────────────────────────────────────
const protect = asyncHandler(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    try {

      token =
        req.headers.authorization.split(' ')[1];


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      // ✅ loads ALL fields including adminZipCodes
      req.user =
        await User.findById(decoded.id)
          .select('-password');


      if (!req.user) {

        res.status(401);
        throw new Error('User not found');

      }


      next();

    }
    catch (error) {

      res.status(401);

      throw new Error(
        'Not authorized, token failed'
      );

    }

  }


  if (!token) {

    res.status(401);

    throw new Error(
      'Not authorized, no token'
    );

  }

});


// ─────────────────────────────────────────────
// ADMIN ONLY MIDDLEWARE
// ─────────────────────────────────────────────
const admin = (

  req,
  res,
  next

) => {

  if (
    req.user &&
    req.user.isAdmin
  ) {

    next();

  }
  else {

    res.status(403);

    throw new Error(
      'Admin access only'
    );

  }

};


module.exports = {

  protect,
  admin

};
module.exports = { protect };