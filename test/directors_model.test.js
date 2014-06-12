var mongoose = require('mongoose')
  , should = require('should')
  , Director = mongoose.model('Director')


/**
 *
 * These tests describe the model that set up in app/models/director.js
 *
 */
describe('Directors', function () {

  /**
   * Model should have three requried fields: full_name, livestream_id, and dob
   * has two optional fields: favorite_movies, favorite_camera
   */
  it('should have a title and body field of String', function (done) {
    var director = new Director({full_name: 'Martin Scorsese', livestream_id: '6488818', dob: '1942-11-17T00:00:00.000Z'});
    director.save(function(err, director) {
      director.full_name.should.equal('Martin Scorsese');
      done(err);
    });
  });

  it('should require livestream_id, dob, and full_name', function (done) {
    var director = new Director({full_name: 'Martin Scorsese', livestream_id: '6488818'});
    director.save(function(err) {
      err.message.should.equal("Validation failed");
      done();
    });
  });

  /**
   * Need an instance method to respond with json
   */
  it('should have an instance method to get itself as JSON', function(done) {
    Director.findOne({livestream_id: '6488818'}, function(err, director) {
      var jsonDirector = director.asJSON();
      jsonDirector.should.match(/"livestream_id": "6488818"/);
      done(err);
    });
  });
});