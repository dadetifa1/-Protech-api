require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
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

app.use('/api/postings', todoRouter)
app.use('/api/salepeople', salepersonRouter)
app.use('/api/saleCommission', salesCommissionRouter)



app.use(errorHandler)

module.exports = app