const Dao      = require('../db/Dao');
const DBMapper = require('../db/DBMapper');
const TeamKeys = require('./models/TeamKeys');

const mapper = new DBMapper({
  "team_id": "teamId",
  "access_key_id": "accessKeyId",
  "secret_access_key": "secretAccessKey",
  "bot_token": "botToken",
});


class TeamKeysDao extends Dao {
  constructor(dbc) {
    super(dbc, "teams_aws_keys", mapper, TeamKeys);
  }

  getAllKeys() {
    return this.select();
  }

  insertKey(key) {
    return this.insert(key);
  }

  getTeamById(teamId) {
    return this.selectOne({teamId});
  }

  updateKey(teamId, keys) {
    return this.update({teamId}, keys)
  }
}

module.exports = TeamKeysDao;
