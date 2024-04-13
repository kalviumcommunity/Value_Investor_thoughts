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
router.post("/logout",protectRoute, logoutUser);
router.get("/get-data",protectRoute, getData);
router.get("/getUserPostedData/:id",protectRoute, getUserPosted);
router.delete("/deletePost/:id", protectRoute,deletePost);
router.get('/user-posts',protectRoute, getUserPosts);
router.post("/follow/:id", followUnFollowUser)
router.put("/update/:id",protectRoute,updateUser)
router.put('/editPost/:id',protectRoute, editPost);
router.post("/create", createPost);
module.exports = router;
