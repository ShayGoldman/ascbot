class FindMostRecentLogs {

  constructor(findMostRecentStreams, cloudWatchLogs) {
    this.findMostRecentStreams = findMostRecentStreams;
    this.cloudWatchLogs        = cloudWatchLogs;
  }

  findMostRecentLogs(streamAmount, logsPerStream) {
    return Promise.resolve()
      .then(() => this.findMostRecentStreams.findMostRecentStreams(streamAmount))
      .then((streams) => Promise.all(
        streams.map((stream) => {
          return Promise.resolve()
            .then(() => this.cloudWatchLogs.listLogs(stream.logGroupName, stream.logStreamName, {limit: logsPerStream}))
            .then((logs) => Object.assign({}, stream, {logs}));
        })
      ));
  }
}

module.exports = FindMostRecentLogs;