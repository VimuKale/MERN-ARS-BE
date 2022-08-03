const User = require("../model/user");
const Shelter = require("../model/shelter");
const RescueVan = require("../model/rescuevan");
const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleUserLogin = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    if (type === "user") {
      userLogin(email, password, req, res);
    } else if (type === "shelter") {
      shelterLogin(email, password, req, res);
    } else if (type === "admin") {
      adminLogin(email, password, req, res);
    } else if (type === "rescuevan") {
      rescuevanLogin(email, password, req, res);
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable To Login User" });
  }
};

const userLogin = async (email, password, req, res) => {
  try {
    const loginDetails = await User.findOne({
      email: email,
      isActive: true,
    });
    // console.log(loginDetails);
    if (loginDetails) {
      const isMatch = await bcrypt.compare(password, loginDetails.password);
      // console.log(isMatch);
      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = jwt.sign(
          loginDetails.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );
        // console.log(accessToken);

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: loginDetails,
          accessToken: accessToken,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable To Login User" });
  }
};

const shelterLogin = async (email, password, req, res) => {
  try {
    const loginDetails = await Shelter.findOne({
      email: email,
      isActive: true,
    });

    // console.log(loginDetails);

    if (loginDetails) {
      const isMatch = await bcrypt.compare(password, loginDetails.password);
      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = jwt.sign(
          loginDetails.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: loginDetails,
          accessToken: accessToken,
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Shelter Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable To Login User" });
  }
};

const adminLogin = async (email, password, req, res) => {
  try {
    const loginDetails = await Admin.findOne({
      email: email,
      isActive: true,
    });

    if (loginDetails) {
      const isMatch = await bcrypt.compare(password, loginDetails.password);
      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = jwt.sign(
          loginDetails.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: loginDetails,
          accessToken: accessToken,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable To Login User" });
  }
};

const rescuevanLogin = async (email, password, req, res) => {
  try {
    const loginDetails = await RescueVan.findOne({
      email: email,
      isActive: true,
    });

    if (loginDetails) {
      const isMatch = await bcrypt.compare(password, loginDetails.password);
      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = jwt.sign(
          loginDetails.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: loginDetails,
          accessToken: accessToken,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable To Login User" });
  }
};
module.exports = {
  handleUserLogin,
};
