
var mongoose = require('mongoose')
  , async = require('async')
  , Director = mongoose.model('Director')

/**
 * Clear database
 *
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      Director.collection.remove(cb)
    }
  ], done)
}
