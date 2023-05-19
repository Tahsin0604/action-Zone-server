//import
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//variable
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Toy store server is running");
});
app.listen(port, () => {
  console.log("Port: ", port);
});
