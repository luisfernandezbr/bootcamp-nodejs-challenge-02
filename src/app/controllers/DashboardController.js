const { User } = require('../models')

class DashboardController {
  async list (req, res) {
    const providerList = await User.findAll({ where: { provider: true } })
    return res.render('dashboard', { providerList })
  }
}

module.exports = new DashboardController()
