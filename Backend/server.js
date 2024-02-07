const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const app = express();
const port = 5000;

app.get('/ping', (req, res) => {
  res.send('<h1>Pong!</h1>');
});

app.get('/',async (req,res)=>{
  try{
    await mongoose.connect(process.env.MongoDb_url)
    res.status(200).send('Db is connected ')
  }catch(error){
    res.status(400).send('Connection failed')
  }
})



app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});

