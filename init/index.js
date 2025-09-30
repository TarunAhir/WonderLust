const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const bdUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(bdUrl);

}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner : "68d3dc09ee4c9154d3bc1730"}));
    await Listing.insertMany(initdata.data);
    console.log("data was inserted");
};

initDB();