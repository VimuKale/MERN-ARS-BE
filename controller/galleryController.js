const Gallery = require("../model/gallery");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile } = require("../s3");

//ERROR HANDLERS
const handleValidationError = (err) => {
  let message;
  const key = Object.keys(err.errors);

  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message;
  }
  return message;
};
const handleDuplicateField = (err) => {
  let message;
  const keys = Object.keys(err.keyValue);
  console.log(keys);
  if (keys.includes("a_email")) message = "User already exists";
  if (keys.includes("a_phone")) message = "Phone Number Already Exists";
  console.log(message);
  return message;
};

// --------------------------------------------------------------------------------//

const handlePostImage = async (req, res) => {
  const file = req.file;
  try {
    const result = await uploadFile(file);
    console.log(result);
    await unlinkFile(file.path);

    const { imageBy, desc } = req.body;

    try {
      const newGallery = new Gallery({
        imageBy: imageBy,
        desc: desc,
        galleryphoto: `${result.Key}`,
      });

      const newPhoto = await newGallery.save();
      res.status(200).json({
        success: true,
        message: "Image Uploaded Successfully",
        payload: newPhoto,
      });
    } catch (e) {
      console.log(e);
      let message = "something went wrong";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Failed To Upload to Gallery" });
  }
};
// --------------------------------------------------------------------------------//
//UPDATE GALLERY
const handleUpdateGallery = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Update",
    });
  } else {
    const _id = req.query.id;
    try {
      const UpdatedGallery = await Gallery.findByIdAndUpdate(
        { _id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!UpdatedGallery) {
        res
          .status(404)
          .json({ success: false, message: "Gallery Photo not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Gallery Photo Description Updated Successfully",
          payload: UpdatedGallery,
        });
      }
    } catch (e) {
      let message = "Unable To Update Gallery" + e;
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};
// --------------------------------------------------------------------------------//
//DELETE GALLERY
const handleDeleteGallery = async (req, res) => {
  try {
    const deletedGallery = await Gallery.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedGallery) {
      res
        .status(404)
        .json({ success: false, message: "Gallery Photo not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Gallery Photo Deleted Successfully",
        payload: deletedGallery,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete Gallery Photo" });
  }
};

// --------------------------------------------------------------------------------//
//GET ALL GALLERY

const GetAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({
      isActive: true,
    });
    if (!gallery) {
      res
        .status(404)
        .json({ success: false, message: "Gallery Photos Not found" });
    } else if (gallery.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Gallery Photos Found",
      });
    } else {
      res.status(200).json({ success: true, payload: gallery });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch the documents" });
  }
};

// --------------------------------------------------------------------------------//
// GET GALLERY BY SHELTER ID
const GetGalleryByShelterId = async (req, res) => {
  try {
    const gallery = await Gallery.find({
      isActive: true,
      imageBy: req.query.id,
    });
    if (!gallery) {
      res
        .status(404)
        .json({ success: false, message: "Gallery Photos Not found" });
    } else if (gallery.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Gallery Photos Found Form Your Shelter",
      });
    } else {
      res.status(200).json({ success: true, payload: gallery });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch the documents" });
  }
};

// --------------------------------------------------------------------------------//
module.exports = {
  handlePostImage,
  handleUpdateGallery,
  handleDeleteGallery,
  GetAllGallery,
  GetGalleryByShelterId,
};
