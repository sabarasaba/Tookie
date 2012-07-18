var apiKeyTMDB     = 'dc4940972c268b026150cf7be6f01d11';
exports.cacheDirectory = './cache/data';
exports.cacheLogDir = './cache/logs.txt';

var cacheDirectory = '/cache/data';
var cacheLogDir = '/cache/logs.txt';

var request = require('request')
  , helpers = require('./helpers.js')
  , async   = require('async')
  , tmdb = require('tmdb').init({apikey: apiKeyTMDB})
  , fs = require('fs');

var torrentz = "http://torrentz.eu";

var urls = [
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q0%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json",
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q1%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json",
    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q2%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json"
];

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
                                //console.log("error on the first loop: \n" + err);
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
                    console.log("first error on callback: " + err);
                callback(null, array);
            });
        
        },
        
        // ii. Get posters from IMDB
        function(array, callback) {
            var array2 = [];
            async.forEach(array, function (movie, callback){ 
                
                    tmdb.Movie.search({query: movie.title}, function(err,result) {
                        var poster = "";

                        try
                        {
                            if (result != null)
                            {
                                var index = helpers.getIndexOfMovie(result);

                                if (result[index].posters.length >= 3)
                                    poster = result[index].posters[3].image.url;
                                else
                                    poster = result[index].posters[result[index].posters.length - 1].image.url;

                                helpers.gimmeTorrent(movie.url, function(torrent_url){
                                    var element = { url: torrent_url
                                                  , title: result[index].name
                                                  , description: result[index].overview
                                                  , poster: poster
                                                  , rating: result[index].rating
                                                  , release_date: result[index].released
                                                  , format: helpers.getMovieFormat(movie.dirty_title)
                                                  , id : movie.id};

                                    array2.pushIfNotExist(element, function(e) { 
                                        return e.title.toLowerCase() === element.title.toLowerCase(); 
                                    });
                                    //array2.push(element);
                                });
                            }
                        }
                        catch(err)
                        {
                            //console.log("error on the second loop: \n" + err);
                            poster = "";
                        }

                        callback();
                    });

            }, function(err) {
                if (err)
                    console.log("seccond error on callback: " + err);
                callback(null, array2.sort(function(a,b){
                    return (new Date(b.release_date) - new Date(a.release_date));
                }));
            }); 
        }
    ],
        // the bonus final callback function
        function(err, status) {
            if (err)
                console.log("error on finish: " + err);
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