const express=require('express');
const router =express.Router({mergeParams:true});

// posts Route
// Index Route-/posts 
router.get('/',(req,res)=>{
    res.send(`get posts`)
})

// show route-/posts/:id

router.get('/:id',(req,res)=>{
     res.send(`get posts id`)
})

// new -posts
router.post('/',(req,res)=>{
    res.send(`new posts`)
})

// delete-posts
router.delete('/:id',(req,res)=>{
    res.send(`delete the user`);
})

module.exports=router