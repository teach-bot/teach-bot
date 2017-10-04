const echo = require('../../../src/skills/echo')
const directMessage = require('../../fixtures/direct_message')
const { NockSlappHelper } = require('../helpers')
const { expect } = require('chai')

describe('echo', () => {
  let slappHelper
  beforeEach(() => {
    slappHelper = new NockSlappHelper(echo)
  })

  describe('without text to echo', () => {
    it('should respond with help text', async () => {
      let matcher = (body) => {
        expect(body.text).to.include('Looks like you would')
        return true
      }
      await slappHelper.sendEvent(directMessage, matcher)
    })
  })

  describe('with text to echo', () => {
    it('should with echo text', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'echo hello world'
      let matcher = (body) => {
        expect(body.text).to.eql('echo hello world')
        return true
      }
      await slappHelper.sendEvent(directMessage, matcher)
    })
  })
})
