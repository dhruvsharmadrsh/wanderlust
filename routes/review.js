const express=require('express');
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require('../schema.js');
const Review=require("../models/review.js")
const ExpressError=require('../utils/ExpressError.js');
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require("../models/listing.js")



function validateReview(req,res,next){
    //  console.log("req.body =", req.body); 
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        console.log(errMsg);
        throw new ExpressError(400,errMsg)
    }
    else{
        next();
    }
}



// Review Route
// post review route
router.post('/',validateReview ,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    const newReview=await new Review(req.body.review);
    listing.reviews.push(newReview);
    // console.log(newReview);
    // console.log(listing);
    // console.log(`/listings/${listing._id}`);
    await newReview.save();   

    await listing.save();    
    req.flash('success','New Review Is Created');
    res.redirect(`/listings/${listing._id}`);
}));    


// Delete Review Route

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // console.log(id," ",reviewId )
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews :reviewId}});
    
    req.flash('success','Review Is Deleted');

    res.redirect(`/listings/${id}`);
}))

module.exports=router