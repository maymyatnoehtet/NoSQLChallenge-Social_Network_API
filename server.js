const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// Replace <PASSWORD> in the DB link with DB password
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace("<PASSWORD>", DB_PASSWORD);

// Connect to MongoDB cloud database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful. ⭐️"));

// Run server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
