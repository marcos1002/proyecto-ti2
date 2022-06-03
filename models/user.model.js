const { Schema } = require('mongoose');

module.exports = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  curpText: String,
  ine: Buffer,
  curp: Buffer,
  photo: Buffer,
  addressProof: Buffer
});