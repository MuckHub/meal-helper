const Meal = require('../models/meal.model');
const fetch = require('node-fetch');

const render = async (req, res) => {
  const topTen = await Meal.find().sort({ users: -1 }).limit(5);

  console.log(topTen);

  const topList = await Promise.all(
    topTen.map(async (el) => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${el.mealId}`
      );
      const meals = await response.json();
      const categoryMeals = meals.meals[0];
      return categoryMeals;
    })
  );

  const result = [];

  res.render('popular', { topList });
};

module.exports = {
  render,
};
