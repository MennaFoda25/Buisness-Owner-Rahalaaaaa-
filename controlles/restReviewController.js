const RestReview = require('./../models/restReviews.model');
const Restaurant = require('./../models/Restaurant.model');
const catcAsync = require('../util/catcAsync');

// exports.createrestReview = catcAsync(async (req, res, next) => {
//   const { comment, rating, user ,restaurantId} = req.body;


//   // Create the review using the Review model
//   const review = await RestReview.create({
//     comment,
//     rating,
//     restaurant : restaurantId,
//     user
//   });

//   if (!review) {
//     return res.status(500).json({
//       status: 'error',
//       message: 'Failed to create the review',
//     });
//   }

//   // Add the newly created review ID to the hotel's reviews array
//   const restaurant = await Restaurant.findByIdAndUpdate(
//     restaurantId,
//     { $push: { reviews: review._id } },
//     { new: true }
//   );

//   if (!restaurant) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Restaurant not found',
//     });
//   }

//   res.status(201).json({ status: 'success', data: { review, restaurant} });
// });


exports.createRestReview = catcAsync(async (req, res) => {
  const { comment, rating, userId } = req.body;
  const restaurantId = req.body.restaurant;

  // Create the review using the Review model
  const review = await RestReview.create({
    comment,
    rating,
    restaurant: restaurantId,
    userId,
  });
  if (!review) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create the review',
    });
  }
  // Add the newly created review to the restaurant's reviews array
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $push: { reviews: review._id } },
    { new: true }
  );

  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: 'restaurant not found'
    });
  }

  res.status(201).json({ status: 'success', data: { review, restaurant } });
});