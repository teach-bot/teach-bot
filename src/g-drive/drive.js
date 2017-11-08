let google = require('googleapis')
let authentication = require('./auth')
const db = require('../db')

async function createSheet (auth, assignmentName, dbInput) {
  console.log('Reached Create Sheet Name')
  var sheets = google.sheets('v4')

  const request = {
    auth: auth,
    resource: {
      properties: {
        title: assignmentName
      }
    }
  }

  sheets.spreadsheets.create(request, (err, response) => {
    if (err) {
      console.error(err)
      return null
    } else {
      dbInput.sheetId = response.spreadsheetId
      db.Assignment.create(dbInput)
      console.log('Success: Sheet created with ID', response.spreadsheetId)
    }
  })
}

async function addNewRow (auth, spreadsheetId, values) {
  var sheets = google.sheets('v4')
  const request = {
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A1:C1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [[new Date().toISOString(), values.name, values.link]]
    }
  }
  sheets.spreadsheets.values.append(
      request, function (err, spreadsheets) {
        if (err) {
          // Handle error
          console.error(err)
        } else {
          console.log('Success: Added Row To', spreadsheets.spreadsheetId)
          console.log('Rows Modified are: ', spreadsheets.tableRange)
        }
      }
    )
}

module.exports = {
  formatSpreadSheet: function (auth) {
    var sheets = google.sheets('v4')
    var spreadSheetId = '1Kd46uZ3v1WEnhzQbbgDCqGKt9nmPkM-QwZlM1qWb9sw' // TODO remove this hardcode
    var timeValues = [['Hours', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6']]
    var dayValues = [['Mon', 'Tue', 'Wew', 'Thu', 'Fri', 'Sat', 'Sun']]
    // For the Time Columns
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadSheetId,
      range: 'Sheet1!B3:B27',
      valueInputOption: 'USER_ENTERED',
      resource:
      {range: 'Sheet1!B3:B27',
        majorDimension: 'COLUMNS',
        values: timeValues}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err)
      } else {
        console.log('Success Hours Column Created')
      }
    })

    // For the Days Row
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadSheetId,
      range: 'Sheet1!C3:I3',
      valueInputOption: 'USER_ENTERED',
      resource:
      {range: 'Sheet1!C3:I3',
        majorDimension: 'ROWS',
        values: dayValues}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err)
      } else {
        console.log('Success: Days Row created')
      }
    })
  },

  addTimeValuesToCell: function (auth, values, spreadSheetId) {
    var sheets = google.sheets('v4')

    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadSheetId,
      range: 'Sheet1!C4:I27',
      valueInputOption: 'USER_ENTERED',
      resource: {range: 'Sheet1!C4:I27',
        majorDimension: 'COLUMNS',
        values: values}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err)
      } else {
        console.log('Success: ', spreadsheets.spreadsheetId)
      }
    })
  },

  createFolder: function (auth) {
    var fileMetadata = {
      'name': 'Invoices',
      'mimeType': 'application/vnd.google-apps.folder'
    }
    var drive = google.drive({ version: 'v3', auth: auth })
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err)
      } else {
        console.log('Folder Id: ', file.id)
      }
    })
  },

// returns assignment ID
  createAssignment: function (assignementName, dbInput) {
    return authentication.authenticate().then((auth) => {
      createSheet(auth, assignementName, dbInput)
    })
  },

  addSubmission: function (sheetId, values) {
    return authentication.authenticate().then((auth) => {
      addNewRow(auth, sheetId, values)
    })
  }
}
