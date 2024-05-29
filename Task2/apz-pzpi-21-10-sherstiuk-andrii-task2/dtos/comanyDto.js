module.exports = class CompanyDto {
  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.description = company.description;
    this.owner = company.owner;
    this.mail = company.mail;
    this.password = company.password;
  }
}