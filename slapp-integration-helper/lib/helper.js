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
    this.expectations = []

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
    var promise = new Promise((resolve, reject) => {
      nock('https://slack.com')
        .post('/api/chat.postMessage', (body) => {
          if (matcher(body)) {
            expectation(body)
            resolve()
            return true
          }
        })
        .reply(200, JSON.stringify({
          'ok': true,
          'text': 'ewl'
        }))
    })
    this.expectations.push(promise)
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

  /**
   * expectActionResponse
   * Currently doesn't do anything but highlights the expectation
   */
  expectActionResponse () {
    return this
  }

  async sendEvent (endpoint, payload, payloadType = 'EVENT') {
    let req = request(this.app)
      .post(endpoint)

    if (payloadType === 'COMMAND') {
      req.type('form')
    }

    if (payloadType === 'ACTION') {
      req.type('form')
      // Slack encodes this in a really weird way...
      payload = {
        payload: JSON.stringify(payload)
      }
    }

    let resp = await req.send(payload)

    await Promise.all(this.expectations) // Wait for
    // if (this.expectations !== this.metExpectations) {
    //   // Set a timeout to wait for all the expectations to be met

    //   throw Error('Not all expectations met')
    // }
    return resp
  }

  async sendMessage (payload) {
    return this.sendEvent('/slack/event', payload)
  }

  async sendCommand (payload) {
    return this.sendEvent('/slack/command', payload, 'COMMAND')
  }

  async sendAction (payload) {
    return this.sendEvent('/slack/action', payload, 'ACTION')
  }

  cleanUp () {
    nock.cleanAll()
  }
}

module.exports = SlappIntegrationHelper
