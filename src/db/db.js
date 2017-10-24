const path = require('path')
const Sequelize = require('sequelize')

const env = require('node-env-file')
env(path.join(process.cwd(), '/.env'))

const databaseURI = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL
let shouldLog = process.env.NODE_ENV === 'development'
const sequelize = new Sequelize(databaseURI, { logging: shouldLog })
module.exports = sequelize
