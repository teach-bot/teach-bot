const Sequelize = require('sequelize')
const sequelize = require('./db')

const AuthToken = sequelize.define('authtokens', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: { type: Sequelize.STRING },
  teamId: { type: Sequelize.STRING }
})

module.exports = AuthToken
