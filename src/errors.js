const Slapp = require('slapp')

class MySlapp extends Slapp {
  constructor() {
    console.log('fuk you')
  }
  message(pattern, eventTypes, callback) {
    super.message(pattern, eventTypes, () => {
      try {
        console.log('BEFORE CALLBACK')
        callback(arguments)
        console.log('AFTER CALLBACK')
      } catch (e) {
        console.log('CAUGHT AN ERROR: ', e)
        let msg = arguments[0]
        Raven.captureException(e)
        let lastEventId = Raven.lastEventId()
        msg.say('Whoops! I ran into an error and have alerted my humans. If they ask you to identify the error, this should help them track down your issue: `'+ lastEventId +'`')
      }
    })
  }
}
module.exports = MySlapp
