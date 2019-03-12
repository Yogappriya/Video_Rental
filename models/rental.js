const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        required: true
      }
    })
  },
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      isGold: {
        type: Boolean,
        required: true
      },
      phone: {
        type: Number,
        required: true
      }
    })
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: Date,
  rentFee: Number
});

const rental = new mongoose.model("rentals", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.rental = rental;
exports.rentalSchema = rentalSchema;
exports.validate = validateRental;
