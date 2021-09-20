const { celebrate, Joi } = require('celebrate');
const val = require('validator');

const validateMovieId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().alphanum(),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (val.isURL(value)) {
        return value;
      }
      return helper.message('Что-то не так с URL!');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (val.isURL(value)) {
        return value;
      }
      return helper.message('Что-то не так с URL!');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (val.isURL(value)) {
        return value;
      }
      return helper.message('Что-то не так с URL!');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  validateMovieId,
  validateUserProfile,
  validateMovie,

  validateSignUp,
  validateSignIn,
};
