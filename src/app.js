require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const logger = require('./logger')
const todoRouter = require('./Posting/Posting-router')
const salepersonRouter = require('./Sales_person/sales-person-router')
const salesCommissionRouter = require('./Sales_Commission/Sales-Commission-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

// app.use(express.static('public'))
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})  


app.use('/api/postings', todoRouter)
app.use('/api/salepeople', salepersonRouter)
app.use('/api/saleCommission', salesCommissionRouter)



app.use(errorHandler)

module.exports = app