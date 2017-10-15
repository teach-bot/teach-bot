const nock = require('nock')
const Slapp = require('slapp')
const express = require('express')
const request = require('supertest')

const context = require('./context')

class SlappIntegrationHelper {
  constructor (skills) {
    this.slapp = Slapp({ context })

    this.registerSkills.bind(this)(skills)
    this.app = express()
    this.slapp.attachToExpress(this.app)
    this.expectations = 0
    this.metExpectations = 0

    this.expectPostMessage = this.expectPostMessage.bind(this)
    this.sendEvent = this.sendEvent.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendCommand = this.sendCommand.bind(this)
  }

  /**
   * registerSkills
   */
  registerSkills (skills) {
    if ((!!skills) && (skills.constructor === Array)) {
      skills.forEach((skill) => {
        skill(this.slapp)
      })
    } else {
      skills(this.slapp)
    }
  }

  /**
   * expectPostMessage
   * How to tell if this is the correct expectation
   * @param {Object} matcher - Matches to the request
   * @paramm {Object} expectation - Calls expects
   */
  expectPostMessage (matcher, expectation) {
    this.expectations = this.expectations + 1
    nock('https://slack.com')
      .post('/api/chat.postMessage', (body) => {
        console.log('MATCHED: ', this.expectations, ' : ', this.metExpectations)
        if (matcher(body)) {
          this.metExpectations = this.metExpectations + 1
          expectation(body)
          return true
        }
      })
      .reply(200, JSON.stringify({
        'ok': true,
        'text': 'ewl'
      }))
    return this
  }

  /**
   * expectSlashResponse
   * How to tell if this is the correct expectation
   * @param {Object} matcher - Matches to the request
   * @paramm {Object} expectation - Calls expects
   */
  expectSlashResponse () {
    return this
  }

  async sendEvent (endpoint, payload, command = false) {
    let req = request(this.app)
      .post(endpoint)

    if (command === true) {
      req.type('form')
    }

    let resp = await req.send(payload)

    if (this.expectations !== this.metExpectations) {
      throw Error('Not all expectations met')
    }
    return resp
  }

  async sendMessage (payload) {
    return this.sendEvent('/slack/event', payload)
  }

  async sendCommand (payload) {
    return this.sendEvent('/slack/command', payload, true)
  }

  cleanUp () {
    nock.cleanAll()
  }
}

module.exports = SlappIntegrationHelper
