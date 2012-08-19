/* In order to run the test you should first do npm install -g nodeunit and then run "nodeunit tests.js" */

var apiKeyTMDB     = process.env.tookie_tmdb_apikey;

var helpers  = require('../helpers.js')
  , worker   = require('../worker.js')
  , tmdb     = require('../libs/tmdb').init(apiKeyTMDB)
  , testCase = require('nodeunit').testCase;

function isURL(str) {
  var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(str);
}

exports.testGetMovieFormats = function(test){
    test.equal(helpers.getMovieFormat("The Raven 2012 BDRip XviD SCREAM"), "blu-ray rip", "this assertion should pass");
    test.equal(helpers.getMovieFormat("Assassins Bullet I 2012 DVDRip XviD 4PlayHD"), "dvd rip", "this assertion should pass");
    test.equal(helpers.getMovieFormat("Snow White and the Huntsman 2012 TS XviD AC3 ADTRG"), "screener", "this assertion should pass");

    test.done();
};

exports.testSanitizeTitles = function(test){
  test.equal(helpers.sanitizeTitle("StreetDance 2 DVDRip XviD DoNE"), "streetdance 2 ", "this assert should pass");

  test.done();
};

exports.testGetYearFromDirtyTitle = function(test){
  test.equal(helpers.getYearFromDirtyTitle("The Avengers 2012 TS XviD AC3 ADTRG"), "2012", "this assert should pass");

  test.done();
};

exports.testGetTorrentLink = function(test){
  var url = 'http://torrentz.eu/ab797cdd79fd0ff532f44e6db009b4ba57f0be1a';

  helpers.gimmeTorrent(url, function(torrent){
    test.equal(url, torrent, "this assert should pass");

    test.done();
  });
};

worker.fetchData();