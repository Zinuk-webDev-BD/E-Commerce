const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.status(200).send("Healthy");
});

route.use("/auth", require("./authRoute"));

module.exports = route;
// DB_URL=mongodb+srv://node2601-ecommerce:39xQFcIIri5o6ywO@cluster0.hppyt.mongodb.net/node2601-ecommerce?appName=Cluster0