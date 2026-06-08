const { uploadToCloudinary } = require("../helpers/utils");
const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");

const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
    } = req.body;

    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;

    if (!title)
      return res.status(400).send({ message: "Product title is required" });
    if (!slug) return res.status(400).send({ message: "Slug is required" });
    const isSlugExist = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (isSlugExist)
      return res.status(400).send({ message: "Slug already exist" });
    if (!description)
      return res
        .status(400)
        .send({ message: "Product Description is required" });
    if (!category)
      return res.status(400).send({ message: "Product Category is required" });
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist)
      return res.status(400).send({ message: "Invalid Category" });
    if (!price)
      return res.status(400).send({ message: "Product Price is required" });

    // Validation of product variants

    const variantsData = JSON.parse(variants); // This json data is temporary, comming from postman, will be change in real frondend

    if (!Array.isArray(variantsData) || variantsData.length === 0)
      return res
        .status(400)
        .send({ message: "Minimum 1 variant is required." });

    for (const variant of variantsData) {
      if (!variant.sku)
        return res.status(400).send({ message: "SKU is required." });
      if (!variant.color)
        return res.status(400).send({ message: "Color is required." });
      if (!variant.size)
        return res.status(400).send({ message: "Size is required." });
      if (!variant.stock || variant.stock < 1)
        return res
          .status(400)
          .send({ message: "Stock is required and must be more then 0" });
    }

    const skus = variantsData.map((v) => v.sku);
    if (new Set(skus).size !== skus.length)
      return res.status(400).send({ message: "SUK must unique" });

    // validation and upload for images

    if (!thumbnail || thumbnail.length === 0)
      return res.status(400).send({ message: "Product thumbnail is required" });
    if (!images || images.length === 0)
      return res.status(400).send({ message: "Product images are required" });

    const thumbnailUrl = await uploadToCloudinary({
      mimetype: thumbnail[0].mimetype,
      imgBuffer: thumbnail[0].buffer,
    });

    const imgsRes = images.map(async (item) => {
      return uploadToCloudinary({
        mimetype: item.mimetype,
        imgBuffer: item.buffer,
      });
    });
    const imagesUrls = await Promise.all(imgsRes);

    const productData = await productSchema.create({
      title,
      slug,
      description,
      category,
      price,
      discountPercentage,
      variants: variantsData,
      tags,
      isActive,
      thumbnail: thumbnailUrl,
      images: imagesUrls,
    });

    res
      .status(200)
      .send({ message: "Product created successfully", productData });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createProduct };