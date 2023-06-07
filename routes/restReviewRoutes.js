const restReviewController = require('./../controlles/restReviewController')
const express = require('express')
const authController = require('./../controlles/authController')
const router = express.Router({ mergeParams: true });


router.route('/')
    //.get(hotelReviewController.getAllReviews)
    .post(restReviewController.createRestReview);

module.exports = router;