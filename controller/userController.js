const User = require("../model/user");

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

// SIGNUP
// ------------------------------------------------------------------------------------------

const handleSignUp = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    state,
    zip,
    user_type,
  } = req.body;

  try {
    const user = await User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zip,
      user_type,
    });

    const newUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User Saved Successfully",
      payload: newUser,
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

//GET USER BY ID
// -----------------------------------------------------------------------------

const handleGetUserByID = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.query.id }).where({
      isDeleted: false,
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({ success: true, payload: user });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

// UPDATE USER BY ID
// ---------------------------------------------------------------------------------

const handleUpdateUserByID = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Update",
    });
  } else {
    try {
      const _id = req.query.id;
      const updatedUser = await User.findByIdAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "User Updated Successfully",
          payload: updatedUser,
        });
      }
    } catch (e) {
      let message = "Unable To Update User Details";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};


  // SOFT DELETE USER
// -------------------------------------------------------------------------
const handleSoftDeleteUserByID = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        payload: deletedUser,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete the User" });
  }
};

module.exports = {
  handleSignUp,
  handleGetUserByID,
  handleUpdateUserByID,
  handleSoftDeleteUserByID,
};
