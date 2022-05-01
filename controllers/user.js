const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const NotFoundError = require("../errors/not-auth-error");
const NotAuthError = require("../errors/not-auth-error");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");

function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

function getUserOne(req, res, next) {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        // next(new NotFoundError("Нет пользователя с таким id"));
        throw new NotAuthError("Нет пользователя с таким id");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // next(new BadRequestError(err.message));
        throw new BadRequestError(err.message);
      } else {
        next(err);
      }
    })
    .catch(next);
}

function addUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(200).send({ name, about, avatar, email }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError(err.message));
        }
        if (err.code === 11000 && err.code === "MongoError") {
          next(new ConflictError("Пользователь с таким email уже существует"));
        } else {
          next(err);
        }
      })
      .catch(next);
  });
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с таким id не найден");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с таким id не найден");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserOne,
  addUser,
  updateProfile,
  updateAvatar,
  login,
};
