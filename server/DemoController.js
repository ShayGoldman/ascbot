const {openEndpoint} = require("./middlewares/handling/serverResponses");

class DemoController {

  constructor(cloudWatchLogs, findMostRecentLogs, teamKeysDao) {
    this.cloudWatchLogs     = cloudWatchLogs;
    this.findMostRecentLogs = findMostRecentLogs;
    this.teamKeysDao        = teamKeysDao;
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

    app.get("/keys", ...openEndpoint(() => {
      return this.teamKeysDao.getAllKeys();
    }));

    app.get("/keys/new/:team/:access/:secret", ...openEndpoint((req) => {
      const {team, access, secret} = req.params;
      return this.teamKeysDao.insertKey({teamId: team, accessKeyId: access, secretAccessKey: secret});
    }));

    app.get("/keys/update/:team/:accessKeyId", ...openEndpoint((req) => {
      const {team, accessKeyId} = req.params;
      return this.teamKeysDao.updateKey(team, {accessKeyId});
    }));

    app.get("/team/:teamId", ...openEndpoint((req) => {
      const {teamId} = req.params;
      return this.teamKeysDao.getTeamById(teamId);
    }));
  }
}

module.exports = DemoController;