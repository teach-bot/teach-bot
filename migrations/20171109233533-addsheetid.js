'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('assignments', 'sheetId', {
      type: Sequelize.STRING,
      defaultValue: ''
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('assignments', 'sheetId')
  }
}
