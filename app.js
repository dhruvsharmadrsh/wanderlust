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


const listingRoute=require('./routes/listing.js');
const reviewRoute=require('./routes/review.js')
const userRoute=require("./routes/user.js")
 

const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);


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


app.get("/demouser",async(req,res)=>{
    let fakeUser=User({
        email:'student@gmail.com',
        username:'delta-student'
    })
    let registeredUser=await User.register(fakeUser,"helloWorld");
    res.send(registeredUser);
})


app.use('/listings',listingRoute)
app.use('/listings/:id/reviews',reviewRoute)
app.use("/",userRoute)



// Midleware  
app.all('*', (req,res,next)=>{
   next(new ExpressError(404, 'Page Not Found'));
})


// Error Handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message='something went wrong'}=err;
    res.status(statusCode).render('listings/error.ejs', {message});
});
