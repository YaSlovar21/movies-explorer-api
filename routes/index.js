const router = require('express').Router();

const { NotFoundError404 } = require('../errors/errors');

const auth = require('../middlewares/auth');

const createUserRouter = require('./signup');
const loginRouter = require('./signin');
const logoutRouter = require('./signout');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.use('/signin', loginRouter);
router.use('/signup', createUserRouter);

// роуты защищенные авторизацией
router.use(auth);

router.use('/signout', logoutRouter);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError404('Ресурс не найден'));
});

module.exports = router;
