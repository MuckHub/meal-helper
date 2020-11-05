const express = require('express');
const router = express.Router();
const favouritesController = require('../controllers/favourites');

router.get('', favouritesController.render);

module.exports = router;
