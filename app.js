

var express = require('express')
  , routes = require('./routes')
  , apiRoutes = require('./routes/api')
  , http = require('http')
  , passport = require('passport')
  , util = require('util')
  , eng = require('ejs-locals')
  , FacebookStrategy = require('passport-facebook').Strategy;


/* FB login shit */
var FACEBOOK_APP_ID = "399936936740982"
var FACEBOOK_APP_SECRET = "43ce8afd0b292bad703f70349d896835";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.engine('ejs', eng);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  /* FB login shit */
  app.use(express.session({ secret: 'tubiega en tanga' }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

console.log("mongourl      : " + process.env.MONGOHQ_URL);
console.log("tmdb api      : " + process.env.tookie_tmdb_apikey);
console.log("fb-api id     : " + process.env.tookie_fb_api_id);
console.log("fb-api secret : " + process.env.tookie_fb_api_secret);

// Index
app.get('/', routes.index);

// Get one movie
app.get('/m/:id', routes.getMovie);

// Get about page
app.get('/about', routes.about);

app.get('/find/:keywords', routes.find);

// API: Index
app.get('/api/', apiRoutes.index);

// API: Get bad movies
app.get('/api/getPaginated/:from/:to', apiRoutes.getPaginated);

// API: Get all movies
app.get('/api/getAllMovies', apiRoutes.getAllMovies);

// API: Get good movies
app.get('/api/getGoodMovies', apiRoutes.getAllMovies);

// API: Get bad movies
app.get('/api/getBadMovies', apiRoutes.getAllMovies);

app.get('/api/findMovies/:movie', apiRoutes.findMovies);



app.get('/u/settings', ensureAuthenticated, function(req, res){
  res.render('settings', { u: req.user, title: 'Settings' + ' / ' });
});

app.get('/auth/facebook',
  passport.authenticate('facebook', {display: [ 'popup' ], scope: [ 'email', 'user_videos' ] }),
  function(req, res){
});

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/u/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
