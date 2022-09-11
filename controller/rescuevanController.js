const RescueVan = require("../model/rescuevan");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../s3");
const bcrypt = require("bcrypt");

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
  if (keys.includes("email")) message = "User already exists";
  return message;
};

// RESCUE VAN REGISTRATION
// ------------------------------------------------------------------------------------------

const handleRescueVanReg = async (req, res) => {
  const file = req.file;
  try {
    const result = await uploadFile(file);
    await unlinkFile(file.path);

    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      address,
      city,
      state,
      zip,
      vehicleNo,
      vehicleDesc,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.table({
      firstName,
      lastName,
      phone,
      email,
      password,
      address,
      city,
      state,
      zip,
      vehicleNo,
      vehicleDesc,
    });

    try {
      const rescueVan = await RescueVan({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        password: hash,
        address: address,
        city: city,
        state: state,
        zip: zip,
        vehicleNo: vehicleNo,
        vehicleDesc: vehicleDesc,
        vehiclephoto: `${result.Key}`,
      });

      const newRescueVan = await rescueVan.save();

      res.status(201).json({
        success: true,
        message: "Rescue Request Sent Successfully",
        payload: newRescueVan,
      });
    } catch (e) {
      let message = "something went wrong";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed To Register Rescue Vehicle" });
  }
};

// UPDATE RESCUE VAN

const handleUpdateRV = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Accept",
    });
  } else {
    try {
      const _id = req.query.id;

      const updatedRV = await RescueVan.findByIdAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedRV) {
        res
          .status(404)
          .json({ success: false, message: "Rescue Van not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Rescue Request Status Updated Successfully",
          payload: updatedRV,
        });
      }
    } catch (e) {
      let message = "Unable To Update Rescue Request Status" + e;
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};

// SOFT DELETE RESCUE VANS
// -------------------------------------------------------------------------
const handleDeleteRV = async (req, res) => {
  try {
    const deletedRV = await RescueVan.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedRV) {
      res.status(404).json({ success: false, message: "Rescue Van not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Rescue Van Deleted Successfully",
        payload: deletedRV,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete Rescue Van" });
  }
};

// GET ALL RESCUE VANS

const handleGetAllRV = async (req, res) => {
  try {
    const rescuevans = await RescueVan.find({
      isActive: true,
    });
    if (!rescuevans) {
      res.status(404).json({ success: false, message: "Rescue Van not found" });
    } else if (rescuevans.length === 0) {
      res.status(404).json({
        success: true,
        message: "No Rescue Vans Found",
        payload: rescuevans,
      });
    } else {
      res.status(200).json({ success: true, payload: rescuevans });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch the document" + e });
  }
};

// GET PARTICULAR RESCUE VAN
// -----------------------------------------------------------------------------

const handleGetRVByID = async (req, res) => {
  try {
    const RV = await RescueVan.findById({ _id: req.query.id }).where({
      isActive: true,
    });

    if (!RV) {
      res.status(404).json({ success: false, message: "Rescue Van not found" });
    } else {
      res.status(200).json({ success: true, payload: RV });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

const handleGetRVByStatus = async (req, res) => {
  console.log(req.params.status);
  try {
    const RV = await RescueVan.find({
      status: req.params.status,
      isActive: true,
    });

    if (!RV) {
      res.status(404).json({
        success: false,
        message: `Rescue Vehicle with Status:${req.params.status} not found`,
      });
    } else {
      res.status(200).json({ success: true, payload: RV });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

module.exports = {
  handleDeleteRV,
  handleGetAllRV,
  handleGetRVByID,
  handleRescueVanReg,
  handleUpdateRV,
  handleGetRVByStatus,
};
