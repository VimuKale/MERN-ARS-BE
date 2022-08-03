const express = require("express");
const router = new express.Router();
const {
  isValidID,
  validatePassword,
  authenticateToken,
} = require("../middleware/commonMiddleware");
const {
  handleGetUserByID,
  handleSignUp,
  handleUpdateUserByID,
  handleSoftDeleteUserByID,
} = require("../controller/userController");

router.get("/user", authenticateToken, isValidID, handleGetUserByID);
router.post("/signup", validatePassword, handleSignUp);
router.patch("/edit", authenticateToken, isValidID, handleUpdateUserByID);
router.delete(
  "/softdelete",
  authenticateToken,
  isValidID,
  handleSoftDeleteUserByID
);
module.exports = router;
