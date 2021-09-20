const mongoose = require('mongoose');
const val = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return val.isURL(v);
        },
        message: 'Что-то не так с ссылкой!',
      },
    },
    trailer: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return val.isURL(v);
        },
        message: 'Что-то не так с ссылкой!',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return val.isURL(v);
        },
        message: 'Что-то не так с ссылкой',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
