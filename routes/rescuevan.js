const express = require("express");
const router = new express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  isValidID,
  //   validatePassword,
  authenticateToken,
  validateRVPassword,
} = require("../middleware/commonMiddleware");
const {
  handleGetRVByID,
  handleRescueVanReg,
  handleUpdateRV,
  handleDeleteRV,
  handleGetAllRV,
  handleGetRVByStatus,
} = require("../controller/rescuevanController");

router.get("/rescuevehicle", authenticateToken, isValidID, handleGetRVByID);
router.get("/allrescuevehicles", authenticateToken, handleGetAllRV);
router.get(
  "/rescuevehiclesbystatus/:status",
  authenticateToken,
  handleGetRVByStatus
);
router.post(
  "/signup",
  validateRVPassword,
  //   validatePassword,
  upload.single("rvimg"),
  handleRescueVanReg
);
router.patch("/edit", authenticateToken, isValidID, handleUpdateRV);
router.delete("/softdelete", authenticateToken, isValidID, handleDeleteRV);
module.exports = router;
