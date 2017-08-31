const AWS         = require("aws-sdk");
const {promisify} = require('../../utils/promisify');
const {overrideDefaults} = require('../../utils/overrideDefaults');

class CloudWatchLogs {
  constructor(config) {
    config.region || (config.region = "us-west-2")
    this.cloudWatchLogs = new AWS.CloudWatchLogs(config);
  }

  listLogGroups(opts) {
    const params = overrideDefaults({}, opts);
    return promisify((handle) => this.cloudWatchLogs.describeLogGroups(params, handle))
      .then(({logGroups}) => logGroups);
  }

  listStreams(logGroupName, opts) {
    const params = overrideDefaults({descending: true, orderBy: "LastEventTime"}, opts, {logGroupName});
    return promisify((handle) => this.cloudWatchLogs.describeLogStreams(params, handle))
      .then(({logStreams}) => logStreams);
  }

  listLogs(logGroupName, logStreamName, opts) {
    const params = overrideDefaults({}, opts, {logGroupName, logStreamName});
    return promisify((handle) => this.cloudWatchLogs.getLogEvents(params, handle))
      .then(({events}) => events);
  }

}

module.exports = CloudWatchLogs;
