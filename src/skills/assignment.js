const db = require('../db')
const drive = require('../google-drive/drive.js')
// module.exports = (slapp) => {

//   console.log(';AAAAAAAAAAAAAAAAAAAAA')
//   slapp.command('/assignment', 'create(.*)', (msg, text, assignmentName) => {
//     console.log('sfdlk;jljkfsdjlksfdsfdjlksdfjlkljksdfjlk')
//   })

// }

// CREATE ASSIGNMENT
module.exports = (slapp) => {
  slapp.command('/assignment', 'create(.*)', async (msg, text, assignmentName) => {
    console.log('Attempt to Create Assignment')
    if (assignmentName === '') {
      msg.say('Oops! try again, but give the assignment a title `/assignment create AssignmentName`')
    } else {
      var sheetId = await drive.createAssignment(assignmentName)
      if(sheetId != null) {
        msg.say('Creating Assignment' + assignmentName)
        db.Assignment.create({name: assignmentName.trim(), closed: false, teamId: msg.team_id, sheetId:sheetId})
      }else {
        console.log('Something went wrong with the sheets API call')
      }
    }
  })

// LIST ASSIGNMENTS
  slapp.command('/assignment', 'list', async (msg) => {
  // if (msg.user_id) == student / teacher
    var attachmentsArray = []
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    assignments.forEach(function (assignment) {
      attachmentsArray.push({text: assignment.name, fallback: 'ERROR', color: '#00FF00'})
    })
    attachmentsArray.push({text: '', fallback: '', callback_id: 'show_all_callback', actions: [{name: 'more', text: 'Show All', type: 'button', value: 'nil'}]})
    msg.say({
      text: 'Here are all the assignments',
      attachments: attachmentsArray
    })
  })

// LIST SHOW ALL
  slapp.action('show_all_callback', 'more', async (msg, value) => {
  // if (msg.user_id) == student / teacher
    var attachmentsArray = []
    let assignments = await db.Assignment.findAll()
    assignments.forEach(function (assignment) {
      if (assignment.closed) {
        attachmentsArray.push({text: assignment.name, fallback: 'ERROR', color: '#FF0000'})
      } else {
        attachmentsArray.push({text: assignment.name, fallback: 'ERROR', color: '#00FF00'})
      }
    })
    msg.say({
      text: 'Here is the *full* list of assignments, both open and closed',
      attachments: attachmentsArray
    })
  })

// CLOSE ASSIGNMENT PART 1
  slapp.command('/assignment', 'close', async (msg) => {
// if (msg.user_id) == student / teacher
    var actionsArray = []
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    assignments.forEach(function (assignment) {
      console.log(assignment.id.toString())
      actionsArray.push({name: 'answer', text: assignment.name, type: 'button', value: assignment.id.toString()})
    })
    console.log('length is ', actionsArray.length)
    msg.say({
      text: 'Please choose which asssignment to close:',
      attachments: [
        {
          text: '',
          fallback: 'Oops, this feature is not working',
          callback_id: 'close_assignment_callback',
          actions: actionsArray
        }
      ]
    })
  })

// CLOSE ASSIGNMENT PT 2
  slapp.action('close_assignment_callback', 'answer', (msg, value) => {
    db.Assignment.findOne({
      where: {
        id: parseInt(value, 10),
        closed: false
      }
    }).then(assignment => {
      assignment.closed = true
      assignment.save().then(() => {})
    })
  })

// SUBMIT ASSIGNMENT PART 1
  slapp.command('/assignment', 'submit', async (msg) => {
// if (msg.user_id) == student / teacher
    var actionsArray = []
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    assignments.forEach(function (assignment) {
      actionsArray.push({name: 'answer', text: assignment.name, type: 'button', value: assignment.id.toString()})
    })
    msg.say({
      text: 'Pick the assignment you would like to submit',
      attachments: [
        {
          text: '',
          fallback: 'Oops, this feature is not working',
          callback_id: 'submit_assignment_callback',
          actions: actionsArray
        }
      ]
    })
  })

// SUBMIT ASSIGNMENT PT 2
  slapp.action('submit_assignment_callback', 'answer', (msg, value) => {
    db.Assignment.findOne({
      where: {
        id: parseInt(value, 10)
      }
    }).then(assignment => {
      msg
      .say('Alright! Go ahead and message me with your submission for ' + assignment.name)
      .route('handleSubmission', assignment, 60)
    })
  })

/// SUBMIT ASSIGNMENT PT 3
// register a route handler
  slapp.route('handleSubmission', (msg, assignment) => {
    db.Submission.create({assignmentId: assignment.id, userId: msg.user_id})
    console.log('submitting assignmeent', assignment.name)
    msg.say(['Me too', 'Noted', 'That is interesting'])
  })
}
