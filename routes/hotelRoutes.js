const express = require('express');
const hotelController = require('./../controlles/hotelController');
const authController = require('./../controlles/authController')

const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(hotelController.getAllHotels)
  //.post(hotelController.createHotel);
  .post(
      authController.protect,
      hotelController.createHotel
    );  



    //router.get('/reviews', hotelController.getHotelReviews);

// router.route('/:id')
// .post(
//       authController.protect,
//       hotelController.createReview
//     );  
router
  .route('/:id')
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);
  

router.get('/hotelreviews/:id', 
authController.protect,
 hotelController.getHotelReviews);

router
  .route('/hotels-within/distance/:distance/center/:latlng/unit/:unit')
  .get(hotelController.hotelsWithin)

//router.use(authController.restrictTo('admin','business_owner' ));
//router.route('/').post(hotelController.createHotel);



module.exports = router;

