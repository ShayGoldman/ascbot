const AWS         = require("aws-sdk");
const {promisify} = require('../utils/promisify');

const accessKeyId     = "";
const secretAccessKey = "";

class CloudWatchLogs {
  constructor(awsConfig) {
    const config        = Object.assign({}, awsConfig, {accessKeyId, secretAccessKey});
    this.cloudWatchLogs = new AWS.CloudWatchLogs(config);
  }

  listLogGroups() {
    return promisify((handle) => this.cloudWatchLogs.describeLogGroups({}, handle))
      .then(({logGroups}) => logGroups);
  }

  listStreams(logGroupName, opts) {
    const config = Object.assign({}, {logGroupName}, {descending: true, limit: 10, orderBy: "LastEventTime"}, opts);
    return promisify((handle) => this.cloudWatchLogs.describeLogStreams(config, handle))
      .then(({logStreams}) => logStreams);
  }

  listLogs(logGroupName, logStreamName, opts) {
    const config = Object.assign({}, {logGroupName, logStreamName}, {limit: 100}, opts);
    return promisify((handle) => this.cloudWatchLogs.getLogEvents(config, handle))
      .then(({events}) => events);
  }

}

module.exports = CloudWatchLogs;