[Tookie](http://tookie.jit.su/)
=================

Tookie was my first application written in node.js. It allows you to see the latest movies from torrentz with a much more functional and responsive UI. The whole thing was designed at first to use a worker and a web app, but due to the lack of money that I had at the moment for buying a new dyno in heroku, its all running on the same app. 
Every 3 hours the app runs "a worker" which does a data scrapping process on torrentz and for each founded movie, it gets the metadata from TMDB, the trailer from youtube and their own .magnet link to download the movie. All this presented in a clean, sober and functional UI suitable for mobiles also.

Live Site
---------

Tookie is currently deployed to nodejitsu. You can check the live site at http://tookie.jit.su/

Author
-------

**Ignacio A. Rivas**

+ http://twitter.com/sabarasaba
+ http://github.com/sabarasaba

Copyright and license
---------------------

All under the GNU General Public License V3, see [license.txt](https://github.com/sabarasaba/Tookie/blob/master/license.txt)