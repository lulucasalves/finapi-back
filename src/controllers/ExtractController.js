const connection = require('../database')

exports.deposit = async (req, res) => {
  const { quantity } = req.body
  const { user_id } = req

  function adicionaZero(numero) {
    if (numero <= 9) return '0' + numero
    else return numero
  }

  const dataAtual = new Date()
  const date =
    adicionaZero(dataAtual.getDate().toString()) +
    '/' +
    adicionaZero(dataAtual.getMonth() + 1).toString() +
    '/' +
    dataAtual.getFullYear()

  connection.query(
    `SELECT statement FROM users WHERE idusers = '${user_id}'`,
    (err, results) => {
      if (err) {
        return res.status(400).json({ error: true, results: err.sqlMessage })
      } else {
        const sql =
          'INSERT INTO deposits(quantity,createdat,userid) VALUES (?,?,?)'
        const values = [quantity, date, user_id]
        connection.query(sql, values, error => {
          if (error) {
            return res
              .status(400)
              .json({ error: true, results: error.sqlMessage })
          } else {
            const total = quantity + parseFloat(results[0].statement)

            connection.query(
              `UPDATE users SET statement = '${total}' WHERE idusers = '${user_id}'`,
              err => {
                if (err) {
                  return res.status(400).json({
                    error: true,
                    results: err.sqlMessage
                  })
                } else {
                  return res
                    .status(201)
                    .json({ error: false, results: 'depositado com sucesso!' })
                }
              }
            )
          }
        })
      }
    }
  )
}

exports.withdraw = async (req, res) => {
  const { quantity } = req.body
  const { user_id } = req

  function adicionaZero(numero) {
    if (numero <= 9) return '0' + numero
    else return numero
  }

  const dataAtual = new Date()
  const date =
    adicionaZero(dataAtual.getDate().toString()) +
    '/' +
    adicionaZero(dataAtual.getMonth() + 1).toString() +
    '/' +
    dataAtual.getFullYear()

  connection.query(
    `SELECT statement FROM users WHERE idusers = '${user_id}'`,
    (err, results) => {
      if (err) {
        return res.status(400).json({ error: true, results: err.sqlMessage })
      } else if (quantity > parseFloat(results[0].statement)) {
        return res.status(400).json({
          error: true,
          results: 'Seu saque não pode ser maior do que o saldo da sua conta!'
        })
      } else {
        const sql =
          'INSERT INTO withdraws(quantity,createdat,userid) VALUES (?,?,?)'
        const values = [quantity, date, user_id]
        connection.query(sql, values, error => {
          if (error) {
            return res
              .status(400)
              .json({ error: true, results: error.sqlMessage })
          } else {
            const total = parseFloat(results[0].statement) - quantity

            connection.query(
              `UPDATE users SET statement = '${total}' WHERE idusers = '${user_id}'`,
              err => {
                if (err) {
                  return res.status(400).json({
                    error: true,
                    results: err.sqlMessage
                  })
                } else {
                  return res
                    .status(201)
                    .json({ error: false, results: 'saque feito com sucesso!' })
                }
              }
            )
          }
        })
      }
    }
  )
}

exports.extract = async (req, res) => {
  const { user_id } = req

  const userId = parseInt(user_id)

  const sqlDeposits = 'SELECT * FROM deposits WHERE userid = ?'
  const values = [userId]

  connection.query(sqlDeposits, values, (err, resultsDeposits) => {
    if (err) {
      return res.status(400).json({ error: true, results: err.sqlMessage })
    } else {
      const sqlWithdraws = 'SELECT * FROM withdraws WHERE userid = ?'
      connection.query(sqlWithdraws, values, (err, resultsWithdraws) => {
        if (err) {
          return res.status(400).json({ error: true, results: err.sqlMessage })
        } else {
          return res.status(200).json({
            error: true,
            results: {
              deposits: resultsDeposits,
              withdraws: resultsWithdraws
            }
          })
        }
      })
    }
  })
}

exports.extractByDate = async (req, res) => {
  const { user_id } = req
  const { date } = req.body

  const userId = parseInt(user_id)

  const sqlDeposits =
    'SELECT * FROM deposits WHERE userid = ? AND createdat = ?'
  const values = [userId, date]

  connection.query(sqlDeposits, values, (err, resultsDeposits) => {
    if (err) {
      return res.status(400).json({ error: true, results: err.sqlMessage })
    } else {
      const sqlWithdraws =
        'SELECT * FROM withdraws WHERE userid = ? AND createdat = ?'
      connection.query(sqlWithdraws, values, (err, resultsWithdraws) => {
        if (err) {
          return res.status(400).json({ error: true, results: err.sqlMessage })
        } else {
          return res.status(200).json({
            error: true,
            results: {
              deposits: resultsDeposits,
              withdraws: resultsWithdraws
            }
          })
        }
      })
    }
  })
}
