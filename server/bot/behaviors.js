const {receivesDirectMessage} = require("./SlackBot");
const CloudWatchLogs = require('../aws/cloudwatch/cloudWatchLogs');

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
    },

    logs: function (bot, teamKeysDao) {
        bot.newInteraction()
            .when(receivesDirectMessage('show me log groups'))
            .waitForData(ev => {
                return teamKeysDao.getTeamById(ev.message.team)
                    .then(team => {
                        const {accessKeyId, secretAccessKey} = team
                        return new CloudWatchLogs({accessKeyId, secretAccessKey})
                    })
                    .then(cloudWatchLogs => cloudWatchLogs.listLogGroups())

            })
            .reply(res => {
                const groups = res.data.map(group => group.logGroupName).join(', ')
                return `Your log groups are: \`${groups}\``
            })
            .close();
    }
}

module.exports.start = function (bot, behaviorsNames, teamKeysDao) {
    if (behaviorsNames === "*") {
        behaviorsNames = Object.keys(behaviors)
    }

    behaviorsNames.forEach(name => {
        behaviors[name](bot, teamKeysDao)
    })
}
