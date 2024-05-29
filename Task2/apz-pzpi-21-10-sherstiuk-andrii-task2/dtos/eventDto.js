module.exports = class EventDto {
  constructor(event) {
    this.id = event.id;
    this.name = event.name;
    this.description = event.description;
    this.continent = event.continent;
    this.country = event.country;
    this.city = event.city;
    this.start_date = event.start_date;
    this.people = event.people;
    this.preview = event.preview;
  }
}