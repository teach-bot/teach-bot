const request = require('supertest')
const slack = require('slack')
const express = require('express')
const { context } = require('../helpers.js')
const SlappExtended = require('../../src/slapp.js')
const directMessage = require('../fixtures/direct_message.json')
const sinon = require('sinon')

describe('SlappExtended', () => {
  let slapp
  let app
  let msgSpy
  beforeEach(() => {
    slapp = SlappExtended({ context })
    app = express()
    slapp.attachToExpress(this.app)
    msgSpy = sinon.spy(slack.chat, 'postMessage')
  })

  afterEach(() => {
    msgSpy.restore()
  })

  describe.only('message', () => {
    it('should behave normally if there are no errors', async () => { 
      var directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'hi'
      slapp.message('hi', ['direct_mention', 'direct_message'], (msg, text) => {
        msg.say('hello')
      })
      await request(this.app)
        .post('/slack/event').send(directMessageCopy)
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.eql('hello')
    })

    it('should catch an error if one is thrown', async () => {
      var directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'hi'
      slapp.message('hi', ['direct_mention', 'direct_message'], (msg, text) => {
        throw new Error('Whoops!')
        msg.say('hello')
      })
      let ravenStub = sinon.spy(Raven, 'captureException', (exception, callback) => {
        callback(null, '103920')
      })
      await request(app)
        .post('/slack/event').send(directMessageCopy)
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.include('Whoops!')
      expect(callArgs.args[0].text).to.include('103920')
      expect(ravenStub.callCount.to.eql(1))
      let ravenCallArgs = ravenStub.getCall(0)
      expect(ravenCallArgs.args[0].message).to.include('Whoops!')
      ravenStub.restore()
    })

  })
})
