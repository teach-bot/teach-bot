const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect;

const db = require('../../src/db');
const context = require('../../src/context');

describe('context', () => {

  describe('when the team exists', () => {

    before(async () => {
      await db.Team.sync({ force : true }) // drops table and re-creates it
      await new db.Team({
        teamId: '1234',
        appToken: '5678',
        botToken: '9abc',
        botUserId: 'efgh',
      }).save()
    });

    it('assigns the team when it exists', (done) => {
      let req = {slapp: {meta: {team_id: '1234'}}}
      context(req, null, () => {
        expect(req.slapp.meta.app_token).to.eql('5678');
        expect(req.slapp.meta.bot_token).to.eql('9abc');
        expect(req.slapp.meta.bot_user_id).to.eql('efgh');
        done();
      })
    });

    it('errors out when the team does not exists', (done) => {
      let req = {slapp: {meta: {team_id: 'xyz'}}}
      context(req, null, (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.eql('Unable to find team')
        done()
      })
    });
  });
});
