
const boomtown = require('../../../src/skills/boomtown')
const directMessage = require('../../fixtures/direct_message')
const SlappIntegrationHelper = require('../../../slapp-integration-helper')
const { expect } = require('chai')

let yes = (_) => { return true }

describe('boomtown', () => {
  let slappHelper
  beforeEach(async () => {
    slappHelper = new SlappIntegrationHelper(boomtown)
  })
  afterEach(async () => {
    slappHelper.cleanUp()
  })

  describe('with correct value', () => {
    it('should reply then die', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown ' + process.env.DEV_BOOMTOWN
      slappHelper.expectPostMessage(yes, (body) => {
        expect(body.text).to.eql('About to die...')
      })
      try {
        await slappHelper.sendMessage(directMessageCopy)
      } catch (e) {
        expect(e).to.be.an('error')
      }
    })
  })

  describe('with incorrect value', () => {
    it('should not respond', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown abcdef'
      await slappHelper.sendMessage(directMessageCopy)
    })
  })
})
