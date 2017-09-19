const path = require('path')
const Sequelize = require('sequelize')

const env = require('node-env-file')
env(path.join(process.cwd(), '/.env'))

const databaseURI = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL
const sequelize = new Sequelize(databaseURI)
module.exports = sequelize
