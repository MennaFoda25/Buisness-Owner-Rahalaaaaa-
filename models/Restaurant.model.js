const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Restaurant must have a name"],
      trim: true,
    },
    Description: {
      type: String
    },
    workingDays: {
      type: String
    },
    StartingTime: {
      type: Number
    },
    closeAt: {
      type: Number
    },
    image: {
      type: [String],
    },
    restRequests:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },

    status: {  // Add the status field to the schema
      type: String,
      enum: ['active', 'in-active'],
      default: 'active',
    },
    priceLevel: {
      type: String,
      default: "$$",
    },
    address: {
      type: String,
      trim: true,
    },
    mapLocation: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    phone: {
      type: String,
      unique: true,
    },
    cuisine: [{
      type: String,
    }],
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
        },
      },
      address: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestReview',
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
