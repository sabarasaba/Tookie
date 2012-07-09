var request = require('request');
var urlbase = 'http://api.themoviedb.org/2.1/';

this.init = function(opts) {
  this.apikey = opts.apikey;
  this.cache = opts.cache;
  return this;
}

this.apikey;

var buildUrl = function(query,method,skipcache) {
  if(!query.lang) query.lang = 'en';
  var url = urlbase+method+'/'+query.lang+'/json/'+exports.apikey+'/'+encodeURIComponent(query.query);
  if(query.year) url += '+'+query.year;
  if(skipcache) return { url: url };

  var key = undefined;
  if(query.query)
    key = 'tmdb:'+method+':'+query.lang+':'+query.query.toLowerCase().replace(/ /g, '_');

  return { url: url, key:key };
}

var buildUrlEmptyQuery = function(method) {
  return { url: urlbase+method+'/en/json/'+exports.apikey };
}

// if query.querystring exists, use it, otherwise loop params
var buildUrlQueryString = function(query, method) {
  if(!query.lang) query.lang = 'en';
  var url = urlbase+method+'/'+query.lang+'/json/'+exports.apikey+'?';
  if(query.querystring)
    return { url: url+query.querystring };

  for(var x in query) {
    if(x != 'lang')
      url=url+'&'+x+'='+query[x];
  }
  return { url: url };
}

this.Movie = {
  // search method. query object like: { query: querystring,year:year,lang:lang }
  search: function(q,callback,skipcache) {
    exports.fetch(buildUrl(q,'Movie.search',skipcache),callback);
  },
  
  // getInfo method. query object like { query: id, lang:lang }
  getInfo: function(q, callback,skipcache) {
    exports.fetch(buildUrl(q,'Movie.getInfo',skipcache),callback);
  },

  // getImages method. query object like { query: id, lang:lang }
  getImages: function(q, callback,skipcache) {
    exports.fetch(buildUrl(q,'Movie.getImages',skipcache),callback);
  },

  // imdbLookup method. query object like { query: id, lang:lang }
  imdbLookup: function(q,callback,skipcache) {
    exports.fetch(buildUrl(q,'Movie.imdbLookup',skipcache),callback);
  },

  browse: function(q,callback) {
    exports.fetch(buildUrlQueryString(q,'Movie.browse'),callback);
  },

  // getLatest methos. no query object
  getLatest: function(callback) {
    exports.fetch(buildUrlEmptyQuery('Movie.getLatest'),callback); 
  },

  // getTranslations method. query object takes id like { query: id }
  getTranslations: function(q,callback) {
    exports.fetch(buildUrl(q,'Movie.getTranslations'),callback);
  },

  // getVersion method. query takes an id or an array of ids, like { query: ['885','550'] } 
  getVersion: function(q, callback) {
    exports.fetch(buildUrl(q,'Movie.getVersion',true),callback);
  }
};

this.Person = {
  getInfo: function(q,callback,skipcache) {
    exports.fetch(buildUrl(q,'Person.getInfo',skipcache),callback);
  },

  getLatest: function(callback) {
    exports.fetch(buildUrlEmptyQuery('Person.getLatest'),callback);
  },

  getVersion: function(q,callback) {
    exports.fetch(buildUrl(q,'Person.getVersion',true), callback);
  },

  search: function(q,callback,skipcache) {
    exports.fetch(buildUrl(q,'Person.search',skipcache), callback);
  }
};

this.Genres = {
  getList: function(callback) {
    exports.fetch(buildUrlEmptyQuery('Genres.getList'), callback);
  }
};

this.fetch = function(url,callback) {
  if(this.cache && url.key) {
    console.log('Looking for URL '+url.url+' from cache with key: '+url.key);
    this.cache.get(url.key,function(err,reply) {
      if(!reply) {
        fetchexternal(url,callback);
        console.log('No cache hit for key: '+url.key+'. Fetching externally.');
      }
      else {
        callback(undefined,JSON.parse(reply));
        console.log('Cache hit for key: '+url.key+'.');
      }
    });
  }
  else {
    console.log('Skipped cache lookup for url: '+url.url+'.');
    fetchexternal(url,callback);
  }
}

var fetchexternal = function(url,callback) {
  request({uri:encodeURI(url.url)}, function(error,response,body) {
    exports.handle(url,error,response,body,callback);
  });
}

exports.handle = function(url, error, response, body, callback, cachekey) {
  var res = null;
  try {
    res = JSON.parse(body);
  }
  catch(e) {
    console.error('Error parsing body. Body was:');
    console.error(body);
    error = 'Error parsing body.';
  }

  if(!error && response.statusCode == 200 && !res.status_code) {
    callback(undefined,res);
    if(this.cache && url.key) {
      this.cache.set(url.key,body);
      console.log('Set value in cache with key: '+url.key);
    }
    return;
  }

  if(!error) {
    switch(res.status_code) {
      case 1: // success
        callback(null,res);
        if(exports.cache && url.key)
          exports.cache.set(url.key,body);
        break;

      case 7: //invalid api key
        callback(res,undefined);
        break;
    }
  }
  else {
    callback(error,res);
  }
}

var fixkey = function(key) {
  return 'tmdb:'+key.replace(' ', '_');
}
