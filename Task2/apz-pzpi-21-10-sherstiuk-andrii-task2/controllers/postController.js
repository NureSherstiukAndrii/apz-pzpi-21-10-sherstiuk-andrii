const postService = require("../service/postService");
const tokenService = require("../service/tokenService");

class PostControllers {
  async getAllPersonalPosts(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userId = await tokenService.getUserIdFromToken(token);
      return res.json(await postService.getAllPersonalPosts(userId));
    } catch (e) {
      next(e);
    }
  }

  async getAllUserPosts(req, res, next){
    try {
      const { id } = req.params;
      return res.json(await postService.getAllUserPosts(id));
    } catch (e) {
      next(e);
    }
  }

  async addPost(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { topic, text } = req.body;
      const userId = await tokenService.getUserIdFromToken(token);
      const newPost = await postService.addPost(topic, text, userId);
      return res.json(newPost);
    } catch (e) {
      next(e);
    }
  }

  async editPost(req, res, next){
    try {
      const { topic, text, id } = req.body;
      const editedPost = await postService.editPost(topic, text, id);
      return res.json(editedPost);
    } catch (e) {
      next(e);
    }
  }


  async deletePost(req, res, next){
    try {
      const { id } = req.params;
      const result = await postService.deletePost(id);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PostControllers();
