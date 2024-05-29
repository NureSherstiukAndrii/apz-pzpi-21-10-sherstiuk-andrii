module.exports = class ServiceCommentDto {
  constructor(comment) {
    this.id = comment.id;
    this.text = comment.text;
    this.date = comment.date;
    this.user_id = comment.user_id;
  }
}