const meta = {
  app_token: 'app_token',
  team_id: 'TXXXXXXXX',
  channel_id: 'DXXXXXXXX',
  user_id: 'user_id',
  app_bot_id: 'app_bot_id'
}

module.exports = {
  meta,
  context: (req, res, next) => {
    req.slapp.meta = Object.assign(req.slapp.meta, meta)
    next()
  }
}
