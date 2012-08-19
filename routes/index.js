

var request = require('request')
  , mongoose    = require('mongoose')
  , MovieSchema = require('../models/movie');

mongoose.connect(process.env.MONGOHQ_URL);

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

exports.find = function(req, res){
  return MovieModel.find({title: new RegExp("^"+req.params.keywords)}).sort('-release_date').limit(30).execFind(function(err, results){
    res.render('find', { u: req.user, m: results, title: req.params.keywords +  ' / ', keywords: req.params.keywords});
  });
};

exports.settings = function(req, res){
  res.render('settings', { u: req.user, title: 'Settings' + ' / ' });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};