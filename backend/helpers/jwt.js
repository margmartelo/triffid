const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/users/login",
      "/users/add",
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  });
}

module.exports = authJwt;
