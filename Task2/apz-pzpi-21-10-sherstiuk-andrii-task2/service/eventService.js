const sql = require('mssql');

const googleBucketService = require("./googleBucketService");
const ApiError = require("../exeptions/apiErrors");
const UserDto = require("../dtos/userDto");
const dbConfig = require("../dbConnection");

class EventService {
  async getAllEvents() {
    try {
      const pool = await sql.connect(dbConfig);
      const eventsQuery = await pool.request().query(`
      SELECT [Events].*, 
             (SELECT COUNT(DISTINCT [User].id) 
              FROM [User]
              JOIN [Events_users] ON [User].id = [Events_users].user_id
              WHERE [Events_users].event_id = [Events].id) AS registeredUsersCount
      FROM [Events]
    `);

      const events = eventsQuery.recordset;

      return await Promise.all(events.map(async (event) => {
        if (event.preview) {
          return {...event, preview: "imageUrl"};
        }
        return event;
    }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getEventsWithFilters(continents, sport_types, sortingValue){
    const pool = await sql.connect(dbConfig);
    let query = `SELECT [Events].*, 
             (SELECT COUNT(DISTINCT [User].id) 
              FROM [User]
              JOIN [Events_users] ON [User].id = [Events_users].user_id
              WHERE [Events_users].event_id = [Events].id) AS registeredUsersCount
      FROM [Events] WHERE 1=1`;

    if (continents !== undefined) {
      const allContinents = continents.split(',').map(g => `'${g}'`).join(', ');
      query += ` AND (continent IN (${allContinents}))`;
    }

    if (sport_types !== undefined) {
      const allSportTypes = sport_types.split(',').map(g => `'${g}'`).join(', ');
      query += ` AND (sportType IN (${allSportTypes}))`;
    }

    if (sortingValue !== undefined){
      if (sortingValue === 'fromMinPeople') {
        sortingValue = 'people'
      }
      if (sortingValue === 'fromMaxPeople') {
        sortingValue = 'people DESC'
      }
      if (sortingValue === 'earliestStartDate') {
        sortingValue = 'start_date'
      }
      if (sortingValue === 'furthestStartDate') {
        sortingValue = 'start_date DESC'
      }
      query += ` ORDER BY ${sortingValue}`;
    }
    
    const filteringEvents = await pool.request().query(query);

    return await Promise.all(filteringEvents.recordset.map(async (event) => {
      if (event.preview) {
        return {...event, preview: "imageUrl"};
      }
      return event[0];
    }));
  }

  async getEvent(id){
    try {
      const pool = await sql.connect(dbConfig);
      const event = await pool.request().query(`SELECT * FROM [Events] WHERE id = ${id}`);

      const listOfUsers = await pool.request().query(`SELECT [User].id, [User].name, [User].lastname FROM [User]
      JOIN [Events_users] ON [User].id = [Events_users].user_id
      WHERE [Events_users].event_id = ${id};`);

      return await Promise.all(event.recordset.map(async (event) => {
        return {...event, preview: "imageUrl", registeredUsers: listOfUsers.recordset};
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addEvent(name, description, continent, country, city, sport_type, startDate, people, img="") {
    try {
      const pool = await sql.connect(dbConfig);

      const existingEvent = await pool
        .request()
        .input('name', sql.NVarChar, name)
        .query('SELECT * FROM [Events] WHERE name = @name');

      if (existingEvent.recordset.length > 0) {
        throw ApiError.BadRequest(`Соревнование ${name} уже существует`);
      }

      await pool
        .request()
        .input('name', sql.NVarChar, name)
        .input('description', sql.NVarChar, description)
        .input('country', sql.NVarChar, country)
        .input('city', sql.NVarChar, city)
        .input('startDate', sql.DateTime, startDate)
        .input('people', sql.Int, people)
        .input('continent', sql.NVarChar, continent)
        .input('img', sql.NVarChar, img)
        .input('sport_type', sql.NVarChar, sport_type)
        .query(`
        INSERT INTO [Events] (name, description, country, city, start_date, people, continent, preview, sportType)
        VALUES (@name, @description, @country, @city, @startDate, @people, @continent, @img, @sport_type)
      `);

      return "Event added";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async removeEvent(eventId){
    try {
      const pool = await sql.connect(dbConfig);
      const event = await pool.request().query(`SELECT preview FROM [Events] WHERE id = ${eventId}`);
      await googleBucketService.deleteImage(event.recordset[0].preview);
      await pool.request().query(`DELETE FROM [Events] WHERE id = ${eventId}`);
      return "Delete successful";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addUserToEvent(eventId, userId){
      const pool = await sql.connect(dbConfig);
      const user = await pool.request().query(`SELECT * FROM [Events_users] WHERE user_id = ${userId} AND event_id = ${eventId}`);
      if (user.recordset.length > 0) {
        throw ApiError.BadRequest(`You already registered`);
      }
      await pool.request().query(`INSERT INTO [Events_users] (user_id, event_id) VALUES (${userId}, ${eventId})`);
      const getLastUserAdded = await pool.request().query(`SELECT * FROM [User] WHERE id=${userId}`);

    return {
      user: new UserDto(getLastUserAdded.recordset[0]),
      message: 'Successful registration',
    };
  }
}



module.exports = new EventService();