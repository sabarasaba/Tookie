
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

  $('#button-edit-movie').fancybox({
    maxWidth  : 1000,
    maxHeight : 900,
    fitToView : false,
    width   : '90%',
    height    : '90%',
    autoSize  : false,
    closeClick  : false,
    openEffect  : 'none',
    closeEffect : 'none',

    beforeClose: function() {

      var pressedButton = $('.fancybox-iframe').contents().find('#buttonState').val();

      if (pressedButton !== 'cancel'){

        var movieObject = {
          id:           $('.fancybox-iframe').contents().find('#movie-id').val(),
          url:          $('.fancybox-iframe').contents().find('#movie-url').val(),
          title:        $('.fancybox-iframe').contents().find('#movie-title').val(),
          description:  $('.fancybox-iframe').contents().find('#movie-description').val(),
          genre:        $('.fancybox-iframe').contents().find('#movie-genre').val(),
          poster:       $('.fancybox-iframe').contents().find('#movie-poster').val(),
          posterSmall:  $('.fancybox-iframe').contents().find('#movie-posterSmall').val(),
          posterMedium: $('.fancybox-iframe').contents().find('#movie-posterMedium').val(),
          rating:       $('.fancybox-iframe').contents().find('#movie-rating').val(),
          releaseDate:  $('.fancybox-iframe').contents().find('#movie-releaseDate').val(),
          format:       $('.fancybox-iframe').contents().find('#movie-format').val(),
          cast:         $('.fancybox-iframe').contents().find('#movie-cast').val()
        };

        var uri = '/api/admin/updateMovie/' + movieObject.id;
        var dataString = 'url='+ movieObject.url + '&title=' + movieObject.title + '&description=' + movieObject.description + '&genre=' + movieObject.genre + '&poster=' + movieObject.poster + '&posterSmall=' + movieObject.posterSmall + '&posterMedium=' + movieObject.posterMedium + '&rating=' + movieObject.rating + '&releaseDate=' + movieObject.releaseDate + '&format=' + movieObject.format + '&cast=' + movieObject.cast;

        $.ajax({
          type: 'POST',
          url: uri,
          data: dataString,
          dataType: 'text',
          success: function(data, textStatus, jqXHR){
            console.log('success');
            console.log(data);
            console.log(textStatus);

            location.reload();
          },

          error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      }
    }
  });

  $('#button-delete-movie').live('click', function(e){
    e.preventDefault();

    var deleteMovie = confirm('Are you sure you wanna delete this movie?');

    if (deleteMovie){
      var uri = '/api/admin/deleteMovie/' + $(this).attr('data-movieID');

      $.ajax({
        type: 'GET',
        url: uri,
        dataType: 'text',
        success: function(data, textStatus, jqXHR){
          console.log('success');
          console.log(data);
          console.log(textStatus);

          location.reload();
        },

        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    }
  });

});


