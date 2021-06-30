const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
require("./security/passport")(passport);

// routes
const AuthRoute = require("./routes/auth.route");
const PostRoute = require("./routes/posts.route");

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router middlewares
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/posts", PostRoute);

module.exports = app;
