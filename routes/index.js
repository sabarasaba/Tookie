
/*
 * GET home page.
 */

var request = require('request')
  , helpers = require('../helpers.js')
  , async   = require('async');

var torrentz = "http://torrentz.eu";
var imdbAPI = "http://www.imdbapi.com/?i=&t="
var urlContainer = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fsearch%3Ff%3D%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json";
var tzSecUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fsearch%3Ff%3D%26p%3D1%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json";

var urls = [
	"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fsearch%3Ff%3D%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json",
	"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftorrentz.eu%2Fsearch%3Ff%3D%26p%3D1%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'results'%5D%2Fdl%22&format=json"
];

var queryIMDB = function(title, description, callback){
	if (description.indexOf('movies') !== -1)
	{
		request(imdbAPI + title + "&r=json&y=2012", function(error, response, body){
			var imdb = JSON.parse(body);

    		callback(imdb.Poster);
		});
	}
}

var fetchData = function(res){

	async.waterfall(
    [
        // i. Get all movies
        function(callback) {
        	var array = [];

        	async.forEach(urls, function(url, callback){
        		request(urlContainer, function(error, response, body){
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
								
								var element = {url: url, title: title, description: description};

								array.push(element);
							}
							catch(err)
							{
								//console.log("error: " + err);
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
        		callback(null, array);
        	});
        
        },
        
        // ii. Get posters from IMDB
        function(array, callback) {
        	var array2 = [];
        	async.forEach(array, function (movie, callback){ 
        		
			    if (movie.description.indexOf('movies') !== -1)
				{
					request(imdbAPI + movie.title + "&r=json&y=2012", function(error, response, body){
						var imdb = JSON.parse(body);

						if (imdb.Poster != "N/A")
						{
							var element = {url: movie.url, title: imdb.Title, description: imdb.Plot, poster: imdb.Poster, rating: imdb.imdbRating};

							array2.push(element);
						}

						callback();
					});
				}
				else
					callback();

			}, function(err) {
			    callback(null, array2);
			}); 
        }
    ],
	    // the bonus final callback function
	    function(err, status) {
	        res.render('index', { p: status });
	    }
	);
}

exports.index = function(req, res){
  fetchData(res);
};


var pitulin = function(res){
	res.render('test', { t: helpers.tubiega()});
}

exports.test = function(req, res){
	pitulin(res);
};