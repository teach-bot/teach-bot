const Team = require('./team')
const Convo = require('./convo')


const models = {
  Team,
  Convo,
}

module.exports = Object.assign({},
  models,
  {
    models: Object.keys(models)
  }
)
