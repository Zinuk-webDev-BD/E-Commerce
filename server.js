const express = require("express");
const app = express();
const dns = require("dns");
const router = require("./route");
require("dotenv").config();
const dbConfig = require("./configs/dbConfig");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dbConfig();
app.use(express.json());
app.use(router);

app.listen(8000, () => {
  console.log("Server is running.");
});