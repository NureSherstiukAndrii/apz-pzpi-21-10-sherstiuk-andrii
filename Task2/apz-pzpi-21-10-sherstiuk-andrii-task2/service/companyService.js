const sql = require('mssql');
const dbConfig = require("../dbConnection");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exeptions/apiErrors");
const tokenService = require("../service/tokenService");
const bcrypt = require("bcrypt");
const CompanyDto = require("../dtos/comanyDto");

class CompanyService {
  async registration(name, description, owner, creationDate, mail, password) {
    const pool = await sql.connect(dbConfig);

    const hashPassword = await bcrypt.hash(password, 3);
    const candidate = await pool
      .request()
      .query(`SELECT * FROM [User] WHERE mail = '${mail}'`);

    if (candidate.recordset.length > 0) {
      throw ApiError.BadRequest(`The company with ${mail} already registered`);
    }

    await pool
      .request()
      .query(`INSERT INTO [Company] (name, description, owner, mail, password)
      VALUES ('${name}','${description}', '${owner}', '${mail}', '${hashPassword}')`);

    const company = await pool
      .request()
      .query(`SELECT * FROM [Company] WHERE mail = '${mail}'`);
    const companyDto = new CompanyDto(company.recordset[0])

    return {
      company: companyDto,
      message: "Company registered",
    }
  }


  async login(mail, password) {
    const pool = await sql.connect(dbConfig);

    const company = await pool.request().query(`SELECT * FROM [Company] WHERE mail = '${mail}'`);
    if (company.recordset.length === 0) {
      throw ApiError.BadRequest(`Компанія с ${mail} не найден`);
    }

    const isPassEquals = await bcrypt.compare(password, company.recordset[0].password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }

    const companyDto = new CompanyDto(company.recordset[0])
    return tokenService.generateToken({...companyDto});
  }

  async getAuthCompany(token) {
    try {
      const companyId = tokenService.getUserIdFromToken(token);
      const pool = await sql.connect(dbConfig);

      const company = await pool.request().query(`SELECT * FROM Company WHERE id = ${companyId}`);
      
      return company.recordset[0];
      
    } catch (error) {
      console.error('Error fetching company and coaches:', error);
      throw error;
    }
  }


  async getCompanies(){
    try {
      const pool = await sql.connect(dbConfig);
      const allCompanies = await pool.request()
        .query(`SELECT * FROM [Company];
         `);
      console.log(allCompanies);

      return allCompanies.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCompany(companyId){
    try {
      const pool = await sql.connect(dbConfig);
      const company = await pool.request().query(
        `SELECT * FROM [Company] WHERE id = ${companyId}`);

      const listOfCoaches = await pool.request().query(`SELECT [User].id, [User].name, [User].lastname FROM [User]
      JOIN [Coach_company] ON [User].id = [Coach_company].coachId
      WHERE [Coach_company].companyId = ${companyId} AND [Coach_company].coachStatus = 'accepted';`);



      return await Promise.all(company.recordset.map(async (company) => {
        return {...company, companyCoaches: listOfCoaches.recordset};
      }));

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoaches(token, status){
    try {
      const pool = await sql.connect(dbConfig);
      const companyId = tokenService.getUserIdFromToken(token);
      const allCompanyCoaches = await pool.request()
        .query(`SELECT U.id, U.name, U.lastname, CC.coachStatus, CC.applicationDate
          FROM [Coach_company] CC
          JOIN [User] U ON CC.coachId = U.id
          WHERE CC.companyId = ${companyId} AND coachStatus='${status}';
         `);
      
      console.log(allCompanyCoaches);
      return allCompanyCoaches.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addCoach(companyId, token){
    if(token === 'null'){
      throw ApiError.UnauthorizedError();
    }
    const coachId = tokenService.getUserIdFromToken(token);
    const pool = await sql.connect(dbConfig);
    const applicant = await pool.request().query(`SELECT * FROM [Coach_company] WHERE companyId = ${companyId} AND coachId = ${coachId}`);
    if (applicant.recordset.length > 0) {
      return `You already sent application`;
    }
    await pool.request().query(`INSERT INTO [Coach_company] (companyId, coachId, coachStatus) VALUES (${companyId}, ${coachId}, 'waiting')`);
    return `Application sent`;
  }

  async acceptCoach(companyId, coachId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`UPDATE [Coach_company] SET coachStatus='accepted' WHERE companyId = ${companyId} AND coachId = ${coachId}`);
      const acceptedCoach =  await pool.request().query(`SELECT * FROM [User] WHERE id = ${coachId}`);
      return new UserDto(acceptedCoach.recordset[0]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCoach(companyId, coachId){
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`DELETE FROM [Coach_company] WHERE companyId = ${companyId} AND coachId = ${coachId}`);
      return "Coach reject succesfully";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


module.exports = new CompanyService();