const Hotel = require('../models/Hotel.model');
const catchAsync = require('../util/catcAsync');
const factory = require('./handlerFactroy');
//const HotelReview = require('../models/hotelReviews.model');
//const restrictTo  = require('../controlles/authController');
exports.getHotel = factory.getOne(Hotel);
exports.getAllHotels = factory.getAll(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);


exports.createHotel = catchAsync(async (req, res) => {
  //const hotelId = req.body.hotel;
  let document;
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not authorized to create hotels.'
    });
  }
  if (req.user.role === 'admin') {
    document = await Hotel.create({
      ...req.body,
      status: 'active'
    });
  }
  else if (req.user.role === 'business_owner') {

    document = await Hotel.create({
      ...req.body,
      status: 'in-active'
    });

    await document.save();
    // Hotel.hotelRequest.push({
    //   hotel: document._id,
    //   status: hotelRequest.status
    // })
    res.status(201).json({
      status: 'success',
      data: {
        document
      }
    });
  }

});


exports.acceptHotelReq = catchAsync(async (req, res) => {

  const hotelId = req.params.id;
  const hotel = await Hotel.findOneAndUpdate(
    {
      hotelId,
      'hotelRequests.status': 'In-Active'
    },
    {
      $set: { 'hotelRequests.$.status': 'Active' }
    },
    { new: true }
  );

  if (!hotel) {
    return res.status(404).json({
      status: 'error',
      message: 'Hotel not found',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Hotel request is accepted',
    data: {
      hotel,
    },
  });
});


//find hotel request by matching ID
//  const hotelRequest = hotel.hotelRequests.find((request) => request._id.toString() === hotelId
//&& request.status === 'In-Active'
// );

// console.log(hotelRequest);

// if (!hotelRequest || hotelRequest.status !== 'In-Active' ) {
//   return res.status(400).json({
//     status: 'error',
//     message: 'Already approved / rejected request '
//   });
// }

// Set the status of the hotel request to 'Active'
// hotelRequest.status = 'Active';

// await hotel.save();

// hotel.hotelRequests.forEach((request) => {
//   if (request._id.toString() === hotelId && request.status === 'In-Active') {
//     request.status = 'Active';
//   }
// });
//   res.status(200).json({
//     status: 'success',
//     message: 'Hotel request is accepted'
//   });
// });

// /hotels-within/distance/:distance/center/:latlng/unit/:unit
exports.hotelsWithin = catchAsync(async (req, res, next) => {

  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('please provide lat and lng in the format lat,lng', 400));
  }
  const hotels = await Hotel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      hotels
    }
  });
}
);

exports.getHotelReviews = async (req, res) => {
  try {
    const hotelId = req.params.id;
    // Retrieve the hotel and populate the reviews
    const hotel = await Hotel.findById(hotelId).populate("reviews");
    //console.log(hotel)

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        reviews: hotel.reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hotel reviews',
    });
  }
};

// exports.showHotelInsights = async(req,res)=>{
//   try{
//     const hotelId = req.params.id;
//     //get the wanted hotel
//   const hotel = await Hotel.findById(hotelId);

//    if(!hotel){
//     return res.status(404).json({
//       status:'error',
//       message:'Hotel not found'
//     });
//     }

//     //Calculate insights ba2a
//     res.status(200).json({
//       status:'success',
//       data:{
//         insights
//       },
//     });
//   }
//   catch(error){
//     res.status(500).json({
//       status:'error',
//       message:'Failed to get hotel insights'
//     })
//   }
// };

