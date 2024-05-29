const { Router } = require("express");
const { body } = require("express-validator");
const router = Router();

const userController = require("../controllers/userController");

router.post("/registration",
  body("mail").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  userController.registration) //
    .post("/login", userController.login) //

module.exports = router;