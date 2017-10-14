const Sequelize = require('sequelize')
const sequelize = require('./db')

const Assignment = sequelize.define('assignments', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: Sequelize.STRING },
  sheetId: { type: Sequelize.STRING },
  closed: { type: Sequelize.BOOLEAN },
  teamId: { type: Sequelize.STRING }
})

module.exports = Assignment
