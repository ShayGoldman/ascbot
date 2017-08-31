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
                this.askForAwsTokens(bot, convo)
            }
          });
        }
      });
    });
  }

  askForAwsTokens(bot, convo) {
      const teamKeysDao = this.teamKeysDao
      const hello = `Hello my friend,
Before we can start I need to have read access to your CloudWatch.
Note that we keep your information secure.
But its recommended that you will create a new IAM with specific roles`
      const question1 = 'When you ready, please reply with the AWS accessKeyId:'
      const question2 = 'Now The AWS secretAccessKey please:'
      const conclusion = `Thats it. Now I am at your service,
you can always send \`help me\` to see how i can help you`
      convo.say(hello);
      convo.addQuestion(question1, function (response1, convo) {
          convo.say('Thanks')

          convo.addQuestion(question2, function (response2, convo) {
              console.log(response1)
              console.log(response2)
              teamKeysDao.updateKey(bot.config.id, {
                  accessKeyId: response1.text,
                  secretAccessKey: response2.text
              })
              convo.say(conclusion)
              convo.next()
          })
          convo.next()
      })
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
