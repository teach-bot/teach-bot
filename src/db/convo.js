const Sequelize = require('sequelize');
const sequelize = require('./db');

const Convo = sequelize.define('convo', {
  key: { type: Sequelize.STRING },
  value: { type: Sequelize.STRING },
});

module.exports = Convo;
