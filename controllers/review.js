
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview =async (req, res) => {
console.log(req.body, "review from data ");
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
newReview.author = req.user._id;

listing.reviews.push(newReview);
console.log(req.body.review);
await newReview.save();
await listing.save();
   req.flash("success", "Review sent Successfully !");
res.redirect(`/listings/${listing._id}`); // FIXED - Template literal with backticks
};



module.exports.deleteReview = async (req, res) => { // FIXED - Added wrapAsync
let { id, reviewId } = req.params;
await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
await Review.findByIdAndDelete(reviewId);
req.flash("success", "Review delete Successfully !");
res.redirect(`/listings/${id}`); // FIXED - Template literal with backticks
};