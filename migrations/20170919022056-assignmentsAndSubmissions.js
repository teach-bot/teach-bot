'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'assignments',
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
        name: {
          type: Sequelize.STRING
        },
        sheetId: {
          type: Sequelize.STRING
        },
        closed: {
          type: Sequelize.BOOLEAN
        },
        teamId: {
          type: Sequelize.STRING
        }
      },
      {
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    ).then(async () => {
      return queryInterface.createTable(
        'submissions', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          assignmentId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'assignments',
              key: 'id'
            }
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          userId: { type: Sequelize.STRING },
          submissionLink: { type: Sequelize.STRING },
          teamId: { type: Sequelize.INTEGER }
        })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('submissions').then(async () => {
      return queryInterface.dropTable('assignments')
    })
  }
}
