const  connection  = require('../database')

const Users = (name, adress) => {
  connection.query(
    `INSERT INTO users (name, address) VALUES (${name}, ${adress})`,
    (err, rows) => {
      if (err) {
        console.log('Query Error: ', rows)
        throw err
      }
    }
  )
}

module.exports = Users
