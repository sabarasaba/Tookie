
/*
 * GET home page.
 */

var fs = require('fs')
  , worker = require('../worker.js');

exports.index = function(req, res){
	fs.readFile(worker.cacheDirectory, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		res.render('index', { p: JSON.parse(data) });
	});
};