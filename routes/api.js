

var request = require('request')
  , mongoose    = require('mongoose')
  , MovieSchema = require('../models/movie');

// API should only be used once the index page its loaded, so we shouldnt open a connection here.

var MovieModel = mongoose.model('Movie', MovieSchema.Movie);


exports.index = function(req, res){

};

exports.getPaginated = function(req, res){
	MovieModel.find({ }).sort('-release_date').limit(req.params.to).skip(req.params.from).execFind(function(err, results){
		res.render('apiPaginated', { m:  results });
	});
};

exports.getAllMovies = function(req,res){
	MovieModel.find({ }).sort('-release_date').execFind(function(err, results){
		res.send(results);
	});
};

exports.getGoodMovies = function(req,res){

};

exports.getBadMovies = function(req,res){

};

exports.findMovies = function(req, res){
	MovieModel.find({title: new RegExp('^'+ req.params.keywords + '$',"i")}).sort('-release_date').limit(req.params.to).skip(req.params.from).execFind(function(err, results){
		res.render('apiPaginated', { m:  results });
	});
};