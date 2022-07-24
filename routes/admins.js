const express = require("express");
const {
  handleGetAdminByID,
  handleSignUp,
  handleUpdateAdminByID,
  handleSoftDeleteAdminByID,
} = require("../controller/adminController");

const router = new express.Router();
const {
  isValidID,
  validatePassword,
  authenticateToken,
} = require("../middleware/commonMiddleware");

router.get("/admin", authenticateToken, isValidID, handleGetAdminByID);
router.post("/signup", validatePassword, handleSignUp);
router.patch("/edit", authenticateToken, isValidID, handleUpdateAdminByID);
router.delete(
  "/softdelete",
  authenticateToken,
  isValidID,
  handleSoftDeleteAdminByID
);
module.exports = router;
