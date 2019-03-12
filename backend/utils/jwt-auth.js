
/* ----- JWT Authentication ----- */

const expressJwt = require('express-jwt');
const userService = require('../handlers/users/user-service');
const conf = require('../../config.json');

const isRevoked = async (req, payload, done) => {
  const user = await userService.readCurrent(payload.sub);
  // token is revoked if user no longer exists
  if (!user) {
    return done(null, true);
  }
  return done();
};

const jwtAuth = () => {
  const secret = conf.JWT_SECRET;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes
      '/api/users/register',
      '/api/users/authenticate',
    ],
  });
};

module.exports = jwtAuth;
