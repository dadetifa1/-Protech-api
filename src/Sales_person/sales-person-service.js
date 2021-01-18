const SalesPersonService = {
  getSalesPeople(db) {
    return db
      .from("protech_saleperson")
      .select(
        "protech_saleperson.id",
        "protech_saleperson.first_name",
        "protech_saleperson.last_name",
        "protech_saleperson.createddate"
      );
  },
  getSalesPersonById(db, sales_person_id) {
    return db
      .from("protech_saleperson")
      .select(
        "protech_saleperson.id",
        "protech_saleperson.first_name",
        "protech_saleperson.last_name",
        "protech_saleperson.createddate"
      )
      .where("protech_saleperson.id", sales_person_id)
      .first();
  },
  insertSalePerson(db, newSalesPerson) {
    return db
      .insert(newSalesPerson)
      .into("protech_saleperson")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteSalesPerson(db, sales_person_id) {
    return db("protech_saleperson").where({ id: sales_person_id }).delete();
  },
  updateSalesPerson(db, sales_person_id, newSalesPerson) {
    return db("protech_saleperson")
      .where({ id: sales_person_id })
      .update(newSalesPerson, (returning = true))
      .returning("*");
  },
};

module.exports = SalesPersonService;
