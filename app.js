// hello

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , eng = require('ejs-locals')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , passport = require('passport')
  , worker = require('./worker.js')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose    = require('mongoose')
  , userModel = require('./models/user');



var tickTime = 10800000; //3 hours

var User = mongoose.model('User', userModel.userSchema);


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ name: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


var app = express();

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.engine('ejs', eng);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());


  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat dawg', cookie: { maxAge: 43200000 } }));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// General Routes

app.get('/', routes.index);

app.get('/about', routes.about);

app.get('/changelog', routes.changelog);

// User Routes

app.get('/login', routes.login);

app.get('/register', routes.register);

app.get('/forgotpassword', routes.forgot)

app.get('/resetPassword/:id/:token', routes.saveNewPassword);

app.get('/user/:name', routes.user);

app.get('/logout', routes.logout);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), routes.postLogin);

app.post('/register', routes.postRegister);

app.post('/forgotPassword', routes.forgotPassword);

app.get('/au', api.au);

// Admin Panel

app.get('/admin/dashboard', requireRole('admin'), routes.adminDashboard);

app.get('/admin/feedbacks', routes.adminFeedbacks);

app.get('/admin/users', requireRole('admin'), routes.adminUsers);

app.get('/admin/user/edit/:name', requireRole('admin'), routes.adminEditUser);

app.get('/admin/feedback/solve/:id', requireRole('admin'), routes.adminSolveFeedback);

app.get('/admin/movie/edit/:id', requireRole('admin'), routes.adminEditMovie);


// Movies Routes

app.get('/search', routes.search);

app.get('/search/release-date', routes.search);

app.get('/search/added-date', routes.search);

app.get('/search/top', routes.search);

app.get('/movie/:id', routes.getMovie);

app.get('/movie/feedback/:id', routes.getFeedback);

app.get('/movie/feedback/:id/:type/:description', api.saveFeedback);


// Handle deprecated URI'S
app.get('/m/:id', function(req, res){
  res.redirect('/movie/' + req.params.id);
});


// API Routes.

app.get('/api/movie-to-favs/:userid/:movieid', api.movieToFavs);

app.post('/api/search-movie/:page', api.moviesSearch);

app.get('/api/movies-by-releasedate/:page', api.moviesByReleaseDate);

app.get('/api/movies-by-addeddate/:page', api.moviesByAddedDate);

app.get('/api/movies-by-rating/:page', api.moviesByRating);

app.get('/api/admin/moviesForFeedback', requireRole('admin'), api.getMoviesForFeedback);

app.post('/api/admin/updateUser/:name', requireRole('admin'), api.updateUser);

app.get('/api/admin/makeAdmin/:name/:state', requireRole('admin'), api.makeAdmin);

app.get('/api/admin/deleteUser/:name', requireRole('admin'), api.deleteUser);

app.post('/api/admin/updateFeedback/:id/:user', requireRole('admin'), api.updateFeedback);

app.post('/api/admin/updateMovie/:id', requireRole('admin'), api.updateMovie);

app.get('/api/admin/deleteMovie/:id', requireRole('admin'), api.deleteMovie);

app.get('/api/admin/deleteFeedback/:id', requireRole('admin'), api.deleteFeedback);

app.get('/api/resetPassword/:id/:token/:password', api.resetPassword)



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};

function requireRole(role) {
  return function(req, res, next) {
    if(req.user && req.user.role === role)
      next();
    else
      res.redirect('/');
  }
};


setInterval(function () {
    worker.fetchData();
}, tickTime);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
