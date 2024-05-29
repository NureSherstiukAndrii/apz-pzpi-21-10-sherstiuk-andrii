const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");

router.get("/bannedUsers", userController.getBannedUsers) //
  .get("/getReports/:id", userController.getReports) //
  .patch("/addBannedUser/:id", userController.addBannedUser) //
  .patch("/deleteBannedUser/:id", userController.removeBannedUser) //
  .delete("/deleteServiceComment/:id", userController.deleteCommentFromService); //

module.exports = router;