const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const logError = require('../middleware.js');
// const validateReview = require("../middleware.js");
// const isAuthor = require("../middleware.js");
const reviewController = require("../controller/review.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewSchema = require("../reviewschema.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, "Please give your feedback properly !!");
    }
    next();
}

const isAuthor = async(req, res, next) => {
    let {id, reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("reviewDelete", "You are not the user");
        res.redirect(`/listings/${id}`);
    } else {
        next();
    }
}


//post request for review

router.post("/", logError, validateReview,  wrapAsync(reviewController.createReview));

// delete request for review 

router.delete("/:reviewid", logError, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;