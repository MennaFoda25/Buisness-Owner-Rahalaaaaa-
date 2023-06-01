const Restaurant = require('../models/Restaurant.model');
const factory = require('./handlerFactroy');
const catchAsync = require('../util/catcAsync');
const RestReview = require('../models/restReviews.model');


// exports.createRestaurant = (Model)=>{
//   return catchAsync(async (req, res) => {
//    let document;

//    if(!req.user || !req.user.role){
//      return res.status(401).json({
//        status: 'error',
//        message: 'You are not authorized to add.'
//      })
//    }

//    // Check user role
//    if (req.user.role === 'admin') {
//      document = await Model.create(req.body);
//    } else if (req.user.role === 'business_owner') {
//      const RestRequest = {
//        restaurant: req.body.restaurantId,
//        status: 'pending'
//      };

//      document = await Model.create({
//        ...req.body,
//        createdBy: req.user._id,
//        restaurantsRequests: [RestRequest]
//      });
//    } else {
//      return next(new AppError('User role not supported for creating documents', 400));
//    }

//    res.status(201).json({
//      status: 'success',
//      data: {
//        document,
//      },
//    });
//  });
// };

exports.getRestReviews = async(req,res)=>{
  try{
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    console.log(restaurant)


    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'restaurant not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        reviews: restaurant.reviews,
      },
    });
  }  catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hotel reviews',
    });
  }

};

exports.getAllRestaurants = async (req, res) => {
    try {
      const restaurantId = req.params.id;
  
      // Retrieve the hotel and populate the reviews
      const restaurant = await Restaurant.findById(restaurantId);
      console.log(restaurant)
  
      if (!restaurant) {
        return res.status(404).json({
          status: 'error',
          message: 'Restaurant not found',
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          reviews: restaurant.reviews,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch hotel reviews',
      });
    }
  };

  




  // exports.createRest =  catchAsync(async (req, res) => {

//     let document;

//     if(!req.user || !req.user.role){
//       return res.status(401).json({
//         status: 'error',
//         message: 'You are not authorized to add.'
//       })
//     }

//     // Check user role
//     if (req.user.role === 'admin') {
//       document = await create(req.body);
//     } else if (req.user.role === 'business_owner') {
//       const hotelRequest = {
//         hotel: req.body.hotelId,
//         status: 'pending'
//       };

//       document = await Model.create({
//         ...req.body,
//         createdBy: req.user._id,
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



//exports.createRestaurant = factory.createRes(Restaurant);
//exports.createRestaurant = factory.createRestaurant(Restaurant);
exports.createRestaurant = factory.createOne(Restaurant);
exports.getRestaurant = factory.getOne(Restaurant);
exports.getAllRestaurants = factory.getAll(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);








// /restaurants-within/distance/:distance/center/:latlng/unit/:unit
exports.restaurantsWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
      next(new AppError('please provide lat and lng in the format lat,lng', 400));
    }
    const restaurants = await Restaurant.find({
      location : { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        restaurants
      }
    });
  });

