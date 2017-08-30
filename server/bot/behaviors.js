const {receivesDirectMessage} = require("./SlackBot");

/**
 * This object defines the list of possible behaviors for our bot.
 * to add a new behaviors simply add a new key (the key name will be
 * used to refer to this behavior) where its value is a function that receive
 * the bot instance and returns a new Interaction.
 */
const behaviors = {
    help: function (bot) {
        bot.newInteraction()
          .when(receivesDirectMessage("help me"))
          .reply("F U")
          .close();
    }
}

module.exports.start = function (bot, behaviorsNames) {
    if (behaviorsNames === "*") {
        behaviorsNames = Object.keys(behaviors)
    }

    behaviorsNames.forEach(name => {
        behaviors[name](bot)
    })
}
