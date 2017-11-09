let fs = require('fs')
let readline = require('readline')
let GoogleAuth = require('google-auth-library')
const db = require('../db')

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'] // you can add more scopes according to your permission need. But in case you chang the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credential/' // the directory where we're going to save the token
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json' // the file which will contain the token

class Authentication {

  authenticate () {
    return new Promise((resolve, reject) => {
      let credentials = this.getClientSecret()
      let authorizePromise = this.authorize(credentials)
      authorizePromise.then(resolve, reject)
    })
  }
  getClientSecret () {
    return require('./credential_secret.json')
  }
  authorize (credentials) {
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var auth = new GoogleAuth()
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

    return new Promise( async (resolve, reject) => {
      let dbToken = await db.AuthToken.findOne()
      console.log("TOKEN IS "+dbToken)
      oauth2Client.credentials = JSON.parse(dbToken.token)
      resolve(oauth2Client)
    })
  }

  //This function is for command line
  getNewToken (oauth2Client, callback) {
    return new Promise((resolve, reject) => {
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      })
      console.log('Authorize this app by visiting this url: \n ', authUrl)
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question('\n\nEnter the code from that page here: ', (code) => {
        rl.close()
        console.log("CODE IS "+code)
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err)
            reject()
          }

          console.log("TOKEN IN "+JSON.stringify(token))
          oauth2Client.credentials = token
          this.storeToken(token)
          resolve(oauth2Client)
        })
      })
    })
  }

  //This function is for command line
  storeToken (token) {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log('Token stored to ' + TOKEN_PATH)
  }


  //This function is for slack UI
  getNewTokenLink() {
    let credentials = this.getClientSecret()
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var auth = new GoogleAuth()
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)
   
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      })
    return authUrl
  }

  //This function is for slack UI
  storeNewTokenLink(code, team_id) {
    let credentials = this.getClientSecret()
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var auth = new GoogleAuth()
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        reject()
      }

      let dbInput = {token: JSON.stringify(token), teamId: team_id}
      db.AuthToken.create(dbInput)
    })
  }

}

module.exports = new Authentication()
