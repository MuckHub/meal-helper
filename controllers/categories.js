const fetch = require('node-fetch');

const render = async (req, res) => {
  try {
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    const meals = await response.json();
    const allCategories = meals.categories;
    res.render('categories', { allCategories });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  render,
};
