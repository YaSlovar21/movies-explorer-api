require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { rateLimiter } = require('./utils/ratelimiter');

// мои мидлвары
const centralErrorHandler = require('./middlewares/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

// роутер
const router = require('./routes/index');

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

app.use('/', router);

app.use(errorLogger);

app.use(errors()); // JOI errors

app.use(centralErrorHandler);

app.listen(PORT);
