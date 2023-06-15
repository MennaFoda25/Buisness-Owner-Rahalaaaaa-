const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A place must have a name"],
      trim: true,
    },
    image: {
      type: [String],
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

    Description: {
      type: String
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
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttractionReview'
    }],

    activityDesctiptor: [{
      type: String
    }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



attractionSchema.index({ location: '2dsphere' });



const Attraction = mongoose.model("Attraction", attractionSchema);
module.exports = Attraction;
