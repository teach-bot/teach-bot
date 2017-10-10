const db = require('../db')

// CREATE ASSIGNMENT
module.exports = (slapp) => {
  slapp.command('/feature-request', '(.*)', (msg, text, featureRequest) => {
    if (featureRequest === '') {
      msg.say('Oops! try again, but this time type your feature request right after `/feature-request `')
    } else {
      msg.say('Got it! Sharing this with the team.')
      channelPayload = Object.assign({
        token: self.meta.bot_token || self.meta.app_token,
        channel: self.meta.channel_id
      }, input)
      msg.slack.channels.create()
    }
  })
}
