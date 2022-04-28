const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routerCards = require("./routers/card");
const routerUsers = require("./routers/user.js");
const auth = require("./middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const { login, addUser } = require("./controllers/user");
const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[A-Za-z0-9]{8,30}$")),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      ),
    }),
  }),
  addUser
);

app.use(auth);

app.use("/", routerUsers);
app.use("/", routerCards);

app.use((req, res) => {
  res.status(404).send({ message: "Роутер не найден!" });
});

mongoose.connect("mongodb://localhost:27017/mestodb ", {
  useNewUrlParser: true,
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.kind === "ObjectId") {
    res.status(400).send({
      message: "Неверно переданы данные",
    });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
