const Sequelize = require('sequelize')
const sequelize = require('./db')

const Submission = sequelize.define('submissions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assignmentId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING },
  submissionLink: { type: Sequelize.STRING },
  teamId: { type: Sequelize.STRING }
  // submissions: { type: Has Many }
})

module.exports = Submission
