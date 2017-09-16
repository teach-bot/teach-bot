const Raven = require('raven')
const express = require('express')
const { resolve } = require('path')
const env = require('node-env-file')
env(resolve(__dirname, '.env'))
const Slapp = require('slapp')

const context = require('./src/context.js')

Raven.config(process.env.SENTRY_DSN).install()

const app = express()
app.use(Raven.requestHandler())
class MySlapp extends Slapp {

  constructor(args) {
    console.log('fuk you')
    super(args)
    let originalMessage = this.message
    this.message = (criteria, typeFilter, callback) => {
      console.log('message called on child')
      originalMessage.bind(this)(criteria, typeFilter, function() {
        try {
          var args = [].slice.call(arguments, 0);
          callback.apply(null, args)
        } catch (e) {
          let msg = arguments[0]
          Raven.captureException(e, (sendErr, eventId) => {
            console.log('Send Err', sendErr)
            console.log('Evnet id', eventId)
            var eventIdToSend = '190320'
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
console.log(MySlapp.name)
var slapp = new MySlapp({
  verify_token: process.env.NODE_ENV !== 'test' ? process.env.SLAPP_VERIFY_TOKEN : null,
  context: context,
  log: true,
  colors: true,
  logger: (app, opts) => {
    app.on('error', (msg) => {
      Raven.captureException(msg)
    })
  }
})

var normalizedPath = require('path').join(__dirname, 'src', 'skills')
require('fs').readdirSync(normalizedPath).forEach(function (file) {
  require('./src/skills/' + file)(slapp)
})
console.log("UFCK< ", slapp.constructor.name)
slapp.attachToExpress(app).listen(process.env.PORT)
