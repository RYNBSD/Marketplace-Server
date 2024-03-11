
class TestError extends Error {
  constructor(reason, status) {
    const message = `Invalid test - reason ${reason} status ${status}`;
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

module.exports = {
  TestError,
};
