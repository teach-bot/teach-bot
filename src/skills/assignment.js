const db = require('../db')

// CREATE ASSIGNMENT
module.exports = (slapp) => {
  slapp.command('/assignment', 'create(.*)', (msg, text, assignmentName) => {
    console.log("I MADE IT FAM")
    if (assignmentName === '') {
      msg.say('Oops! try again, but give the assignment a title `/assignment create AssignmentName`')
    } else {
      msg.say('Creating Assignment!')
      db.Assignment.create({name: assignmentName.trim(), closed: false, teamId: msg.team_id})
    }
  })

// LIST ASSIGNMENTS
  slapp.command('/assignment', 'list', (msg) => {
  // if (msg.user_id) == student / teacher
    msg.say('Listing all of the assignments')
    db.Assignment.findAll().then(assignments => {
      assignments.forEach(function (assignment) {
        msg.say(assignment.name)
      })
    })
  })

// CLOSE ASSIGNMENT PT 1
  slapp.command('/assignment', 'close', (msg) => {
  // if (msg.user_id) == student / teacher
    var state = { selection: 'assignment1' }
    var assignmentNames = 'Open Assignments \n'
    db.Assignment.findAll().then(assignments => {
      assignments.forEach(function (assignment) {
        assignmentNames += (assignment + '\n')
      })
    })
    msg.say(assignmentNames)
  })

// CLOSE ASSIGNMENT PT 2
  slapp.route('closeAssignment', (msg, state) => {
    db.Assignment.findOne({
      where: {
        name: state.name,
        closed: false
      }
    }).then(assignment => {
      assignment.closed = true
      assignment.save().then(() => {})
    })
  })

// SUBMIT ASSIGNMENT PT 1
  slapp.command('/assignment', 'submit', (msg) => {
  // if (msg.user_id) == student / teacher
    var state = { selection: 'assignment1' }
    var assignmentNames = 'Open Assignments \n'
    db.Assignment.findAll().then(assignments => {
      assignments.forEach(function (assignment) {
        assignmentNames += (assignment + '\n')
      })
    })
    msg.say(assignmentNames) // MAKE THIS INTERACTIVE
  })

// SUBMIT ASSIGNMENT PT 2
  slapp.route('submitAssignment', (msg, state) => {
    db.Submission.create({assignmentId: state.assignmentId, userId: msg.user_id, teamId: msg.team_id})
  })
}
