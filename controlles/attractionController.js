const Attraction = require('../models/Attraction.model');
const factory = require('./handlerFactroy');
const catcAsync = require('../util/catcAsync');
const AttractionReview = require('./../models/AttractionReview.model');


exports.deleteAttraction = factory.deleteOne(Attraction);
exports.updateAttraction = factory.updateOne(Attraction);
exports.createAttraction = factory.createOne(Attraction);
exports.getAttraction = factory.getOne(Attraction);
exports.getAllAttractions = factory.getAll(Attraction);

exports.createAttractionReview = catcAsync(async (req, res) => {
  const { comment, userId } = req.body;
  const attId = req.body.place;

  const review = await AttractionReview.create({
    comment,
    place: attId,
    userId

  });
  if (!review) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create the review',
    });
  }

  const place = await Attraction.findByIdAndUpdate(attId, {
    $push: { reviews: review._id }
  },
    { new: true }
  );
  if (!place) {
    return res.status(404).json({
      status: 'error',
      message: 'Hotel not found',
    });
  }
  res.status(201).json({ status: 'Success', data: { review, place } });
});






// exports.createAttraction = catcAsync(async (req, res) => {
//   let document;
//   // if (!req.user || !req.user.role) {
//   //   return res.status(401).json({
//   //     status: 'error',
//   //     message: 'You are not authorized to add attraction '
//   //   })
//   // }

//   if (req.user.role === 'admin') {
//     document = await Attraction.create(
//       {
//         ...req.body,
//         status: 'active'
//       }
//     )
//   } else if (req.user.role === "business_owner") {
//     document = await Attraction.create({
//       ...req.body,
//       status: 'in-active'
//     });
//     await document.save();
//     res.status(201).json({
//       status: 'Success',
//       data: {
//         document,

//       },
//     });
//   };

// });

// exports.acceptAttraction = catcAsync(async (req, res) => {
//   const attractionId = req.params.id;
//   const attraction = await Attraction.findOneAndUpdate(
//     {
//       _id: attractionId,
//       status: 'in-active'
//     },
//     {
//       $set: { status: 'active' }
//     },
//     { new: true }
//   );

//   if (!attraction) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Place not found or is already accepted'
//     });
//   }

//   res.status(200).json({
//     status: 'Success',
//     data: {
//       attraction
//     }
//   });
// });


// exports.getInactiveAttractions = catcAsync(async (req, res) => {
//   const attractions = await Attraction.find({ status: 'in-active' });

//   res.status(200).json({
//     status: 'success',
//     results: attractions.length,
//     data: {
//       attractions
//     }
//   });
// });

// exports.getReview = async(req, res)=>{
//  try{
//   const attractionId = req.params.id;
//   const attraction =await Attraction.findById(attractionId).populate("reviews");
//   if(!attraction){
//  return res.status(404).json({
//   status:"error",
//   message:'Place not found'
//   });
//  }
// res.status(200).json({
//   status:'Success',
//   data:{
//     reviews: attraction.reviews
//   },
//  });
// } catch(error){
//   res.status(500).json({
//     status:"Error",
//     message: ' we are sorry!! failed to get Reviews'
//   });
// }
// };

exports.getAllAttractions = catcAsync(async (req, res) => {
  const attractions = await Attraction.find({ 'status': 'active' });
  res.status(200).json({
    status: 'success',
    results: attractions.length,
    data: {
      attractions
    }
  });
});
// /attractions-within/distance/:distance/center/:latlng/unit/:unit
exports.attractionsWithin = catcAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('please provide lat and lng in the format lat,lng', 400));
  }
  const attractions = await Attraction.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      attractions
    }
  });
});

exports.getAttractionReviews = async (req, res) => {
  try {
    const placeId = req.params.id;
    // Retrieve the hotel and populate the reviews
    const place = await Attraction.findById(placeId).populate("reviews");
    //console.log(hotel)

    if (!place) {
      return res.status(404).json({
        status: 'error',
        message: 'place not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        reviews: place.reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch place reviews',
    });
  }
};
