const express=require('express');
const router=express.Router({mergeParams:true});

// Users Route
// Index Route-/users 
router.get('/',(req,res)=>{
    res.send(`get users`)
})

// show route-/users/:id

router.get('/:id',(req,res)=>{
     res.send(`get users id`)
})

// new -users
router.post('/',(req,res)=>{
    res.send(`new users`)
})

// delete-users
router.delete('/:id',(req,res)=>{
    res.send(`delete the user`);
})

module.exports=router;