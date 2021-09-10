require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');

const val = require('validator');

// мои мидлвары
const auth = require('./middlewares/auth');
const centralErrorHandler = require('./middlewares/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { NotFoundError404 } = require('./errors/errors');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// мидлы проверяющие все запросы
app.use(cors);
app.use(requestLogger);

// .. роуты не защищенные авторизацией

// мидл защиты роута авторизацией
app.use(auth);

// .. роуты защищенные авторизацией

app.use('*', (req, res, next) => {
  next(new NotFoundError404('Ресурс не найден'));
});

app.use(errorLogger);

app.use(errors()); // JOI errors

app.use(centralErrorHandler);

app.listen(PORT);
