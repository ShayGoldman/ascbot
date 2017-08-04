const Dao            = require('./Dao');
const DBMapper       = require('./DBMapper');

const mapper = new DBMapper({
  "team_id": "teamId",
  "access_key_id": "accessKeyId",
  "secret_access_key": "secretAccessKey"
});


class TeamKeysDao extends Dao {
  constructor(dbc) {
    super(dbc, "teams_aws_keys", mapper);
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