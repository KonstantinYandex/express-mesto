const jwt = require("jsonwebtoken");
const NotAuthError = require("../errors/not-auth-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWish("Bearer")) {
    return next(new NotAuthError("Необходима авторизация"));
  }

  const token = authorization.replace("Beares", "");

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new NotAuthError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};
