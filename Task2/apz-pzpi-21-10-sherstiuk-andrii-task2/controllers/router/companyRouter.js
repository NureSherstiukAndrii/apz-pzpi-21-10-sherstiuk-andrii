const { Router } = require("express");
const {body} = require("express-validator");
const router = Router();

const companyController = require("../controllers/companyController");

router.post("/registration",
  body("mail").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  companyController.registration) //
  .post("/login", companyController.login) //
  .get("/getCompanies", companyController.getCompanies)
  .get("/getAuthCompany", companyController.getAuthCompany)//
  .get("/getCoaches", companyController.getCoaches) //
  .get("/getCompany/:id", companyController.getCompany) //
  .post("/addCoach/:id", companyController.addCoach) //
  .patch("/acceptCoach/:id", companyController.acceptCoach) //
  .delete("/deleteCoach/:id", companyController.deleteCoach) //

module.exports = router;