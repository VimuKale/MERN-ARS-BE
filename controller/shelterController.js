const Shelter = require("../model/shelter");

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
    s_name,
    s_phone,
    s_category,
    email,
    password,
    s_address,
    s_city,
    s_state,
    s_zip,
    user_type,
  } = req.body;

  try {
    const shelterData = await Shelter({
      s_name,
      s_phone,
      s_category,
      email,
      password,
      s_address,
      s_city,
      s_state,
      s_zip,
      user_type,
    });

    // console.log(shelterData);

    const newShelter = await shelterData.save();

    // console.log(newShelter);

    res.status(201).json({
      success: true,
      message: "Shelter Saved Successfully",
      payload: newShelter,
    });
  } catch (e) {
    // console.log(e);
    let message = "something went wrong";
    if (e.code === 11000) message = handleDuplicateField(e);
    if (e.name === "ValidationError") message = handleValidationError(e);
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
};

// GET SHELTER BY ID
// ----------------------------------------------------------------------------

const handleGetShelterByID = async (req, res) => {
  try {
    const shelter = await Shelter.findById({ _id: req.query.id }).where({
      isActive: true,
    });

    if (!shelter) {
      res.status(404).json({ success: false, message: "Shelter not found" });
    } else {
      res.status(200).json({ success: true, payload: shelter });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

// UPDATE SHELTER BY ID
// ---------------------------------------------------------------------------------

const handleUpdateShelterByID = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Update",
    });
  } else {
    try {
      const _id = req.query.id;
      const updatedShelter = await Shelter.findByIdAndUpdate(
        { _id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedShelter) {
        res.status(404).json({ success: false, message: "Shelter not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Shelter Updated Successfully",
          payload: updatedShelter,
        });
      }
    } catch (e) {
      let message = "Unable To Update Shelter Details";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};

// SOFT DELETE SHELTER
// -------------------------------------------------------------------------
const handleSoftDeleteShelterByID = async (req, res) => {
  try {
    const deletedShelter = await Shelter.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedShelter) {
      res.status(404).json({ success: false, message: "Shelter not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Shelter Deleted Successfully",
        payload: deletedShelter,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete the Shelter" });
  }
};

module.exports = {
  handleSignUp,
  handleGetShelterByID,
  handleUpdateShelterByID,
  handleSoftDeleteShelterByID,
};
