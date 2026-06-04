const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.status(200).send("Healthy");
});

route.use("/auth", require("./authRoute"));
route.use("/category", require("./categoryRoute"));
route.use("/product", require("./productRoute"));
module.exports = route;
// mongodb+srv://node2601-ecommerce:39xQFcIIri5o6ywO@cluster0.hppyt.mongodb.net/node2601-ecommerce?appName=Cluster0