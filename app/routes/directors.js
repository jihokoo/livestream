var express = require('express');
var router = express.Router();
var directors = require('../controllers/directors');

router.get('/', directors.showAll);
router.post('/', directors.create);
router.get('/:livestream_id', directors.showOne);
router.put('/:livestream_id', directors.update);

module.exports = router;

/*

request.post('http://localhost:3000/directors', {form: {livestream_id: 6488818 
}}, function(a, b, c){
	console.log(b.toJSON());
});

var request = require('request');
request.post('http://localhost:3000/directors', {form: {livestream_id: 6488818}}, function(a, b, c){
	console.log(c);
});


var request = require('request');
request.put({url: 'http://localhost:3000/directors/6488818', headers: {Authorization: 'Bearer 10f607392e9e569848a4f03a8cc206ff', 'Content-Type': 'application/x-www-form-urlencoded'}}, function(a, b, c){
	console.log(c);
});
*/