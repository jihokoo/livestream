var Director = require('../models/director')['Director'];
var request = require('request');
var crypto = require('crypto');

exports.showOne = function(req, res){
	var livestream_id = req.params.livestream_id;

	if(livestream_id){
		Director.findOne({livestream_id: livestream_id}, function(err, director){
			// check if director was found based on id provided in url
			if(director){
				res.json(200, director.asJSON());
			} else{
				res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'no user was found matching the provided livestream_id'}));
			}
		});
	} else{
		res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'livestream_id not provided'}));
	}
};

exports.showAll = function(req, res){
	Director.find(function(err, directors){
		// .find function passes back an array
		// check if the array is not empty (has any directors)
		if(err){
			res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': err.message}));
		}
		res.json(200, JSON.stringify(directors));
	});
};

exports.update = function(req, res){
	// Pulling out the md5 hashed full_name from the header
	var header = req.headers['authorization']||'',
    token = header.split(/\s+/).pop()||'';        

  // First check if an 'Authorization' header was included
  if(!header){
  	res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'missing authorization header'}));
  }
  // Check if the 'Authorization' header was correctly formated
  if(!token){
  	res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'incorrect authorization header'}));	
  }

  // Pull parameters off url and form body
	var livestream_id = req.params.livestream_id, 
		favorite_camera = req.body.favorite_camera, 
		favorite_movies = req.body.favorite_movies;

	// check if livestream_id exists
	if(livestream_id){
		Director.findOne({livestream_id: livestream_id}, function(err, director){
			// in case there was an invalid input for the livestream_id parameter
			if(err){
				res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': err.message}));
			}

			if(director){
				// check if the hashed token from the header matches the full_name of the director
				// from the id specified in the url
				var name = director.full_name;
				var hash = crypto.createHash('md5').update(name).digest('hex');
				if(token !== hash){
					res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'incorrect authorization token'}));
				}
				// set values if favorite_movies and favorite_camera fields exist
				if(favorite_movies){
					director.favorite_movies = favorite_movies;
				}
				if(favorite_camera){
					director.favorite_camera = favorite_camera;
				}
				// pass back the new director object
				director.save(function(err, director){
					res.json(200, JSON.stringify({message: 'Updated Successfully', director: director}));
				});
			} else{
				res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'no director was found matching the provided livestream_id'}));
			}
		});
	} else{
		res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'a livestream_id must be provided in the body of the request'}));
	}
};

exports.create = function(req, res){
	var livestream_id = req.body.livestream_id, 
		favorite_camera = req.body.favorite_camera, 
		favorite_movies = req.body.favorite_movies;
	if(req.body.livestream_id){
		Director.findOne({
			livestream_id: livestream_id
		}, function(err, director){
			// in case of error
			if(err){
				res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': err.message}));
			}

			// checking if director account with the specified livestream_id already exists
			if(director){
				res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'there already exists an account with the provided livestream_id', 'body': director}));
			} else{
				request.get('https://api.new.livestream.com/accounts/'+livestream_id, function(a, b, c){
					var response = JSON.parse(c);
					var newDirector;
					// check if we get a valid response from api call
					if(response.name === 'BadRequestError'){
						res.json(response);
					} else{
						newDirector = new Director({
							livestream_id: livestream_id,
							full_name: response.full_name,
							dob: response.dob
						});

						if(favorite_movies){
							newDirector.favorite_movies.push(favorite_movies);
						}
						if(favorite_camera){
							newDirector.favorite_camera = favorite_camera;
						}
						newDirector.save(function(err, director){
							res.json(200, director.asJSON());
						});
					}
				});
			}
		});
	} else{
		res.json(500, JSON.stringify({'name': 'BadRequestError', 'message': 'a livestream_id must be provided in the body of the request'}));
	}
};