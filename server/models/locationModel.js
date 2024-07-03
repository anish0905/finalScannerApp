const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  deliveryBoysId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "deliveryBoysDetails",
  },
  locations: [
    {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
