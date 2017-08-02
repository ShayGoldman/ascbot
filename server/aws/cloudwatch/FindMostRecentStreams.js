const sortBy  = require('lodash/sortBy');
const reverse = require('lodash/reverse');

class FindMostRecentStreams {
  constructor(cloudWatchLogs) {
    this.cloudWatchLogs = cloudWatchLogs;
  }

  findMostRecentStreams(amount) {
    return Promise.resolve()
      .then(() => this.cloudWatchLogs.listLogGroups())
      .then((logGroups) => logGroups.map((group) => group.logGroupName))
      .then((groups) => Promise.all(groups.map((logGroupName) => {
        return Promise.resolve()
          .then(() => this.cloudWatchLogs.listStreams(logGroupName))
          .then((streams) => ({logGroupName, streams}));
      })))
      .then((groupsWithStreams) => filterAndSortGroupsWithStreams(groupsWithStreams))
      .then((groupsWithStreams) => groupsWithStreams.map((groupWithStream) => {
        return Object.assign({}, groupWithStream.streams[0], {logGroupName: groupWithStream.logGroupName});
      }))
      .then((streams) => streams.slice(0, amount));
  }
}

function filterAndSortGroupsWithStreams(groupsWithStreams) {
  return reverse(
    sortBy(
      groupsWithStreams.filter((groupWithStream) => groupWithStream.streams.length !== 0),
      (groupWithStream) => groupWithStream.streams[0].lastEventTimestamp
    )
  )
}

module.exports = FindMostRecentStreams;