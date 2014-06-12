var express = require('express');
var router = express.Router();
var directors = require('../controllers/directors');

router.get('/', directors.showAll);
router.post('/', directors.create);
router.get('/:livestream_id', directors.showOne);
router.put('/:livestream_id', directors.update);

module.exports = router;