var mongoose = require('mongoose');

var Schema = mongoose.Schema;


exports.Movie = new Schema({
  id            : { type: String },
  url           : { type: String },
  title         : { type: String },
  description   : { type: String },
  genre         : { type: String },
  poster        : { type: String },
  poster_small  : { type: String },
  poster_medium : { type: String },
  rating        : { type: String },
  release_date  : { type: Date   },
  format        : { type: String },
  id            : { type: String },
  cast          : { type: String },
  default_url   : { type: String },
  modified      : { type: Date, default: Date.now }
});