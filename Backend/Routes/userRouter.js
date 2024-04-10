const Express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  getData,
  getUserPosted,
  deletePost,
  updateUser,
  editPost,
  getUserPosts,
  createPost,
  followUnFollowUser
} = require("../Controller/userController");

const router = Express.Router();
const {protectRoute} = require('../middleWare/protectRoute')

// router.use(cors());
router.post("/register", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/get-data", getData);
router.get("/getUserPostedData/:id", getUserPosted);
router.delete("/deletePost/:id", protectRoute,deletePost);
router.get('/user-posts', protectRoute, getUserPosts);
router.post("/follow/:id", protectRoute, followUnFollowUser)
router.put("/update/:id", protectRoute,updateUser)
router.put('/editPost/:id', editPost);
router.post("/create", protectRoute, createPost);
module.exports = router;
