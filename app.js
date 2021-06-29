const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
require("./security/passport")(passport);

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
