const router = require('express').Router();
const { login } = require('../controllers/users');
const { validateSignIn } = require('../middlewares/joivalidation');

router.post('/', validateSignIn, login);

module.exports = router;
