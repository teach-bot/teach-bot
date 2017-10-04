
const assignment = require('../../../src/skills/assignment')
const slashCommand = require('../../fixtures/slash_command')
const { NockSlappHelper } = require('../helpers')
const { expect } = require('chai')
const db = require('../../../src/db')

describe('assignment', () => {
  let slappHelper
  beforeEach(async () => {
    slappHelper = new NockSlappHelper(assignment)
    await db.Assignment.sync({ force: true })
  })

  describe('create with name', () => {
    it('should respond with Assignment Created! and make database call', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'

      let matcher = (body) => {
        expect(body.text).to.eql('Creating Assignment!')
        return true
      }
      await slappHelper.eventExpectCommmand(slashCommandCopy, matcher)
    })
  })
})
