const express = require('express')
const router = require('./router')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express();
const cors = require('cors')
const port = 5000;

app.use(cors());

app.use(async (req,res,next)=>{
  try{
    await mongoose.connect(process.env.MongoDb_url)
    console.log('DB is connected')
    next()
  }catch(error){
    console.log('DB not connected')
  }
})

app.use('/',router);

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});

