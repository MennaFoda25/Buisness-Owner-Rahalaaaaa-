const Hotel = require('../models/Hotel.model');
const catchAsync = require('../util/catcAsync');
const factory = require('./handlerFactroy');
exports.getHotel = factory.getOne(Hotel);
//exports.getAllHotels = factory.getAll(Hotel);
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
      status: 'in-active',
      createdBy: req.user._id
    });

    await document.save();

    res.status(201).json({
      status: 'success',
      data: {
        document
      }
    });
  }

});


exports.acceptHotelReq = catchAsync(async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({
  //     status: 'error',
  //     message: 'You are not authorized to perform this action',
  //   });
  // }
  const hotelId = req.params.id;
  const hotel = await Hotel.findOneAndUpdate(
    {
      hotelId,
      'status': 'in-active'
    },
    {
      $set: { 'status': 'active' }
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
    const hotel = await Hotel.findById(hotelId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'name',
      },
    });

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

exports.getAllHotels = catchAsync(async (req, res) => {
  let hotels;
  // Check if the user role is admin or user
  if (req.user.role === 'user') {
    hotels = await hotels.find({ 'status': 'active' });
  } else if (req.user.role === 'business_owner') {
    hotels = await Hotel.find({ 'createdBy': req.user._id });
  }
  //const hotels = await Hotel.find({ 'status': 'active' });

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels
    }
  });
});

exports.getInactiveHotels = catchAsync(async (req, res) => {
  const hotels = await Hotel.find({ 'status': 'in-active' });

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels
    }
  });
});

