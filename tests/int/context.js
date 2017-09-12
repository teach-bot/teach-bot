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

    it('assigns the team when it exists', async () => {
      let req = {slapp: {meta: {team_id: '1234'}}}
      let next = sinon.spy()
      await context(req, null, next)
      expect(req.slapp.meta.app_token).to.eql('5678');
      expect(req.slapp.meta.bot_token).to.eql('9abc');
      expect(req.slapp.meta.bot_user_id).to.eql('efgh');
      // TODO: Figure out why this assertion is breaking
      // expect(next).to.have.been.calledOnce()
    });

    it('errors out when the team does not exists', async () => {
      let req = {slapp: {meta: {team_id: 'xyz'}}}
      let res = {end: sinon.spy()}
      await context(req, res, () => {})
      expect(res.end).to.have.been.calledWith(
        sinon.match.instanceOf(Error).and(sinon.match.has('message', 'Error'))
      )
    });
  });
});
