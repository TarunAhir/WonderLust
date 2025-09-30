const express = require("express");
const router = express.Router({mergeParams :true}); // id ataki na jay te mate mesrgeParams parante is listings and child is review !
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Controller
const reviewController = require("../controllers/review.js")

  


// POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));




module.exports = router;