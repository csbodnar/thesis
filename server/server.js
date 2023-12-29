require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require("nodemailer");
const cors = require("cors");
const requestIp = require("request-ip");
const https = require("https");
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(requestIp.mw());

const { User, Itinerary } = require("./models");

const HEADERS = {
  "content-type": "application/json",
  "x-api-key": "sh428739766321522266746152871799",
};
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

axios.defaults.httpsAgent = httpsAgent;
axios.create({});
let transporter;

const priceMultiplier = {
  PRICE_UNIT_UNSPECIFIED: 1,
  PRICE_UNIT_WHOLE: 1,
  PRICE_UNIT_CENTI: 100,
  PRICE_UNIT_MILLI: 1000,
  PRICE_UNIT_MICRO: 1000000,
};
const BAD_REQUEST = "BAD_REQUEST";
const RESULT_STATUS_UNSPECIFIED = "RESULT_STATUS_UNSPECIFIED"; // Results status not specified.
const RESULT_STATUS_COMPLETE = "RESULT_STATUS_COMPLETE"; // Results are now complete.
const RESULT_STATUS_INCOMPLETE = "RESULT_STATUS_INCOMPLETE"; // Results are not complete yet.
const RESULT_STATUS_FAILED = "RESULT_STATUS_FAILED"; // Search has failed.

const RESULT_ACTION_UNSPECIFIED = "RESULT_ACTION_UNSPECIFIED"; // Result action is not specified.
const RESULT_ACTION_REPLACED = "RESULT_ACTION_REPLACED"; // Result action is to replace, as the results have been changed.
const RESULT_ACTION_NOT_MODIFIED = "RESULT_ACTION_NOT_MODIFIED"; // Result action is not to modify, as no changes have occurred.
const RESULT_ACTION_OMITTED = "RESULT_ACTION_OMITTED"; // Results for this vertical have been omitted.

const SEARCH_CREATE_URL =
  "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create";

const SEARCH_POLL_URL =
  "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll";

const ITINERARY_REFRESH_CREATE =
  "https://partners.api.skyscanner.net/apiservices/v3/flights/live/itineraryrefresh/create";

const ITINERARY_REFRESH_POLL =
  "https://partners.api.skyscanner.net/apiservices/v3/flights/live/itineraryrefresh/poll";

const AUTOSUGGEST_FLIGHTS =
  "https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights";

const FETCH_NEAREST_CULTURE =
  "https://partners.api.skyscanner.net/apiservices/v3/culture/nearestculture";

const FETCH_LOCALES =
  "https://partners.api.skyscanner.net/apiservices/v3/culture/locales";

const FETCH_MARKETS =
  "https://partners.api.skyscanner.net/apiservices/v3/culture/markets";

app.post("/register", async function (req, res) {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    res.status(400).send({ error: "EMAIL_ALREADY_IN_USE_ERROR" });
    return;
  }
  created_user = await User.create(req.body);
  let token = jwt.sign(
    { id: created_user.id, email: created_user.email, name: created_user.name },
    process.env.SECRET
  );
  res.status(201).send({ token: token, name: created_user.name });
});
app.post("/login", async function (req, res) {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    if (user.checkPassword(req.body.password)) {
      let token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.SECRET
      );
      res.status(200).send({ token: token, name: user.name });
    } else {
      res.status(400).send({ error: "INCORRECT_PASSWORD_ERROR" });
    }
  } else {
    res.status(404).send({ error: "USER_NOT_EXISTS_ERROR" });
  }
});

app.get("/getWatched", async function (req, res) {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET);
    let user = await User.findByPk(decoded.id);
    if (user === null) {
      res.status(404).send({ msg: "User not found" });
    }
    let itinerary = await user.getItinerary();
    if (itinerary == null || itinerary == undefined) {
      res.status(200).send({ msg: "no watched" });
      return;
    }
    try {
      let itineraryResult = await getFreshDataOfItineraryModel(itinerary);
      console.log("status of user's itinerary poll", itineraryResult.status);
      let resultItineraryObj = itineraryResult.content.results.itineraries;
      if (resultItineraryObj && Object.values(resultItineraryObj).length == 0) {
        console.log("empty search result");
        user.setItinerary(null);
        res.status(200).send({ msg: "no watched" });
        return;
      }
      res.send({ detailed: itineraryResult, raw: itinerary });
    } catch (error) {
      res.status(400).json({ msg: "Outdated request", error: error.message });
    }
  } catch (err) {
    console.log(err.message);
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
    const [itinerary, created] = await Itinerary.findOrCreate({
      where: {
        itineraryId: req.body.itineraryId,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        currency: req.body.currency,
        market: req.body.market,
        locale: req.body.locale,
        cabinClass: req.body.cabinClass,
      },
      defaults: {
        itineraryId: req.body.itineraryId,
        priceAmount: req.body.priceAmount,
        priceUnit: req.body.priceUnit,
        lastCheckPriceAmount: req.body.priceAmount,
        lastCheckPriceUnit: req.body.priceUnit,
        originIATA: req.body.originIATA ? req.body.originIATA : null,
        originEntityId: req.body.originEntityId
          ? req.body.originEntityId
          : null,
        destinationIATA: req.body.destinationIATA ? destinationIATA : null,
        destinationEntityId: req.body.destinationEntityId
          ? req.body.destinationEntityId
          : null,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        currency: req.body.currency,
        market: req.body.market,
        locale: req.body.locale,
        cabinClass: req.body.cabinClass,
        adults: req.body.adults,
        childrenAges: "",
      },
    });
    await user.setItinerary(itinerary);
    res.status(200).json({ msg: `success`, itinerary: itinerary });
  } catch (err) {
    console.log(err.message);
    res.json({ msg: err.message });
  }
});

app.get("/fetchCurrencies", async function (req, res) {
  let resData = await get(`${FETCH_NEAREST_CULTURE}?ipAddress=${clientIp}`);
  res.send(resData);
});
app.get("/fetchLocales", async function (req, res) {
  let resData = await get(FETCH_LOCALES);
  res.send(resData);
});
app.get("/fetchMarkets", async function (req, res) {
  const userlanguage = req.query.lang;
  let resData = await get(`${FETCH_MARKETS}/${userlanguage}`);
  res.send(resData);
});
app.get("/fetchCulture", async function (req, res) {
  const clientIp = req.clientIp;
  console.log("Client IP:", clientIp);
  let resData = await get(`${FETCH_NEAREST_CULTURE}?ipAddress=${clientIp}`);
  console.log(resData);
  res.send(resData);
});

app.post("/search", async function (req, res) {
  console.log(req.body.query.queryLegs);
  let resp = await post(req.body, SEARCH_CREATE_URL);
  res.send(resp);
});

app.post("/searchRefresh", async function (req, res) {
  let resp = await post({}, `${SEARCH_POLL_URL}/${req.body.sessionToken}`);
  res.send(resp);
});

app.post("/suggestPlace", async function (req, res) {
  let resp = await post(req.body, AUTOSUGGEST_FLIGHTS);
  res.send(resp);
});
async function checkEveryUsersWatched() {
  try {
    const users = await User.findAll();
    users.forEach(async (user) => {
      let itinerary = await user.getItinerary();
      if (itinerary == null || itinerary == undefined) {
        return;
      }
      let resultItineraryObj = undefined;
      let originPlace = "";
      let destinationPlace = "";
      try {
        let itineraryResult = await getFreshDataOfItineraryModel(itinerary);
        originPlace =
          itineraryResult.content.results.places[
            Object.values(itineraryResult.content.results.legs)[0].originPlaceId
          ].name;
        destinationPlace =
          itineraryResult.content.results.places[
            Object.values(itineraryResult.content.results.legs)[0]
              .destinationPlaceId
          ].name;
        console.log(originPlace, destinationPlace);
        console.log("status of user's itinerary poll", itineraryResult.status);
        resultItineraryObj =
          itineraryResult.content.results.itineraries[itinerary.itineraryId];
      } catch (error) {
        //outdated request
      }
      if (resultItineraryObj) {
        if (Object.values(resultItineraryObj).length == 0) {
          console.log("empty search result");
          user.setItinerary(null);
          return;
        }
        freshCheapestPriceObj = resultItineraryObj.pricingOptions[0].price;
        const freshAmount =
          parseInt(freshCheapestPriceObj.amount) /
          priceMultiplier[freshCheapestPriceObj.unit];
        const oldAmount =
          parseInt(itinerary.priceAmount) /
          priceMultiplier[itinerary.priceUnit];
        const lastCheckedAmount =
          parseInt(itinerary.lastCheckPriceAmount) /
          priceMultiplier[itinerary.lastCheckPriceUnit];
        const formatter = new Intl.NumberFormat(itinerary.locale, {
          style: "currency",
          currency: itinerary.currency,
          currencyDisplay: "symbol",
          maximumFractionDigits: 2,
        });
        let freshPriceWithFormat = formatter.format(freshAmount);
        let oldPriceWithFormat = formatter.format(oldAmount);
        itinerary.lastCheckPriceAmount = freshCheapestPriceObj.amount;
        itinerary.lastCheckPriceUnit = freshCheapestPriceObj.unit;
        await itinerary.save();
        console.log(
          user.name,
          "'s, pricewhen marked: " +
            oldPriceWithFormat +
            ", lasttime checked: " +
            lastCheckedAmount +
            "->" +
            freshAmount
        );
        if (
          freshAmount <= oldAmount * 0.9 ||
          freshAmount >= oldAmount * 1.1 ||
          freshAmount <= lastCheckedAmount * 0.9 ||
          freshAmount >= lastCheckedAmount * 1.1
        ) {
          let msg = formattedMessage(
            oldPriceWithFormat,
            freshPriceWithFormat,
            user.email,
            new Date(itinerary.year, itinerary.month - 1, itinerary.day),
            originPlace,
            destinationPlace
          );
          sendEmail(msg);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
sendEmail = async (msg) => {
  let info = await transporter.sendMail(msg);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
formattedMessage = (
  oldPriceWithFormat,
  freshPriceWithFormat,
  email,
  date,
  originPlace,
  destinationPlace
) => {
  return {
    from: '"FlyCLoud" <flycloud@example.com>',
    to: email,
    subject: "Price Alert",
    text: `The price of your marked itinerary (${date.toDateString()}, from ${originPlace} to ${destinationPlace}) has changed from ${oldPriceWithFormat} to ${freshPriceWithFormat}`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Price Change Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Price Change Notification</h1>
            <p>The price of your marked itinerary (${date.toDateString()}, from ${originPlace} to ${destinationPlace}) has changed from ${oldPriceWithFormat} to ${freshPriceWithFormat}.</p>
        </div>
    </body>
    </html>`,
  };
};
async function post(queryDataObj, url) {
  let resp = await makeRequest("POST", url, queryDataObj);
  return resp;
}
async function get(url) {
  let resp = await makeRequest("GET", url);
  if (resp.error) {
    throw new Error(BAD_REQUEST);
  }
  return resp;
}
async function makeRequest(method, url, data = null) {
  let resp;
  let returnCondition = false;
  let requsetObj = {
    method,
    url,
    headers: HEADERS,
  };
  if (data) {
    requsetObj.data = data;
  }
  do {
    await axios
      .request(requsetObj)
      .then(function (response) {
        console.log(
          response.status,
          response.data.status
            ? `${response.data.status} ${response.data.action}`
            : Object.keys(response.data)
        );
        if (
          (response.status == 200 &&
            response.data.status !== RESULT_STATUS_FAILED) ||
          response.data.action == RESULT_ACTION_OMITTED
        ) {
          sessionToken = response.data.sessionToken;
          resp = response.data;
          returnCondition = true;
        }
      })
      .catch(function (error) {
        console.log("error", error.response ? error.response.status : error);
        if (error.response && error.response.status != 429) {
          console.log(error.response.data.message);
          resp = { error: error.response.data.message };
          returnCondition = true;
        }
      });
  } while (!returnCondition);

  return resp;
}
async function searchByItinerary(token, itineraryId) {
  let resp = await post(
    { itineraryId: itineraryId },
    `${ITINERARY_REFRESH_CREATE}/${token}`
  );
  return resp;
}
async function refreshItneraryCreateAndPollTillStatusComplete(
  sessionToken,
  itineraryId
) {
  let refreshCreateResult = await searchByItinerary(sessionToken, itineraryId);
  let resData = refreshCreateResult;

  while (resData.status !== RESULT_STATUS_COMPLETE) {
    console.log("itinerary refresh poll status: ", resData.status);
    try {
      resData = await get(
        `${ITINERARY_REFRESH_POLL}/${resData.refreshSessionToken}`
      );
    } catch (error) {
      console.log(resData);
      resData = error;
      return resData;
    }
  }
  return resData;
}
async function getFreshDataOfItineraryModel(itinerary) {
  let queryDataObj = {
    query: {
      market: itinerary.market,
      locale: itinerary.locale,
      currency: itinerary.currency,
      queryLegs: [
        {
          originPlaceId: {
            entityId: itinerary.originEntityId,
          },
          destinationPlaceId: {
            entityId: itinerary.destinationEntityId,
          },
          date: {
            year: itinerary.year,
            month: itinerary.month,
            day: itinerary.day,
          },
        },
      ],
      cabinClass: itinerary.cabinClass,
      adults: itinerary.adults,
    },
  };
  let createSearchResult = await post(queryDataObj, SEARCH_CREATE_URL);

  let itineraryResult = await refreshItneraryCreateAndPollTillStatusComplete(
    createSearchResult.sessionToken,
    itinerary.itineraryId
  );
  if (itineraryResult.error) {
    console.log(itineraryResult.error);
    throw new Error(BAD_REQUEST);
  }
  return itineraryResult;
}

const server = app.listen(port ? port : 5555, async () => {
  testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log(`Server listening on the port::${server.address().port}`);
  checkEveryUsersWatched();
  setInterval(checkEveryUsersWatched, 60 * 60 * 1000); //60 * 60 * 1000 = 1 hour
});
