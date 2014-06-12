var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , Director = mongoose.model('Director')
  , agent = request.agent(app);

describe('Directors controller', function () {

  /**
   * Clear the database before beginning each run
   */
  before(function (done) {
    require('./helper').clearDb(done)
  })


  describe('GET /directors', function () {

    /**
     * Make sure we return json
     * Make sure response is empty array since db is empty
     */
    it('should respond with Content-Type text/json', function (done) {
      agent
      .get('/directors')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res) {
        var response = JSON.parse(res.body);
        // response is the JSON return object
        response.should.be.an.instanceOf(Array);
        response.length.should.equal(0);
      })
      .end(done);
    });


    /**
     * Save a director in the database using our model and then retrieve it
     * using the GET /directors
     *
     */
    it('should return a director if there is one in the DB', function (done) {
      var director = new Director({full_name: 'Martin Scorsese', livestream_id: '6488818', dob: '1942-11-17T00:00:00.000Z'});
      director.save(function(err) {
        agent
          .get('/directors')
          .expect(200)
          .expect(function(res) {
            var response = JSON.parse(res.body);
            response.should.be.an.instanceOf(Array);
            response[0].full_name.should.equal('Martin Scorsese');
          })
          .end(done);
      });
    });

    /**
     * Save a second director in the database using our model and then retrieve it
     * using the GET /directors
     *
     */
    it('should return a director if there is one in the DB', function (done) {
      var director = new Director({full_name: 'James Cameron', livestream_id: '6488824', dob:'1954-08-16T00:00:00.000Z'});
      director.save(function(err) {
        agent
          .get('/directors')
          .expect(200)
          .expect(function(res) {
            var response = JSON.parse(res.body);
            response.should.be.an.instanceOf(Array);
            response[0].full_name.should.equal('Martin Scorsese');
            response[1].full_name.should.equal('James Cameron');
          })
          .end(done);
      });
    });
  });


  /**
   * Search for directors by livestream_id
   */
  describe('GET /directors/:livestream_id', function () {
    var director;

    // create another director for test
    before(function(done) {
      director = new Director({full_name: 'Steven Spielberg', livestream_id: '6488834', dob: '1946-12-18T00:00:00.000Z'});
      director.save(done);
    });

    /**
     * This is a proper GET /directors/livestream_id request
     * where we search by the livestream_id of the director created above
     */
    it('should return the JSON of the director based on the livestream_id', function (done) {
      agent
        .get('/directors/' + director.livestream_id)
        .expect(200)
        .expect(function(res) {
          var response = JSON.parse(res.body);
          response.full_name.should.equal('Steven Spielberg');
        })
        .end(done);
    });

    /**
     * Here we pass in a bad livestream_id to the URL, we should get a 500 error
     */
    it('should return a 500 error if the ID is not correct', function (done) {
      agent
        .get('/directors/' + '821083012083012983')
        .expect(500)
        .expect(function(res) {
          var response = JSON.parse(res.body);
          response.message.should.equal('no user was found matching the provided livestream_id');
        })
        .end(done);
    });
  });

  /**
   * Series of tests to test creation of new Directors using a POST
   * Request to /directors
   */
  describe('POST /directors', function () {

    /**
     * Test the creation of an director through endpoint
     *
     */
    it('should be able to create a new Director', function (done) {
      agent
        .post('/directors')
        .send({'livestream_id': '648889'})
        .expect(200)
        .expect(function(res) {
          var response = JSON.parse(res.body);
          response.full_name.should.equal('Theresa Ellru Solberg');
        })
        .end(done);
    });

    // This one should fail with a 500 because we don't set the director.body
    it('should be not be able to create a new Director without a livestream_id', function (done) {
      agent
        .post('/directors')
        .expect(500)
        .end(done);
    });

    // Check if the directors were actually saved to the database
    it('should check that the last two posts saved to the DB', function (done) {
      Director.findOne({livestream_id: '648889'}, function(err, director) {
        director.full_name.should.equal('Theresa Ellru Solberg');
        director.should.be.an.instanceOf(Director);
        done();
      });
    });
  });


  /**
   * Series of tests to test updating of directors using a PUT
   * Request to /directors/:livestream_id
   */
  describe('PUT /directors', function () {
    var director;

    before(function(done) {
      Director.findOne({livestream_id: '6488824'}, function(err, _director) {
        director = _director;
        done();
      });
    });

    /**
     * Test the updating of an director
     *
     */
    it('should be able to update an director', function (done) {
      agent
        .put('/directors/' + director.livestream_id)
        .set('Authorization', 'Bearer 0c1f04161f135b59960cc73854c46177')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({'favorite_movies': 'Titanic'})
        .expect(200)
        .expect(function(res) {
          var response = JSON.parse(res.body);
          response.message.should.equal('Updated Successfully');
          response.director.favorite_movies[0].should.equal('Titanic');
          response.director.full_name.should.equal('James Cameron');
        })
        .end(done);
    });
  });
});