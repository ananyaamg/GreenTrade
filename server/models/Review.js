const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    role: {
      type: String,
      enum: ['buyer_to_seller', 'seller_to_buyer'],
      required: true,
    },
  },
  { timestamps: true }
);

// One review per transaction per direction
reviewSchema.index({ item: 1, reviewer: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
