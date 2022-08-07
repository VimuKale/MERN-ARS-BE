const express = require("express");
const router = new express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  isValidID,
  //   isValidFDID,
  authenticateToken,
} = require("../middleware/commonMiddleware");

const {
  handleRescueRequest,
  handleAcceptRR,
  handleUpdateRR,
  handleDeleteRR,
  handleGetShelterRR,
  handleGetAllRR,
} = require("../controller/rescuerequestController");

router.post(
  "/rescuerequest",
  authenticateToken,
  upload.single("rrimg"),
  handleRescueRequest
);

router.post("/acceptrr", authenticateToken, handleAcceptRR);

router.patch("/updaterr", authenticateToken, handleUpdateRR);

router.delete("/softdeleterr", authenticateToken, handleDeleteRR);

router.get("/getrr", authenticateToken, isValidID, handleGetShelterRR);

router.get("/getallrr", authenticateToken, handleGetAllRR);

module.exports = router;
