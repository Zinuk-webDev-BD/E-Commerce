const express = require("express");
const { signUp } = require("../controllers/authControllers");
const route = express.Router();

route.post("/signUp", signUp)

module.exports = route;