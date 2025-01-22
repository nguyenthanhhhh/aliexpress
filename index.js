const express = require('express')
const {
  getPromotionalPrice,
  getOriginalPrice,
  getTitle,
} = require('./function')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

// Định nghĩa một route cơ bản
app.get('/title/:id', async (req, res) => {
  const title = await getTitle(req.params?.id)
  return res.send(title)
})

app.get('/price-original/:id', async (req, res) => {
  const title = await getOriginalPrice(req.params?.id)
  return res.send(title)
})

app.get('/price-promotional/:id', async (req, res) => {
  const title = await getPromotionalPrice(req.params?.id)
  return res.send(title)
})

// Lắng nghe cổng 3000
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
