'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('authtokens', 'token', {
      type: Sequelize.TEXT,
      defaultValue: '',
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('authtokens', 'token', {
      type: Sequelize.CHAR,
      defaultValue: '',
    })
  }
};
