module.exports = class UserDto {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.age = user.age;
    this.role = user.role;
    this.experience = user.experience;
    this.country = user.country;
    this.city = user.city;
    this.reg_date = user.reg_date;
    this.is_banned = user.is_banned;
    this.photo = user.photo;
    this.price = user.price;
    this.weight = user.weight;
    this.height = user.height;
  }
}