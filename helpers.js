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