const router = require("express").Router();
const {
  getUsers,
  getUserOne,
  addUser,
  updateAvatar,
  updateProfile,
} = require("../controllers/user");

router.get("/users", getUsers);
router.get("/users/:userID", getUserOne);
router.post("/users", addUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
