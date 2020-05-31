const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let orders = new Schema({
  userid: {type: mongoose.SchemaTypes.ObjectId},
  menuItems:[{menuid: mongoose.SchemaTypes.ObjectId, qtyOrdered: Number}],
  totalCost: {type: mongoose.SchemaTypes.Number},
  address: {type: mongoose.SchemaTypes.String},
  phone: {type: mongoose.SchemaTypes.String}
});


module.exports = mongoose.model('orders', orders);