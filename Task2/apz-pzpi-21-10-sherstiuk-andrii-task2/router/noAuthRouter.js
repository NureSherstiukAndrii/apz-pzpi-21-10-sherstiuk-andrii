const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");

router.get("/serviceComments", userController.getLastServiceComments) //
      .get("/allUsers", userController.getAllUsers) //
      .get("/allUsersWithFilters", userController.getAllUsersWithFilters) //
      .get("/user/:id", userController.getUser); //

module.exports = router;