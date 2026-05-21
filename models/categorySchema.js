const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      //   required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("category", categorySchema);