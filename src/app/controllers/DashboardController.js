const { User, Appointment } = require('../models')

class DashboardController {
  async list (req, res) {
    const providerList = await User.findAll({ where: { provider: true } })
    return res.render('dashboard', { providerList })
  }

  async listAppointments (req, res) {
    const { id } = req.session.user

    const appointmentList = await Appointment.findAll({
      where: {
        provider_id: id
      }
    })

    return res.render('provider/dashboard', { appointmentList })
  }
}

module.exports = new DashboardController()
