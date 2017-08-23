const {receivesDirectMessage} = require("./SlackBot");

class SlackBotController {

  constructor(slackBot) {
    this.slackBot = slackBot;
  }

  listenForInstallations() {
    this.slackBot.addEventHook("create_bot", (bot, config) => {

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
  }
}

module.exports = SlackBotController;