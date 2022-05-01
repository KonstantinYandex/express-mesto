const router = require("express").Router();
const {
  getUsers,
  getUserOne,
  updateAvatar,
  updateProfile,
  getUserById
} = require("../controllers/user");

const { celebrate, Joi } = require("celebrate");

router.get("/users", getUsers);
router.get('/users/:userId',getUserById)
router.get("/users/me", getUserOne);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);
router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      ),
    }),
  }),
  updateAvatar
);

module.exports = router;
