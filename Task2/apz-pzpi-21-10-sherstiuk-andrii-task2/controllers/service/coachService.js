const sql = require('mssql');
const dbConfig = require("../dbConnection");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exeptions/apiErrors");
const tokenService = require("../service/tokenService");

class CoachService {
  async getAllClients(coachId, status){
    try {
      const pool = await sql.connect(dbConfig);
      const allCoachClients = await pool.request()
        .query(`SELECT U.id, U.name, U.lastname, CC.athleteStatus, CC.dateOfApplication
          FROM [Coach_clients] CC
          JOIN [User] U ON CC.athleteId = U.id
          WHERE CC.coachId = ${coachId} AND athleteStatus='${status}';
         `);
      return allCoachClients.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoachComments(coachId){
    try {
      const pool = await sql.connect(dbConfig);
      const commentsQuery = await pool.request().query(
        `SELECT 
            SenderUser.id AS id, 
            SenderUser.name AS SenderName, 
            SenderUser.lastname AS SenderLastname, 
            Coach_comments.text, 
            Coach_comments.dateOfCreation
        FROM [Coach_comments]
        JOIN [User] AS CoachUser ON [Coach_comments].coachId = CoachUser.id
        JOIN [User] AS SenderUser ON [Coach_comments].senderId = SenderUser.id
        WHERE [Coach_comments].coachId = ${coachId};
        `);

      return commentsQuery.recordset;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteClient(coachId, clientId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`DELETE FROM [Coach_clients] WHERE coachId = ${coachId} AND athleteId = ${clientId}`);
      return `Client reject succesfully`
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addClient(coachId, token){
    if(token === 'null'){
      throw ApiError.UnauthorizedError();
    }
    const clientId = tokenService.getUserIdFromToken(token);
    const pool = await sql.connect(dbConfig);
    const applicant = await pool.request().query(`SELECT * FROM [Coach_clients] WHERE coachId = ${coachId} AND athleteId = ${clientId}`);
    if (applicant.recordset.length > 0) {
      return `You already sent application`;
    }
    await pool.request().query(`INSERT INTO [Coach_clients] (coachId, athleteId) VALUES (${coachId}, ${clientId})`);
    return `Application sent`;
  }

  async acceptClient(coachId, clientId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`UPDATE [Coach_clients] SET athleteStatus='accepted' WHERE coachId = ${coachId} AND athleteId = ${clientId}`);
      const acceptedClient =  await pool.request().query(`SELECT * FROM [User] WHERE id = ${clientId}`);
      return new UserDto(acceptedClient.recordset[0]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addCoachRating(rating, token, coachId) {
    try {
      const pool = await sql.connect(dbConfig);
      if(token === 'null'){
        throw ApiError.UnauthorizedError();
      }
      const valuer = await tokenService.getUserIdFromToken(token);
      const checkValuer = await pool.request().query(`SELECT * FROM [Coach_ratings] WHERE valuerId = ${valuer} AND coachId = ${coachId}`);

      if(checkValuer.recordset.length > 0){
        throw ApiError.BadRequest('You have already rated');
      }

      await pool.request().query(`INSERT INTO [Coach_ratings] (ratingValue, valuerId, coachId) 
        VALUES (${rating}, ${valuer}, ${coachId})`);
      return "Rating sent"
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTopCoaches(sport_type) {
    try {
      const pool = await sql.connect(dbConfig);
      const betterCoaches = await pool
        .request()
        .query(`SELECT TOP 5 U.id, U.name, U.lastname, U.role, AVG(CR.ratingValue) AS avgRating
              FROM [User] U
              JOIN [Coach_ratings] CR ON U.id = CR.coachId
              WHERE U.role = 'coach' AND U.sport_type = '${sport_type}'
              GROUP BY U.id, U.name, U.lastname, U.role, U.sport_type
              ORDER BY avgRating DESC;
            `);

      return betterCoaches.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


module.exports = new CoachService();