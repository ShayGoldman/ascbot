const AWS         = require("aws-sdk");
const {promisify} = require('../../utils/promisify');


const accessKeyId     = "";
const secretAccessKey = "";

class CloudWatchLogs {
  constructor(awsConfig) {
    const config        = Object.assign({}, awsConfig, {accessKeyId, secretAccessKey});
    this.cloudWatchLogs = new AWS.CloudWatchLogs(config);
  }

  listLogGroups(opts) {
    const params = overrideDefaultConfig({}, opts);
    return promisify((handle) => this.cloudWatchLogs.describeLogGroups(params, handle))
      .then(({logGroups}) => logGroups);
  }

  listStreams(logGroupName, opts) {
    const params = overrideDefaultConfig({descending: true, orderBy: "LastEventTime"}, opts, {logGroupName});
    return promisify((handle) => this.cloudWatchLogs.describeLogStreams(params, handle))
      .then(({logStreams}) => logStreams);
  }

  listLogs(logGroupName, logStreamName, opts) {
    const params = overrideDefaultConfig({}, opts, {logGroupName, logStreamName});
    return promisify((handle) => this.cloudWatchLogs.getLogEvents(params, handle))
      .then(({events}) => events);
  }

}

function overrideDefaultConfig(defaults, ...overrides) {
  return Object.assign({}, defaults, ...overrides);
}

module.exports = CloudWatchLogs;