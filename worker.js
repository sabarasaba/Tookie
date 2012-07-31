var apiKeyTMDB     = 'dc4940972c268b026150cf7be6f01d11';
exports.cacheDirectory = './cache/data';
exports.cacheLogDir = './cache/logs.txt';

var cacheDirectory = '/cache/data';
var cacheLogDir = '/cache/logs.txt';

var request = require('request')
  , helpers = require('./helpers.js')
  , async   = require('async')
  , tmdb = require('./libs/tmdb').init(apiKeyTMDB)
  , fs = require('fs');

var torrentz = "http://torrentz.eu";

var urls = [
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q0%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json",
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q1%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json",
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q2%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json"
];

var getMetadataFromMovie = function(movie, callback){
  tmdb.search.movie(movie.title, function(errr,res) {
    try{
        if (res != null)
        {
              var index = helpers.getIndexOfMovie(res.results, helpers.getYearFromDirtyTitle(movie.dirty_title));
              if (res.results[index] != undefined && res.results[index] != null)
              {
                  tmdb.movie.info(res.results[index].id, function(err,res) {
                    if (res != null)
                    {
                        var genre = "undefined";
                        if (res.genres[0] != null)
                            genre = res.genres[0].name;

                        callback({ title: res.original_title, genre: genre, score: res.vote_average, poster: "http://cf2.imgobject.com/t/p/w342" + res.poster_path, overview: res.overview, released: res.release_date});
                    }
                    else
                        callback(null);
                  });
              }
              else
                callback(null);
        }
        else
        {
            callback(null);
        }
    } catch(err) { }
  });
}

exports.fetchData = function(){

    async.waterfall(
    [
        // i. Get all movies
        function(callback) {
            var array = [];

            async.forEach(urls, function(url, callback){
                request(url, function(error, response, body){
                    if (!error && response.statusCode == 200) 
                    {
                        for (var i = 0; i < 60; i++) 
                        {
                            try
                            {
                                var data = JSON.parse(body);
                                var url = torrentz + data.query.results.dl[i].dt.a.href;
                                var title = helpers.sanitizeTitle(data.query.results.dl[i].dt.a.content);
                                var description = data.query.results.dl[i].dt.content;
                                var dirty_title = data.query.results.dl[i].dt.a.content;
                                
                                var element = {url: url, title: title, description: description, dirty_title: dirty_title, id: i + array.length};

                                array.pushIfNotExist(element, function(e) { 
                                    return e.title.toLowerCase() === element.title.toLowerCase(); 
                                });
                            }
                            catch(err)
                            {
                                //console.log("Error scrapping data from torrentz: \n" + err);
                            }
                        }

                        callback();
                    }
                    else
                    {
                        callback();
                    }
                });
            }, function(err){
                if (err)
                    console.log('herp derp trying to collect data from torrentz: ' + err);
                callback(null, array);
            });
        
        },
        
        // ii. Get posters from IMDB
        function(array, callback) {
            var array2 = [];
            async.forEach(array, function (movie, callback){ 
                getMetadataFromMovie(movie, function(data){
                    if (data != null)
                    {
                        helpers.gimmeTorrent(movie.url, function(torrent){
                            var element = { url: torrent
                                          , title: data.title
                                          , description: data.overview
                                          , genre: data.genre
                                          , poster: data.poster
                                          , rating: data.score
                                          , release_date: data.released
                                          , format: helpers.getMovieFormat(movie.dirty_title)
                                          , id : movie.id};

                            array2.pushIfNotExist(element, function(e){
                                return e.title.toLowerCase() === element.title.toLowerCase();
                            });

                            callback();
                        });
                    }
                    else
                    {
                        callback();
                    }
                });

            }, function(err) {
                if (err)
                    console.log("herp derp trying to fetch data from tmdb: " + err);

                callback(null, array2.sort(function(a,b){
                    return (new Date(b.release_date) - new Date(a.release_date));
                }));
            });             
        }
    ],
        // the bonus final callback function
        function(err, status) {
            if (err)
                console.log("Error wrapping up movies: " + err);

            console.log('Indexed movies: ' + status.length);
            
            fs.writeFile(__dirname + cacheDirectory, JSON.stringify(status), function(err) {
                if(err) {
                    console.log(err);
                } else 
                {
                    fs.open(__dirname + cacheLogDir, 'a', 666, function( e, id ) {
                        fs.write( id, 'created new cache file at: ' + new Date() + '\n', null, 'utf8', function(){
                            fs.close(id, function(){
                                console.log("Cache file updated !");
                            });
                        });
                    });
                }
            }); 
        }
    );
}