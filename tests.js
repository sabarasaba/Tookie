/* 2 lazy to use automated testssssss, so i hardcoded most of this shit. */

var apiKeyTMDB     = 'dc4940972c268b026150cf7be6f01d11';

var request = require('request')
  , helpers = require('./helpers.js')
  , async   = require('async')
  , tmdb = require('tmdb').init({apikey: apiKeyTMDB})
  , fs = require('fs');

var helpersTest = function(){
	console.log(helpers.getMovieFormat("The Raven 2012 BDRip XviD SCREAM"));
	console.log(helpers.getMovieFormat("Assassins Bullet I 2012 DVDRip XviD 4PlayHD"));
	console.log(helpers.getMovieFormat("Snow White and the Huntsman 2012 TS XviD AC3 ADTRG "));
}

var testFirstLoop= function(){
	var torrentz = "http://torrentz.eu";

	var urls = [
	    "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fmo%2Fmovies-q0%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json"
	];

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
                        console.log("error on the first loop: \n" + err);
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
        console.log(array);
    });
}

var tmdb = function(){
    tmdb.Movie.search({query: "the raven "}, function(err,result) {
	   console.log(result);
	   var index = helpers.getIndexOfMovie(result);
	   console.log("index =" + index);
    });
}

var getIndexOfTracker = function(tracker, array, callback){
    for (var i = 0; i < array.length; i++){
        if (array[i].host.indexOf(tracker) != -1)
            callback(i);
    }
}

var getTorrentWithPriority = function(data, callback){

    getIndexOfTracker("1337x", data, function(index){
        var req_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURI(data[index].url) + "%22%20and%20xpath%3D%22/html/body/div%5B@class%3D%27wrapper%27%5D/div%5B@class%3D%27content%27%5D/div%5B@class%3D%27contentBar%27%5D/div%5B@class%3D%27contentInner%27%5D/div%5B@class%3D%27torrentInfoBox%27%5D/div%5B@class%3D%27torrentInfoBtn%27%5D/a%5B@class%3D%27torrentDw%27%5D%22&format=json";
        request(req_url, function(error, response, body){
            if (!error && response.statusCode == 200){
                var data = JSON.parse(body);
                callback(data.query.results.a.href);
            }
            else
                callback("empty_url");
        });
    });

    /*
    i = getIndexOfTracker("torrentreactor", data);
    if (i != -1){
        return "empty response";
    }

    i = getIndexOfTracker("mnova", data);
    if (i != -1){
        return "empty response";
    }

    return "empty response";
    */
}


var gimmeTorrent = function(url, callback){
    var req_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2F86fd02151f4b54581350661778f779fa867f559c%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'download'%5D%22&format=json";
    var array = [];

    request(req_url, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            try{
                for (var i = 1; i < 20; i++){
                    var element = { host: data.query.results.div.dl[i].dt.a.span[0].content, url: data.query.results.div.dl[i].dt.a.href};
                    array.push(element);
                }
            }
            catch(err){}

            getTorrentWithPriority(array, function(torrent){
                callback(torrent);
            });
        }
        else
            console.log("Error on request: " + error);
    });
}

gimmeTorrent("http://torrentz.eu/86fd02151f4b54581350661778f779fa867f559c", function(r){
    console.log(r);
});