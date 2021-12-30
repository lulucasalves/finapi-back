const mysql = require('mysql')
require('dotenv/config')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.SECRET,
  database: 'finapi'
})

connection.query('SELECT * from SCHEMA', (err, rows) => {
  if (err) {
    console.log('Query Error: ', rows)
    throw err
  }

  console.log('Banco de dados conectado!')
})

module.exports = connection
