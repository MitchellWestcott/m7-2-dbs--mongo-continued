"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getSeats = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("m7-2");

    const seats = await db.collection("m7-2").find().toArray();

    const results = {};

    seats.forEach((seat) => {
      results[seat._id] = seat;
    });
    if (seats.length === 0) {
      res.status(404).json({ status: 404, message: "Data not found" });
      client.close();
    } else {
      res.status(200).json({
        status: 200,
        seats: results,
        numOfRows: NUM_OF_ROWS,
        seatsPerRow: SEATS_PER_ROW,
      });
      client.close();
    }
  } catch (err) {
    console.log(err.stack);
    client.close();
  }
};

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  const _id = seatId;
  const query = { _id };

  try {
    await client.connect();
    const db = client.db("m7-2");

    const updateSeatingInfo = {
      _id: _id,
      price: 255,
      isBooked: true,
      fullName: fullName,
      email: email,
    };

    const updateSeat = { $set: { ...updateSeatingInfo } };

    const results = await db.collection("m7-2").updateOne(query, updateSeat);

    if (results) {
      res.status(200).json({
        status: 200,
        _id,
        ...req.body,
        message: `Seat ${_id} successfully booked`,
      });
      client.close();
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
    console.log(err.stack);
    client.close();
  }
  client.close();
};

const updateSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { _id, isBooked, fullName, email } = req.body;

  const query = { _id };

  const newValue = {
    $set: { isBooked: isBooked, fullName: fullName, email: email },
  };

  try {
    await client.connect();
    const db = client.db("m7-2");
    const result = await db.collection("m7-2").updateOne(query, newValue);

    if (result) {
      res.status(201).json({
        status: 201,
        _id,
        success: true,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: `Booking ${_id} not found`,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

module.exports = { getSeats, bookSeat, updateSeat };
