const db = require('./db');

// var store = {
//   'T6R6PESE6': {
//     app_token: 'xoxp-229227502482-229362853301-233457898913-37639f7b2537b0b41d52aa1666028e71',
//     bot_token: 'xoxb-235081576471-FP2GZPdCz7Hd69SkmVVswYiO',
//     bot_user_id: 'U6X2DGYDV',
//   }
// };

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
    res.end('Error');
  }
}
