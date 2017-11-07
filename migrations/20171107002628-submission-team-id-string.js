'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('submissions', 'teamId', {
      type: Sequelize.STRING,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('submissions', 'teamId', {
      type: Sequelize.INTEGER,
      defaultValue: "X"
    })
  }
};
