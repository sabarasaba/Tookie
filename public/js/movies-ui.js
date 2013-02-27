
Array.prototype.remove = function(index){
  this.splice(index, 1);
};


// Infinite Scrolling implementation.

var displayLoading = function(callback){
  $('.movies-container').append('<div class="loading"><img src="/img/ajax-loader.gif" alt="loader"/></div>');
  callback();
};

var parseCurrentURI = function (){
  // Get current URI
  var pathArray = window.location.pathname.split('/');

  // Remove empty nodes
  pathArray.remove(0);
  pathArray.remove(pathArray.length);

  return pathArray;
};

var getDataFromAPI = function(uri){
  var ajaxURI = uri;
  var startTime = new Date().getTime();
  $.ajax({
    url: ajaxURI,
    dataType: 'html',
    success: function(html){
      if (html){
        var requestTime = new Date().getTime() - startTime;
        var timeInMinutes = parseFloat(requestTime / 1000).toString().substr(0, 5);

        if (currentPage != 1){
          $('.movies-container').append('<div class="movie-separator"><p>Page '+ currentPage +'</p><div class="load-time">Loaded in ' + timeInMinutes + '</div></div>');
        }

        $('.movies-container').append(html);
      }
      else{
        console.log('Error on ajax call to api.');
        console.log(html);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log('Error');
      console.log(errorThrown);
    },
    complete: function(jqXHR, textStatus){
      callInProgress = false;
      $('.loading').hide();
    }
  });
};

var loadData = function(){
  callInProgress = true;

  var currentURI = parseCurrentURI();

  switch(currentURI[1]){
    case 'release-date':
      console.log('release-date uri');
      getDataFromAPI('/api/movies-by-releasedate/' + currentPage++);
    break;

    case 'top':
      console.log('top uri');
      getDataFromAPI('/api/movies-by-rating/' + currentPage++);
    break;

    case 'search':
      console.log('search uri');
    break;

    default:
      console.log('default uri');
    break;
  };
};

var currentPage     = 0
  , callInProgress  = false;

// Infinite scrolling event handler
$(window).scroll(function(){
  if ((!callInProgress) && ($(window).scrollTop() == $(document).height() - $(window).height())){
    displayLoading(function(){
      loadData();
    });
  }
});

// Add first page
$(document).ready(function(){
  displayLoading(function(){
    loadData();
  });

});


