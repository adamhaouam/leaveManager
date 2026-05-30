const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  updateMyProfile,
  getProfile,
  getUserList,
  deleteUser,
} = require("../controllers/authController");
const { protect, requireAdmin, requireManager } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateMyProfile);

router.get("/users", protect, requireManager, getUserList);
router
  .route("/users/:id")
  .put(protect, requireAdmin, updateUserProfile)
  .delete(protect, requireAdmin, deleteUser);

module.exports = router;
