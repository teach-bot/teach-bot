'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'teams',
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
        teamId: {
          type: Sequelize.STRING
        },
        appToken: {
          type: Sequelize.STRING
        },
        botToken: {
          type: Sequelize.STRING
        },
        botUserId: {
          type: Sequelize.STRING
        },
      },
      {
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    ).then(async () => {
      return queryInterface.createTable(
        'convos', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          key: {
            type: Sequelize.STRING
          },
          value: {
            type: Sequelize.STRING
          },
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('teams').then(async () => {
      return queryInterface.dropTable('convos')
    });
  }
};
