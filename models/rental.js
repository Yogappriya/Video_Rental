const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("./customer");
const { movieSchema } = require("./movies");

const rentalSchema = new mongoose.Schema({
  movie: movieSchema,
  customer: customerSchema,
  startDate: {
    type: Date,
    required: true
  },
  endDate: { type: Date, required: true },
  rentFee: Number
});

const rental = new mongoose.model("rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    movieId: Joi.required(),
    customerId: Joi.required(),
    startDate: Joi.required(),
    endDate: Joi.required()
  };
  return Joi.validate(rental, schema);
}

exports.rental = rental;
exports.rentalSchema = rentalSchema;
exports.validate = validateRental;
