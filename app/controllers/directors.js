var Director = require('../models/director');
var request = require('request');
// make sure to return in jsonp

exports.showOne = function(req, res){
	var livestream_id = req.params.livestream_id;
	if(livestream_id){
		Director.findOne({livestream_id: livestream_id}, function(err, director){
			if(director){
				res.jsonp(director);
			} else{
				res.jsonp({'name': 'BadRequestError', 'message': 'no user was found matching the provided livestream_id'});
			}
		});
	} else{
		res.jsonp({'name': 'BadRequestError', 'message': 'livestream_id not provided'});
		// send back an error message when
		// livestream_id is not provided
	}
};

exports.showAll = function(req, res){
	Director.find(function(err, directors){
		if(directors){
			res.jsonp(directors);
		} else{
			res.jsonp({'name': 'BadRequestError', 'message': 'no directors have an account'});
		}
	});
};

exports.update = function(req, res){
	var livestream_id = req.params.livestream_id;
	var favorite_camera = req.body.favorite_camera;
	var favorite_movie = req.body.favorite_movie;
	if(livestream_id){
		Director.findOne({livestream_id: livestream_id}, function(err, director){
			if(director){
				if(favorite_movie){
					director.favorite_movie = favorite_movie;
				}
				if(favorite_camera){
					director.favorite_camera = favorite_camera;
				}
				director.save(function(err, director){
					res.jsonp(director);
				})
			} else{
				res.jsonp({'name': 'BadRequestError', 'message': 'no director was found matching the provided livestream_id'});
			}
		});
	} else{
		res.jsonp({'name': 'BadRequestError', 'message': 'a livestream_id must be provided in the body of the request'});
	}
};

exports.create = function(req, res){
	var livestream_id = req.body.livestream_id;
	var favorite_camera = req.body.favorite_camera;
	var favorite_movie = req.body.favorite_movie;
	var newDirector;
	if(req.body.livestream_id){
		request.get('https://api.new.livestream.com/accounts/'+livestream_id, function(a, b, c){
			var response = JSON.parse(c);
			Director.findOne({
				livestream_id: livestream_id
			}, function(err, director){
				if(director){
					res.jsonp({'name': 'BadRequestError', 'message': 'there already exists an account with the provided livestream_id'});
				} else{
					newDirector = new Director({
						livestream_id: livestream_id,
						full_name: response.full_name,
						dob: response.dob,
						favorite_movie: favorite_movie,
						favorite_camera: favorite_camera
					});
					newDirector.save(function(err, director){
						res.jsonp(director);
					});
				}
			});
		});
	} else{
		res.jsonp({'name': 'BadRequestError', 'message': 'a livestream_id must be provided in the body of the request'});
	}
};