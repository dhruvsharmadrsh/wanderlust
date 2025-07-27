const express=require('express');
const app=express();
const users=require('./routes/user.js');
const posts=require('./routes/posts.js');
const cookieParser=require('cookie-parser');
const session=require("express-session");
const path=require('path');
const flash = require('connect-flash');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



app.listen(3000,()=>{
    console.log(`app is listing at port 3000`);
})

app.use(cookieParser('screate code'));

sessionOption={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOption));
  app.use(flash());

  app.use((req,res,next)=>{
    res.locals.successMsg=req.flash('success');
    res.locals.errorMsg=req.flash('error');
    next();
})


app.get("/regester",(req,res)=>{
    let {name='drsh'}=req.query; 
    req.session.name=name;
    if(name==='drsh'){
        req.flash("error",'user doesnt regester successfully');
    }else{
        req.flash("success",'user regester successfully');
    }

    res.redirect('/hello');
}) 

app.get("/hello",(req,res)=>{

    res.render('page.ejs',{name:req.session.name});
})

// app.get('/reqcount',(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//          req.session.count=1;
//     }
//     res.send(`you send request ${req.session.count} times`);

// })
// // Root Route 
// app.get('/',(req,res)=>{
//     const {name}=req.cookies;
//     res.send(`hi ${name} `);
// })

// app.get('/getcookies',(req,res)=>{
//     res.cookie('greet','hello')
//     res.cookie('Made_In',"India");
//     res.send('sending a cookie')
// })

// app.get('/getsignedcookies',(req,res)=>{
//     res.cookie('color','red',{signed:true})
//     res.send('signed cookie sent');
// })



// app.get('/verify',(req,res)=>{
//     console.log(req.cookies)
//     console.log(req.signedCookies);
//     res.send('done');
// })

// app.use('/users',users);
// app.use('/posts',posts);
