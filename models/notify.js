// models/Prompt.js
const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    purpose: { type: String, required: true },
    category: { type: String, required: true },
    bedrooms: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notify", notifySchema);
