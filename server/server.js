require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sqlite3 = require("sqlite3");
const express = require("express"),
  path = require("path"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT;
app.use(bodyParser.json());
const { User } = require("./models");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

app.get("/", async function (req, res) {
  const users = await User.findAll();
  res.send(users);
});

const server = app.listen(port ? port : 5555, () => {
  console.log(`Server listening on the port::${server.address().port}`);
});
