const {receivesDirectMessage} = require("./SlackBot");
const {TeamKeysDao} = require("../teams/TeamKeysDao");

class SlackBotController {

  constructor(slackBot, teamKeysDao) {
    this.slackBot = slackBot;
    this.teamKeysDao = teamKeysDao;
  }

  listenForInstallations() {
    this.slackBot.addEventHook("create_bot", (bot, config) => {
        // TODO: Solve syntax error
      this.teamKeysDao.insert({
          teamId: bot.config.id,
          teamToken: config.token,
          accessKeyId: "test",
          secretAccessKey: "secretAccessKey"
      })

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

    this.slackBot
      .newInteraction()
      .when(receivesDirectMessage("help"))
      .reply("F U")
      .close();

    this.teamKeysDao.getAllKeys()
        .each(key => this.slackBot.listen(key.botToken))
  }
}

module.exports = SlackBotController;
