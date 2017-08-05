const chalk = require('chalk');

const info  = chalk.green;
const debug = chalk.yellow;
const error = chalk.red;

class Logger {

  constructor(opts = {}) {
    const {debugOn, caller} = opts;
    this.debugOn = debugOn;
    this.caller = caller ? `[${caller}]::` : "";
  }

  registerClass(caller) {
    const {debugOn} = this;
    return new Logger({debugOn, caller: caller.constructor.name});
  }

  register(caller) {
    const {debugOn} = this;
    return new Logger({debugOn, caller});
  }

  info(msg) {
    console.log(info(`${this.caller}${msg}`));
  }

  debug(msg) {
    if (this.debugOn) {
      console.log(debug(`${this.caller}${msg}`));
    }
  }

  error(err) {
    console.log(error(`${this.caller}${err.stack || err}`));
  }

}


module.exports = Logger;