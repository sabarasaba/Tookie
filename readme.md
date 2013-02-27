[Tookie](http://tookie.jit.su/)
=================

Tookie is a meta-search engine that indexes movie torrents from torrentz and presents all the information in a beautiful and responsive UI. It allows the user to view the information of the latest movies available out there along with the respective metadata (trailer, cast, release date, etc). And it also provides an external link to a .torrent file or a magnet link for downloading the movie.

Tookie runs a worker every 3 hours who indexes all the new movies available in the first pages of torrentz. And then, for each movie found it querys the API v3 of TMDB and gets all the metadata and saves everything on a mongo database.


Live Site
---------

Tookie is currently deployed to nodejitsu. You can check the live site at http://tookie.jit.su/

Configuration
--------------

1. Download/clone the repo
2. Run "npm install"
3. Start the mongodb server
4. Create the following enviroment variables:
	* MONGOHQ_URL : Containing the mongodb connection string
	* tookie_tmdb_apikey : Containing your tmdb api key
5. Run "node app.js"
6. Go to "http://localhost:3000/"

Author
-------

**Ignacio A. Rivas**

+ http://twitter.com/sabarasaba
+ http://github.com/sabarasaba

Copyright and license
---------------------

Licensed under The MIT License (MIT). http://www.opensource.org/licenses/mit-license.php