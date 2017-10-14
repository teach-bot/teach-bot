let google = require('googleapis');
let authentication = require("./authentication");

async function createSheet(auth, assignmentName) {
  var sheets = google.sheets('v4')
  let response = await sheets.spreadsheets.create({
    auth: auth,
    resource: {
        properties:{
            title: assignmentName
        }
    }
  })
  console.log(response.spreadsheetId)
  return response.spreadsheetId
}


module.exports = {

  

  formatSpreadSheet: function(auth) {
    var sheets = google.sheets('v4');
    var spreadsheets_id = "1Kd46uZ3v1WEnhzQbbgDCqGKt9nmPkM-QwZlM1qWb9sw";
    var timeValues = [['Hours','7','8','9','10','11','12','1','2','3','4','5','6','7','8','9','10','11','12','1','2','3','4','5','6']]
    var dayValues = [['Mon','Tue','Wew','Thu','Fri','Sat','Sun']]
    //For the Time Columns
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheets_id,
      range: 'Sheet1!B3:B27',
      valueInputOption: 'USER_ENTERED',
      resource: 
          {range: 'Sheet1!B3:B27',
          majorDimension: 'COLUMNS',
          values: timeValues}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Success Hours Column Created');
      }
    });

    //For the Days Row
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheets_id,
      range: 'Sheet1!C3:I3',
      valueInputOption: 'USER_ENTERED',
      resource: 
          {range: 'Sheet1!C3:I3',
          majorDimension: 'ROWS',
          values: dayValues}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Success: Days Row created');
      }
    });
  },

  addTimeValuesToCell: function(auth, values, spreadsheets_id){
    var sheets = google.sheets('v4');
    
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheets_id,
      range: 'Sheet1!C4:I27',
      valueInputOption: 'USER_ENTERED',
      resource: {range: 'Sheet1!C4:I27',
          majorDimension: 'COLUMNS',
          values: values}
    }, function (err, spreadsheets) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Success: ', spreadsheets.spreadsheetId);
      }
    });
  },

  addNewRow: function(auth, values, spreadsheetId){
    var sheets = google.sheets('v4');
    const request = {
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A1:C1",
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values:  [[new Date().toISOString(),'Brian', 'www.facebook.com']]
        }
      };
    sheets.spreadsheets.values.append(
      request,function (err, spreadsheets) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log('Success: Added Row To', spreadsheets.spreadsheetId);
          console.log('Rows Modified are: ', spreadsheets.tableRange);
        }
      }
    );

  },

  createFolder: function(auth) {
    var fileMetadata = {
      'name': 'Invoices',
      'mimeType': 'application/vnd.google-apps.folder'
    };
    var drive = google.drive({ version: 'v3', auth: auth });
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Folder Id: ', file.id);
      }
    });
  },

//returns assignment ID
  createAssignment: function(assignementName) {
    authentication.authenticate().then((auth)=>{
       return createSheet(auth, assignementName);
    });
  } 
};

// authentication.authenticate().then((auth)=>{
//   values1 =[
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6'],
//           ['TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6','TESTING7','TESTING8','TESTING9','TESTING10','TESTING11','TESTING12','TESTING1','TESTING2','TESTING3','TESTING4','TESTING5','TESTING6']
//         ]
//   var spreadsheets_id = "1Kd46uZ3v1WEnhzQbbgDCqGKt9nmPkM-QwZlM1qWb9sw";
//   var spreadsheet_id_assignment = "1B0NPaA4kG8g8Db4vpKxMYJypvi5ab83CR0vHJu5LBFM"
//   var values2 = [
//         ['Irfan', 'TEST LINK']
//         ['Brian', 'www.facebook.com']
//       ]
//   // addSheet(auth);
//   // formatSpreadSheet(auth)
//   // addTimeValuesToCell(auth,values1,spreadsheet_id_assignment);
//   addNewRow(auth,values2,spreadsheet_id_assignment);

// });
