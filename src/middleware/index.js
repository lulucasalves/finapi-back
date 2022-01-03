require('dotenv/config')
const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  try {
    const [, token] = req.headers.authorization.split(' ')

    const { sub } = jwt.verify(token, process.env.JWT)

    req.user_id = sub

    return next()
  } catch (err) {
    console.log(err)

    return res.status(400).json({ error: true, results: 'Token inválido' })
  }
}

module.exports = { authenticate }
