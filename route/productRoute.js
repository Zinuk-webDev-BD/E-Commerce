const { Router } = require("express");
const { createProduct } = require("../controllers/productConroller");
const { authMiddleware, roleCheck } = require("../middlewares/authMiddleware");
const route = Router();

route.post(
  "/create",
  authMiddleware,
  roleCheck(["admin", "moderator"]),
  createProduct,
);

module.exports = route;