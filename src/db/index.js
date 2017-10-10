const Team = require('./team')
const Convo = require('./convo')
const Assignment = require('./assignment')
const Submission = require('./submission')
const User = require('./user')

const models = {
  Team,
  Convo,
  Assignment,
  Submission,
  User
}

Assignment.hasMany(Submission, {foreignKey: 'assignmentId', sourceKey: 'id'})

module.exports = Object.assign({},
  models,
  {
    models: Object.keys(models)
  }
)
