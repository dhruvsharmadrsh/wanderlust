const mongoose = require("mongoose");
const data = require("../init/data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(data.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

initDB();