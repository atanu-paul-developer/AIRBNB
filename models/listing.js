const { string, required } = require('joi');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require("./review.js");
const { type } = require('../listschema.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    }, 
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ], 
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }, 
    geometry: {
        type: Array,
        coordinates: {
            type: [Number], // Array of longitude, latitude
        },
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;