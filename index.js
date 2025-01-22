const express = require('express')
const apiRoute = require('./api/index')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.get('/health', (req, res) => res.status(200).send('OK'))

app.use(apiRoute)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
