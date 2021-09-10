// Введенные данные не соответствуют формату
// ValidationError
// CastError
class BadRequestError400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError400;
