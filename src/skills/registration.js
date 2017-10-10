const db = require('../db')

module.exports = (slapp) => {
  slapp.command('/register', (msg, text) => {
    msg.respond('Registering Students')
    let token = msg.meta.bot_token
    slapp.client.users.list({token}, (err, resp) => {
      console.log(err)
      resp.members.forEach(function (user) {
        if (user.is_bot == false || user.name === "slackbot") {
            db.User.create({
                          slackId: user.id,
                          realName: user.real_name,
                          userName: user.name,
                          role: "",
                          teamId: msg.meta.team_id})
        }
      })
    })
  })
}
