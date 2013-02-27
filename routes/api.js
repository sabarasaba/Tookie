var mongoose       = require('mongoose')
  , MovieSchema    = require('../models/movie')
  , UserSchema     = require('../models/user')
  , FavsSchema     = require('../models/favs')
  , FeedbackSchema = require('../models/feedback');

var MovieModel    = mongoose.model('Movie', MovieSchema.Movie);
var FeedbackModel = mongoose.model('Feedback', FeedbackSchema.Feedback);
var UserModel     = mongoose.model('User', UserSchema.userSchema);
var FavsModel     = mongoose.model('Favs', FavsSchema.Favs);
var moviesPerPage = 30;

exports.moviesByReleaseDate = function(req, res){
  var pageTo = req.params.page * 30;

  MovieModel.find({ }).sort('-release_date').limit(moviesPerPage).skip(pageTo).execFind(function(err, results){
    if (!err)
      res.render('apiMoviesPaginated', { m:  results });
    else
      console.log('Error: ' + err)
  });
};

exports.moviesByRating = function(req, res){
  var pageTo = req.params.page * 30;

  MovieModel.find({ }).sort('-rating').limit(moviesPerPage).skip(pageTo).execFind(function(err, results){
    if (!err)
      res.render('apiMoviesPaginated', { m:  results });
    else
      console.log('Error: ' + err)
  });
};

exports.movieToFavs = function(req, res){

  var favObject = new FavsModel({
    _movie:  req.params.movieid,
    userID:  req.params.userid
  });

  favObject.save(function(err){
    if (!err){
      console.log('Movie added to favs.');
      res.send('Movie added to favs.');
    }
    else{
      console.log('There was a problem adding the movie to favs.')
      res.send('There was a problem adding the movie to favs');
    }
  });

};

exports.saveFeedback = function(req, res){

  var feedbackObject = new FeedbackModel({
    _movie : req.params.id,
    movieID: req.params.id,
    type: req.params.type,
    description: req.params.description
  });

  feedbackObject.save(function(err){
    if (!err){
      console.log('Feedback saved');
      res.send('Thanks for your feedback!');
    }
    else{
      console.log('There was a problem saving the feedback.')
      res.send('There was a problem saving the feedback.');
    }
  });
};

exports.getMoviesForFeedback = function(req, res){
  FeedbackModel.find({ }).populate('_movie').sort('-modified').exec(function(err, results){
    if (!err){
      console.log(results);
      res.render('apiFeedbacks', { f:  results });
    }
    else{
      console.log('Error: ' + err);
      res.send('There was a problem getting the feedbacks.');
    }
  });
};

exports.makeAdmin = function(req, res){
  var state = (req.params.state == 'true') ? 'admin' : 'user';

  UserModel.update({ 'name': req.params.name }, { $set: { 'role': state } }, function(err){
    if (!err){
      console.log('User "' + req.params.name + '" is now an admin.');
      res.send('User updated.');
    }
    else{
      console.log(err);
      res.send('Error: ' + err);
    }
  });
};

exports.deleteUser = function(req, res){
  UserModel.remove({ 'name': req.params.name }, function(err){
    if (!err){
      console.log('Deleted user "' + req.params.name + '".');
      res.send('User deleted.');
    }
    else{
      console.log(err);
      res.send('Error: ' + err);
    }
  });
};

exports.updateUser = function(req, res){
  UserModel.update({ 'name': req.params.name }, { $set: { 'name': req.body.name, 'email': req.body.email, 'password': req.body.password } }, function(err){
    if (!err){
      console.log('User "' + req.params.name + '" updated.');
      res.send('User updated.');
    }
    else{
      console.log(err);
      res.send('Error: ' + err);
    }
  });
};

exports.updateFeedback = function(req, res){
  MovieModel.update({ '_id': req.params.id }, { $set: { 'url': req.body.url, 'title': req.body.title, 'description': req.body.description, 'genre': req.body.genre, 'poster': req.body.poster, 'posterSmall': req.body.posterSmall, 'posterMedium': req.body.posterMedium, 'rating': req.body.rating, 'releaseDate': req.body.releaseDate, 'format': req.body.format, 'cast': req.body.cast } }, function(err){
    if (!err){
      FeedbackModel.remove({ 'movieID': req.params.id }).populate('_movie').exec(function(err_delete){
        if (!err_delete){
          console.log('Movie "' + req.body.title + '" updated and feedback erased.');
          res.send('Movie updated');
        }
        else{
          console.log('Error: ' + err_delete);
          res.send('Error: ' + err_delete);
        }
      });

    }
    else{
      console.log(err);
      console.log('Error: ' + err);
    }
  });
};

exports.deleteFeedback = function(req, res){
  console.log(req.params.id);

  FeedbackModel.remove({ '_id': req.params.id }, function(err){
    if (!err){
      console.log('Feedback removed.');
      res.send('Feedback removed');
    }
    else{
      console.log('Error: ' + err);
      res.send('Error: ' + err);
    }
  });
};

