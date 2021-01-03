const express = require('express')
const xss = require('xss')
const SalesCommisionService = require('./Sales-Commission-service')


const SalesCommissionRouter = express.Router()
const jsonParser = express.json()

const serializeSaleCommission = salecommission => ({
  sales_commission_id: salecommission.id,
  sales_persion_id: salecommission.sales_persion_id,
  Sales_person_first_name: salecommission.first_name,
  Sales_person_last_name: salecommission.last_name,
  posting_id: salecommission.posting_id,
  po_number: salecommission.po_number,
  commission_rate: salecommission.commission_rate,
  commission_amount: salecommission.commission_amount,
  created_date: salecommission.created_date
})


SalesCommissionRouter
.route('/')
.get((req, res, next) => {
   SalesCommisionService.getAllSalesCommissions(req.app.get('db'))
   .then(data => {
     res.json(data)
     next()
   })
   .catch(next)
})

SalesCommissionRouter
.route('/:sale_commission_id')
.all((req, res, next) => {
  if(isNaN(parseInt(req.params.sale_commission_id))) {
    return res.status(404).json({
      error: { message: `Invalid id` }
    })
  }
  SalesCommisionService.getSaleCommissionById(
    req.app.get('db'),
    req.params.sale_commission_id
  )
    .then(saleCommission => {
      if (!saleCommission) {
        return res.status(404).json({
          error: { message: `That sale commission doesn't exist` }
        })
      }
      res.saleCommission = saleCommission
      next()
    })
    .catch(next)
})
.get((req, res, next) => {
  res.json(serializeSaleCommission(res.saleCommission))
})
.delete((req, res, next) => {
  SalesCommisionService.deleteSaleCommission(
    req.app.get('db'),
    req.params.sale_commission_id
  )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
})
// .patch(jsonParser, (req, res, next) => {
//   const { sales_number, invoice, dollar_amount, commission_percentage_fraction, commission_amount, po_number, customer, territory,date_paid, vendor, paid } = req.body
//   const PostToAdd = { sales_number, invoice, dollar_amount, commission_percentage_fraction, commission_amount, po_number, customer, territory, vendor, paid }


//   for (const [key, value] of Object.entries(PostToAdd)){
//     if (value == null){
//       return res.status(400).json({
//         error: { message: `Missing '${key}' in request body` }
//       })
//     }
// }

//   PostToAdd.date_paid = date_paid === "" ? null : date_paid;

//   SalesCommisionService.updateSaleCommission(
//     req.app.get('db'),
//     req.params.sale_commission_id,
//     PostToAdd
//   )
//     .then(updatedPost => {
//       res.status(200).json(serializeSaleCommission(updatedPost[0]))
//     })
//     .catch(next)
// })


module.exports = SalesCommissionRouter