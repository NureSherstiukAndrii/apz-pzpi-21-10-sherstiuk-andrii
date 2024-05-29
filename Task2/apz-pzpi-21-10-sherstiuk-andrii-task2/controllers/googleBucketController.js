// const googleBucketService = require("../service/googleBucketService");
//
// class googleBucketControllers {
//
//   async addUserPhoto(req, res, next) {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: 'No image file provided.' });
//       }
//
//       const imageUrl = await googleBucketService.addImage(req.file.buffer, req.file.originalname);
//
//       res.json({ imageUrl });
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   async editUserPhoto(req, res, next){
//     try {
//       const newPhoto = req.files[0];
//       const { oldPhoto } = req.body;
//       const img = await googleBucketService.editImage(oldPhoto, newPhoto.buffer, newPhoto.originalname)
//       res.json({ img })
//     } catch (e) {
//       next(e);
//     }
//   }
//
//
//   async deleteUserPhoto(req, res, next){
//     try {
//       const { postId } = req.body;
//       await postService.deletePost(postId);
//     } catch (e) {
//       next(e);
//     }
//   }
// }
//
// module.exports = new googleBucketControllers();
