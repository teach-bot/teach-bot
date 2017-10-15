
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
    await db.User.sync({ force: true })
    await new db.User({
      slackId: 'abc',
      role: 'gxteacher'
    }).save()
  })
  afterEach(async () => {
    slappHelper.cleanUp()
  })

  describe('create with name', () => {
    it('should respond with Assignment Created! and make database call', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      slashCommandCopy.user_id = 'abc'
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      expect(parsedResp.text).to.eql('Creating Assignment name')
    })
  })
})
