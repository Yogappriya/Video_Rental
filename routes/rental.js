const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { rental, validate } = require("../models/rental");
const { customer } = require("../models/customer");
const { movie } = require("../models/movies");

router.get("/", async (req, res) => {
  res.send(await rental.find());
});

router.get("/:id", async (req, res) => {
  const r = await rental.findById(req.params.id);
  if (!r) return res.status(404).send("Invalid rental id");

  res.send(r);
});

router.post("/", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const p = await movie.findById(req.body.movieId);
  const c = await customer.findById(req.body.customerId);
  const r = new rental({
    customer: {
      _id: c.id,
      name: c.name,
      phone: c.phone
    },
    movie: {
      _id: p.id
    },
    startDate: "2017-02-01T08:35:02.055Z",
    endDate: "2017-02-09T08:35:02.055Z",
    rentFee: p.dailyRentalRate
  });

  res.send(r.save());
});

router.put("/:id", async (req, res) => {
  const r = await rental.findById(req.params.id);
  if (!r) return res.status(404).send("Invalid rental id");
});

router.delete("/:id", async (req, res) => {
  const r = await rental.findByIdAndRemove(req.params.id);
  if (!r) return res.status(404).send("Invalid rental id");
  res.send(r);
});

module.exports = router;
