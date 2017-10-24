const echo = require('../../../src/skills/echo')
const directMessage = require('../../fixtures/direct_message')
const SlappIntegrationHelper = require('../../../slapp-integration-helper')
const { expect } = require('chai')

let yes = (_) => { return true }

describe('echo', () => {
  let slappHelper
  beforeEach(async () => {
    slappHelper = new SlappIntegrationHelper(echo)
  })
  afterEach(async () => {
    slappHelper.cleanUp()
  })

  describe('without text to echo', () => {
    it('should respond with help text', async () => {
      await slappHelper.expectPostMessage(yes, (body) => {
        expect(body.text).to.include('Looks like you would')
      }).sendMessage(directMessage)
    })
  })

  describe('with text to echo', () => {
    it('should with echo text', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'echo hello world'
      await slappHelper.expectPostMessage(yes, (body) => {
        expect(body.text).to.eql('echo hello world')
      }).sendMessage(directMessageCopy)
    })
  })
})
