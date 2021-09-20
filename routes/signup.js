const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { validateSignUp } = require('../middlewares/joivalidation');

router.post('/', validateSignUp, createUser);

module.exports = router;
