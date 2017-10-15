
// FEATURE REQUEST
module.exports = (slapp) => {
  slapp.command('/feature-request', '(.*)', (msg, text, featureRequest) => {
    if (featureRequest === '') {
      msg.say('Oops! try again, but this time type your feature request right after `/feature-request `')
    } else {
      msg.say('Got it! Sharing this with the team.')
    }
  })
}
