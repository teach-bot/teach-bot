const db = require('../db')

// CREATE ASSIGNMENT
module.exports = (slapp) => {
  /**
   * /assignment create [assignment name]
   * Allow an admin to create an assignment
   */
  slapp.command('/assignment', 'create(.*)', async (msg, text, assignmentName) => {
    let userSlackId = msg.meta.user_id

    // Make sure we have the user to talk about
    let user = await db.User.findOne({ where: {slackId: userSlackId} })
    if (!user) {
      let text = `Oops - I couldn't find you in the system. Please contact an administrator for assistance.`
      return msg.respond({ text })
    }

    // Check roles
    if (user.role === 'gxstudent' || user.role === 'otherstudent') {
      let text = 'Oops - you cannot use this feature as a student'
      return msg.respond({ text })
    }
    if (assignmentName === '') {
      let text = 'Oops! try again, but give the assignment a title `/assignment create AssignmentName`'
      return msg.respond({ text })
    } else {
      await db.Assignment.create({ name: assignmentName.trim(), closed: false, teamId: msg.team_id })
      return msg.respond({ text: 'Creating Assignment' + assignmentName })
    }
  })

  /**
   * /assignment list
   * Allow anyone to list assignments
   */
  slapp.command('/assignment', 'list', async (msg) => {
    // msg.respond('Listing all of the assignments!')
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    let attachmentsArray = assignments.map((assignment) => {
      return {
        text: assignment.name,
        fallback: 'ERROR',
        color: '#00FF00'
      }
    })
    attachmentsArray.push({text: '', fallback: '', callback_id: 'assignment_list_show_all', actions: [{name: 'more', text: 'Show All', type: 'button', value: 'nil'}]})
    msg.respond({
      text: '',
      attachments: attachmentsArray
    })
  })

  /**
   * assignment_list_show_all - Used by assignment
   * Lists all the assignments (including the closed ones)
   */
  slapp.action('assignment_list_show_all', 'more', async (msg, value) => {
    let assignments = await db.Assignment.findAll()
    let attachmentsArray = assignments.map((assignment) => {
      return {
        text: assignment.name,
        fallback: 'ERROR',
        color: assignment.closed ? '#FF0000' : '#00FF00'
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

    // Find the user
    let user = await db.User.findOne({ where: {slackId: userSlackId} })
    if (user.role === 'gxstudent' || user.role === 'otherstudent') {
      let text = 'Oops - you cannot use this feature as a student'
      return msg.respond({ text })
    }

    // Grab assignment
    let assignments = await db.Assignment.findAll({
      where: {
        closed: false
      }
    })
    let actionsArray = assignments.map((assignment) => {
      return {
        name: 'answer',
        text: assignment.name,
        type: 'button',
        value: assignment.id.toString()
      }
    })

    // Return actions
    return msg.respond({
      text: 'Please choose which assignment to close:',
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
