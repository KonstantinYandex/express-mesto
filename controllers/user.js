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

function getUserOne(req, res) {
  User.findById(req.params.userID)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
}

function addUser(req, res) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          throw new BadRequestError(err.message);
        }
        if (err.code === 11000 && err.code === "MongoError") {
          throw new ConflictError("Пользователь с таким email уже существует");
        }
      })
      .catch(next);
  });
}

function updateProfile(req, res) {
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
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
}

function updateAvatar(req, res) {
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
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
}

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.status(200).send(token);
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
