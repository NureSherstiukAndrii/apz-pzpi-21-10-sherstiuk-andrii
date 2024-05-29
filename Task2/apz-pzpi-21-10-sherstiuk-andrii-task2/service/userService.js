const sql = require("mssql");
const bcrypt = require("bcrypt");

const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');
const ResultDto = require('../dtos/resultDto');
const serviceDto = require('../dtos/serviceCommentDto');
const ApiError = require("../exeptions/apiErrors");
const dbConfig = require("../dbConnection");

class UserService {
  async registration(name, lastname, age, experience, sport_type, country, city, mail, password, role, img="", price, weight, height) {
    const pool = await sql.connect(dbConfig);

    const hashPassword = await bcrypt.hash(password, 3);
    const candidate = await pool
      .request()
      .query(`SELECT * FROM [User] WHERE mail = '${mail}'`);

    if (candidate.recordset.length > 0) {
      throw ApiError.BadRequest(`The user with ${mail} already registered`);
      return `The user with ${mail} already registered`;
    }

    // Check if price is a valid number
    const validPrice = !isNaN(price) ? price : 0; // Set a default value

    await pool
      .request()
      .query(`INSERT INTO [User] (name, lastname, age, experience, sport_type, role, country, city, mail, password, photo, price, weight, height)
      VALUES ('${name}','${lastname}', ${age}, ${experience}, '${sport_type}', '${role}', '${country}', '${city}', '${mail}', 
      '${hashPassword}', '${img}', ${validPrice}, ${weight}, ${height})`);


    const user = await pool
      .request()
      .query(`SELECT * FROM [User] WHERE mail = '${mail}'`);
    const userDto = new UserDto(user.recordset[0])

    return {
      user: userDto,
      message: "User registered",
    }
  }


  async login(mail, password) {
    const pool = await sql.connect(dbConfig);

    const user = await pool.request().query(`SELECT * FROM [User] WHERE mail = '${mail}'`);
    if (user.recordset.length === 0) {
      throw ApiError.BadRequest(`Пользователь с ${mail} не найден`);
    }

    const isPassEquals = await bcrypt.compare(password, user.recordset[0].password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }

    const userDto = new UserDto(user.recordset[0])
    return tokenService.generateToken({...userDto});
  }

  async changeUserInfo(name, lastname, mail, role, price, country, city, age, experience, sport_type, reg_date, weight, height, photo="", token) {
    try {
      const pool = await sql.connect(dbConfig);
      const userId = await tokenService.getUserIdFromToken(token);
      let query = `UPDATE [User] SET name = '${name}'
      , lastname = '${lastname}', age = ${age}, experience = ${experience}, sport_type = '${sport_type}', role='${role}', 
      country = '${country}', city = '${city}', mail = '${mail}', photo = '${photo}', weight = ${weight}, height = ${height}`;

      if(price !== undefined) {
        query += `, price =${price} WHERE id = ${userId}`;
      }
      else{
        query += ` WHERE id = ${userId}`;
      }

      await pool.request().query(query);

      const updatedDate = await pool.request().query(`SELECT * FROM [User] WHERE id = ${userId}`);
      const forSend = new UserDto(updatedDate.recordset[0]);

      return {
        updated: forSend,
        message: "Data updated",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(id) {
    try {
      const pool = await sql.connect(dbConfig);

      // Select user with their rating (if available) from Coach_ratings
      const user = await pool.request().query(`
      SELECT u.*
      FROM [User] u
      LEFT JOIN [Coach_ratings] cr ON u.id = cr.id
      WHERE u.id = ${id}
    `);

      let userRating = 0
      const userRatingArr = await pool.request().query(`SELECT ratingValue FROM [Coach_ratings] WHERE coachId = ${id}`)
      if (userRatingArr.recordset.length > 0) {
        userRating =
          userRatingArr.recordset.reduce((acc, currentValue) => acc + currentValue.ratingValue, 0) /
          userRatingArr.recordset.length;
      }

      if (user.recordset.length > 0) {
        const userData = user.recordset[0];

        userData.rating = userRating;
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAuthUser(token) {
    try {
      const userId = tokenService.getUserIdFromToken(token);
      const pool = await sql.connect(dbConfig);

      let userRating = 0
      const userRatingArr = await pool.request().query(`SELECT ratingValue FROM [Coach_ratings] WHERE coachId = ${userId}`)
      if (userRatingArr.recordset.length > 0) {
        userRating =
          userRatingArr.recordset.reduce((acc, currentValue) => acc + currentValue.ratingValue, 0) /
          userRatingArr.recordset.length;
      }

      const user = await pool.request().query(`SELECT * FROM [User] WHERE id = ${userId}`);
      if (user.recordset.length > 0) {
        const userData = user.recordset[0];

        userData.rating = userRating;
        pool.close();

        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUsers(role) {
    try {
      const pool = await sql.connect(dbConfig);

      const allUsers = await pool.request().query(`
      SELECT u.*
      FROM [User] u
      LEFT JOIN [Coach_ratings] cr ON u.id = cr.id
      WHERE u.role = '${role}' AND u.is_banned = 0
    `);
      const users = allUsers.recordset;

      return await Promise.all(users.map(async (user) => {

        let userRating = 0
        const userRatingArr = await pool.request().query(`SELECT ratingValue FROM [Coach_ratings] WHERE coachId = ${user.id}`)
        if (userRatingArr.recordset.length > 0) {
          userRating =
            userRatingArr.recordset.reduce((acc, currentValue) => acc + currentValue.ratingValue, 0) /
            userRatingArr.recordset.length;
        }

        user.rating = userRating;
        return user;
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUsersWithFilters(role, sport_type, minAge, maxAge, minExp, maxExp, minPrice, maxPrice, sort_by) {
    try {
      const pool = await sql.connect(dbConfig);
      let query = `SELECT * FROM [User] WHERE role = '${role}' AND is_banned = 0`;

      if (sport_type !== undefined) {
        const allSportTypes = sport_type.split(',').map(g => `'${g}'`).join(', ');
        query += ` AND (sport_type IN (${allSportTypes}))`;
      }

      if (minAge !== undefined || maxAge !== undefined) {
        minAge === undefined ? (minAge = 0) : minAge;
        maxAge === undefined ? (maxAge = 100) : maxAge;
        query += ` AND (age BETWEEN ${minAge} AND ${maxAge})`;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        minPrice === undefined ? (minPrice = 0) : minPrice;
        maxPrice === undefined ? (maxPrice = 1000000) : maxPrice;
        query += ` AND (price BETWEEN ${minPrice} AND ${maxPrice})`;
      }

      if (minExp !== undefined || maxExp !== undefined) {
        minExp === undefined ? (minExp = 0) : minExp;
        maxExp === undefined ? (maxExp = 100) : maxExp;
        query += ` AND (experience BETWEEN ${minExp} AND ${maxExp})`;
      }

      const sortMap = {
        fromMinAge: 'age',
        fromMaxAge: 'age DESC',
        fromMinExp: 'experience',
        fromMaxExp: 'experience DESC',
        fromMinPrice: 'price',
        fromMaxPrice: 'price DESC',
        fromMinRate: 'rating',
        fromMaxRate: 'rating DESC',
      };

      if (sort_by !== undefined && sortMap[sort_by] !== undefined) {
        sort_by = sortMap[sort_by];
        query += ` ORDER BY ${sort_by}`;
      }

      const filteringUsers = await pool.request().query(query);

      return await Promise.all(filteringUsers.recordset.map(async (user) => {

        let userRating = 0;
        const userRatingArr = await pool.request().query(`SELECT ratingValue FROM [Coach_ratings] WHERE coachId = ${user.id}`);
        if (userRatingArr.recordset.length > 0) {
          //calculate average rating
          userRating =
            userRatingArr.recordset.reduce((acc, currentValue) => acc + currentValue.ratingValue, 0) /
            userRatingArr.recordset.length;
        }

        user.rating = userRating;
        return user;
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteUser(token){
    try {
      const pool = await sql.connect(dbConfig);
      const userId = await tokenService.getUserIdFromToken(token);
      await pool.request().query(`DELETE FROM [User] WHERE id = ${userId}`);

      return "Account deleted";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserHistory(token){
    try {
      const pool = await sql.connect(dbConfig);
      const userId = await tokenService.getUserIdFromToken(token);
      // get userData
      const userData = await pool.request().query(`SELECT * FROM [User] WHERE id=${userId}`);
      // get user results
      const resultsHistory = await pool.request().query(`SELECT * FROM [Users_history] WHERE userId = ${userId} ORDER BY dateOfTrain DESC`);
      // Add coefficients and phrases to each history object
      return resultsHistory.recordset.map((entry) => {
        const passage_length = entry.result;
        const heartbeatCoefficient = entry.heartbeat * 0.4;
        const oxygenCoefficient = entry.oxygen * 0.3;
        const temperatureCoefficient = entry.temperature * 0.3;
        const weightCoefficient = userData.recordset[0].weight * 0.2;
        const heightCoefficient = userData.recordset[0].height * 0.1;
        const middleSpeedCoefficient = entry.middle_speed * 0.2;
        const tiltAngleCoefficient = entry.tilt_angle * 0.1;

        const healthCoefficient = (heartbeatCoefficient + oxygenCoefficient +
          temperatureCoefficient + weightCoefficient + heightCoefficient).toFixed(2);

        const trainCoefficient = (passage_length /
          (weightCoefficient + heightCoefficient + middleSpeedCoefficient + tiltAngleCoefficient)).toFixed(2);

        // Implement the determineCategory function, which will return a phrase depending on the coefficient
        const healthCategory = determineHealthCategory(healthCoefficient);
        const trainCategory = determineTrainCategory(trainCoefficient);

        return {
          ...entry,
          healthCoefficient,
          trainCoefficient,
          healthCategory,
          trainCategory
        };
      });

      function determineHealthCategory(coefficient) {
        if (coefficient < 50) {
          return 'red';
        } else if (coefficient >= 50 && coefficient < 75) {
          return 'yellow';
        } else {
          return 'lightgreen';
        }
      }

      function determineTrainCategory(coefficient) {
        if (coefficient < 5) {
          return 'red';
        } else if (coefficient >= 5 && coefficient < 10) {
          return 'yellow';
        } else {
          return 'lightgreen';
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserResult(token, id) {
    try {
      const pool = await sql.connect(dbConfig);
      const userId = await tokenService.getUserIdFromToken(token);
      const userData = await pool.request().query(`SELECT * FROM [User] WHERE id=${userId}`);
      const result = await pool
        .request()
        .query(`SELECT * FROM [Users_history] WHERE userId = ${userId} AND id = ${id}`);

      const entry = result.recordset[0];

      // Calculate coefficient
      const passage_length = entry.result;
      const heartbeatCoefficient = entry.heartbeat * 0.4;
      const oxygenCoefficient = entry.oxygen * 0.3;
      const temperatureCoefficient = entry.temperature * 0.3;
      const weightCoefficient = userData.recordset[0].weight * 0.2;
      const heightCoefficient = userData.recordset[0].height * 0.1;
      const middleSpeedCoefficient = entry.middle_speed * 0.2;
      const tiltAngleCoefficient = entry.tilt_angle * 0.1;

      const healthCoefficient =
        heartbeatCoefficient + oxygenCoefficient + temperatureCoefficient + weightCoefficient + heightCoefficient;

      const trainCoefficient = (passage_length /
        (weightCoefficient + heightCoefficient + middleSpeedCoefficient + tiltAngleCoefficient)).toFixed(2);

      // Determine category
      const category = determineCategory(healthCoefficient);

      return {
        ...entry,
        healthCoefficient,
        trainCoefficient,
        category,
      };

      function determineCategory(coefficient) {
        if (coefficient < 50) {
          return 'danger';
        } else if (coefficient >= 50 && coefficient < 75) {
          return 'normal';
        } else {
          return 'good';
        }
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addNewResult(result, heartbeat, oxygen, temperature, dateOfResult, middleSpeed, tiltAngle, token){
    try {
      const pool = await sql.connect(dbConfig);
      const userId = await tokenService.getUserIdFromToken(token);
      await pool.request().query(`INSERT INTO [Users_History] 
        (result, dateOfTrain, userId, heartbeat, oxygen, temperature, middle_speed, tilt_angle)
        VALUES (${result}, '${dateOfResult}', ${userId}, ${heartbeat}, ${oxygen}, ${temperature}, ${middleSpeed}, ${tiltAngle})`);
      const newResult = await pool.request()
        .query(`SELECT * FROM [Users_history] WHERE userId = ${userId} AND result = ${result} AND dateOfTrain = '${dateOfResult}'`);
      
      return new ResultDto(newResult.recordset[0]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteResult(id){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`DELETE FROM [Users_history] WHERE id = ${id}`);

      return "Result deleted";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getBannedUser(){
    try {
      const pool = await sql.connect(dbConfig);
      const users = await pool.request().query(`SELECT * FROM [User] WHERE is_banned = 1`);
      return users.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addBannedUser(userId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`UPDATE [User] SET is_banned = 1 WHERE Id = ${userId}`);

      return "User banned";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeBannedUser(userId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`UPDATE [User] SET is_banned = 0 WHERE Id = ${userId}`);

      return "User unbanned";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addReport(recipientId, token, reason) {
    try {
      const pool = await sql.connect(dbConfig);
      const senderId = await tokenService.getUserIdFromToken(token);

      const checkSenderId = await pool
        .request()
        .input('senderId', sql.Int, senderId)
        .query('SELECT * FROM [User_reports] WHERE senderId = @senderId');

      if (checkSenderId.recordset.length > 0) {
        throw ApiError.BadRequest('You have already filed a complaint against the user');
      }

      await pool
        .request()
        .input('reason', sql.NVarChar, reason)
        .input('senderId', sql.Int, senderId)
        .input('recipientId', sql.Int, recipientId)
        .query('INSERT INTO [User_reports] (reason, senderId, recipientId) VALUES (@reason, @senderId, @recipientId)');

      return 'Report sent';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addCommentToService(token, text) {
    try {
      const userId = tokenService.getUserIdFromToken(token);
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('userId', sql.Int, userId)
        .input('text', sql.NVarChar, text)
        .query('INSERT INTO [Service_comments] (user_id, description) VALUES (@userId, @text)');

      const newComment = await pool
        .request()
        .input('userId', sql.Int, userId)
        .input('text', sql.NVarChar, text)
        .query('SELECT * FROM [Service_comments] WHERE user_id = @userId AND description = @text');

      return {
        comment: new serviceDto(newComment.recordset[0]),
        message: 'Feedback sent',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCommentFromService(id){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`DELETE FROM [Service_comments] WHERE id = ${id}`);

      return 'Comment deleted';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addCommentToCoach(coachId, token, text) {
    try {
      const pool = await sql.connect(dbConfig);
      const senderId = await tokenService.getUserIdFromToken(token);

      const checkSenderId = await pool
        .request()
        .input('senderId', sql.Int, senderId)
        .query('SELECT * FROM [Coach_comments] WHERE senderId = @senderId');

      if (checkSenderId.recordset.length > 0) {
        throw ApiError.BadRequest('You have already left a comment');
      }

      await pool
        .request()
        .input('text', sql.NVarChar, text)
        .input('senderId', sql.Int, senderId)
        .input('coachId', sql.Int, coachId)
        .query('INSERT INTO [Coach_comments] (text, senderId, coachId) VALUES (@text, @senderId, @coachId)');

      return 'Comment sent';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLastServiceComments() {
    try {
      const pool = await sql.connect(dbConfig);
      const commentsQuery = await pool.request().query(
        `SELECT TOP 6 sc.id, sc.description, sc.date, u.name, u.lastname, u.photo
      FROM [Service_comments] sc
      JOIN [User] u ON sc.user_id = u.id
      ORDER BY sc.date DESC;`);

      // We modify each entry by replacing the value of the photo field using the link to the photo
      return await Promise.all(commentsQuery.recordset.map(async (comment) => {
        return {...comment};
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getReports(id) {
    try {
      const pool = await sql.connect(dbConfig);
      const reports = await pool.request().query(`SELECT
        ur.id AS id,
        ur.reason,
        ur.dateOfCreation,
        u_sender.id AS senderId,
        u_sender.name AS senderName,
        u_sender.lastname AS senderLastname
      FROM [User_reports] ur
      JOIN [User] u_sender ON ur.senderId = u_sender.id
      JOIN [User] u_recipient ON ur.recipientId = u_recipient.id
      WHERE u_recipient.id = ${id};`);

      return reports.recordset;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = new UserService();