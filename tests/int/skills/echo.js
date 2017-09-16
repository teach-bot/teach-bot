const echo = require('../../../src/skills/echo')
const directMessage = require('../../fixtures/direct_message')
const { SlappHelper } = require('../helpers')
const { expect } = require('chai')

describe('echo', () => {
  let slappHelper
  beforeEach(() => {
    slappHelper = new SlappHelper(echo)
  })

  describe('without text to echo', () => {
    it('should respond with help text', async () => {
      let msgSpy = await slappHelper.sendEvent(directMessage)
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.include('Looks like you would')
    })
  })

  describe('with text to echo', () => {
    it('should with echo text', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'echo hello world'
      let msgSpy = await slappHelper.sendEvent(directMessageCopy)
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.eql('echo hello world')
    })
  })
})
