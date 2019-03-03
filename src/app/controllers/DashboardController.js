const { User, Appointment } = require('../models')
const Sequelize = require('sequelize')
const moment = require('moment')
const config = require('../../config/database')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

class DashboardController {
  async list (req, res) {
    const providerList = await User.findAll({ where: { provider: true } })
    return res.render('dashboard', { providerList })
  }

  listAppointments (req, res) {
    const { id } = req.session.user

    const query = `SELECT
                      "Appointment"."id",
                      "Appointment"."date",
                      "Appointment"."user_id",
                      "Appointment"."provider_id",
                      "User"."id" AS "user_id",
                      "User"."name" AS "user_name",
                      "User"."avatar" AS "user_avatar"
                  FROM
                    "appointments" AS "Appointment"
                  LEFT OUTER JOIN
                    "users" AS "User" ON "Appointment"."user_id" = "User"."id"
                  WHERE "Appointment"."provider_id" = ${id}`

    let appointmentList = []
    sequelize.query(query).spread((results, metadata) => {
      appointmentList = results

      appointmentList.map(value => {
        value.date = moment(value.date).format('DD/MM/YYYY HH:mm')
        return value
      })

      return res.render('provider/dashboard', { appointmentList })
    })
  }
}

module.exports = new DashboardController()
