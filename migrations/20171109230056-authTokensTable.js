module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'authtokens',
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
        token: {
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
    return queryInterface.dropTable('authtokens')
  }
}
