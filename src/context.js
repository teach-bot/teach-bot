const db = require('./db')

module.exports = async (req, res, next) => {
  let team = await db.Team.findOne({where: { teamId: req.slapp.meta.team_id }});
  if (team) {
    req.slapp.meta = Object.assign(req.slapp.meta, {
      app_token: team.appToken,
      bot_token: team.botToken,
      bot_user_id: team.botUserId,
    });
    next()
  } else {
    res.end(new Error('Error'))
  }
}
