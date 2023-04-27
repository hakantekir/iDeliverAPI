require("dotenv");
const mongoose = require("mongoose");

//MONGO DB CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log("Error connecting to Database : ", err);
  } else {
    console.log("Connected to database successfully!");
  }
});

module.exports = mongoose;
