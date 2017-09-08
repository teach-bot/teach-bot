const env = require('node-env-file')
env(__dirname + '/../../.env');
console.log("BEFORE DB");


// Global before
before(() => {
  console.log('globalbeofre');
  const db = require('../../src/db');
  db.models.forEach((key) => {
    db[key].sync({force: true});
  });
});
