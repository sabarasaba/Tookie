
/*
 * GET home page.
 */

var fs = require('fs');

var cacheDirectory = './cache/data';


exports.index = function(req, res){
	fs.readFile(cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		res.render('index', { p: JSON.parse(data) });
	});
};