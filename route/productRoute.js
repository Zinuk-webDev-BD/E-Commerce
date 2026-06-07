const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const { createProduct } = require("../controllers/productConroller");
const { authMiddleware, roleCheck } = require("../middlewares/authMiddleware");
const route = Router();

route.post(
  "/create",
  authMiddleware,
  roleCheck(["admin", "moderator"]),
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
  createProduct,
);

module.exports = route;