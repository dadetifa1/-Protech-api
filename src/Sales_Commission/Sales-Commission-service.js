const SalesCommissionService = {
  getAllSalesCommissions(db) {
    return db
      .from('protech_sales_commission_hist')
      .innerJoin('protech_posting', 'protech_sales_commission_hist.posting_id', 'protech_posting.id')
      .innerJoin('protech_saleperson', 'protech_sales_commission_hist.sales_persion_id', 'protech_saleperson.id')
      .select(
        'protech_sales_commission_hist.id',
        'protech_sales_commission_hist.sales_persion_id',
        'protech_saleperson.first_name',
        'protech_saleperson.last_name',
        'protech_sales_commission_hist.posting_id',
        'protech_posting.po_number',
        'protech_sales_commission_hist.commission_rate',
        'protech_sales_commission_hist.commission_amount',
        'protech_sales_commission_hist.created_date',
      )
  },
  getSaleCommissionById(db, sales_commission_id) {
    return db
    .from('protech_sales_commission_hist')
    .innerJoin('protech_posting', 'protech_sales_commission_hist.posting_id', 'protech_posting.id')
    .innerJoin('protech_saleperson', 'protech_sales_commission_hist.sales_persion_id', 'protech_saleperson.id')
    .select(
      'protech_sales_commission_hist.id',
      'protech_sales_commission_hist.sales_persion_id',
      'protech_saleperson.first_name',
      'protech_saleperson.last_name',
      'protech_sales_commission_hist.posting_id',
      'protech_posting.po_number',
      'protech_sales_commission_hist.commission_rate',
      'protech_sales_commission_hist.commission_amount',
      'protech_sales_commission_hist.created_date',
    )
    .where('protech_sales_commission_hist.id', sales_commission_id)
    .first()
  },
  getSaleCommissionBySalesPersonID(db, sales_person_id) {
    return db
      .from('protech_sales_commission_hist')
      .innerJoin('protech_posting', 'protech_sales_commission_hist.posting_id', 'protech_posting.id')
      .innerJoin('protech_saleperson', 'protech_sales_commission_hist.sales_persion_id', 'protech_saleperson.id')
      .select(
        'protech_sales_commission_hist.id',
        'protech_sales_commission_hist.sales_persion_id',
        'protech_saleperson.first_name',
        'protech_saleperson.last_name',
        'protech_sales_commission_hist.posting_id',
        'protech_posting.po_number',
        'protech_sales_commission_hist.commission_rate',
        'protech_sales_commission_hist.commission_amount',
        'protech_sales_commission_hist.created_date',
      )
      .where('protech_sales_commission_hist.sales_persion_id', sales_person_id)
      .first()
  },
  insertSaleCommission(db, newSalesCommission) {
    return db
      .insert(newSalesCommission)
      .into('protech_sales_commission_hist')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteSaleCommission(db, sales_commission_id) {
    return db('protech_sales_commission_hist')
      .where({'id': sales_commission_id})
      .delete()
  },
  updateSaleCommission(db, sales_commission_id, newSalesCommission) {
    return db('protech_sales_commission_hist')
      .where({id: sales_commission_id})
      .update(newSalesCommission, returning=true)
      .returning('*')
  }

}

module.exports = SalesCommissionService