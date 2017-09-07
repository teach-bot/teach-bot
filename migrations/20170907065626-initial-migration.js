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
        updatedAt: {
          type: Sequelize.STRING
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
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('teams');
  }
};
