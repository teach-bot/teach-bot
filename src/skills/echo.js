module.exports = (slapp) => {
  slapp.message('echo (.*)', ['direct_mention', 'direct_message'], (msg, text, echo) => {
    msg.say(`echo ${echo}`)
  })
}
