const express = require("express");
const bodyParser = require("body-parser");

const PORT = 8080;

class Server {
  constructor(modules = [], logger) {
    this.logger = logger.registerClass(this);
    logger.info("Starting server");

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));

    modules.forEach((module) => {
      try {
        module.attachTo(this.app);
      } catch (e) {
        throw new Error(`Could not attach to module [$\{module.constructor.name}]\n${e.stack}`);
      }
    });
  }

  start() {
    this.app.listen(PORT, () => {
      this.logger.debug(`Server available at: http://localhost:${PORT}`);
    })
  }
}

module.exports = Server;