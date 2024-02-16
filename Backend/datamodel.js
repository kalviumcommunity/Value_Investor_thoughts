
const mongoose = require("mongoose")

const dataSchema = new mongoose.Schema({
investorName:{
    type:String,
    required:true,
},

stockName:{
    type:String,
    required:true,
},
content:{
    type:String,
    required:true,
}
},{timestamps:true});

module.exports = mongoose.model('data',dataSchema,'Datas')