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

const Card = require('../models/card');

const {
  BadRequestError400,
  NotFoundError404,
  ForbiddenError403,
} = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
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
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError404('Такой карточки нет'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then((deletedCard) => {
            res.send(deletedCard);
          });
      } else {
        next(new ForbiddenError403('Нет прав для удаления данной карточки'));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError404('Такой карточки нет');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      next(err);
    });
};

module.exports.removeLikeFromCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError404('Такой карточки нет');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400('Ошибка валидации ID'));
      }
      next(err);
    });
};
