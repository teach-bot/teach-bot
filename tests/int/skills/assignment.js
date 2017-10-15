
const assignment = require('../../../src/skills/assignment')
const slashCommand = require('../../fixtures/slash_command')
const SlappIntegrationHelper = require('../../../slapp-integration-helper')
const { expect } = require('chai')
const db = require('../../../src/db')

let yes = (_) => { return true }

describe('assignment', () => {
  let slappHelper
  beforeEach(async () => {
    slappHelper = new SlappIntegrationHelper(assignment)
    await db.Assignment.sync({ force: true })
  })
  afterEach(async () => {
    slappHelper.cleanUp()
  })

  describe('create with name', () => {
    it('should respond with Assignment Created! and make database call', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      await slappHelper.expectPostMessage(yes, (body) => {
        expect(body.text).to.eql('Creating Assignment!')
      }).sendCommand(slashCommandCopy)
    })
  })
})
