require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// мои мидлвары
const auth = require('./middlewares/auth');
const centralErrorHandler = require('./middlewares/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

// роуты
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { NotFoundError404 } = require('./errors/errors');

// контроллеры на роуты, не защищенные авторизацией
const { login, createUser, logout } = require('./controllers/users');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// мидлы проверяющие все запросы
app.use(cors);
app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());

// .. роуты не защищенные авторизацией
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// мидл защиты роута авторизацией
app.use(auth);

// .. роуты защищенные авторизацией
app.use('/signout', logout);
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError404('Ресурс не найден'));
});

app.use(errorLogger);

app.use(errors()); // JOI errors

app.use(centralErrorHandler);

app.listen(PORT);
