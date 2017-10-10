const HELP_TEXT = [
  ' You can tell me to do any of the following things by directly mentioning me.',
  'Ex: `@botname` echo Yodel',
  '`echo` -  Echo back whatever you said to me',
  '`help` - Prints this help text',
  ' The following are slash commands: ',
  '`/assignment` - view, create, submit, and close assignments',
  '`/register` - if you are a teacher, use this command to register all new students and TAs who have joined',
  '`/feature-request` - use this feature to communicate feature requests to the team'
].join('\n')

module.exports = (slapp) => {
  slapp.message('help(.*)', ['direct_mention', 'direct_message'], (msg, text) => {
    msg.say(HELP_TEXT)
  })
}
