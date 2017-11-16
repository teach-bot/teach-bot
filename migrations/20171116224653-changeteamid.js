'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('submissions', 'teamId', {
      type: Sequelize.STRING,
      defaultValue: 0
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('submissions', 'teamId', {
      type: Sequelize.INTEGER,
      defaultValue: ''
    })
  }
}
