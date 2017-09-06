var store = {
  'T6R6PESE6': {
    app_token: 'xoxp-229227502482-229362853301-233457898913-37639f7b2537b0b41d52aa1666028e71',
    bot_token: 'xoxb-235081576471-FP2GZPdCz7Hd69SkmVVswYiO',
    bot_user_id: 'U6X2DGYDV',
  }
};

module.exports = (req, res, next) => {
  var meta = req.slapp.meta
  let stored = store[meta.team_id];
  if (stored) {
    req.slapp.meta = Object.assign(req.slapp.meta, {
      app_token: stored.app_token,
      bot_token: stored.bot_token,
      bot_user_id: stored.bot_user_id,
    })
    next()
  } else {
    res.end('Error');
  }
}
