const db = require('../db')
const nock = require('nock')

// CREATE ASSIGNMENT
module.exports = (slapp) => {
  slapp.command('/assignment', 'create(.*)',  (msg, text, assignmentName) => {
    let userSlackId = msg.meta.user_id
  
    db.User.findOne({ where: {slackId: userSlackId} }).then(async (user) => { ///FAIL GRACEFULLY
      if (user.role === 'gxstudent' || user.role === 'otherstudent') {
        msg.respond('Oops - you cannot use this feature as a student')
        return
      }
      if (assignmentName === '') {
        msg.respond('Oops! try again, but give the assignment a title `/assignment create AssignmentName`')
      } else {

        await msg.respond({ text: 'Creating Assignment' + assignmentName})
        db.Assignment.create({name: assignmentName.trim(), closed: false, teamId: msg.team_id})
      }
    })
  })

// LIST ASSIGNMENTS
  slapp.command('/assignment', 'list', async (msg) => {
    msg.respond('Listing all of the assignments!')
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
    msg.respond({
      text: '',
      attachments: attachmentsArray
    })
  })

  // LIST SHOW ALL
  slapp.action('show_all_callback', 'more', async (msg, value) => {
    var attachmentsArray = []
    let assignments = await db.Assignment.findAll()
    assignments.forEach(function (assignment) {
      if (assignment.closed) {
        attachmentsArray.push({text: assignment.name, fallback: 'ERROR', color: '#FF0000'})
      } else {
        attachmentsArray.push({text: assignment.name, fallback: 'ERROR', color: '#00FF00'})
      }
    })
    msg.respond({
      text: 'Here is the *full* list of assignments, both open and closed',
      attachments: attachmentsArray
    })
  })

  // CLOSE ASSIGNMENT PART 1
  slapp.command('/assignment', 'close', async (msg) => {
    let userSlackId = msg.meta.user_id
    let user = await db.User.findOne({ where: {slackId: userSlackId} })
    if (user.role === 'gxstudent' || user.role === 'otherstudent') {
      msg.respond('Oops - you cannot use this feature as a student')
      return
    }
    var actionsArray = []
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    assignments.forEach(function (assignment) {
      actionsArray.push({name: 'answer', text: assignment.name, type: 'button', value: assignment.id.toString()})
    })
    msg.respond({
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
    let userSlackId = msg.meta.user_id
    let user = await db.User.findOne({ where: {slackId: userSlackId} })
    if (user.role === 'faculty' || user.role === 'leadfaculty') {
      msg.respond('Oops - you cannot use this feature as a student')
      return
    }
    var actionsArray = []
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    assignments.forEach(function (assignment) {
      actionsArray.push({name: 'answer', text: assignment.name, type: 'button', value: assignment.id.toString()})
    })
    msg.respond({
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
      .say('Alright! Go ahead and message me with your submission for `' + assignment.name + '`')
      .route('handleSubmission', assignment, 60)
    })
  })

  /// SUBMIT ASSIGNMENT PT 3
  // register a route handler
  slapp.route('handleSubmission', (msg, assignment) => {
    db.Submission.create({assignmentId: assignment.id, userId: msg.user_id})
    msg.respond('Got it, recorded your submission for: `' + assignment.name + '`')
  })
}
