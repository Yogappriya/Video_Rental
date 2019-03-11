const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { movie, validate } = require("../models/movies");
const { genre } = require("../models/genres");

router.get("/", async (req, res) => {
  res.send(await movie.find().sort({ title: 1 }));
});

router.get("/:title", async (req, res) => {
  const m = await movie.find({ title: req.params.title });
  if (!m) {
    return res.status(404).send("Movie with given title does not exist");
  }
  res.send(m);
});

router.get("/:id", async (req, res) => {
  const m = await movie.find({ _id: req.params.id });
  if (!m) {
    return res.status(404).send("Movie with given id does not exist");
  }
  res.send(m);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const g = await genre.findById(req.body.genreId);
  if (!g) {
    return res.status(404).send("Invalid genre");
  }

  let m = new movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: g._id,
      name: g.name
    }
  });
  res.send(await m.save());
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  const g = await genre.find({ _id: req.body.genreId });
  if (!g) {
    return res.status(404).send("Invalid genre");
  }

  const Movie = await movie.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: g._id,
        name: g.name
      }
    }
  );

  if (!Movie) return res.status(404).send("Movie with given id does not exist");
  res.send(Movie);
});

router.delete("/", async (req, res) => {
  const m = await movie.deleteOne({ _id: req.body.id });
  if (!m) return res.send("invalid id");
  res.send(m);
});

module.exports = router;
