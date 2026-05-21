const categorySchema = require("../models/categorySchema");

const createCategory = async (req, res) => {
  const { title } = req.body;
  try {
    if (!title?.trim())
      return res.status(400).send({ message: "Category title is required" });

    const category = await categorySchema.create({ title });

    res.status(200).send({ message: "Category created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

module.exports = { createCategory, getAllCategories };