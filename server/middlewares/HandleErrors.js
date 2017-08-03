const {error404, error500Generic} = require("./handling/serverResponses");

const errorMap = {
  NotFoundError: error404,
};

class HandleErrors {
  constructor(logger) {
    this.logger = logger.registerClass(this);
  }

  attachTo(app) {
    app.use((err, req, res, next) => {
      if (err) {
        this.logger.error(err);
        const errorHandler = errorMap[err.constructor.name] || error500Generic;
        err.stack          = {};
        errorHandler(res, err);
      }
      next();
    });
  }

}

module.exports = HandleErrors;