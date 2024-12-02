const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}
  
main()
.then(() => {
    console.log("connected to db!");
})
.catch(err => console.log(err));

const initDB = async () => {
    let newData = data.map((obj) => ({...obj, owner: '67416b75b7cf0bc5f7649c63'}));   // check the map function out
    await Listing.insertMany(newData);
    console.log("data was initialized");
}

initDB();