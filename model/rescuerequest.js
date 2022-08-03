const mongoose = require("mongoose");
const validator = require("validator");
const { validatePhone } = require("../middleware/commonMiddleware");

const rescueRequestSchema = new mongoose.Schema(
  {
    requestBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    acceptedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shelter",
      default: null,
    },
    status: {
      type: "String",
      required: true,
      default: "pending",
    },
    email: {
      type: String,
      required: [true, "User Email Is Required For Rescue Request"],
    },
    animal_type: {
      type: String,
      required: [true, "Animal Type Field Is Required"],
    },
    r_loc: {
      type: String,
      required: [true, "Rescue Location Field Is Required"],
      minlength: [
        2,
        "Rescue location must be grater than or equal To two characters",
      ],
    },
    r_landmark: {
      type: String,
      required: [true, "Rescue Landmark Field Is Required"],
      minlength: [
        2,
        "Rescue location must be grater than or equal To two characters",
      ],
    },
    r_description: {
      type: String,
      required: [true, "Rescue Description Field Is Required"],
      minlength: [
        2,
        "Rescue Description must be grater than or equal To two characters",
      ],
      maxlength: [200, "Rescue Description Cannot Be Over 200 characters"],
    },
    r_city: {
      type: String,
      required: [true, "City Field Is Required"],
    },
    r_state: {
      type: String,
      required: [true, "State Field Is Required"],
    },
    r_zip: {
      type: String,
      required: [true, "Zip Field Is Required"],
    },
    photo: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const RescueRequest = new mongoose.model("RescueRequest", rescueRequestSchema);

module.exports = RescueRequest;
