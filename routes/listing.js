const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });    //multer save image in cloudinary storage

// Controller
const listingController = require("../controllers/listing.js")

router.route("/")
    .get(wrapAsync(listingController.index))       //index route 
    .post(isLoggedIn,

        upload.single('listing[image]'),                     //create route          
        validateListing,
        wrapAsync(listingController.createListing));

// new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))                                         //show route
    .put(isLoggedIn, isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));              //delete route


// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;