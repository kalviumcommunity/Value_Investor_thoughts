const postModel = require("../datamodel");
const userModel = require("../Validation/userModel");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
  try {
     const { postedBy, text, img, StockName ,investorName} = req.body;
 
     if (!postedBy || postedBy.trim() === '' || !text || text.trim() === '') {
       return res.status(400).json({ message: "postedBy and text fields are required and cannot be empty" });
     }
 
     const user = await userModel.findById(postedBy);
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     if (postedBy.toString() !== user._id.toString()) {
       return res.status(401).json({ message: "Unauthorized to create post" });
     }
     const maxLength = 1500;
     if (text.length > maxLength) {
       return res.status(400).json({ message: `Text must be less than ${maxLength} characters` });
     }
 
     let newPostData = { postedBy,text,investorName};
     if (img) {
       const uploadedResponse = await cloudinary.uploader.upload(img);
       newPostData.img = uploadedResponse.secure_url;
     }
 
     let existingData = await postModel.findOne({ stockName: StockName });
     if (!existingData) {
       existingData = new postModel({ stockName: StockName, posts: [newPostData] });
       await existingData.save();
       return res.status(201).json({ message: "post created successfully", newPost: existingData });
     } else {
       existingData.posts.push(newPostData);
       await existingData.save();
       return res.status(201).json({ message: "post created successfully", newPost: newPostData });
     }
  } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Internal server error" });
  }
 };
 
 
 const userPosted = async (req, res) => {
  try {
     const data = await DataModel.find({});
     if (!data) {
       return res.status(404).send({ message: "No data found" });
     }
     res.status(200).send(data);
  } catch (err) {
     console.error(err);
     res.status(500).send({ message: "Server error" });
  }
 };



const deletePost = async (req, res) => {
  try {
    const post = await post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "post not found to delete" });
    }

    if (post.postedBy.tostring() !== req.user._id.tostring()) {
      return res.status(401).json({ message: "Unauthorized to delete post" });
    }
    await post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(100).json({ message: err.message });
  }
};


module.exports = {
  createPost,userPosted,deletePost
};
