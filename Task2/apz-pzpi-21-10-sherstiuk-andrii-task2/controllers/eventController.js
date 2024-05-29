const eventService = require("../service/eventService");
const tokenService = require("../service/tokenService");

class EventControllers {
  async getAllEvents(req, res, next){
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (e) {
      next(e);
    }
  }

  async getEvent(req, res, next){
    try {
      const { id } = req.params;
      const event = await eventService.getEvent(id);
      res.json(event[0]);
    } catch (e) {
      next(e);
    }
  }

  async getEventsWithFilters(req, res, next){
    try {
      const { continents, sport_types, sort_by } = req.query;
      const filteringReady = await eventService.getEventsWithFilters(continents, sport_types, sort_by);
      res.json(filteringReady);
    } catch (e) {
      next(e);
    }
  }

  async addEvent(req, res, next){
    try {
      const { name, description, continent, country, city, sport_type, start_date, people } = req.body;
      let img = ""
      res.json(await eventService.addEvent(name, description, continent, country, city, sport_type, start_date, people, img));
    } catch (e) {
      next(e);
    }
  }

  async removeEvent(req, res, next){
    try {
      const { id } = req.params;
      res.json(await eventService.removeEvent(id));
    } catch (e) {
      next(e);
    }
  }

  async addUserToEvent(req, res, next){
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = req.params;
      const userId = tokenService.getUserIdFromToken(token);
      return res.json(await eventService.addUserToEvent(+id, +userId));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new EventControllers();
