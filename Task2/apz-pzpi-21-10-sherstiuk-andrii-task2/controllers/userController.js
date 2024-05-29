const { validationResult } = require("express-validator");

const userService = require("../service/userService");
const ApiError = require("../exeptions/apiErrors");

class UserControllers {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
      }
      const { name, lastname, age, role, experience, sport_type, country, city, mail, password, price_per_lesson, weight, height } = req.body;
      let img = "";
      const userData = await userService.registration(name, lastname, +age, +experience, sport_type, country, city, mail, password, role, img, +price_per_lesson, weight, height);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { mail, password } = req.body;
      const userData = await userService.login(mail, password)
      return res.json(userData)
    }
    catch (e) {
      next(e);
    }
  }

  async getAuthUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user = await userService.getAuthUser(token);
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { role } = req.query;
      const allUser = await userService.getAllUsers(role);
      return res.json(allUser);
    } catch (e) {
      next(e)
    }
  }

  async getAllUsersWithFilters(req, res, next) {
    try {
      const { role, sport_type, minAge, maxAge, minExp, maxExp, minPrice, maxPrice, sort_by } = req.query;
      const allFilteringUsers = await userService.getAllUsersWithFilters(role, sport_type, minAge, maxAge, minExp, maxExp, minPrice, maxPrice, sort_by);
      return res.json(allFilteringUsers);
    } catch (e) {
      next(e)
    }
  }

  async deleteUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      res.json(await userService.deleteUser(token));
    } catch (e) {
      next(e)
    }
  }

  async changeUserData(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const {name, lastname, mail, role, price, country, city, age, experience, sport_type, reg_date, weight, height} = req.body;
      let photo = "";
      res.json(await userService.changeUserInfo(name, lastname, mail, role, price, country, city, age, experience, sport_type, reg_date, weight, height, photo, token));
    } catch (e) {
      next(e)
    }
  }

  async getUserHistory(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      res.json(await userService.getUserHistory(token));
    } catch (e) {
      next(e)
    }
  }

  async getUserResult(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      res.json(await userService.getUserResult(token, id));
    } catch (e) {
      next(e)
    }
  }

  async addNewResult(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { result, heartbeat, oxygen, temperature, dateOfResult, middle_speed, tiltAngle } = req.body;
      res.json(await userService.addNewResult(result, heartbeat, oxygen, temperature, dateOfResult, middle_speed, tiltAngle, token));
    } catch (e) {
      next(e)
    }
  }

  async deleteResult(req, res, next) {
    try {
      const { id } = req.params;
      res.json(await userService.deleteResult(id));
    } catch (e) {
      next(e)
    }
  }

  async getBannedUsers(req, res, next){
    try {
      res.json(await userService.getBannedUser());
    } catch (e) {
      next(e)
    }
  }

  async addBannedUser(req, res, next){
    try {
      const { id } = req.params;
      res.json(await userService.addBannedUser(id));
    } catch (e) {
      next(e)
    }
  }

  async removeBannedUser(req, res, next){
    try {
      const { id } = req.params;
      res.json(await userService.removeBannedUser(id));
    } catch (e) {
      next(e)
    }
  }

  async addReport(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const {recipientId, value} = req.body;
      res.json(await userService.addReport(recipientId, token, value));
    } catch (e) {
      next(e)
    }
  }

  async getLastServiceComments(req, res, next){
    try {
      const comments = await userService.getLastServiceComments();
      res.json(comments);
    } catch (e) {
      next(e)
    }
  }

  async addCommentToService(req, res, next){
    try {
      const {text} = req.body;
      const token = req.headers.authorization.split(" ")[1];
      return res.json(await userService.addCommentToService(token, text));
    } catch (e) {
      next(e)
    }
  }

  async deleteCommentFromService(req, res, next){
    try {
      const { id } = req.params;
      return res.json(await userService.deleteCommentFromService(id));
    } catch (e) {
      next(e)
    }
  }

  async addCommentToCoach(req, res, next){
    try {
      const {coachId, value} = req.body;
      const token = req.headers.authorization.split(" ")[1];
      res.json(await userService.addCommentToCoach(coachId, token, value));
    } catch (e) {
      next(e)
    }
  }

  async getReports(req, res, next){
    try {
      const { id } = req.params;
      res.json(await userService.getReports(id));
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserControllers();
