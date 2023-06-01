const express = require('express');
const restaurantController= require('../controlles/restaurantController');
const authController = require('./../controlles/authController');

const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(
   // authController.protect, // Protect the route, user must be logged in
   // authController.restrictTo('admin', 'business_owner'), // Restrict access to admin and business_owner roles
    restaurantController.createRestaurant);

  router
  .get('/restaurantsReviews/:id',
  authController.protect,
  restaurantController.getAllRestaurants)
 
// router.route('/:id')
// .post(
//   authController.protect,
//   restaurantController.createReview
// );

 router
.get('/restaurantReviews/:id', 
 authController.protect,
restaurantController.getRestReviews);

router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(restaurantController.updateRestaurant)
  .delete(restaurantController.deleteRestaurant);


router
  .route('/restaurants-within/distance/:distance/center/:latlng/unit/:unit')
  .get(restaurantController.restaurantsWithin)

module.exports = router;

