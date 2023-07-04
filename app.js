const path = require("path");
const express = require("express");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const thoughtRoutes = require("./routes/thoughtRoutes");

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Development logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/thoughts", thoughtRoutes);

// Handle all unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});

module.exports = app;
