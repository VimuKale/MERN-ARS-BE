const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    imageBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Shelter",
    },
    desc: {
      type: String,
      required: [true, "Short Desc Field Is Required"],
      lowercase: true,
      minlength: [3, "Short Desc Should Be Between 3 and 30 characters"],
    },
    galleryphoto: {
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

const Gallery = new mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
