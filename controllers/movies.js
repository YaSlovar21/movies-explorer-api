// возвращает все сохранённые пользователем фильмы
// GET /movies

// создаёт фильм с переданными в теле
// country, director, duration, year, description
// image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// удаляет сохранённый фильм по id
// DELETE /movies/movieId

// getMovies,
// createMovie,
// deleteMovie,

const Movie = require('../models/movie');

const {
  BadRequestError400,
  NotFoundError404,
  ForbiddenError403,
} = require('../errors/errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError400('Введенные данные не соответствуют формату'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .orFail(new NotFoundError404('Такого фильма нет'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then((deletedCard) => {
            res.send(deletedCard);
          });
      } else {
        next(new ForbiddenError403('Нет прав для удаления данной карточки'));
      }
    })
    .catch(next);
};
