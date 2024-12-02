const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const logError = require('../middleware.js');
// const validateListing = require("../middleware.js");
// const isOwner = require("../middleware.js");
const listingController = require("../controller/listing.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../listschema.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        console.log(error);
        throw new ExpressError(400, "Please fill-up properly !!");
    } 
    next();
}

const isOwner = async(req, res, next) => {
    let {id} = req.params; 
    let detail = await Listing.findById(id);
    if(!detail.owner._id.equals(res.locals.currUser._id)) {
        req.flash("update", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

router.route("/")
.get(wrapAsync(listingController.index))     // index route
.post(upload.single('Listing[image]'), validateListing, wrapAsync(listingController.addListing));    // add the new route 
// .post( upload.single('Listing[image]'), (req, res) => {
//     res.send(req.file);
// })

router.get("/new", logError, listingController.createShow);   // New route 

router.route("/:id")
.get(wrapAsync(listingController.detailListing))    //show route
.put(logError, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.updateListing));     // update

router.get("/:id/edit", isOwner, wrapAsync(listingController.editForm))   // ediitng portion

router.delete("/:id/delete", logError, isOwner, wrapAsync(listingController.deleteListing));   // delete 

module.exports = router;