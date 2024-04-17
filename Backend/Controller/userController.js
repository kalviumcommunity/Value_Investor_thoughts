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

    const updateUser = async (req, res) => {
      try {
       
        const { firstName, lastName, email, bio, password, profilePic } = req.body;
        const userId = req.params.id;
        const updatedUser = await userModel.findById(userId);
        const updateUsername = await postModel.findOne({
          "posts.postedBy": userId,
        });

        if (!updateUsername) {
          return res.status(404).json({ error: "Post content to update" });
        } else {
          await postModel.updateMany(
            { "posts.postedBy": userId },
            { $set: { "posts.$[elem].investorName": firstName, "posts.$[elem].profilePic": profilePic } },
            { arrayFilters: [{ "elem.postedBy": userId }] }
          );
        }

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        if (req.params.id !== userId.toString())
          return res
            .status(400)
            .json({ error: "You cannot update other user's profile" });
        if (firstName) updatedUser.firstName = firstName;
        if (lastName) updatedUser.lastName = lastName;
        if (email) updatedUser.email = email;
        if (bio) updatedUser.bio = bio;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          updatedUser.password = hashedPassword;
        }

        if (profilePic) {
          try {
            const publicId = updatedUser.profilePic
              ? updatedUser.profilePic.split("/").pop().split(".")[0]
              : null;
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
            const uploadResult = await cloudinary.uploader.upload(profilePic);
            updatedUser.profilePic = uploadResult.url;
          } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({
              error: "Failed to update profile picture",
              details: error.message,
            });
          }
        }

        await updatedUser.save();

        res.status(200).json({
          message: "Profile updated successfully",
          user: {
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            bio: updatedUser.bio,
            profilePic: updatedUser.profilePic,
          },
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

  const getUserPosts = async (req, res) => {
    try {
      const { decoded } = req;
      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: "User logged out successfully" });
      console.log("Error from getUserPosts:", error.message);
    }
  };

  const followUnFollowUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userToModify = await userModel.findById(id);
      const currentUser = await userModel.findById(req.user._id);

      if (id === req.user._id.toString())
        return res
          .status(400)
          .json({ error: "You cannot follow/unfollow yourself" });

      if (!userToModify || !currentUser)
        return res.status(400).json({ error: "User not found" });

      const isFollowing = currentUser.following.includes(id);

      if (isFollowing) {
        await userModel.findByIdAndUpdate(id, {
          $pull: { followers: req.user._id },
        });
        await userModel.findByIdAndUpdate(req.user._id, {
          $pull: { following: id },
        });
        res.status(200).json({ message: "User unfollowed successfully" });
      } else {
        // Follow user
        await userModel.findByIdAndUpdate(id, {
          $push: { followers: req.user._id },
        });
        await userModel.findByIdAndUpdate(req.user._id, {
          $push: { following: id },
        });
        res.status(200).json({ message: "User followed successfully" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in followUnFollowUser: ", err.message);
    }
  };

  const createPost = async (req, res) => {
    try {
      const { postedBy, text, img, Stock, investorName, profilePic } = req.body;
   
      if (!postedBy || postedBy.trim() === "" || !text || text.trim() === "") {
        return res.status(400).json({
          message: "postedBy and text fields are required and cannot be empty",
        });
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
        return res.status(400).json({
          message: `Text must be less than ${maxLength} characters`,
        });
      }

      const lowerCaseStockName = Stock.replace(/\s+/g, "").toLowerCase();

      let newPostData = {
        postedBy,
        text,
        img,
        Stock,
        investorName,
        profilePic,
        StockNameUser: lowerCaseStockName,
      };
      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        newPostData.img = uploadedResponse.url;
      }
      

      let existingData = await postModel.findOne({
        stockName: lowerCaseStockName,
      });
      if (!existingData) {
        existingData = new postModel({
          stockName: lowerCaseStockName,
          posts: [newPostData],
        });
        await existingData.save();
        return res.status(201).json({
          message: "Post created successfully",
          newPost: existingData,
        });
      } else {
        existingData.posts.push(newPostData);
        await existingData.save();
        return res.status(201).json({
          message: "Post created successfully",
          newPost: newPostData,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const editPost = async (req, res) => {
    try {
      const { investorName, postedBy, EditId, text, img, Stock} = req.body;
   
      if (!EditId) {
        return res.status(400).json({ message: "EditId is required" });
      }
      if (!text || text.trim() === "") {
        return res
          .status(400)
          .json({ message: "Text field is required and cannot be empty" });
      }

      const lowerCaseStockName = Stock.replace(/\s+/g, "").toLowerCase();

      // Find the existing post
      const existingPost = await postModel.findOne({ "posts._id": EditId });
      if (!existingPost) {
        console.error(`No post found with id ${EditId}`);
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the stock names match
      const postToUpdate = existingPost.posts.find(
        (post) => post._id.toString() === EditId
      );
      if (postToUpdate.StockNameUser !== lowerCaseStockName) {
        // Remove the post from the current stock
        await postModel.updateOne(
          { "posts._id": EditId },
          { $pull: { posts: { _id: EditId } } }
        );

        // Add the post to the new stock
        let newPostData = {
          investorName,
          text,
          StockNameUser: lowerCaseStockName,
          postedBy,
        };
        if (img) {
          const uploadedResponse = await cloudinary.uploader.upload(img);
          newPostData.img = uploadedResponse.url;
        } else {
          newPostData.img = postToUpdate.img; // Use the existing image
        }

        let stockExists = await postModel.findOne({
          stockName: lowerCaseStockName,
        });
        if (!stockExists) {
          await postModel.create({
            stockName: lowerCaseStockName,
            posts: [newPostData],
          });
        } else {
          await postModel.updateOne(
            { stockName: lowerCaseStockName },
            { $push: { posts: newPostData } }
          );
        }
      } else {
        // Update the post within the same stock
        await postModel.updateOne(
          { "posts._id": EditId },
          {
            $set: {
              "posts.$": {
                investorName,
                text,
                StockNameUser: lowerCaseStockName,
                postedBy,
                img: postToUpdate.img || img,
              },
            },
          }
        );
      }

      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const deletePost = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedPost = await postModel.findOneAndUpdate(
        { "posts._id": id },
        { $pull: { posts: { _id: id } } },
        { new: true }
      );
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      // console.error("Error deleting post:", error);
      res.status(500).json({ message: "Server error" });
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


