const Listing = require('../models/listing.js');
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    listing.reviews.push(newReview);
    // console.log(listing.reviews);
    await listing.save();

    req.flash("add", "Review added !!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    let {id, reviewid} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);

    req.flash("reviewDelete", "Review Delete !!");
    res.redirect(`/listings/${id}`);
};