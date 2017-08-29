const {error500} = require("../middlewares/handling/serverResponses");

const BotKit = require('botkit');

class SlackBot {

  constructor(config, logger) {
    const conf              = Object.assign({}, config, {scopes: ['bot']});
    this._bot               = BotKit.slackbot(conf);
    this.logger = logger.registerClass(this);
    this.InteractionBuilder = generateInteractionBuilder(this._bot, this.logger);
  }

  newInteraction() {
    return new this.InteractionBuilder();
  }

  listen(token) {
      this._bot.spawn({token: token}).startRTM()
   }

  setupOAuth(app) {
    this._bot.createOauthEndpoints(app, (err, req, res) => {
      if (err) return error500(res, err);
      else res.redirect("/yay.html");
    });
  }

  addEventHook(event, handle) {
    this._bot.on(event, handle);
  }
}

function generateInteractionBuilder(bot, logger) {
  return class InteractionBuilder {
    constructor() {
      return this;
    }

    when(hook) {
      this.hook = hook;
      return this;
    }

    waitForData(func) {
      this.funcToWaitFor = func;
      return this;
    }

    reply(funcOrText) {
      if (typeof funcOrText === "function") this.funcForReply = funcOrText;
      else this.textForReply = funcOrText;
      return this;
    }

    close() {
      bot.hears(...this.hook, (bot, message) => {
        Promise.resolve()
          .then(() => this.funcToWaitFor && this.funcToWaitFor({message}))
          .then((data) => {
            const answer = this.funcForReply ? this.funcForReply({data, message}) : (this.textForReply || "Oops :(");
            bot.reply(message, answer);
          })
          .catch(logger.error)
      });
    }

  }
}

function receivesDirectMessage(pattern) {
  return [pattern, ["direct_message"]];
}

module.exports = {
  SlackBot,
  receivesDirectMessage
};
