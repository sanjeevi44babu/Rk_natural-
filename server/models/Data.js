const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
