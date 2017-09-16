
const boomtown = require('../../../src/skills/boomtown')
const directMessage = require('../../fixtures/direct_message')
const { SlappHelper } = require('../helpers')
const { expect } = require('chai')

describe('boomtown', () => {
  let slappHelper
  beforeEach(() => {
    slappHelper = new SlappHelper(boomtown)
  })

  describe('with correct value', () => {
    it('should reply then die', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown '+process.env.DEV_BOOMTOWN
      let msgSpy
      try {
        msgSpy = await slappHelper.sendEvent(directMessageCopy)
      } catch (e) {
        expect(e).to.be.an('error')
      }
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.include('About to die...')
    })
  })

  describe('with incorrect value', () => {
    it('should not respond', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown abcdef'
      let msgSpy = await slappHelper.sendEvent(directMessageCopy)
      expect(msgSpy.callCount).to.eql(0)
    })
  })
})
