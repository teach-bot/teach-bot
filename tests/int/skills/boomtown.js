
const boomtown = require('../../../src/skills/boomtown')
const directMessage = require('../../fixtures/direct_message')
const { NockSlappHelper } = require('../helpers')
const { expect } = require('chai')

describe('boomtown', () => {
  let slappHelper
  beforeEach(() => {
    slappHelper = new NockSlappHelper(boomtown)
  })

  describe('with correct value', () => {
    it('should reply then die', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown ' + process.env.DEV_BOOMTOWN
      let matcher = (body) => {
        expect(body.text).to.eql('About to die...')
        return true
      }
      try {
        await slappHelper.sendEvent(directMessageCopy, matcher)
      } catch (e) {
        expect(e).to.be.an('error')
      }
    })
  })

  describe('with incorrect value', () => {
    it('should not respond', async () => {
      let directMessageCopy = JSON.parse(JSON.stringify(directMessage))
      directMessageCopy.event.text = 'boomtown abcdef'
      let matcher = (body) => {
        throw Error('Should not send request')
      }
      await slappHelper.sendEvent(directMessageCopy, matcher)
    })
  })
})
