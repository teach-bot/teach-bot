const Sequelize = require('sequelize');

const env = require('node-env-file')
env(__dirname + '/../../.env');

console.log('process.env.DATABASE_NAME', process.env.DATABASE_NAME);

if (process.env.NODE_ENV == 'test') {
  process.env.DATABASE_NAME = process.env.DATABASE_NAME + '_test';
}


const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {dialect: 'postgres'}
);
module.exports = sequelize
