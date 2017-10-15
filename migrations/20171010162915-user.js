'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        userName: {
          type: Sequelize.STRING
        },
        realName: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.STRING
        },
        slackId: {
          type: Sequelize.STRING
        },
        teamId: {
          type: Sequelize.STRING
        }
      },
      {
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}
