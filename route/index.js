const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.status(200).send("Healthy");
});

route.use("/auth", require("./authRoute"));
route.use("/category", require("./categoryRoute"));
module.exports = route;
// mongodb+srv://E-Commerce:39xQFcIIri5o6ywO@cluster0.hppyt.mongodb.net/node2601-E-Commerce?appName=Cluster0