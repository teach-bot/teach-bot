const Slapp = require('slapp')

class SlappExtended extends Slapp {

  constructor(args) {
    super(args)
    let originalMessage = this.message

    // For some reason class overwriding as I was expecting
    // didn't work so I had to manualy hack things out.
    this.message = (criteria, typeFilter, callback) => {
      originalMessage.bind(this)(criteria, typeFilter, function() {
        // TODO: Add user context for sentry here. https://docs.sentry.io/clients/node/usage/#tracking-users
        try {
          var args = [].slice.call(arguments, 0);
          callback.apply(null, args)
        } catch (e) {
          let msg = arguments[0]
          Raven.captureException(e, (sendErr, eventId) => {
            var eventIdToSend = '190320' // Some random value that looks like an "error message"
            if (eventId) {
              eventIdToSend = eventId
            }
            msg.say('Whoops! I ran into an error and have alerted my humans. If they ask you to identify the error, this should help them track down your issue: `'+ eventIdToSend +'`')
          })
        }
      })
    }
    this.message = this.message.bind(this)
  }
}
modules.export = SlappExtended
