const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;

class Server {
  constructor(modules = []) {

    console.log("@@@ Starting server");

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
      console.log(`@@@ Server available at: http://localhost:${PORT}`);
    })
  }
}

module.exports = Server;