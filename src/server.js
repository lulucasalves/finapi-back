const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routes')
require('./database')

app.use(express.json())
app.use(cors())
app.use(router)

const port = 3000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
