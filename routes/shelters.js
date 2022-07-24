const express = require("express");
const {
  handleSoftDeleteShelterByID,
  handleGetShelterByID,
  handleSignUp,
  handleUpdateShelterByID,
} = require("../controller/shelterController");
const router = new express.Router();
const {
  isValidID,
  validatePassword,
  authenticateToken,
} = require("../middleware/commonMiddleware");

router.get("/shelter", authenticateToken, isValidID, handleGetShelterByID);
router.post("/signup", validatePassword, handleSignUp);
router.patch("/edit", authenticateToken, isValidID, handleUpdateShelterByID);
router.delete(
  "/softdelete",
  authenticateToken,
  isValidID,
  handleSoftDeleteShelterByID
);
module.exports = router;
