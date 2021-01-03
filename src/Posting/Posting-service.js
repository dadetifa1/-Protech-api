const SalesCommisionService = require('../Sales_Commission/Sales-Commission-service')

const PostingService = {
  getPostings(db) {
    return db
      .from('protech_posting')
      .select(
        'protech_posting.id',
        'protech_posting.sales_number',
        'protech_posting.invoice',
        'protech_posting.dollar_amount',
        'protech_posting.commission_percentage_fraction',
        'protech_posting.commission_amount',
        'protech_posting.po_number',
        'protech_posting.customer',
        'protech_posting.territory',
        'protech_posting.vendor',
        'protech_posting.date_paid',
        'protech_posting.paid',
      )
  },
  getPostingsById(db, posting_id) {
    return db
      .from('protech_posting')
      .select(
        'protech_posting.id',
        'protech_posting.sales_number',
        'protech_posting.invoice',
        'protech_posting.dollar_amount',
        'protech_posting.commission_percentage_fraction',
        'protech_posting.commission_amount',
        'protech_posting.po_number',
        'protech_posting.customer',
        'protech_posting.territory',
        'protech_posting.vendor',
        'protech_posting.date_paid',
        'protech_posting.paid',
      )
      .where('protech_posting.id', posting_id)
      .first()
  },
  insertPostings(db, newPosting) {
    return db
      .insert(newPosting)
      .into('protech_posting')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deletePostings(db, posting_id) {
    return db('protech_posting')
      .where({'id': posting_id})
      .delete()
  },
  updatePostings(db, posting_id, newPosting) {
    return db('protech_posting')
      .where({id: posting_id})
      .update(newPosting, returning=true)
      .returning('*')
  },
  insertSaleCommission(db, newSalesCommission){
    return SalesCommisionService.insertSaleCommission(db, newSalesCommission)
  }

}

module.exports = PostingService