const RescueRequest = require("../model/rescuerequest");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../s3");
const nodemailer = require("nodemailer");

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

let mailTransporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  service: "gmail",
  PORT: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// RESCUE REQUEST
// ------------------------------------------------------------------------------------------

const handleRescueRequest = async (req, res) => {
  const file = req.file;
  try {
    const result = await uploadFile(file);
    await unlinkFile(file.path);

    const {
      id,
      email,
      animal_type,
      r_loc,
      r_landmark,
      r_desc,
      r_city,
      r_state,
      r_zip,
    } = req.body;

    try {
      const rescuerequest = await RescueRequest({
        requestBy: id,
        email: email,
        animal_type: animal_type,
        r_loc: r_loc,
        r_landmark: r_landmark,
        r_description: r_desc,
        r_city: r_city,
        r_state: r_state,
        r_zip: r_zip,
        photo: `${result.Key}`,
      });

      const newRescueRequest = await rescuerequest.save();
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Rescue Request Submitted",
        html: `<h2>Dear User,</h2><br><h3>We Have Received Your Rescue Request Successfully.<br>Here Is Your Reference ID for the Case:<br>Ref ID.:</h3><h2 style="color:#0F9D58;">${newRescueRequest._id}</h2><br><br><h3>With Regards,<br>ARS(Animal Rescue System)</h3>`,
      };

      mailTransporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("Email Failed: ", err);
        } else {
          console.log("Email Sent: ", info);
        }
      });

      res.status(201).json({
        success: true,
        message: "Rescue Request Sent Successfully",
        payload: newRescueRequest,
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
      .json({ success: false, message: "Failed To Submit Rescue Request" });
  }
};

const handleAcceptRR = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Accept",
    });
  } else {
    try {
      const _id = req.body._id;
      const shelter_id = req.body.id;
      const shelterName = req.body.shelterName;
      const updatedRR = await RescueRequest.findByIdAndUpdate(
        { _id },
        {
          acceptedBy: shelter_id,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedRR) {
        res
          .status(404)
          .json({ success: false, message: "Rescue Request not found" });
      } else {
        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: updatedRR.email,
          subject: "Rescue Request - Accepted",
          html: `<h2>Dear User,</h2><br><h3>Your Rescue Request Ref id: <span style="color:#0F9D58;">${updatedRR._id}</span> has been Accepted By <span style="color:#F4B400;">"${shelterName}"</span> You might further get communicated by shelter itself</h3><br><br><h3>With Regards,<br>ARS(Animal Rescue System)</h3>`,
        };

        mailTransporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log("Email Failed: ", err);
          } else {
            console.log("Email Sent: ", info);
          }
        });

        res.status(200).json({
          success: true,
          message: "Rescue Request Accepted Successfully",
          payload: updatedRR,
        });
      }
    } catch (e) {
      let message = "Unable To Accept Rescue Request";
      if (e.code === 11000) message = handleDuplicateField(e);
      if (e.name === "ValidationError") message = handleValidationError(e);
      return res.status(400).json({
        success: false,
        message: message,
      });
    }
  }
};

const handleUpdateRR = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Accept",
    });
  } else {
    try {
      const _id = req.body._id;
      const status = req.body.status;
      const updatedRR = await RescueRequest.findByIdAndUpdate(
        { _id },
        {
          status: status,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedRR) {
        res
          .status(404)
          .json({ success: false, message: "Rescue Request not found" });
      } else {
        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: updatedRR.email,
          subject: "Rescue Request - Status Update",
          html: `<h2>Dear User,</h2><br><h3>Your Rescue Request Ref id: <span style="color:#0F9D58;">${updatedRR._id}</span> Status changed By Shelter to <span style="color:#4285F4;">"${updatedRR.status}"</span></h3><br><br><h3>With Regards,<br>ARS(Animal Rescue System)</h3>`,
        };

        mailTransporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log("Email Failed: ", err);
          } else {
            console.log("Email Sent: ", info);
          }
        });

        res.status(200).json({
          success: true,
          message: "Rescue Request Status Updated Successfully",
          payload: updatedRR,
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

// SOFT DELETE RESCUE REQUEST
// -------------------------------------------------------------------------
const handleDeleteRR = async (req, res) => {
  try {
    const deletedRR = await RescueRequest.findByIdAndUpdate(
      { _id: req.query.id },
      { isActive: false },
      { new: true }
    );
    if (!deletedRR) {
      res
        .status(404)
        .json({ success: false, message: "Rescue Request not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Rescue Request Deleted Successfully",
        payload: deletedRR,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete Rescue Request" });
  }
};

// GET ALL RESCUE REQUEST

const handleGetAllRR = async (req, res) => {
  try {
    const rescuerequests = await RescueRequest.find({
      isActive: true,
    }).populate("requestBy");
    if (!rescuerequests) {
      res
        .status(404)
        .json({ success: false, message: "Rescue Request not found" });
    } else if (rescuerequests.length === 0) {
      res.status(404).json({
        success: true,
        message: "No Rescue Request Found",
        payload: rescuerequests,
      });
    } else {
      res.status(200).json({ success: true, rescuerequests });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch the document" + e });
  }
};

// GET PARTICULAR SHELTERS RR

const handleGetShelterRR = async (req, res) => {
  try {
    const rescuerequests = await RescueRequest.find({
      acceptedBy: req.query.id,
    })
      .where({
        isActive: true,
      })
      .populate("requestBy");

    if (!rescuerequests) {
      res
        .status(404)
        .json({ success: false, message: "Rescue Request not found" });
    } else if (rescuerequests.length === 0) {
      res.status(404).json({
        success: true,
        message: "No Accepted Request By You",
        payload: rescuerequests,
      });
    } else {
      res.status(200).json({ success: true, rescuerequests });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch the document" + e });
  }
};

module.exports = {
  handleRescueRequest,
  handleUpdateRR,
  handleAcceptRR,
  handleDeleteRR,
  handleGetShelterRR,
  handleGetAllRR,
};
