const express = require('express');
const router = express.Router();
const popularController = require('../controllers/popular');

router.get('', popularController.render);

module.exports = router;
