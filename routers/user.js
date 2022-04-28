const router = require("express").Router();
const {
  getUsers,
  getUserOne,
  addUser,
  updateAvatar,
  updateProfile,
  login
} = require("../controllers/user");

router.get("/users", getUsers);
router.get("/users/:userID", getUserOne);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
