const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const Forbidden = require('../errors/forbidden');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
}

function addCard(req, res, next) {
  const { name, link, likes } = req.body;

  Card.create({
    name, link, likes, owner: req.user._id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const id = req.user._id;
  Card.findById(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      if (cards.owner.toString() !== id) {
        throw new Forbidden('Нет прав для удаления карточки');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          // eslint-disable-next-line no-shadow
          .then((cards) => {
            res.status(200).send(cards);
          })
          .catch(next);
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      res.status(200).send(card);
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      res.status(200).send(card);
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
