const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Restaraunt must have a name"],
      trim: true,
    },
    image: {
      // type: mongoose.SchemaTypes.Url,
      type: String,
    },

    priceLevel: {
      type: String,
      default: "$$",
    },
    address: {
      type: String,
      trim: true,
    //  required:false
    },
    mapLocation:{
      type:String,
    //  required:false
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
      unique: true
    },
    
    cuisine: [{
      type : String
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
      
      coordinates:{
        type: [Number],
      required:true,
      validate:{
        validator: function(value){
          return value.length === 2;
        }
      }
      },
      address: String,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }]

    
    // reviews: [{}],

      // numberOfReviews : {},
      // rankingDenominator: {},

      // isClosed : {},
      // isLongClosed : {},
      // mealTypes : {},
      // hours : {},
      // webUrl : {},
      // website : {},
      // rankingString : {},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


restaurantSchema.index({location : '2dsphere'  });



const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
