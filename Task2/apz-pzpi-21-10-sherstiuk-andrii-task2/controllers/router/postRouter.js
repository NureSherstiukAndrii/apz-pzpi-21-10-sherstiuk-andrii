const { Router } = require("express");
const router = Router();

const postController = require("../controllers/postController");

router.post("/addPost", postController.addPost)
  .get("/getAllPersonalPosts", postController.getAllPersonalPosts)
  .get("/getAllUserPosts/:id", postController.getAllUserPosts)
  .delete("/deletePost/:id", postController.deletePost)
  .patch("/editPost", postController.editPost);

module.exports = router;