const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserOne,
  updateAvatar,
  updateProfile,
  getUserById,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/me', getUserOne);
router.get('/users/:userId', getUserById);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
