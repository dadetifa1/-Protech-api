const express = require('express')
const xss = require('xss')
const SalePersonService = require('./sales-person-service')


const SalesPersonRouter = express.Router()
const jsonParser = express.json()

const serializeSaleperson = salePerson => ({
  Posting_id: salePerson.id,
  first_name: xss(salePerson.first_name),
  last_name: xss(salePerson.last_name),
})


SalesPersonRouter
.route('/')
.get((req, res, next) => {
   SalePersonService.getSalesPeople(req.app.get('db'))
   .then(data => {
     res.json(data)
     next()
   })
   .catch(next)
})
.post(jsonParser,(req, res, next) => {
  const { first_name, last_name } = req.body
  const SalesPersonToAdd = { first_name, last_name }

  for (const [key, value] of Object.entries(SalesPersonToAdd)){
      if (value == null){
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
  }      

   SalePersonService.insertSalePerson(
    req.app.get('db'),
    SalesPersonToAdd
  )
    .then(AddedSalesPerson => {
      res.status(201)
      .location(`/postings/${AddedSalesPerson.id}`)
      .json(serializeSaleperson(AddedSalesPerson))
    })
    .catch(next)
})

SalesPersonRouter
.route('/:sale_person_id')
.all((req, res, next) => {
  if(isNaN(parseInt(req.params.sale_person_id))) {
    return res.status(404).json({
      error: { message: `Invalid id` }
    })
  }
  SalePersonService.getSalesPersonById(
    req.app.get('db'),
    req.params.sale_person_id
  )
    .then(salePerson => {
      if (!salePerson) {
        return res.status(404).json({
          error: { message: `Sale Person doesn't exist` }
        })
      }
      res.salePerson = salePerson
      next()
    })
    .catch(next)
})
.get((req, res, next) => {
  res.json(serializeSaleperson(res.salePerson))
})
.delete((req, res, next) => {
  SalePersonService.deleteSalesPerson(
    req.app.get('db'),
    req.params.sale_person_id
  )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
  const { first_name, last_name } = req.body
  const SalesPersonToAdd = { first_name, last_name }

  for (const [key, value] of Object.entries(SalesPersonToAdd)){
    if (value == null){
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }
  } 

  SalePersonService.updateSalesPerson(
    req.app.get('db'),
    req.params.sale_person_id,
    SalesPersonToAdd
  )
    .then(updatedSalesPerson => {
      res.status(200).json(serializeSaleperson(updatedSalesPerson[0]))
    })
    .catch(next)
})


module.exports = SalesPersonRouter