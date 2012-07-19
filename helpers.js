var request = require('request');

var getIndexOfTracker = function(tracker, array, callback){
    for (var i = 0; i < array.length; i++){
        if (array[i].host.indexOf(tracker) != -1)
            callback(i);
    }
}

var getTorrentWithPriority = function(data, callback){
    //l337x
    getIndexOfTracker("torrentreactor", data, function(index){
        //var req_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURI(data[index].url) + "%22%20and%20xpath%3D%22/html/body/div%5B@class%3D%27wrapper%27%5D/div%5B@class%3D%27content%27%5D/div%5B@class%3D%27contentBar%27%5D/div%5B@class%3D%27contentInner%27%5D/div%5B@class%3D%27torrentInfoBox%27%5D/div%5B@class%3D%27torrentInfoBtn%27%5D/a%5B@class%3D%27magnetDw%27%5D%22&format=json";
        var req_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20%22" + encodeURI(data[index].url) + "%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40id%3D'body'%5D%2Fdiv%5B%40id%3D'page'%5D%2Fdiv%5B%40id%3D'content'%5D%2Fdiv%5B%40id%3D'container'%5D%2Fdiv%5B%40id%3D'main'%5D%2Fdiv%5B%40class%3D'buttons2'%5D%2Fa%5B%40class%3D'js-download-link'%5D%22&format=json";
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

exports.gimmeTorrent = function(url, callback){
    var req_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURI(url)+"%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%5B%40class%3D'download'%5D%22&format=json";
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
            catch(err){ }

            getTorrentWithPriority(array, function(torrent){
                callback(torrent);
            });
        }
        else
            console.log("Error on gimmeTorrent: " + error);
    });
}


// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

exports.getMovieFormat = function(title){
    if (title.toLowerCase().indexOf(" ts ")   != -1 ||
        title.toLowerCase().indexOf("dvdscr") != -1 ||
        title.toLowerCase().indexOf(" scr ")  != -1 ||
        title.toLowerCase().indexOf("tsrip")  != -1 ||
        title.toLowerCase().indexOf("camrip") != -1 ||
        title.indexOf(" CAM ")                != -1)
        return "screener";

    if (title.toLowerCase().indexOf("brrip")  != -1 ||
        title.toLowerCase().indexOf("bdrip")  != -1 ||
        title.toLowerCase().indexOf("bd rip") != -1)
        return "blu-ray rip";

    return "dvd rip";
}

exports.getIndexOfMovie = function(data){
    var max = 0;
    var max_index = 0;

    for (var i = 0; i < data.length; i++){
        if (data[i].released != null){
            var year = data[i].released.substring(0, data[i].released.indexOf('-'));

            if ((year > max) && (year <= new Date().getFullYear())){
                max = year;
                max_index = i;
            }
        }
    }

    return max_index;
}


// Sanitize the name of a movie/game/tv-show
exports.sanitizeTitle = function(title){
    if (title.toLowerCase().indexOf("2012") != -1)
    {
        var index = title.toLowerCase().indexOf("2012");
        title = title.substring(0, index);
    }
    else{
        if (title.toLowerCase().indexOf("2011") != -1)
        {
            var index = title.toLowerCase().indexOf("2011");
            title = title.substring(0, index);
        }
        else
        {
            title = title.toLowerCase().replace("hdtv","");
            title = title.toLowerCase().replace("x264","");
            title = title.toLowerCase().replace("asap","");
            title = title.toLowerCase().replace("dvdrip","");
            title = title.toLowerCase().replace("xvid","");
            title = title.toLowerCase().replace("ac3","");
            title = title.toLowerCase().replace("cocain","");
            title = title.toLowerCase().replace("amiable","");
            title = title.toLowerCase().replace("maxspeed","");
            title = title.toLowerCase().replace("sparks","");
            title = title.toLowerCase().replace("ts","");
            title = title.toLowerCase().replace("deprived","");
            title = title.toLowerCase().replace("adtrg","");
            title = title.toLowerCase().replace("dbrip","");
            title = title.toLowerCase().replace("bhrg","");
            title = title.toLowerCase().replace("absurdity","");
            title = title.toLowerCase().replace("unrated","");
            title = title.toLowerCase().replace("dvdscr","");
            title = title.toLowerCase().replace("1cdrip","");
            title = title.toLowerCase().replace("ddr","");
        }
    }

    if (title.toLowerCase().indexOf("2010") != -1 || title.toLowerCase().indexOf("2009") != -1 || title.toLowerCase().indexOf("2008") != -1)
        title = "";

    return title.toLowerCase().replace(/\s+/g, ' ');
}