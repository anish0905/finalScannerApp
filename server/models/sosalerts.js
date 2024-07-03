const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    uniqueCode: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SosAlert = mongoose.model("SosAlert", sosAlertSchema);

module.exports = SosAlert;
