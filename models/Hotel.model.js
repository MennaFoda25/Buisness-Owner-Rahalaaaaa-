const mongoose = require("mongoose");
const validator = require("validator");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Hotel must have a name"],
      trim: true,
    },
    // hotelId:{
    //   type:String,
    //   required:[true,"A Hotel must have a hotelId"]
    // },
    image: {
      type: [String],
    },

    hotelRequests: [
      {
        hotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Hotel',

        },
        status: {
          type: String,
          enum: ['active', 'in-active'],
          default: 'active'
        }
      }
    ],

    Description: {
      type: String
    },

    priceLevel: {
      type: String,
      default: "$$",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    hotelClass: {
      type: Number,
      default: 0.0,
      min: [0, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
      required: true
    },
    mapLocation: {
      type: String,
      required: false
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // Array of numbers
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2; // Require exactly two elements
          },
          message:
            "Coordinates must contain exactly two elements (longitude and latitude).",
        },
      },
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HotelReview'
    }]
  },
  {
    //
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        if (ret.hotelRequests && ret.hotelRequests.length > 0) {
          ret.status = ret.hotelRequests[0].status; // Access the status field from the first hotel request
        } else {
          ret.status = 'In-Active';
        }
      },
    },
    toObject: { virtuals: true },
  }
);

hotelSchema.index({ location: "2dsphere" });
// hotelSchema.pre('find');


const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
