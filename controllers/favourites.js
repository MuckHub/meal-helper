const fetch = require('node-fetch');
const Meal = require('../models/meal.model');
const User = require('../models/user.model');

const render = async (req, res) => {
  const user = (await User.findOne({ login: res.locals.user })).populate(
    'favourites'
  );

  const favList = user.favourites;
  const favMeals = await Promise.all(
    favList.map(async (el) => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${el}`
      );
      const meals = await response.json();
      const categoryMeals = meals.meals[0];
      return categoryMeals;
    })
  );

  res.render('favourites', { favMeals });
};

module.exports = {
  render,
};
