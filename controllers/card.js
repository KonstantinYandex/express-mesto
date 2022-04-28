const Card = require("../models/cards");
const NotFoundError = require("../errors/not-auth-error");
const NotAuthError = require("../errors/not-auth-error");
const BadRequestError = require("../errors/bad-request-error");
const Forbidden = require("../errors/forbidden");

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
}

function addCard(req, res, next) {
  const { name, link, likes } = req.body;

  Card.create({ name, link, likes, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new NotAuthError(err.message);
      }
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  const id = req.user._id;
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError("Карточка с таким id не найдена.");
      }
      if (cards.owner.toString() !== id) {
        throw new Forbidden("Нет прав для удаления карточки");
      }

      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Передан некорректный id");
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с таким id не найдена.");
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Невалидный id");
      }
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с таким id не найдена.");
      }
      res.status(200).send(card);
    })

    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Невалидный id");
      }
    })
    .catch(next);
}

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
