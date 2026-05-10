const express = require("express");
const route = express.Router();

route.use("/", (req , res)=>{
    res.status(200).send("Healthy");
});

route.use("/auth", require("./authRoute"));

module.exports = route;