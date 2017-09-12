const env = require('node-env-file')
var chai = require("chai");
var sinonChai = require("sinon-chai");

before(() => {
  chai.use(sinonChai);
})

