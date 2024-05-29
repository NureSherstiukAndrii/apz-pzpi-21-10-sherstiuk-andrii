const sql = require('mssql');

const dbConfig = require("../dbConnection");
const PostDto = require("../dtos/postDto");

class PostService {
  async getAllPersonalPosts(userId){
    try {
      const pool = await sql.connect(dbConfig);
      const allPosts = await pool.request().query(`SELECT * FROM [Posts] WHERE user_id = ${userId} ORDER BY dateOfCreation DESC`);
      return allPosts.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUserPosts(userId){
    try {
      const pool = await sql.connect(dbConfig);
      const allPosts = await pool.request().query(`SELECT * FROM [Posts] WHERE user_id = ${userId} ORDER BY dateOfCreation DESC`);
      return allPosts.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addPost(topic, text, userId) {
    try {
      const pool = await sql.connect(dbConfig);
      console.log('topic', typeof topic);
      console.log('text', typeof text);

      const result = await pool
        .request()
        .input('topic', sql.NVarChar, topic)
        .input('text', sql.NVarChar, text)
        .input('userId', sql.Int, userId)
        .query('INSERT INTO [Posts] (topic, text, user_id) VALUES (@topic, @text, @userId); SELECT SCOPE_IDENTITY() AS newPostId');

      const newPostId = result.recordset[0].newPostId;

      const newPost = await pool
        .request()
        .input('userId', sql.Int, userId)
        .input('newPostId', sql.Int, newPostId)
        .query('SELECT * FROM [Posts] WHERE user_id = @userId AND id = @newPostId');

      const postDto = new PostDto(newPost.recordset[0]);
      return { post: postDto };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async editPost(topic, text, postId) {
    try {
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('topic', sql.NVarChar, topic)
        .input('text', sql.NVarChar, text)
        .input('postId', sql.Int, postId)
        .query('UPDATE [Posts] SET topic = @topic, text = @text WHERE id = @postId');

      const editedPost = await pool
        .request()
        .input('postId', sql.Int, postId)
        .query('SELECT * FROM [Posts] WHERE id = @postId');

      const postDto = new PostDto(editedPost.recordset[0]);
      return { post: postDto, message: 'Post edited' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async deletePost(postId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`DELETE FROM [Posts] WHERE id = ${postId}`);
      return {
        postId: postId,
        message: "Post deleted"
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


module.exports = new PostService();