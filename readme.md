[Tookie](http://tookie.jit.su/)
=================

Tookie is a meta-search engine who indexes movie torrents from torrentz and presents all the information in a beautiful and responsive UI. It allows the user to view the information of the latest movies available out there along with the respective metadata (trailer, cast, release date, etc). And it also provides an external link who might contain a .torrent file or a magnet link for downloading the movie.

Every 3 hours the app runs "a worker" which does a data scrapping process on torrentz and for each founded movie, gets the respective metadata using the API v3 of TMDB, the trailer from youtube and the .magnet link to download the movie. All this presented in a clean, sober and functional UI suitable for mobiles also.

The whole thing was designed at first to use a worker and a web app in separate dynos, but due to the lack of money that I had at the moment for buying a new dyno in heroku, its all running on the same app. 

Live Site
---------

Tookie is currently deployed to nodejitsu. You can check the live site at http://tookie.jit.su/

Configuration
--------------

1. Download/clone the repo
2. Run "npm install"
3. Start the mongodb server
4. Create the following enviroment variables:
	* MONGOHQ_URL : Containing the mongodb connectionstring
	* tookie_tmdb_apikey : Containing your tmdb api key
	* tookie_fb_api_id : Containing your facebook api id
	* tookie_fb_api_secret : Containing your facebook api secret key
5. Run "node tests/test.js" in order to make the first data scrapping process.
6. Run "node app.js"
7. Go to "http://localhost:3000/"

Author
-------

**Ignacio A. Rivas**

+ http://twitter.com/sabarasaba
+ http://github.com/sabarasaba

Copyright and license
---------------------

Licensed under The MIT License (MIT). http://www.opensource.org/licenses/mit-license.php