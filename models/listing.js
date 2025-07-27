const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1629047261508-1df7c85c7bd8?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => {
            if (typeof v === "object" && v.url) return v.url; // Extract URL from object
            return v?.trim() || "https://images.unsplash.com/photo-1629047261508-1df7c85c7bd8?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        },
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:Review,
        }
    ]
});

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;