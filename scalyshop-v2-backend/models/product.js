var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  nrReserved: { type: Number },
  nrOrdered: { type: Number },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("products", productSchema);
