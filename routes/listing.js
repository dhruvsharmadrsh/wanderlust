const express=require('express');
const router=express.Router();
const {listingSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require("../models/listing.js")




function validateListing(req, res, next) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
}





// Index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))


// New route
router.get('/new',wrapAsync(async(req,res)=>{
    res.render('listings/new.ejs');
}))


// Show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews")
    if (!listing) {  
        req.flash("error","Listing you requested for does not exit!")
        return res.redirect("/listings")
    
    }
    res.render('listings/show.ejs',{listing})
})
)


// Add/Create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    
    const listing=req.body.listing

    const newListing=new Listing(listing);


    await newListing.save();
    req.flash('success','New Listing Is Created');
    res.redirect("/listings")
        

}))


// Edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(id)
    const listing=await Listing.findById(id);
    // console.log(listing)
    if(!listing){
        req.flash("error","Listing you requested for does not exit!")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}))


// Update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let {listing}=req.body;
    await Listing.findByIdAndUpdate(id,{...listing})
    req.flash('success','Listing Updated');;
    res.redirect(`/listings/${id}`)
}) )


// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success','Listing Is Deleted');
    res.redirect('/listings');
}))

module.exports = router;
