const {openEndpoint} = require("./middlewares/handling/serverResponses");

class DemoController {

  constructor(cloudWatchLogs) {
    this.cloudWatchLogs = cloudWatchLogs;
  }

  attachTo(app) {

    app.get("/log-groups", ...openEndpoint(() => {
      return this.cloudWatchLogs.listLogGroups();
    }));

    app.get("/streams/:index", ...openEndpoint((req) => {
      const {index} = req.params;
      return Promise.resolve()
        .then(() => this.cloudWatchLogs.listLogGroups())
        .then((logGroups) => this.cloudWatchLogs.listStreams(logGroups[index].logGroupName));
    }));

    app.get("/logs/:index", ...openEndpoint((req) => {
      const {index} = req.params;
      return Promise.resolve()
        .then(() => this.cloudWatchLogs.listLogGroups())
        .then((logGroups) => {
          const {logGroupName} = logGroups[index];
          return Promise.resolve()
            .then(() => this.cloudWatchLogs.listStreams(logGroupName))
            .then((streams) => this.cloudWatchLogs.listLogs(logGroupName, streams[index].logStreamName));
        })
    }));
  }
}

module.exports = DemoController;