var mongoose = require('mongoose');

var Schema = mongoose.Schema;


exports.Feedback = new Schema({
  _movie        : [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  movieID       : { type: String },
  type          : { type: String },
  description   : { type: String },
  modified      : { type: Date, default: Date.now }
});