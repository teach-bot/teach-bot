
module.exports = (slapp) => {
  slapp.command('/timesheet', 'start', (msg) => {
    var timeOptions = []
    timeOptions.push({name: 'timeOption', text: '0.5 hrs', type: 'button', value: '0.5'})
    timeOptions.push({name: 'timeOption', text: '1 hr', type: 'button', value: '1'})
    timeOptions.push({name: 'timeOption', text: '1.5 hrs', type: 'button', value: '1.5'})
    timeOptions.push({name: 'timeOption', text: '2 hrs', type: 'button', value: '2'})
    timeOptions.push({name: 'timeOption', text: '2+ hrs', type: 'button', value: '3'})
    msg.say({
      text: 'How long do you plan on working?',
      attachments: [
        {
          fallback: 'Oops, this feature is not working',
          callback_id: 'timesheet_start_callback',
          actions: timeOptions
        }
      ]
    }).route('')
  })

  slapp.action('timesheet_start_callback', 'timeOption', (msg, value) => {
    msg.say('Great, I will notify you when your *' + value + ' hour* session is over! Let me know if you finish early with `/timesheet stop`')
  })

  slapp.command('/timesheet', 'stop', (msg) => {
    msg.say('Logged you down for *0.75* hours, from 6:03 PM- 6:47 PM')
  })
}
