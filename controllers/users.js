// возвращает информацию о пользователе (email и имя)
// GET /users/me

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me

// getCurrentUser,
//  updateProfile,

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  BadRequestError400,
  NotFoundError404,
  DuplicateKeyError409,
} = require('../errors/errors');

const User = require('../models/user');

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError404('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError400('Новые данные не соответствуют формату'));
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError404('Такого пользователя нет');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign(
        { _id: user.id },
        NODE_ENV === 'production' ? JWT_SECRET : 'the-secret-key',
        { expiresIn: '7d' },
      );
        // return res.send({ token });
      return res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }) // sameSite:true,
        .send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: -1, httpOnly: true }).send({ message: 'logged out done' });
};

// создаем пользователя по имени, описанию, ссылке на картинку
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError400('Введенные данные не соответствуют формату'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DuplicateKeyError409('Пользователь с таким E-mail уже существует'));
      }
      next(err);
    });
};
