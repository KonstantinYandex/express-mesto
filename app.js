const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routerCards = require("./routers/card");
const routerUsers = require("./routers/user.js");
const auth = require("./middlewares/auth");
const { celebrate, Joi, errors } = require("celebrate");
const { login, addUser } = require("./controllers/user");
const app = express();
const { PORT = 3000 } = process.env;
const NotFoundError = require("./errors/not-found-error");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb ", {
  useNewUrlParser: true,
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
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

app.use((req, res, next) => {
  next(new NotFoundError("Роутер не найден"));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
