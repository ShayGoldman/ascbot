class TeamKeys {

  constructor(data) {
    const {teamId, accessKeyId, secretAccessKey} = data;
    this.teamId                                  = teamId;
    this.accessKeyId                             = accessKeyId;
    this.secretAccessKey                         = secretAccessKey;
  }

}


module.exports = TeamKeys;