
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , worker = require('./worker.js');

var tickTime = 10800000; //3 hours

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use("/cache", express.static(__dirname + '/cache'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

/* I can't afford to buy a new dynos in heroku to run this worker, so I run it directly in the current app. */
setInterval(function () {
    worker.fetchData();
}, tickTime);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
