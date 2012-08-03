
/*
 * GET home page.
 */

var fs = require('fs')
  , worker = require('../worker.js');


var filterMovies = function(m, quality, callback){
	var movies = [];

	for (var i = 0; i < m.length; i++){
		if ((quality == null && m[i].format != 'screener') || (m[i].format == quality))
			movies.push(m[i]);
	}

	callback(movies);
};

exports.index = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		res.render('index', { p: JSON.parse(data) });
	});
};

exports.good = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		filterMovies(JSON.parse(data), null, function(movies){
			res.render('index', { p:  movies});
		});
	});
};

exports.dvd = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		filterMovies(JSON.parse(data), 'dvd rip', function(movies){
			res.render('index', { p:  movies});
		});
	});
};

exports.br = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		filterMovies(JSON.parse(data), 'blu-ray rip', function(movies){
			res.render('index', { p:  movies});
		});
	});
};

exports.screener = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		filterMovies(JSON.parse(data), 'screener', function(movies){
			res.render('index', { p:  movies});
		});
	});
};

