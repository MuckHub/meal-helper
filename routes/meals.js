const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meals');

router.get('/:name', mealsController.render);
router.get('/detailed/:id', mealsController.renderDetailed);

router.post('/add/:id', mealsController.add);
router.post('/remove/:id', mealsController.remove);

module.exports = router;
