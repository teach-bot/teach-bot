const chai = require('chai');
const expect = chai.expect;

const db = require('../../src/db');
const context = require('../../src/context');

describe('context', () => {

  describe('when the team exists', () => {

    beforeEach(async () => {
      await db.Team.truncate();
      db.Team({
        teamId: '1234',
        appToken: '5678',
        botToken: '9abc',
        botUserId: 'efgh',
      });
    });
    it('assigns the team when it exists', (done) => {
        let req = {slapp: {meta: {team_id: '12345'}}}
        context(req, null, () => {
          expect(req.slapp.meta.app_token).to.eql('5678');
          expect(req.slapp.meta.bot_token).to.eql('9abc');
          expect(req.slapp.meta.bot_user_id).to.eql('efgh');
          done();
        })
    });
  });
});
