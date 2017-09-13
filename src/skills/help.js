const HELP_TEXT = [
  ' You can tell me to do any of the following things by directly mentioning me.',
  'Ex: `@botname` echo Yoooooo',
  '`echo` -  Echo back whatever you said to me',
  '`help` - Prints this help text'
].join('\n')

// const HELP_TEXT = 'halp';

module.exports = (slapp) => {
  slapp.message('help(.*)', ['direct_mention', 'direct_message'], (msg, text) => {
    msg.say(HELP_TEXT)
  })
}
