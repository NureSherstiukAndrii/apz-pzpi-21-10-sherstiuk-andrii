const jwt = require("jsonwebtoken");

class TokenService {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "2h"});
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  getUserIdFromToken(token){
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded.id;
  }
}


module.exports = new TokenService();