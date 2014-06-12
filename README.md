# Livestream Project

### Used [Mocha](https://github.com/visionmedia/mocha) and [Supertest](https://github.com/visionmedia/supertest) used for Testing

#### Start

* Make sure to have [MongoDB](http://www.mongodb.org/downloads) installed
* Run `mongod&` in the terminal to run database in the background
* Run `npm install` to install dependencies
* Run `npm test` to see tests execute in the terminal
* Run `npm start` to run program on local machine without testing

#### Endpoints are

* Show All (get): '/directors'
* Show One (get): '/directors/:livestream_id'
* Create One (post): '/directors'
```javascript
body:
{
	livestream_id: required,
	favorite_movies: optional,
	favorite_camera: optional
}
```
* Update One (put): '/directors/:livestream_id'
```javascript
header:
{
	Authorization: 'Bearer md5(full_name of account)'
}

body:
{	
	favorite_movies: optional,
	favorite_camera: optional
}
```