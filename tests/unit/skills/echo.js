const request = require('supertest');
const Slapp = require('slapp')
const express = require('express')
const { meta, context } = require('../helpers')
const echo = require('../../../src/skills/echo')
const direct_message = require('../../fixtures/direct_message')
const nock = require('nock')


describe('echo', () => {
  let slapp
  let app
  nock.disableNetConnect()
  beforeEach(() => {
    slapp = Slapp({ context })
    app = express()
    slapp.attachToExpress(app)
    echo(slapp)
  })

  describe('without text to echo', () => {
    it.only('should respond with help text', async () => {
      nock(/.*/)
        .post(/.*/, (body) => {
          console.log('BODYFDSO', body) 
          return true;
        })
        .reply(200)

      let resp = await request(app)
        .post('/slack/event').send(direct_message)

      //console.log('resp', resp)
    })
  })
})


