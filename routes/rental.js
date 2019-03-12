const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { rental, validate } = require("../models/rental");
const { customer } = require("../models/customer");
const { movie } = require("../models/movies");
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  res.send(await rental.find());
});

router.get("/:id", async (req, res) => {
  const r = await rental.findById(req.params.id);
  if (!r) return res.status(404).send("Invalid rental id");

  res.send(r);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const p = await movie.findById(req.body.movieId);
  const c = await customer.findById(req.body.customerId);

  if (!p) return res.status(404).send("invalid movie id");
  if (!c) return res.status(404).send("invalid customer id");

  if (p.numberInStock === 0)
    return res.status(404).send("movie not available ");

  const r = new rental({
    customer: {
      isGold: c.isGold,
      name: c.name,
      phone: c.phone,
      _id: c._id
    },
    movie: {
      _id: p._id,
      title: p.title,
      dailyRentalRate: p.dailyRentalRate
    },
    rentFee: p.dailyRentalRate
  });
  try {
    new Fawn.Task()
      .save("rentals", r)
      .update(
        "movies",
        { _id: p._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    res.send(r);
  } catch (e) {
    res.status(500).send("something failed");
  }
});

module.exports = router;
