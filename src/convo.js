const { Convo } = require('./db')

module.exports = {
  set (id, params, callback) {
    // TODO: This can create a race condition. Using upsert could work
    callback = callback || (() => {})
    params.id = id
    let serializedValue = JSON.stringify(params)
    let defaults = { key: id, value: serializedValue }
    Convo.findOrCreate({where: {key: id}, defaults}).spread((row, created) => {
      if (created) {
        callback()
      } else {
        row.updateAttributes(defaults).then(function (updated) {
          callback()
        })
      }
    })
  },
  get (id, callback) {
    Convo.findOne({where: { key: id }}).then((row) => {
      if (row) {
        callback(null, JSON.parse(row.value))
      } else {
        callback(null, null)
      }
    })
  },
  del (id, callback) {
    Convo.destroy({where: { key: id }}).then((affectedRows) => {
      callback()
    })
  }
}
