const router = require("express").Router();
const { getSeats, bookSeat, updateSeat } = require("./handlers");

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", bookSeat);

router.put("/api/update-seat", updateSeat);

// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

module.exports = router;
