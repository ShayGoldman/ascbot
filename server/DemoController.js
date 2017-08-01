const {openEndpoint} = require("./middlewares/handling/serverResponses");

class DemoController {

  constructor() {
    this.wod = "Hello";
  }

  attachTo(app) {

    app.get("/speak", ...openEndpoint(() => {
      return this.wod;
    }));
  }
}

module.exports = DemoController;