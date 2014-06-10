var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// router.get('/directors/all')
// list the directors registered on your platform
// all attributes (fullname, DOB, favorite_camera, favorite_movies)
// for each director should be returned

// router.get('/directors/:id', )
// get individual

// router.put('/directors/:id/')
// update an individual account
// as a bonus:
// make sure the user authenicates
// him/herself with the following header
// Authorization: Bearer md5(FullNameOfTheAccountToModify) 
// Example: Authorization: Bearer 1bef1e4f8ea440a6323f9d25a5b4bd1b
// md5 is a hashing mechanism

// router.post('/directors/:id')
// create an individual account

// router.delete('/directors/:id')


module.exports = router;