const express = require('express')
const router = express.Router();
const dataModel = require('./datamodel')

router.use(express.json())



router.get("/get-data",async (req,res)=>{
    try{
       const data =await  dataModel.find({})
       res.status(200).send(data) 
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.post("/post-data",(req,res)=>{
 res.status(201).json({
    message:"Get a post request"
 });
})

router.put("/update-data",(req,res)=>{
    res.status(200).json({
        message:"Get a put request"
    })
})


router.delete("/delete-data",(req,res)=>{
res.status(200).json({
    message:"Deleted a request"
})

})

module.exports = router;
