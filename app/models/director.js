var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/livestream');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("mongoose connection is open")
});

var Schema = mongoose.Schema;

var join = function(a){
  return a.join();
};

var directorSchema = new Schema({
	livestream_id: {
		type: String,
		required: true,
		unique: true,
		// use livestream_id as a secondary index
		// for faster lookup
		index: true
	},
	full_name: {
		type: String,
		required: true
	},
	dob: {
		type: String,
		required: true
	},
	favorite_camera: String,
	favorite_movies: {type: [String], get: join}
}, { autoIndex: false });

directorSchema.methods = {
  asJSON: function(){
    return JSON.stringify(this, null, " ");
  }
};

var Director = mongoose.model('Director', directorSchema);
exports.Director = Director;