const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routerCards = require("./routers/card");
const routerUsers = require("./routers/user.js");

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "6255556d5d516b92eae5f13f",
  };

  next();
});

app.use("/", routerUsers);
app.use("/", routerCards);

app.use((req, res) => {
  res.status(404).send({ message: "Роутер не найден!" });
});

mongoose.connect("mongodb://localhost:27017/mestodb ", {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("ssssss");
});
