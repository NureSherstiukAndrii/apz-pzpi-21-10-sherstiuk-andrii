module.exports = class ResultDto {
  constructor(result) {
    this.id = result.id;
    this.result = result.result;
    this.heartbeat = result.heartbeat;
    this.oxygen = result.oxygen;
    this.temperature = result.temperature;
    this.middle_speed = result.middle_speed;
    this.tilt_angle = result.tilt_angle;
    this.dateOfTrain = result.dateOfTrain;
    this.userId = result.userId;
  }
}