var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directorSchema = new Schema({
	livestream_id: {
		type: String,
		required: true,
		unique: true,
		// use livestream_id as a secondary index
		// since all interactions needs id
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
	favorite_movies: [String]
}, { autoIndex: false });

var Director = mongoose.model('Director', directorSchema);
exports.Director = Director;