const express = require("express");
const router = express.Router();
const { genre, validate } = require("../models/genres");

router.get("/", async (req, res) => {
  res.send(await genre.find());
});

router.get("/:name", async (req, res) => {
  const g = await genre.find({ name: req.params.name });
  if (!g) return res.status(404).send("Genre not found");
  res.send(g);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  let g = new genre({ name: req.body.name });
  res.send(await g.save());
});

router.put("/:name", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  res.send(
    await genre.updateOne(
      { name: req.params.name },
      { $set: { name: req.body.name } }
    )
  );
});

router.delete("/:name", async (req, res) => {
  res.send(await genre.remove({ name: req.params.name }));
});

module.exports = router;
