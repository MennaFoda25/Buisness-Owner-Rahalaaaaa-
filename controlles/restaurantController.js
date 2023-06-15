//const Restaurant = require('../models/Restaurant.mode');
const Restaurant = require('../models/Restaurant.model')
const factory = require('./handlerFactroy');
const catchAsync = require('../util/catcAsync');
//const RestReview = require('../models/restReviews.model');

exports.getRestaurant = factory.getOne(Restaurant);

exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);
exports.createRestaurant = catchAsync(async (req, res) => {
  let document;
  //console.log(req.user)
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not authorized to create Restaraunt '
    })
  }
  // Check user role
  if (req.user.role === 'admin') {
    document = await Restaurant.create(
      {
        ...req.body,
        status: 'active'
      });

  } else if (req.user.role === 'business_owner') {

    document = await Restaurant.create({
      ...req.body,
      status: 'in-active'
    });
    await document.save();

    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  };
});


exports.acceptRestaurantReq = catchAsync(async (req, res) => {
  const restaurantId = req.params.id;
  const restaurant = await Restaurant.findOneAndUpdate(
    {
      restaurantId,
      'status': 'in-active'
    },
    {
      $set: { 'status': 'active' }
    },
    { new: true }
  );
  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: 'Restaurant not found or request is already active',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Restaurant request has been accepted',
    data: {
      restaurant
    },
  });
});

exports.getInactiveRestaurants = catchAsync(async (req, res) => {
  const inactiveRestaurants = await Restaurant.find({ status: 'in-active' }).lean();

  res.status(200).json({
    status: 'success',
    results: inactiveRestaurants.length,
    data: {
      restaurants: inactiveRestaurants
    }
  });
});


exports.getRestReviews = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate("reviews");
    // console.log(restaurant)


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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hotel reviews',
    });
  }

};

// /restaurants-within/distance/:distance/center/:latlng/unit/:unit
exports.restaurantsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('please provide lat and lng in the format lat,lng', 400));
  }
  const restaurants = await Restaurant.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      restaurants
    }
  });
});

exports.getAllRestaurants = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.find({ 'status': 'active' });
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'user')) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not authorized to access this resource.'
    });
  }
  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants
    }
  });
});



