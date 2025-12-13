const { default: mongoose } = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String },
  description: { type: String },
  quantity: { type: Number, default: 0 , min: 0},
}, { timestamps: true });

const Sweet = mongoose.model('Sweet', sweetSchema);

module.exports = Sweet;