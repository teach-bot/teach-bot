
const assignment = require('../../../src/skills/assignment')
const slashCommand = require('../../fixtures/slash_command')
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

  // describe('list', () => {
  //   let assignment1
  //   let assignment2
  //   beforeEach(() => {
  //     assignment1 = await db.Assignment.create({
  //       name: 'Assignment 1',
  //       closed: false,
  //       teamId: msg.team_id
  //     })
  //     assignment2 = await db.Assignment.create({
  //       name: 'Assignment 2',
  //       closed: true,
  //       teamId: msg.team_id
  //     })
  //   })
  //   it('should list the assignments', async () => {
  //     let slashCommandCopy = JSON.parse(JSON.stringify(slashCommand))
  //     slashCommandCopy.command = '/assignment'
  //     slashCommandCopy.text = 'list'
  //     slashCommandCopy.user_id = 'abc' // Uknown user
  //     let resp = await slappHelper.expectSlashResponse().sendCommand(slashCommandCopy)
  //     let parsedResp = resp.res.text
  //     expect(parsedResp).to.eql('Oops! try again, but give the assignment a title `/assignment create AssignmentName`')
  //   })
  // })
})
