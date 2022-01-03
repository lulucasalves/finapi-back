const connection = require('../database')
const passwordhash = require('password-hash')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
  const { name, password, cpf } = req.body

  const passwordHash = passwordhash.generate(password)

  connection.query(
    `SELECT name FROM users WHERE cpf = '${cpf}'`,
    (err, results) => {
      if (results) {
        return res.json({ error: true, results: 'Este usuário já existe' })
      }
    }
  )

  const sql = 'INSERT INTO users(name,password,statement,cpf) VALUES (?,?,?,?)'
  const values = [name, passwordHash, 0, cpf]
  connection.query(sql, values, error => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }
    return res.status(201).json({ error: false, results: 'usuário cadastrado' })
  })
}

exports.user = async (req, res) => {
  const { idusers } = req.params

  const sql = 'SELECT idusers,name,cpf,statement FROM users WHERE idusers = ?'
  const values = [idusers]
  connection.query(sql, values, (error, results) => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }
    return res.status(201).json({ error: false, results: results })
  })
}

exports.delete = async (req, res) => {
  const { idusers } = req.params

  const sql = 'DELETE FROM users WHERE idusers = ?'
  const values = [idusers]
  connection.query(sql, values, (error, results) => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }
    return res.status(201).json({ error: false, results: 'usuário deletado' })
  })
}

exports.balance = async (req, res) => {
  const { idusers } = req.params

  const sql = 'SELECT statement FROM users WHERE idusers = ?'
  const values = [idusers]
  connection.query(sql, values, (error, results) => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }
    return res.status(201).json({ error: false, results: results })
  })
}

exports.update = async (req, res) => {
  const { idusers } = req.params
  const { name, cpf, password } = req.body

  const passwordHash = passwordhash.generate(password)

  const sql = `UPDATE users SET name = ?, cpf = ?, password = ? WHERE idusers = '${idusers}'`
  const values = [name, cpf, passwordHash]
  connection.query(sql, values, (error, results) => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }
    return res
      .status(201)
      .json({ error: false, results: 'Sua conta foi atualizada' })
  })
}

exports.login = async (req, res) => {
  const { cpf, password } = req.body

  const sql = `SELECT idusers,password FROM users WHERE cpf = ?`
  const values = [cpf]
  connection.query(sql, values, (error, results) => {
    if (error) {
      return res.status(400).json({ error: true, results: error.sqlMessage })
    }

    if (results && passwordhash.verify(password, results[0].password)) {
      const token = jwt.sign({ cpf: results[0].cpf }, process.env.JWT, {
        subject: String(results[0].idusers),
        expiresIn: '1d'
      })

      return res
        .status(202)
        .json({ error: false, results: 'Login realizado com sucesso', token })
    }
  })
}
