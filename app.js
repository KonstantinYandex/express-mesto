require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const express = require('express');
// const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCards = require('./routers/card');
const routerUsers = require('./routers/user');
const auth = require('./middlewares/auth');
const { login, addUser } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not-found-error');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// const allowedCors = [
//   'http://konstantinnovikov.nomoredomains.xyz',
//   'http://api.konstantinnovikov.nomoredomains.xyz',
//   'http://localhost:3000',
// ];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  console.log(origin);
  console.log('11111');
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      ),
    }),
  }),
  addUser,
);

app.use(auth);

app.use('/', routerUsers);
app.use('/', routerCards);

app.use((req, res, next) => {
  next(new NotFoundError('Роутер не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
