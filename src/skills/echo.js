module.exports = (slapp) => {
  slapp.message('echo *$', ['direct_mention', 'direct_message'], (msg, text, echo) => {
    msg.say(`:wave: Looks like you would like me to echo something back. Please say \`echo MESSAGE_TO_ECHO\` and replace \`MESSAGE_TO_ECHO\` with what you want me to say. :thumbs:`)
  })
  slapp.message('echo (.*)', ['direct_mention', 'direct_message'], (msg, text, echo) => {
    msg.say(`echo ${echo}`)
  })
}
