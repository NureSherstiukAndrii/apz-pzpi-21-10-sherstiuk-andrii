module.exports = class PostDto {
  constructor(post) {
    this.id = post.id;
    this.topic = post.topic;
    this.text = post.text;
    this.user_id = post.user_id;
    this.dateOfCreation = post.dateOfCreation;
  }
}