/* eslint-ignore */
const jwt = require('jsonwebtoken');

const { UnauthorizedError401 } = require('../errors/errors');

const { JWT_SECRET = 'the-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError401('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError401('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
