const Slapp = require('slapp')
const env = require('node-env-file')
env(__dirname + '/.env');

const context = require('./src/context.js');

var slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  context: context,
  log: true,
  colors: true,
});

var normalizedPath = require("path").join(__dirname, "src", "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./src/skills/" + file)(slapp);
});

slapp.attachToExpress(require('express')()).listen(process.env.PORT)
