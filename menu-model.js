const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let menus = new Schema({
  item: {type: mongoose.SchemaTypes.String},
  desciption:{type: mongoose.SchemaTypes.String},
  category: {type: mongoose.SchemaTypes.String},
  cost: {type: mongoose.SchemaTypes.Number},
  quantity: {type: mongoose.SchemaTypes.Number}
  
});


module.exports = mongoose.model('menus', menus);