const express = require('express')
const {
  getTitle,
  getOriginalPrice,
  getPromotionalPrice,
} = require('../function')

require('dotenv').config()

const app = express()

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

module.exports = app
