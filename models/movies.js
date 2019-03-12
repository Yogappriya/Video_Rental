const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

const movieSchema = new mongoose.Schema({
  title: String,
  numberInStock: Number,
  dailyRentalRate: Number,
  genre: genreSchema
});

const movie = new mongoose.model("movies", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .trim()
      .required(),
    numberInStock: Joi.required(),
    dailyRentalRate: Joi.required(),
    genreId: Joi.objectId().required()
  };
  return Joi.validate(movie, schema);
}

exports.movie = movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovie;
