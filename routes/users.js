// возвращает информацию о пользователе (email и имя)
// GET /users/me

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me

const router = require('express').Router();

const {
  validateUserProfile,
} = require('../middlewares/joivalidation');

const {
  // .. контроллеры users
  getCurrentUser,
  updateProfile,
} = require('../controllers/movies');

router.get('/me', getCurrentUser);

router.patch('/me', validateUserProfile, updateProfile);
