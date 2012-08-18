

var request = require('request')
  , mongoose    = require('mongoose')
  , MovieSchema = require('../models/movie');

//mongoose.connect('mongodb://localhost:27017/tookie');

var MovieModel = mongoose.model('Movie', MovieSchema.Movie);


exports.index = function(req, res){

};

exports.getPaginated = function(req, res){
	MovieModel.find({ }).sort('-release_date').limit(req.params.to).skip(req.params.from).execFind(function(err, results){
		//res.send(results);
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