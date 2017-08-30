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
              convo.say('Hello my friend.');
              convo.say('Before we can start I need to get read access to your CloudWatch')
              convo.say([
                'We keep your information secure.',
                'But its recommended that you will create a new IAM with specific roles'
            ].join(' '))
              const question1 = 'When you ready, please reply with the IAM AWS key:'
              convo.addQuestion(question1, function (response, convo) {
                  // TODO: save the response as the key
                  convo.say('Thanks')
                  const question2 = 'Now The AWS secret please:'
                  convo.addQuestion(question2, function (response, convo) {
                      // TODO: save the response as the secret
                      convo.say('Thats it. Now I am at your service, you can always send `help me` to see how i can help you')
                      convo.next()
                  })
                  convo.next()
              })
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
