const mongoose = require('mongoose');

const CO2_SAVINGS = {
  Electronics: 15,
  Books: 2,
  Tools: 5,
  Clothing: 3,
  Furniture: 20,
  Sports: 4,
  Other: 3,
};

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Giveaway', 'Lend', 'Trade'],
    },
    itemCategory: {
      type: String,
      enum: ['Electronics', 'Books', 'Tools', 'Clothing', 'Furniture', 'Sports', 'Other'],
      default: 'Other',
    },
    image: { type: String, default: '' },
    sustainabilityRating: { type: Number, min: 1, max: 5, required: true },
    status: {   
      type: String,
      enum: ['Available', 'Pending', 'Gifted'],
      default: 'Available',
    },
    estimatedCO2Saved: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    zipCode: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

itemSchema.pre('save', async function () {
  if (this.isModified('itemCategory') || this.isNew) {
    this.estimatedCO2Saved = CO2_SAVINGS[this.itemCategory] || 3;
  }
});

module.exports = mongoose.model('Item', itemSchema); 