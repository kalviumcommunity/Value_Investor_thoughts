const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    stockName: {
      type: String,
      require: false,
    },
    posts: [
      {
        investorName: {
          type: String,
          require: false,
        },
        editId: {
          type: String,
          required: false,
        },
        text: {
          // New field for image URL
          type: String,
          required: false, // Assuming img is optional
        },
        img: {
          // New field for image URL
          type: String,
          required: false, // Assuming img is optional
        },
        profilePic: {
          type: String,
          required: false, // Assuming img is optional
        },
        StockNameUser: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const DataModel = mongoose.model("posts", dataSchema);

module.exports = DataModel;
