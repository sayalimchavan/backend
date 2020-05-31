const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tokens = new Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userdetails' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});


module.exports = mongoose.model('token', tokens);