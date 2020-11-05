const findBtn = document.querySelector('.find-btn');
const randomBtn = document.querySelector('.random-btn');
const form = document.querySelector('.result-form');
const error = document.querySelector('.error-msg');
const result = document.querySelector('.result');
const noResult = document.querySelector('.no-result');

const addBtn = document.querySelector('.fav-add');
const removeBtn = document.querySelector('.fav-remove');

const renderResultsTemplate = async (data) => {
  const hbsRes = await fetch('/views/results.hbs');
  const hbs = await hbsRes.text();
  const hbsTemplate = Handlebars.compile(hbs);

  return hbsTemplate({ data });
};

if (findBtn) {
  findBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let search = form.elements.search.value;

    if (search !== '') {
      let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search}`
      );
      let data = await response.json();

      if (data.meals === null) {
        form.reset();

        error.classList.add('hidden');
        noResult.classList.remove('hidden');
      } else {
        const renderTemplate = await renderResultsTemplate(data.meals);
        error.classList.add('hidden');
        result.innerHTML = '';
        result.insertAdjacentHTML('afterbegin', renderTemplate);
        form.reset();
      }
    } else {
      error.classList.remove('hidden');
      document.querySelector('.no-result').classList.add('hidden');
    }
  });
}
if (randomBtn) {
  randomBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let timerId = setInterval(async () => {
      let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/random.php`
      );
      let data = await response.json();
      const renderTemplate = await renderResultsTemplate({
        data: data.meals[0],
      });
      error.classList.add('hidden');
      result.innerHTML = '';
      result.insertAdjacentHTML('afterbegin', renderTemplate);
      form.reset();
    }, 250);

    setTimeout(() => {
      clearInterval(timerId);
    }, 2000);
  });
}

if (addBtn) {
  addBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const mealId = addBtn.id;
    const response = await fetch(`/meals/add/${addBtn.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealId }),
    });
    addBtn.classList.add('hidden');
    removeBtn.classList.remove('hidden');
  });
}
if (removeBtn) {
  removeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const mealId = addBtn.id;
    const response = await fetch(`/meals/remove/${addBtn.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealId }),
    });
    addBtn.classList.remove('hidden');
    removeBtn.classList.add('hidden');
  });
}
