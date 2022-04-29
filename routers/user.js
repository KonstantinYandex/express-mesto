const router = require("express").Router();
const {
  getUsers,
  getUserOne,
  updateAvatar,
  updateProfile,
} = require("../controllers/user");

router.get("/users", getUsers);
router.get("/users/me", getUserOne);
router.patch(
  "/users/me",
  celebrate({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
  updateProfile
);
router.patch(
  "/users/me/avatar",
  celebrate({
    avatar: Joi.string().regex(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    ),
  }),
  updateAvatar
);

module.exports = router;
