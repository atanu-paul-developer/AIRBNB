const { response, request } = require("express");
const Listing = require("../models/listing");
const { authenticate } = require("passport");
let mapKey = process.env.MAP_KEY;

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listing/listing.ejs", {allListings});
};

module.exports.createShow =  (req, res) => {
    res.render("./listing/create.ejs");
};

module.exports.addListing = async(req, res) => {
    let geoUrl = ` https://api.maptiler.com/geocoding/${req.body.Listing.location}.json?key=${mapKey}&limit=1`;
    let response = await fetch(geoUrl, {
    method: 'get',
    });
     
    let finalResponse = await response.json();

    let url = req.file.path;
    let filename = req.file.filename;
    let newList = new Listing(req.body.Listing); 
    newList.owner = req.user._id;
    newList.image = {url, filename};
    await newList.save();
    newList.geometry = finalResponse.features[0].geometry.coordinates;
    let findList = await newList.save(); 
    req.flash("success", "New listing added successfully!");
    res.redirect("/listings");
};

module.exports.detailListing = async (req, res) => {
    let {id} = req.params;
    let detail = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    res.render("./listing/detail.ejs", {detail});
};

module.exports.editForm = async(req, res) => {
    let {id} = req.params;
    let detail = await Listing.findById(id);
    let newUrl = detail.image.url;
    let blurUrl = newUrl.replace("/upload", "/upload/h_200,w_250"); 
    res.render("./listing/edit.ejs", {detail, blurUrl});
};

module.exports.updateListing = async(req, res) => {
    let editUrl = req.file.path;
    let editFilename = req.file.filename;

    if (typeof req.file !== "undefined" ) {
        let {id} = req.params; 
        let updateList = await Listing.findByIdAndUpdate(id, {...req.body.Listing});
        updateList.image = {editUrl, editFilename};
        await updateList.save();
    }
    req.flash("update", "The detail of listing is updated");
    res.redirect("/listings");
};

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("delete", "The listing is deleted");
    res.redirect("/listings");
}; 

// you can write like this the above code 
        // fetch(url, {
        //     method: "get",
        //     headers: {
        //         Authorization: `Bearer ${mapToken}`
        //     }
        // })
        // .then(async (response) => {
        //     let data = await response.json()
        // })
        // .then((data) => {
        //     console.log(data);
        // })