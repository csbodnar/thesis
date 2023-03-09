require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const express = require("express"),
  path = require("path"),
  app = express(),
  bodyParser = require("body-parser"),
  port = process.env.PORT;
app.use(bodyParser.json());
const { User, Flight } = require("./models");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

app.get("/", async function (req, res) {
  const users = await User.findAll();
  res.send(users);
});

app.get("/aircraft", async function (req, res) {
  try {
    // Fetch data from OpenSky API
    const response = await axios.get(
      "https://opensky-network.org/api/states/all"
    );
    const data = response.data.states;

    // Extract the aircraft data from the response
    /*const aircraftData = response.data.states.map((state) => ({
      icao24: state[0],
      callsign: state[1] || null,
      origin_country: state[2] || null,
      time_position: new Date(state[3] * 1000),
      last_contact: new Date(state[4] * 1000),
      longitude: state[5] || null,
      latitude: state[6] || null,
      altitude: state[7] || null,
      on_ground: state[8],
      velocity: state[9] || null,
      heading: state[10] || null,
      vertical_rate: state[11] || null,
      sensors: state[12] || null,
      geo_altitude: state[13] || null,
      squawk: state[14] || null,
      spi: state[15] || null,
      position_source: state[16] || null,
      category: state[17] || null,
    }));*/
    const aircraftData = [];
    for (const item of data) {
      const [
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        category,
      ] = item;
      aircraftData.push({
        icao24,
        callsign,
        origin_country,
        time_position: new Date(time_position * 1000),
        last_contact: new Date(last_contact * 1000),
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
        vertical_rate,
        sensors,
        geo_altitude,
        squawk,
        spi,
        position_source,
        // category,
      });
    }

    await Flight.bulkCreate(aircraftData, {
      updateOnDuplicate: Object.keys(aircraftData[0]),
    });

    // Bulk insert the aircraft data into the database
    await Flight.bulkCreate(aircraftData);

    // Send a success response
    res.json({ success: true });
  } catch (error) {
    // Send an error response
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port ? port : 5555, () => {
  console.log(`Server listening on the port::${server.address().port}`);
});
