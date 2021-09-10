// миддлвар централизованной обработки ошибок
// если ни один обработчик ошибки не справился ошибка падает сюда
// используем как centralErrorHandler в app.js

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
