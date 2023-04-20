require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const cors = require("cors");
const requestIp = require("request-ip");
const https = require("https");
const express = require("express"),
  path = require("path"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(requestIp.mw());

const { User, Flight } = require("./models");

const HEADERS = {
  "content-type": "application/json",
  "x-api-key": "prtl6749387986743898559646983194",
};
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

axios.defaults.httpsAgent = httpsAgent;

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
  // let created_user = await User.create({
  //   name: "Jhon Doe",
  //   email: "jhon.doe@example.com",
  //   password: "asd123",
  // });
  //TODO: validate unique email
  created_user = await User.create(req.body);
  let token = jwt.sign(
    { id: created_user.id, email: created_user.email, name: created_user.name },
    process.env.SECRET
  );
  res.status(201).json({ token: token });
});
app.post("/login", async function (req, res) {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    if (user.checkPassword(req.body.password)) {
      let token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ msg: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ msg: "User does not exist" });
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
    let flight = await user.getFlight();
    res.status(200).json(flight ? flight : { msg: "no watched" });
  } catch (err) {
    res.status(401).json({ msg: "Couldn't Authenticate", error: err.message });
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
    const flight = await Flight.findOrCreate(req.body);
    await user.setFlight(flight);
    res.status(200).json({ msg: `flight is set to watched for user` });
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
  // todo while status !== 'RESULT_STATUS_INCOMPLETE' loop try
  let resp;
  let returnCondition = false;
  console.log(req.body.query.queryLegs);
  do {
    await axios
      .request({
        method: "POST",
        url: "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create",
        headers: HEADERS,
        data: req.body,
      })
      .then(function (response) {
        console.log(response.status, response.data.action);
        if (
          (response.status == 200 &&
            response.data.status !== "RESULT_STATUS_FAILED") ||
          response.data.action == "RESULT_ACTION_OMITTED"
        ) {
          sessionToken = response.data.sessionToken;
          resp = response.data;
          returnCondition = true;
        }
      })
      .catch(function (error) {
        console.log(error.response ? error.response.status : error.data);
        if (error.response && error.response.status == 400) {
          console.log(error.response.data.message);
          resp = error;
          returnCondition = true;
        }
      });
  } while (!returnCondition);
  res.send(resp);
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

app.get("/fetchCulture", async function (req, res) {
  const clientIp = req.clientIp;
  console.log("Client IP:", clientIp);
  let resData;
  await axios
    .request({
      method: "GET",
      url: `https://partners.api.skyscanner.net/apiservices/v3/culture/nearestculture?ipAddress=${clientIp}`,
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

app.post("/suggestPlace", async function (req, res) {
  let resData;
  await axios
    .request({
      method: "POST",
      url: "https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights",
      headers: HEADERS,
      data: req.body,
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

async function checkEveryUsersWatched() {
  console.log("check");
  const users = await User.findAll();
  users.forEach(async (user) => {
    let flight = await user.getFlight();
    console.log(flight);
  });
}

const server = app.listen(port ? port : 5555, () => {
  console.log(`Server listening on the port::${server.address().port}`);
  // checkEveryUsersWatched();
  // setInterval(checkEveryUsersWatched, 30 * 1000); //60 * 60 * 1000 = 1 hour
});
