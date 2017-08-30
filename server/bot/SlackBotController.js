const TeamKeys = require("../teams/models/TeamKeys");
const behaviors = require("./behaviors");

class SlackBotController {

  constructor(slackBot, teamKeysDao) {
    this.slackBot = slackBot;
    this.teamKeysDao = teamKeysDao;
  }

  listenForInstallations() {
    this.slackBot.addEventHook("create_bot", (bot, config) => {
      // save the new team to the db
      this.teamKeysDao.insert(new TeamKeys({
          teamId: bot.config.id,
          teamToken: config.token,
          accessKeyId: "test",
          secretAccessKey: "secretAccessKey"
      }))

      bot.startRTM((err) => {
        if (err) bot.destoryRTM();
        else {
          bot.startPrivateConversation({user: config.createdBy}, (err, convo) => {

            if (!err) {
              convo.say('Ask for help');
            }
          });
        }
      });
    });
  }

  attachTo(app) {
    this.slackBot.setupOAuth(app);
    this.listenForInstallations();
    behaviors.start(this.slackBot, "*");

    //listen to all the teams
    this.teamKeysDao.getAllKeys()
        .then(keys => keys.forEach(key => this.slackBot.listen(key.teamToken)))
  }
}

module.exports = SlackBotController;
