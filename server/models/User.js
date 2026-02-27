const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    zipCode: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      default: ''
    },

    greenPoints: {
      type: Number,
      default: 0
    },

    badge: {
      type: String,
      enum: ['None', 'Green Starter', 'Eco Warrior', 'Local Hero'],
      default: 'None'
    },

    totalCO2Saved: {
      type: Number,
      default: 0
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalRatings: {
      type: Number,
      default: 0
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    // ✅ PASSWORD RESET FIELDS
    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpiry: {
      type: Date,
      default: null
    }

  },
  {
    timestamps: true
  }
);


// HASH PASSWORD BEFORE SAVE
userSchema.pre('save', async function () {

  if (!this.isModified('password')) return;

  const salt = bcrypt.genSaltSync(10);

  this.password = bcrypt.hashSync(this.password, salt);

});


// COMPARE PASSWORD
userSchema.methods.matchPassword = function (enteredPassword) {

  return bcrypt.compareSync(
    enteredPassword,
    this.password
  );

};


// UPDATE BADGE BASED ON GREEN POINTS
userSchema.methods.updateBadge = function () {

  if (this.greenPoints >= 100)
    this.badge = 'Local Hero';

  else if (this.greenPoints >= 50)
    this.badge = 'Eco Warrior';

  else if (this.greenPoints >= 10)
    this.badge = 'Green Starter';

  else
    this.badge = 'None';

};


module.exports = mongoose.model(
  'User',
  userSchema
);