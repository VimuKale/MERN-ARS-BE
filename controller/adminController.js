const Admin = require("../model/admin");

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

// SIGNUP
// ------------------------------------------------------------------------------------------

const handleSignUp = async (req, res) => {
  const {
    a_firstName,
    a_lastName,
    a_phone,
    email,
    password,
    a_address,
    a_city,
    a_state,
    a_zip,
    user_type,
  } = req.body;

  try {
    const admin = await Admin({
      a_firstName,
      a_lastName,
      a_phone,
      email,
      password,
      a_address,
      a_city,
      a_state,
      a_zip,
      user_type,
    });

    const newAdmin = await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin Saved Successfully",
      payload: newAdmin,
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
};

// GET ADMIN BY ID
// ----------------------------------------------------------------------------

const handleGetAdminByID = async (req, res) => {
  try {
    const admin = await Admin.findById({ _id: req.query.id }).where({
      isActive: true,
    });

    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
    } else {
      res.status(200).json({ success: true, payload: admin });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

// UPDATE Admin BY ID
// ---------------------------------------------------------------------------------

const handleUpdateAdminByID = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Update",
    });
  } else {
    try {
      const _id = req.query.id;
      const updatedAdmin = await Admin.findByIdAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedAdmin) {
        res.status(404).json({ success: false, message: "Admin not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Admin Updated Successfully",
          payload: updatedAdmin,
        });
      }
    } catch (e) {
      let message = "Unable To Update Admin Details";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};

// SOFT DELETE ADMIN
// -------------------------------------------------------------------------
const handleSoftDeleteAdminByID = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedAdmin) {
      res.status(404).json({ success: false, message: "Admin not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Admin Deleted Successfully",
        payload: deletedAdmin,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete the Admin" });
  }
};

module.exports = {
  handleSignUp,
  handleGetAdminByID,
  handleUpdateAdminByID,
  handleSoftDeleteAdminByID,
};
