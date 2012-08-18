

var request = require('request')
  , mongoose    = require('mongoose')
  , MovieSchema = require('../models/movie');

mongoose.connect('mongodb://localhost:27017/tookie');

var MovieModel = mongoose.model('Movie', MovieSchema.Movie);


exports.index = function(req, res){
	return MovieModel.find({ }).sort('-release_date').limit(30).execFind(function (err, movie){
    	if (!err)
      		res.render('index', { m:  movie, u: req.user, title: ''});
    	else
      		return console.log(err);
  	});
};

exports.getMovie = function(req, res){
	MovieModel.findById(req.params.id, function (err, doc) {
    	if (!err)
      		res.render('movie', { mf: doc, u: req.user, title: doc.title + ' / '});
    	else
      		console.log(err);
  	});
};

exports.about = function(req, res){
  res.render('about', { u: req.user, title: 'About' + ' / '});
}