  const bcrypt = require("bcrypt");
  const {
    generateToken,
  } = require("../utils/helpers/generate_Token_and_cookies");
  const DataModel = require("../datamodel");

  const {
    validateRegister,
    validateLogin,
  } = require("../Validation/Registration");
  const userModel = require("../Validation/userModel");
  const postModel = require("../datamodel");
  const cloudinary = require("cloudinary").v2;
  const dotenv = require("dotenv");
  dotenv.config(); 


  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  
  const signupUser = async (req, res) => {
    try {
      const { firstName, email, password, bio, ProfilePic } = req.body;
      const { error, value } = validateRegister(req.body);
      if (error) {
        return res.status(404).json({ error: "Cannot get data from joi" });
      }
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        console.log(error);
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        firstName,
        email,
        password: hashedPassword,
        ProfilePic,
        bio,
      });
      await newUser.save();
      if (newUser) {
        const token = generateToken(newUser, res);
        res.status(201).json({
          message: "Signup successfully",
          token: token,
          user: {
            _id: newUser._id,
            name: newUser.firstName,
            email: newUser.email,
            bio: newUser.bio,
            ProfilePic: newUser.ProfilePic,
          },
        });
      } else {
        return res.status(400).json({ error: "Invalid user data" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log("Error in signupUser:", error.message);
    }
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const { error, value } = validateLogin(req.body);
      if (error) {
        console.log(error);
        return res.status(404).send(error.message);
      }
      const user = await userModel.findOne({ email: email });
      if (!user) return res.status(400).json({ error: "Invalid Email" });
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect)
        return res.status(401).json({ error: "Wrong password" });

      // Generate token and send response with user data
      const token = generateToken(user, res);
      res.status(200).json({
        message: "Login successfully",
        token: token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio,
          profilePic: user.profilePic,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

  const logoutUser = async (req, res) => {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "User logged out successfully" });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getData = async (req, res) => {
    try {
      const data = await DataModel.find({});
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  const getUserPosted = async (req, res) => {
    try {
      const userId = req.params.id;
      // Fetch all posts where 'postedBy' matches 'userId'
      const data = await DataModel.find({ "posts.postedBy": userId });
      // Extract only the posts from the data
      const userPosts = data.map(item => item.posts.filter(post => post.postedBy === userId)).flat();
      res.status(200).send(userPosts);
    } catch (err) {
      console.error("Error in getUserPosted:", err.message); // Log any errors
      res.status(400).send(err.message);
    }
  };

 

  module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    getData,
    getUserPosts,
    updateUser,
    deletePost,
    createPost,
    editPost,
    getUserPosted,
    followUnFollowUser,
  };


