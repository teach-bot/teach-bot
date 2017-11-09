
const assignment = require('../../../src/skills/assignment')
const slashCommand = require('../../fixtures/slash_command')
const buttonAction = require('../../fixtures/button_action')
const SlappIntegrationHelper = require('../../../slapp-integration-helper')
const { expect } = require('chai')
const db = require('../../../src/db')

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
    await new db.User({
      slackId: 'cde',
      role: 'gxstudent'
    }).save()
  })
  afterEach(async () => {
    slappHelper.cleanUp()
  })

  describe('create', () => {
    it('should respond with Assignment Created! and make database call when authenticated', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      slashCommandCopy.user_id = 'abc' // This role is gxteacher
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      let assignment = await db.Assignment.findOne({})
      expect(assignment.name).to.eql('name')
      expect(parsedResp.text).to.eql('Creating Assignment name')
    })

    it('should bail on incorrect role', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      slashCommandCopy.user_id = 'cde' // This role is gxstudent
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      let assignment = await db.Assignment.findOne({})
      expect(assignment).to.be.a('null')
      expect(parsedResp.text).to.eql('Oops - you cannot use this feature as a student')
    })

    it('should bail on unknown user', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create name'
      slashCommandCopy.user_id = 'fgh' // Uknown user
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      let assignment = await db.Assignment.findOne({})
      expect(assignment).to.be.a('null')
      expect(parsedResp.text).to.eql(`Oops - I couldn't find you in the system. Please contact an administrator for assistance.`)
    })

    it('should bail w/o assignment name', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'create'
      slashCommandCopy.user_id = 'abc' // Uknown user
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      let assignment = await db.Assignment.findOne({})
      expect(assignment).to.be.a('null')
      expect(parsedResp.text).to.eql('Oops! try again, but give the assignment a title `/assignment create AssignmentName`')
    })
  })

  describe('list', () => {
    beforeEach(async () => {
      await db.Assignment.create({
        name: 'Assignment 1',
        closed: false,
        teamId: 'TXXXXXXXX'
      })
      await db.Assignment.create({
        name: 'Assignment 2',
        closed: true,
        teamId: 'TXXXXXXXX'
      })
    })

    it('should list the assignments', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'list'
      slashCommandCopy.user_id = 'abc'
      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)
      expect(parsedResp.attachments.length).to.eql(2)
      expect(parsedResp.attachments[0].text).to.eql('Assignment 1')
      expect(parsedResp.attachments[1].callback_id).to.eql('assignment_list_show_all')
    })

    it('should list the all assignments when the button is pressed', async () => {
      let buttonActionCopy = JSON.parse(JSON.stringify(buttonAction))
      buttonActionCopy.command = '/assignment'
      buttonActionCopy.text = 'list'
      buttonActionCopy.user_id = 'abc' // Uknown user

      let resp = await slappHelper.expectActionResponse().sendAction(buttonActionCopy)
      let parsedResp = JSON.parse(resp.res.text)

      expect(parsedResp.attachments.length).to.eql(2)
      expect(parsedResp.attachments[0].text).to.eql('Assignment 1')
      expect(parsedResp.attachments[1].text).to.eql('Assignment 2')
    })
  })

  describe.only('close', () => {
    beforeEach(async () => {
      await db.Assignment.create({
        name: 'Assignment 1',
        closed: false,
        teamId: 'TXXXXXXXX'
      })
      await db.Assignment.create({
        name: 'Assignment 2',
        closed: true,
        teamId: 'TXXXXXXXX'
      })
    })

    it('should list all the unclosed assignments', async () => {
      let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
      slashCommandCopy.command = '/assignment'
      slashCommandCopy.text = 'close'
      slashCommandCopy.user_id = 'abc'

      let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
      let parsedResp = JSON.parse(resp.res.text)

      expect(parsedResp.attachments.length).to.eql(1)
      expect(parsedResp.attachments[0].text).to.eql('Assignment 1')
    })
  })
})
