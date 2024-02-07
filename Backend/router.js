const express = require('express')
const router = express.Router();

router.use(express.json())

router.get("/",(req,res)=>{
    res.json({
      message:"Get all data"
    })
})

router.get("/ping",(req,res)=>{
    res.send("pong")
})

router.post("/post-method",(req,res)=>{
 res.status(201).json({
    message:"Get a post request"
 });
})

router.put("/",(req,res)=>{
    res.status(200).json({
        message:"Get a put request"
    })
})


router.delete("/",(req,res)=>{
res.status(200).json({
    message:"Deleted a request"
})

})

module.exports = router;
