const Hotel = require('../models/Hotel.model');
const catchAsync = require('../util/catcAsync');
const factory = require('./handlerFactroy');
//const HotelReview = require('../models/hotelReviews.model');
//const restrictTo  = require('../controlles/authController');

// create hotel restricted to owner 
exports.createHotel = factory.createHotel(Hotel);
// exports.createHotelRestricted = restrictTo('business_owner', this.createHotel);

exports.getHotel = factory.getOne(Hotel); 
exports.getAllHotels = factory.getAll(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);


// exports.createHotel = (Model) => {
//   return catchAsync(async (req, res) => {
//     let document;

//     if(!req.user ){
//       return res.status(401).json({
//         status: 'error',
//         message: 'You are not authorized to create hotels.'
//       })
//     }

//     // Check user role
//     if (req.user.role === 'admin') {
//       document = await Model.create(req.body);
//     } else if (req.user.role === 'business_owner') {
//       const hotelRequest = {
//         hotel: req.body.hotelId,
//         status: 'pending'
//       };

//       document = await Model.create({
//         ...req.body,
//         hotelRequests: [hotelRequest]
//       });
//     } else {
//       return next(new AppError('User role not supported for creating documents', 400));
//     }
    

//     res.status(201).json({
//       status: 'success',
//       data: {
//         document,
//       },
//     });
//   });
// };
// /hotels-within/distance/:distance/center/:latlng/unit/:unit
exports.hotelsWithin = catchAsync(async (req, res, next) => {

    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
      next(new AppError('please provide lat and lng in the format lat,lng', 400));
    }
    const hotels = await Hotel.find({
      location : { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
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
      const hotel = await Hotel.findById(hotelId);
      console.log(hotel)
  
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

  

