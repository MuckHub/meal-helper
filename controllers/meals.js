const fetch = require('node-fetch');
const Meal = require('../models/meal.model');
const User = require('../models/user.model');

const render = async (req, res) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${req.params.name}`
    );
    const meals = await response.json();
    const categoryMeals = meals.meals;

    res.render('meals', { categoryMeals });
  } catch (error) {
    console.log(error);
  }
};

const renderDetailed = async (req, res) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.params.id}`
    );
    const meal = await response.json();

    let ingred1 =
      meal.meals[0].strMeasure1 + ' ' + meal.meals[0].strIngredient1;
    let ingred2 =
      meal.meals[0].strMeasure2 + ' ' + meal.meals[0].strIngredient2;
    let ingred3 =
      meal.meals[0].strMeasure3 + ' ' + meal.meals[0].strIngredient3;
    let ingred4 =
      meal.meals[0].strMeasure4 + ' ' + meal.meals[0].strIngredient4;
    let ingred5 =
      meal.meals[0].strMeasure5 + ' ' + meal.meals[0].strIngredient5;
    let ingred6 =
      meal.meals[0].strMeasure6 + ' ' + meal.meals[0].strIngredient6;
    let ingred7 =
      meal.meals[0].strMeasure7 + ' ' + meal.meals[0].strIngredient7;
    let ingred8 =
      meal.meals[0].strMeasure8 + ' ' + meal.meals[0].strIngredient8;
    let ingred9 =
      meal.meals[0].strMeasure9 + ' ' + meal.meals[0].strIngredient9;
    let ingred10 =
      meal.meals[0].strMeasure10 + ' ' + meal.meals[0].strIngredient10;
    let ingred11 =
      meal.meals[0].strMeasure11 + ' ' + meal.meals[0].strIngredient11;
    let ingred12 =
      meal.meals[0].strMeasure12 + ' ' + meal.meals[0].strIngredient12;
    let ingred13 =
      meal.meals[0].strMeasure13 + ' ' + meal.meals[0].strIngredient13;
    let ingred14 =
      meal.meals[0].strMeasure14 + ' ' + meal.meals[0].strIngredient14;
    let ingred15 =
      meal.meals[0].strMeasure15 + ' ' + meal.meals[0].strIngredient15;
    let ingred16 =
      meal.meals[0].strMeasure16 + ' ' + meal.meals[0].strIngredient16;
    let ingred17 =
      meal.meals[0].strMeasure17 + ' ' + meal.meals[0].strIngredient17;
    let ingred18 =
      meal.meals[0].strMeasure18 + ' ' + meal.meals[0].strIngredient18;
    let ingred19 =
      meal.meals[0].strMeasure19 + ' ' + meal.meals[0].strIngredient19;

    let ingedients = [];
    ingedients.push.apply(ingedients, [
      ingred1,
      ingred2,
      ingred3,
      ingred4,
      ingred5,
      ingred6,
      ingred7,
      ingred8,
      ingred9,
      ingred10,
      ingred11,
      ingred12,
      ingred13,
      ingred14,
      ingred14,
      ingred15,
      ingred16,
      ingred17,
      ingred18,
      ingred19,
    ]);

    ingedients = ingedients.filter(
      (v) => v != ' ' && v != 'null null' && v != '  ' && v != ' null'
    );

    if (req.session.user) {
      const user = await (
        await User.findOne({ login: res.locals.user })
      ).populate('favourites');

      if (user.favourites.includes(meal.meals[0].idMeal)) {
        res.locals.isFavourite = true;
      } else {
        res.locals.isFavourite = false;
      }
    }

    const mealDetails = {
      id: meal.meals[0].idMeal,
      strMeal: meal.meals[0].strMeal,
      strCategory: meal.meals[0].strCategory,
      strInstructions: meal.meals[0].strInstructions
        .split('\r\n')
        .filter((v) => v != ''),
      strMealThumb: meal.meals[0].strMealThumb,
      ingredients: ingedients,
    };

    res.render('detailed', { mealDetails });
  } catch (error) {
    console.log(error);
  }
};

const add = async (req, res) => {
  const meal = await Meal.findOne({ mealId: req.body.mealId });

  if (meal) {
    await Meal.updateOne(
      { mealId: req.body.mealId },
      { $push: { users: res.locals.user } }
    );
  } else {
    const newMeal = await new Meal({
      mealId: req.body.mealId,
      users: res.locals.user,
    }).save();
  }
  await User.updateOne(
    { login: res.locals.user },
    { $push: { favourites: req.body.mealId } }
  );
  res.end();
};

const remove = async (req, res) => {
  await User.updateOne(
    { login: res.locals.user },
    { $pull: { favourites: req.body.mealId } }
  );
  await Meal.updateOne(
    { mealId: req.body.mealId },
    { $pull: { users: res.locals.user } }
  );
  res.end();
};

module.exports = {
  render,
  renderDetailed,
  add,
  remove,
};
