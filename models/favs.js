var mongoose = require('mongoose');

var Schema = mongoose.Schema;


exports.Favs = new Schema({
  _movie        : [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  userID        : { type: String },
  created       : { type: Date, default: Date.now }
});