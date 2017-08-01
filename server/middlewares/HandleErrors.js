const {error404, error500Generic} = require("./handling/serverResponses");

const errorMap = {
  NotFoundError: error404,
};

class HandleErrors {

  attachTo(app) {
    app.use((err, req, res, next) => {
      if (err) {
        console.log("@@@ ERROR:", err);
        const errorHandler = errorMap[err.constructor.name] || error500Generic;
        err.stack          = {};
        errorHandler(res, err);
      }
      next();
    });
  }

}

module.exports = HandleErrors;