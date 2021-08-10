const express = require("express");
const xss = require("xss");
const PostingService = require("./Posting-service");

const PostingRouter = express.Router();
const jsonParser = express.json();

const serializePosting = (post) => ({
  Posting_id: post.id,
  po_number: xss(post.po_number),
  sales_number: xss(post.sales_number),
  dollar_amount: xss(post.dollar_amount),
  invoice: xss(post.invoice),
  commission_percentage_fraction: post.commission_percentage_fraction,
  commission_amount: post.commission_amount,
  customer: xss(post.customer),
  territory: xss(post.territory),
  vendor: xss(post.vendor),
  date_paid:
    post.date_paid !== null
      ? post.date_paid.toISOString().split("T")[0]
      : post.date_paid,
  paid: post.paid,
  sale_person_firstname: xss(post.first_name),
  sale_person_lastname: xss(post.last_name),
  sale_person_id: post.sales_person_id,
});

const mappingPosting = (data) => {
  let x = data.reduce((groups, item) => {
    if (groups[item.id]) {
      groups[item.id].descItems.push({
        part_number: item.part_number,
        qty: item.qty,
        unit_cost: item.unit_cost,
        so: item.so,
        inv: item.inv,
        ship_date: item.ship_date,
      });
    } else {
      let {
        id,
        sales_number,
        invoice,
        dollar_amount,
        commission_percentage_fraction,
        commission_amount,
        po_number,
        customer,
        territory,
        vendor,
        date_paid,
        paid,
        first_name,
        last_name,
        sales_person_id,
      } = item;

      let descItems = [];

      if (
        item.part_number != null &&
        item.qty != null &&
        item.unit_cost != null &&
        item.so != null &&
        item.inv != null &&
        item.ship_date != null
      ) {
        descItems = [
          {
            part_number: item.part_number,
            qty: item.qty,
            unit_cost: item.unit_cost,
            so: item.so,
            inv: item.inv,
            ship_date: item.ship_date,
          },
        ];
      }

      let me = {
        id,
        sales_number,
        invoice,
        dollar_amount,
        commission_percentage_fraction,
        commission_amount,
        po_number,
        customer,
        territory,
        vendor,
        date_paid,
        paid,
        first_name,
        last_name,
        sales_person_id,
        descItems,
      };
      groups[item.id] = me;
    }

    return groups;
  }, {});

  let mappedData = [];
  for (const element in x) {
    mappedData.push(x[element]);
  }

  return mappedData;
};

PostingRouter.route("/")
  .get((req, res, next) => {
    PostingService.getPostings(req.app.get("db"))
      .then((data) => {
        res.json(mappingPosting(data));
        next();
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      sales_number,
      invoice,
      dollar_amount,
      commission_percentage_fraction,
      commission_amount,
      po_number,
      customer,
      territory,
      date_paid,
      vendor,
      paid,
      sales_person_id,
      descItems,
    } = req.body;
    const PostToAdd = {
      sales_number,
      invoice,
      dollar_amount,
      commission_percentage_fraction,
      commission_amount,
      po_number,
      customer,
      territory,
      vendor,
      paid,
    };

    for (const [key, value] of Object.entries(PostToAdd)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (!sales_person_id) {
      return res.status(400).json({
        error: { message: `Missing 'Sales_person_id' in request body` },
      });
    }

    if (!descItems) {
      return res.status(400).json({
        error: { message: `Missing 'descItems' in request body` },
      });
    }

    PostToAdd.date_paid = date_paid === "" ? null : date_paid;

    PostingService.insertPostings(req.app.get("db"), PostToAdd)
      .then((AddedPost) => {
        let posting_id = AddedPost.id;
        let commission_rate = 100;
        let update_commission_amount =
          Number(PostToAdd.dollar_amount) * commission_percentage_fraction;

        saleCommission = {
          posting_id,
          sales_person_id,
          commission_rate,
          commission_amount: update_commission_amount,
        };

        PostingService.insertSaleCommission(req.app.get("db"), saleCommission)
          .then((data) => "do nothing")
          .catch(next);

        if (descItems.length !== 0) {
          descItems.forEach((element) => {
            element.post_id = AddedPost.id;
            element.po_number = AddedPost.po_number;
          });

          PostingService.insertDescriptionItem(req.app.get("db"), descItems)
            .then((data) => "do nothing")
            .catch(next);
        }

        return AddedPost;
      })
      .then((completedPost) => {
        res
          .status(201)
          .location(`/api/postings/${completedPost.id}`)
          .json(serializePosting(completedPost));
      })
      .catch(next);
  });

PostingRouter.route("/:post_id")
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.post_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` },
      });
    }
    // PostingService.getPostingsById(req.app.get("db"), req.params.post_id)
    PostingService.getNewPost(req.app.get("db"), req.params.post_id)
      .then((post) => {
        if (!post || post.rowCount === 0) {
          return res.status(404).json({
            error: { message: `Post doesn't exist` },
          });
        }
        res.post = post.rows[0].post;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    // res.json(serializePosting(res.post));
    res.json(res.post);
  })
  .delete((req, res, next) => {
    PostingService.deletePostings(req.app.get("db"), req.params.post_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      sales_number,
      invoice,
      dollar_amount,
      commission_percentage_fraction,
      commission_amount,
      po_number,
      customer,
      territory,
      date_paid,
      vendor,
      paid,
      sales_person_id,
    } = req.body;
    const PostToAdd = {
      sales_number,
      invoice,
      dollar_amount,
      commission_percentage_fraction,
      commission_amount,
      po_number,
      customer,
      territory,
      vendor,
      paid,
    };

    for (const [key, value] of Object.entries(PostToAdd)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (!sales_person_id) {
      return res.status(400).json({
        error: { message: `Missing 'Sales_person_id' in request body` },
      });
    }

    PostToAdd.date_paid = date_paid === "" ? null : date_paid;

    PostingService.updatePostings(
      req.app.get("db"),
      req.params.post_id,
      PostToAdd
    )
      .then((updatedPost) => {
        commission_rate = 100;
        posting_id = req.params.post_id;
        let update_commission_amount =
          Number(PostToAdd.dollar_amount) * commission_percentage_fraction;

        saleCommission = {
          posting_id,
          sales_person_id,
          commission_rate,
          commission_amount: update_commission_amount,
        };

        PostingService.updateSaleCommission(req.app.get("db"), saleCommission)
          .then((data) => "do nothing")
          .catch(next);
        return updatedPost;
      })
      .then((updatedPost) => {
        res.status(200).json(serializePosting(updatedPost[0]));
      })
      .catch(next);
  });

module.exports = PostingRouter;
