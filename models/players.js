const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
  userID: String,
  username: String,
  serverID: String,
  xp: Number,
  lastTimestamp: Number,
  level: Number
});

module.exports = mongoose.model("Players", playerSchema)