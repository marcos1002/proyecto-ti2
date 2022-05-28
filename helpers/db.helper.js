const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

const db = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.model('User', require('../models/user.model'));

module.exports = db;