# Livestream Project

### Used [Mocha](https://github.com/visionmedia/mocha) and [Supertest](https://github.com/visionmedia/supertest) used for Testing

#### Endpoints are

* Show All (get): '/directors'
* Show One (get): '/directors/:livestream_id'
* Create One (post): '/directors'

	body:

	{
		livestream_id: required,
		favorite_movies: optional,
		favorite_camera: optional
	}

* Update One (put): '/directors/:livestream_id'

	header:

	{
		Authorization: 'Bearer md5(full_name of account)'
	}

	body:

	{	
		favorite_movies: optional,
		favorite_camera: optional
	}