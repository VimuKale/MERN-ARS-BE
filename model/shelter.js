const mongoose = require("mongoose");
const validator = require("validator");
const { validatePhone } = require("../middleware/commonMiddleware");

const shelterSchema = new mongoose.Schema(
  {
    s_name: {
      type: String,
      required: [true, "Shelter Name Field Is Required"],
      lowercase: true,
      minlength: [
        2,
        "Shelter name must be grater than or equal To two letters",
      ],
    },
    s_category: {
      type: String,
      required: [true, "Category Field Is Required"],
      lowercase: true,
      minlength: [2, "Category must be grater than or equal To two letters"],
    },
    s_phone: {
      type: String,
      required: [true, "Phone Number Is Required"],
      unique: [true, "Phone Number Already Exists"],
      validate: [validatePhone, "Phone Number Must Be Of 10 Digits"],
    },
    email: {
      type: String,
      required: [true, "Email Field Is Required"],
      unique: [true, "Email ID Already Taken"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password Field Is Required"],
    },

    s_address: {
      type: String,
      required: [true, "Address Field Is Required"],
      minlength: [2, "Address must be grater than or equal To two letters"],
    },
    s_city: {
      type: String,
      required: [true, "City Field Is Required"],
    },
    s_state: {
      type: String,
      required: [true, "State Field Is Required"],
    },
    s_zip: {
      type: String,
      required: [true, "Zip Field Is Required"],
      maxlength: [6, "Zip Should of 6 Digits Only"],
    },
    user_type: {
      type: String,
      required: [true, "User Type Field Is Must"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Shelter = new mongoose.model("Shelter", shelterSchema);

module.exports = Shelter;
