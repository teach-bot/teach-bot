
const assignment = require('../../../src/skills/assignment')
const slashCommand = require('../../fixtures/slash_command')
const { SlappHelper } = require('../helpers')
const { expect } = require('chai')
const db = require('../../../src/db')

describe('assignment', () => {
  let slappHelper
  beforeEach(async () => {
    slappHelper = new SlappHelper(assignment)
    await db.Assignment.sync({ force: true })
  })

  describe('create with name', () => {
    it.only('should respond with Assignment Created! and make database call', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      let msgSpy = await slappHelper.sendEvent(slashCommandCopy, true)
      expect(msgSpy.callCount).to.eql(1)
      let callArgs = msgSpy.getCall(0)
      expect(callArgs.args[0].text).to.eql('Creating Assignment!')
    })
  })
})
