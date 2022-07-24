const mongoose = require("mongoose");
const validator = require("validator");
const { validatePhone } = require("../middleware/commonMiddleware");

const adminSchema = new mongoose.Schema(
  {
    a_firstName: {
      type: String,
      required: [true, "First Name Field Is Required"],
      lowercase: true,
      minlength: [2, "First name must be grater than or qqual To two letters"],
    },
    a_lastName: {
      type: String,
      required: [true, "Last Name Field Is Required"],
      lowercase: true,
      minlength: [2, "First name must be grater than or qqual To two letters"],
    },
    a_phone: {
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

    a_address: {
      type: String,
      required: [true, "Address Field Is Required"],
    },
    a_city: {
      type: String,
      required: [true, "City Field Is Required"],
    },
    a_state: {
      type: String,
      required: [true, "State Field Is Required"],
    },
    a_zip: {
      type: String,
      required: [true, "Zip Field Is Required"],
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

const Admin = new mongoose.model("Admin", adminSchema);

module.exports = Admin;
