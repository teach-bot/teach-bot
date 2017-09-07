const db = require('../db');

module.exports = {
  async getTeamById: (teamId) => {
      return db.Team.findOne({
        where: { teamId }
      });
  }
}
