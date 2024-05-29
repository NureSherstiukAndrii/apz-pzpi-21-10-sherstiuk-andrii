const coachService = require("../service/coachService");
const tokenService = require("../service/tokenService");

class CoachControllers {
  async getAllClients(req, res, next){
    try {
      const { status } = req.query;
      const token = req.headers.authorization.split(" ")[1];
      const coachId = tokenService.getUserIdFromToken(token);
      res.json(await coachService.getAllClients(coachId, status));
    } catch (e) {
      next(e);
    }
  }

  async getCoachComments(req, res, next){
    try {
      const { coachId } = req.params;
      res.json(await coachService.getCoachComments(+coachId));
    } catch (e) {
      next(e);
    }
  }

  async deleteClient(req, res, next){
    try {
      const { id } = req.params;
      const token = req.headers.authorization.split(" ")[1];
      const coachId = tokenService.getUserIdFromToken(token);
      res.json(await coachService.deleteClient(coachId, id));
    } catch (e) {
      next(e);
    }
  }

  async addClient(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      res.json(await coachService.addClient(id, token));
    } catch (e) {
      next(e);
    }
  }

  async acceptClient(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      const coachId = tokenService.getUserIdFromToken(token);
      res.json(await coachService.acceptClient(coachId, id));
    } catch (e) {
      next(e);
    }
  }

  async addCoachRating(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { userId, newRating } = req.body;
      res.json(await coachService.addCoachRating(+newRating, token, +userId));
    } catch (e) {
      next(e);
    }
  }

  async getTopCoaches(req, res, next){
    try {
      const { sport_type } = req.query;
      res.json(await coachService.getTopCoaches(sport_type));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CoachControllers();
