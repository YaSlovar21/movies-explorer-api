// возвращает все сохранённые пользователем фильмы
// GET /movies

// создаёт фильм с переданными в теле
// country, director, duration, year, description
// image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// удаляет сохранённый фильм по id
// DELETE /movies/movieId

const router = require('express').Router();

const {
  validateMovieId,
  validateMovie,
} = require('../middlewares/joivalidation');

const {
  // .. контроллеры movies
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validateMovie, createMovie);

router.delete('/:movieId', validateMovieId, deleteMovie);
