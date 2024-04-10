const express = require("express");
const router = express.Router();
const cors = require('cors');
const {
    createPost,
    userPosted,
    deletePost,
    editPost,
} = require("../Controller/postController");
const {protectRoute} = require("../middleWare/protectRoute");

// Enable CORS for all routes
router.use(cors());

// Define routes for editing and deleting posts
router.put('/post/:id', protectRoute, editPost);
router.delete('/posts/:id', protectRoute, deletePost);
router.post("/create", protectRoute, createPost);
router.get("/get-user-Posted", userPosted);

// Export the router
module.exports = router;