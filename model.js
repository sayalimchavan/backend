const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userdetails = new Schema({
  first_Name: {type: mongoose.SchemaTypes.String},
  last_Name: {type: mongoose.SchemaTypes.String},
  address: {type: mongoose.SchemaTypes.String},
  e_mail: {type: mongoose.SchemaTypes.String},
  phone: {type: mongoose.SchemaTypes.String},
  password:  {type: mongoose.SchemaTypes.String},
  role: {type: mongoose.SchemaTypes.String},
  isVerified: {type: mongoose.SchemaTypes.Boolean, default: false}
});


module.exports = mongoose.model('userdetails', userdetails);