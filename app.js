const express=require("express");
const mongoose=require("mongoose");
const path=require('path')
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require('./utils/ExpressError.js');
const Review=require("./models/review.js")
const {listingSchema,reviewSchema}=require('./schema.js');
const session=require("express-session")
const flash=require("connect-flash");
const listings=require('./routes/listing.js');
const reviews=require('./routes/review.js')


const app=express();
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")))


const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
async function main() {
    await mongoose.connect(MONGO_URL)
}
main().then(()=>console.log("connected with database")).catch(err=>console.log(err));





const port =8080;
app.listen(port,()=>{
    console.log("server is listening at port 8080");
})  


// Root router
app.get("/",(req,res)=>{
    res.send("working well");
})


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash('error')
    next();
})

app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)




// Midleware  
app.all('*', (req,res,next)=>{
   next(new ExpressError(404, 'Page Not Found'));
})


// Error Handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message='something went wrong'}=err;
    res.status(statusCode).render('listings/error.ejs', {message});
});
