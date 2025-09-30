const Listing = require("../models/listing.js");



module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings: allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", " Listing you requested dose not exist !");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename };
    await listing.save();
    req.flash("success", "New listing Created Successfully !");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", " Listing you requested dose not exist !");
        return res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", { listing, originalImage });
};


module.exports.updateListing = async (req, res) => { // FIXED - Added validateListing
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " Updated Successfully !");
    res.redirect(`/listings/${id}`); // FIXED - Template literal with backticks
};

module.exports.deleteListing = async (req, res) => { // FIXED - Added isLoggedIn middleware
    let { id } = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
    req.flash("success", "Deleted Successfully !");
    res.redirect("/listings");
};