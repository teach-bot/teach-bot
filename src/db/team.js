const Sequelize = require('sequelize')
const sequelize = require('./db')

const Team = sequelize.define('teams', {
  teamId: { type: Sequelize.STRING },
  appToken: { type: Sequelize.STRING },
  botToken: { type: Sequelize.STRING },
  botUserId: { type: Sequelize.STRING }
})

module.exports = Team
