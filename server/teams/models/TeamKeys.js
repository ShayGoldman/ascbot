class TeamKeys {

  constructor(data) {
    const {teamId, teamToken, accessKeyId, secretAccessKey} = data;
    this.teamId                                             = teamId;
    this.teamToken                                          = teamToken;
    this.accessKeyId                                        = accessKeyId;
    this.secretAccessKey                                    = secretAccessKey;
  }

}


module.exports = TeamKeys;
