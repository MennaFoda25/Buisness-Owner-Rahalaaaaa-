const express = require('express');
const attractionController = require('../controlles/attractionController');
const authController = require('./../controlles/authController');
//const AttractionReview = require('./../controlles/');


const router = express.Router({ mergeParams: true });

router.route('/Reviews')
  .post(attractionController
    .createAttractionReview);
router.route('/Reviews/:id')
  .get(attractionController.getAttractionReviews);


router
  .route('/')
  .get(attractionController.getAllAttractions)
  .post(authController.protect,
    attractionController.createAttraction);

router
  .route('/:id')
  .get(attractionController.getAttraction)
  .patch(attractionController.updateAttraction)
  .delete(attractionController.deleteAttraction);

// router.get('/InActive',
//   attractionController.getInactiveAttractions);

// router.patch('/acceptAttraction/:id',
//   authController.protect,
//   attractionController.acceptAttraction);

router
  .route('/attractions-within/distance/:distance/center/:latlng/unit/:unit')
  .get(attractionController.attractionsWithin)


module.exports = router;

