const express = require("express");
const router = new express.Router();

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  isValidID,
  authenticateToken,
} = require("../middleware/commonMiddleware");

const {
  handlePostImage,
  handleUpdateGallery,
  handleDeleteGallery,
  GetAllGallery,
  GetGalleryByShelterId,
} = require("../controller/galleryController");

router.post(
  "/postImage",
  authenticateToken,
  upload.single("gimg"),
  handlePostImage
);

router.patch("/edit", authenticateToken, isValidID, handleUpdateGallery);
router.delete("/delete", authenticateToken, isValidID, handleDeleteGallery);
router.get("/getAll", authenticateToken, GetAllGallery);
router.get(
  "/getByShelterId",
  authenticateToken,
  isValidID,
  GetGalleryByShelterId
);

module.exports = router;
