const router = require("express").Router();
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");
const { celebrate, Joi } = require("celebrate");

router.get("/cards", getCards);
router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().required().email(),
    }),
  }),
  addCard
);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
