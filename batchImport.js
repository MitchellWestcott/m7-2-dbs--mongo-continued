const { MongoClient } = require("mongodb");
// const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
// const fs = require("file-system");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}

const seatClone = Object.values(seats);

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("m7-2");
    const result = await db.collection("m7-2").insertMany([...seatClone]);
    // assert.equal(1, result.insertedCount);
    if (result) {
      console.log("success");
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
  console.log("disconnected!");
};

batchImport();
