module.exports = (slapp) => {
  slapp.message('boomtown (.*)', ['direct_mention', 'direct_message'], (msg, text, boomtownkey) => {
    if (boomtownkey === process.env.DEV_BOOMTOWN) {
      msg.say('About to die...')
      throw new Error('Boomtown *boom*')
    }
  })
}
