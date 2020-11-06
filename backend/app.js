const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join("backend/images")));
app.use("/feed", feedRoutes);
app.use("/user", userRoutes);

//mw for handling error
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});
mongoose
  .connect(
    `mongodb+srv://momadian183:${process.env.MONGO_ATLAS_PW}@cluster0.zc1o9.mongodb.net/social`
    // "mongodb://localhost:27017/socialDB"
  )
  .then((reult) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = app;
