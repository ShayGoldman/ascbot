class TeamKeys {

  constructor(data) {
    const {teamId, accessKeyId, secretAccessKey, botToken} = data;
    this.teamId                                  = teamId;
    this.accessKeyId                             = accessKeyId;
    this.secretAccessKey                         = secretAccessKey;
    this.botToken                                = botToken;
  }

}


module.exports = TeamKeys;
