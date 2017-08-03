const chalk = require('chalk');

const info  = chalk.green;
const debug = chalk.yellow;
const error = chalk.red;

class Logger {

  constructor(debugOn) {
    this.debugOn = debugOn;
    if (debugOn) this.debug("Debug data available");
  }

  info(msg) {
    console.log(info(msg));
  }

  debug(msg) {
    if (this.debugOn) {
      console.log(debug(msg));
    }
  }

  error(msg) {
    console.log(error(msg));
  }

}


module.exports = Logger;