const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async listAvailable (req, res) {
    const { provider } = req.params
    const date = moment(parseInt(req.query.date))

    const appointmentList = await Appointment.findAll({
      where: {
        provider_id: provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00'
    ]

    const availableTimes = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      return {
        time,
        value: value.format(),
        available:
          value.isAfter(moment()) &&
          !appointmentList.find(appointment => {
            return moment(appointment.date).format('HH:mm') === time
          })
      }
    })

    return res.render('available/index', { availableTimes })
  }
}

module.exports = new AppointmentController()
