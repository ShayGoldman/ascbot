const {openEndpoint} = require("./middlewares/handling/serverResponses");

class DemoController {

  constructor(cloudWatchLogs, findMostRecentLogs) {
    this.cloudWatchLogs     = cloudWatchLogs;
    this.findMostRecentLogs = findMostRecentLogs;
  }

  attachTo(app) {

    app.get("/logs/latest", ...openEndpoint(() => {
      return this.findMostRecentLogs.findMostRecentLogs(1, 10);
    }));

    app.get("/streams/recent", ...openEndpoint(() => {
      return this.findMostRecentLogs.findMostRecentLogs(5, 2);
    }));

    app.get("/log-groups", ...openEndpoint(() => {
      return this.cloudWatchLogs.listLogGroups();
    }));
  }
}

module.exports = DemoController;