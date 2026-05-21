const {
  createCategory,
  getAllCategories,
} = require("../controllers/categoryController");
const { authMiddleware, roleCheck } = require("../middlewares/authMiddleware");

const route = require("express").Router();

route.post("/create", authMiddleware, roleCheck(["admin"]), createCategory);
route.get("/all", getAllCategories);
module.exports = route;