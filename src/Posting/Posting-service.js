const SalesCommisionService = require("../Sales_Commission/Sales-Commission-service");

const PostingService = {
  getPostings(db) {
    return db
      .from("protech_posting")
      .innerJoin(
        "protech_sales_commission_hist",
        "protech_sales_commission_hist.posting_id",
        "protech_posting.id"
      )
      .innerJoin(
        "protech_saleperson",
        "protech_saleperson.id",
        "protech_sales_commission_hist.sales_person_id"
      )
      .leftJoin(
        "itemized_description",
        "itemized_description.post_id",
        "protech_posting.id"
      )
      .select(
        "protech_posting.id",
        "protech_posting.sales_number",
        "protech_posting.invoice",
        "protech_posting.dollar_amount",
        "protech_posting.commission_percentage_fraction",
        "protech_posting.commission_amount",
        "protech_posting.po_number",
        "protech_posting.customer",
        "protech_posting.territory",
        "protech_posting.vendor",
        "protech_posting.date_paid",
        "protech_posting.paid",
        "protech_saleperson.first_name",
        "protech_saleperson.last_name",
        "protech_sales_commission_hist.sales_person_id",
        "itemized_description.part_number",
        "itemized_description.qty",
        "itemized_description.unit_cost",
        "itemized_description.so",
        "itemized_description.inv",
        "itemized_description.ship_date"
      );
  },
  getPostingsById(db, posting_id) {
    return db
      .from("protech_posting")
      .innerJoin(
        "protech_sales_commission_hist",
        "protech_sales_commission_hist.posting_id",
        "protech_posting.id"
      )
      .innerJoin(
        "protech_saleperson",
        "protech_saleperson.id",
        "protech_sales_commission_hist.sales_person_id"
      )
      .select(
        "protech_posting.id",
        "protech_posting.sales_number",
        "protech_posting.invoice",
        "protech_posting.dollar_amount",
        "protech_posting.commission_percentage_fraction",
        "protech_posting.commission_amount",
        "protech_posting.po_number",
        "protech_posting.customer",
        "protech_posting.territory",
        "protech_posting.vendor",
        "protech_posting.date_paid",
        "protech_posting.paid",
        "protech_saleperson.first_name",
        "protech_saleperson.last_name",
        "protech_sales_commission_hist.sales_person_id"
      )
      .where("protech_posting.id", posting_id)
      .first();
  },
  getNewPost(db, posting_id) {
    return db.raw(`
    select row_to_json(posting) as post
    from(
      select 
      p.id, 
      p.sales_number, 
      p.invoice ,
      p.dollar_amount ,
      p.commission_percentage_fraction ,
      p.commission_amount ,
      p.po_number ,
      p.customer ,
      p.territory ,
      p.vendor ,
      p.date_paid ,
      p.paid ,
      psp.first_name,
      psp.last_name,
      pch.sales_person_id, 
      (select json_agg(alb)
      from (
        select part_number,qty,unit_cost,so,inv,ship_date  from public.itemized_description where post_id  = p.id
      ) alb
    ) as descItems
    from  public.protech_posting as p
    inner join public.protech_sales_commission_hist as pch on p.id = pch.posting_id 
    inner join public.protech_saleperson as psp on pch.sales_person_id  = psp.id ) posting
    where posting.id = ${posting_id};`);
  },
  insertPostings(db, newPosting) {
    return db
      .insert(newPosting)
      .into("protech_posting")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  insertDescriptionItem(db, newDescItems) {
    return db.insert(newDescItems).into("itemized_description").returning("id");
  },
  deletePostings(db, posting_id) {
    return db("protech_posting").where({ id: posting_id }).delete();
  },
  updatePostings(db, posting_id, newPosting) {
    return db("protech_posting")
      .where({ id: posting_id })
      .update(newPosting, (returning = true))
      .returning("*");
  },
  insertSaleCommission(db, newSalesCommission) {
    return SalesCommisionService.insertSaleCommission(db, newSalesCommission);
  },
  updateSaleCommission(db, updatedSalesCommission) {
    return SalesCommisionService.updateSaleCommissionByPostingID(
      db,
      updatedSalesCommission.posting_id,
      updatedSalesCommission
    );
  },
};

module.exports = PostingService;
