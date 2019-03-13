const express = require("express");
const app = express();
const Joi = require("joi");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rental = require("./routes/rental");
const user = require("./routes/user");
const login = require("./routes/login");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR : jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Could not connect to MongoDB"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/login", login);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening in port${port}`);
});
