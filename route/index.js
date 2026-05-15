const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.status(200).send("Healthy");
});

route.use("/auth", require("./authRoute"));

module.exports = route;
// mongodb+srv://node2601-ecommerce:39xQFcIIri5o6ywO@cluster0.hppyt.mongodb.net/E-Commerce?appName=Cluster0