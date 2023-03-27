require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const express = require("express"),
  path = require("path"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT;
app.use(bodyParser.json());
const { User, Flight } = require("./models");

const HEADERS = {
  "content-type": "application/json",
  "x-api-key": "prtl6749387986743898559646983194",
};

let sessionToken = "";
let refreshToken = "";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

app.get("/users", async function (req, res) {
  const users = await User.findAll();
  res.send(users);
});
app.post("/register", async function (req, res) {
  created_user = await User.create({
    name: "Jhon Doe",
    email: "jhon.doe@example.com",
    password: "asd123",
  });
  // created_user = await User.create(req.body);
  res.status(201).json(created_user);
});
app.post("/login", async function (req, res) {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    if (user.checkPassword(req.body.password)) {
      token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
});
app.get("/getWatched", async function (req, res) {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    let user = await User.findByPk(decoded.id);
    if (user === null) {
      res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user.Flight ? user.Flight : { msg: "no watched" });
  } catch (err) {
    res.status(401).json({ msg: "Couldn't Authenticate" });
  }
});
app.post("/setWatched", async function (req, res) {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    let user = await User.findByPk(decoded.id);
    if (user === null) {
      res.status(404).json({ msg: "User not found" });
    }
    const flight = Flight.create(req.body);
    user.setFlight(flight);
  } catch (err) {
    res.status(401).json({ msg: "Couldn't Authenticate" });
  }
});

app.get("/fetchCurrencies", async function (req, res) {
  await axios
    .request({
      method: "GET",
      url: "https://partners.api.skyscanner.net/apiservices/v3/culture/currencies",
      headers: HEADERS,
    })
    .then(function (response) {
      resData = response.data;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});
app.get("/fetchLocales", async function (req, res) {
  await axios
    .request({
      method: "GET",
      url: "https://partners.api.skyscanner.net/apiservices/v3/culture/locales",
      headers: HEADERS,
    })
    .then(function (response) {
      resData = response.data;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});
app.get("/fetchMarkets", async function (req, res) {
  const userlanguage = req.query.lang;
  await axios
    .request({
      method: "GET",
      url: `https://partners.api.skyscanner.net/apiservices/v3/culture/markets/${userlanguage}`,
      headers: HEADERS,
    })
    .then(function (response) {
      resData = response.data;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});
app.post("/search", async function (req, res) {
  let resData;
  //req.body should look like this
  let reqBody = {
    query: {
      market: "UK",
      locale: "en-GB",
      currency: "EUR",
      queryLegs: [
        {
          originPlaceId: { iata: "LHR" },
          destinationPlaceId: { iata: "DXB" },
          date: { year: 2023, month: 9, day: 20 },
        },
      ],
      cabinClass: "CABIN_CLASS_ECONOMY",
      adults: 2,
      childrenAges: [3, 9],
    },
  };

  await axios
    .request({
      method: "POST",
      url: "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create",
      headers: HEADERS,
      data: reqBody, //req.body,
    })
    .then(function (response) {
      resData = response.data;
      sessionToken = response.data.sessionToken;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});

app.post("/searchRefresh", async function (req, res) {
  let resData;
  await axios
    .request({
      method: "POST",
      url: `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`,
      headers: HEADERS,
    })
    .then(function (response) {
      resData = response.data;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});

app.post("/searchByItinerary", async function (req, res) {
  let resData;
  await axios
    .request({
      method: "POST",
      url: `https://partners.api.skyscanner.net/apiservices/v3/flights/live/itineraryrefresh/create/${sessionToken}`,
      headers: HEADERS,
      data: req.body,
    })
    .then(function (response) {
      resData = response.data;
      refreshToken = response.data.refreshSessionToken;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});

app.post("/refreshByItinerary", async function (req, res) {
  let resData;
  await axios
    .request({
      method: "POST",
      url: `https://partners.api.skyscanner.net/apiservices/v3/flights/live/itineraryrefresh/poll/${refreshToken}`,
      headers: HEADERS,
    })
    .then(function (response) {
      resData = response.data;
    })
    .catch(function (error) {
      resData = error;
    });
  res.send(resData);
});

const server = app.listen(port ? port : 5555, () => {
  console.log(`Server listening on the port::${server.address().port}`);
});
