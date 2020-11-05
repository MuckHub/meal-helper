const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  mealId: String,
  users: [String],
});

module.exports = mongoose.model('Meal', mealSchema);
