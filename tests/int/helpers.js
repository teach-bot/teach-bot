const nock = require('nock')
const Slapp = require('slapp')
const express = require('express')
const slack = require('slack')
const request = require('supertest')
const sinon = require('sinon')

const meta = {
  app_token: 'app_token',
  team_id: 'TXXXXXXXX',
  channel_id: 'DXXXXXXXX',
  user_id: 'user_id',
  app_bot_id: 'app_bot_id'
}

const context = (req, res, next) => {
  req.slapp.meta = Object.assign(req.slapp.meta, meta)
  next()
}

class NockSlappHelper {
  constructor (skills) {
    this.slapp = Slapp({ context })
    if ((!!skills) && (skills.constructor === Array)) {
      skills.forEach((skill) => {
        skill(this.slapp)
      })
    } else {
      skills(this.slapp)
    }
    this.app = express()
    this.slapp.attachToExpress(this.app)
  }

  async sendEvent (payload, matcher) {
    nock('https://slack.com')
      .post('/api/chat.postMessage', matcher)
      .reply(200, JSON.stringify({
        'ok': true,
        'ts': '1405895017.000506',
        'channel': 'C024BE91L',
        'message': {
          'text': 'SJFDLS'
        }
      }))
    await request(this.app)
        .post('/slack/event').send(payload)
  }
}

class SlappHelper {
  constructor (skills) {
    this.slapp = Slapp({ context })
    if ((!!skills) && (skills.constructor === Array)) {
      skills.forEach((skill) => {
        skill(this.slapp)
      })
    } else {
      skills(this.slapp)
    }
    this.app = express()
    this.slapp.attachToExpress(this.app)
  }

  async sendEvent (payload) {
    let msgSpy = sinon.spy(slack.chat, 'postMessage')
    await request(this.app)
        .post('/slack/event').send(payload)
    msgSpy.restore()
    return msgSpy
  }
}

module.exports = {
  meta,
  context,
  SlappHelper,
  NockSlappHelper
}
