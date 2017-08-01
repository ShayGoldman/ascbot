class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name  = this.constructor.name;
    this.stack = (new Error(message)).stack;
  }
}

class NotFoundError extends ExtendableError {}

module.exports = {
  NotFoundError
};

