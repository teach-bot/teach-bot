const Sequelize = require('sequelize')
const sequelize = require('./db')

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  realName: { type: Sequelize.STRING },
  userName: { type: Sequelize.STRING },
  role: {type: Sequelize.STRING },
  slackId: {type: Sequelize.STRING },
  teamId: { type: Sequelize.STRING }
})

module.exports = User
