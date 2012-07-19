var helpers = require('./helpers.js')
  , worker  = require('./worker.js')
  , should  = require('should');

function test(name, fn){
  try {
    fn();
  } catch (err) {
    console.log('    \x1b[31m%s', name);
    console.log('    %s\x1b[0m', err.stack);
    return;
  }
  console.log('  √ \x1b[32m%s\x1b[0m', name);
}  

function isURL(str) {
  var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(str);
}

test('get movie format', function(){
    helpers.getMovieFormat("The Raven 2012 BDRip XviD SCREAM").should.equal('blu-ray rip');
    helpers.getMovieFormat("Assassins Bullet I 2012 DVDRip XviD 4PlayHD").should.equal('dvd rip');
    helpers.getMovieFormat("Snow White and the Huntsman 2012 TS XviD AC3 ADTRG ").should.equal('screener');
    helpers.getMovieFormat("").should.equal('dvd rip');
});

test('get torrent link', function(){
    helpers.gimmeTorrent("http://torrentz.eu/86fd02151f4b54581350661778f779fa867f559c", function(r){
        should.exist(r);
        r.should.include("http");
        //isURL(r).should.be.true();
    });
});

test('fetch movies', function(){
    worker.fetchData();
});