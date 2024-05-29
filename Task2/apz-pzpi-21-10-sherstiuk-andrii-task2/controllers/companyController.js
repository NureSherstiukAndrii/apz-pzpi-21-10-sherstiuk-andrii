const {validationResult} = require("express-validator");

const companyService = require("../service/companyService");
const tokenService = require("../service/tokenService");
const ApiError = require("../exeptions/apiErrors");
const userService = require("../service/userService");

class CompanyControllers {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
      }
      const { name, description, owner, creationDate, mail, password } = req.body;
      const companyData = await companyService.registration(name, description, owner, creationDate, mail, password);
      return res.json(companyData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const {mail, password} = req.body;
      const userData = await companyService.login(mail, password)
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async getCompanies(req, res, next){
    try {
      const companies = await companyService.getCompanies();
      res.json(companies);
    } catch (e) {
      next(e);
    }
  }

  async getCompany(req, res, next){
    try {
      const { id } = req.params;
      const company = await companyService.getCompany(id);
      res.json(company[0]);
    } catch (e) {
      next(e);
    }
  }

  async getAuthCompany(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const company = await companyService.getAuthCompany(token);
      return res.json(company)
    } catch (e) {
      next(e);
    }
  }

  async getCoaches(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { status } = req.query;
      const companyCoaches = await companyService.getCoaches(token, status);
      res.json(companyCoaches);
    } catch (e) {
      next(e);
    }
  }

  async addCoach(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      res.json(await companyService.addCoach(id, token));
    } catch (e) {
      next(e);
    }
  }

  async acceptCoach(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      const companyId = tokenService.getUserIdFromToken(token);
      res.json(await companyService.acceptCoach(companyId, id));
    } catch (e) {
      next(e);
    }
  }

  async deleteCoach(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      const companyId = tokenService.getUserIdFromToken(token);
      res.json(await companyService.deleteCoach(companyId, id));
    } catch (e) {
      next(e);
    }
  }

}

module.exports = new CompanyControllers();
