const { User } = require('../models')

class SessionController {
  async create (req, res) {
    return res.render('auth/signin')
  }

  async store (req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      req.flash('error', 'User not found')
      return res.redirect('/')
    }

    if (!(await user.checkPassword(password))) {
      req.flash('error', 'Wrong password')
      return res.redirect('/')
    }

    req.session.user = user

    let redirectPage = 'app/dashboard'

    if (user.provider === true) {
      redirectPage = 'app/dashboard/provider'
    }
    return res.redirect(redirectPage)
  }

  destroy (req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  }
}

module.exports = new SessionController()
