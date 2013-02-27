var setYoutubeTrailer = function(container, keyword){
  var keyword= encodeURIComponent(keyword);
  var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=1&v=2&alt=jsonc';

  $.ajax({
    type: "GET",
    url: yt_url,
    dataType:"jsonp",
    success: function(response) {
      if(response.data.items) {
        $.each(response.data.items, function(i,data) {
          var video_id=data.id;
          var video_url="http://www.youtube.com/watch?v="+video_id+"&iv_load_policy=3";

          if (navigator.userAgent.match(/(iPod|iPhone|iPad)/))
            video_url = "<a href='"+video_url+"'>Watch trailer</a>";
          else
            video_url = "<a class='fancybox-media' href='"+video_url+"'>Watch trailer</a>";

          $(container).empty().html(video_url);
        });
      } else {
          $(container).html("<div id='error'>No video was found.</div>");
      }
    }
  });
};

var share = function(where, title, image){
  switch(where){
    case 'facebook':
      var leftPosition = (window.screen.width / 2) - (200);

      var topPosition = (window.screen.height / 2) - (170);
      var windowFeatures = "status=no,height=" + 250 + ",width=" + 600 + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
      var u = location.href;
      var t = document.title;
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer', windowFeatures);
    break;

    case 'twitter':
      var leftPosition = (window.screen.width / 2) - (200);

      var topPosition = (window.screen.height / 2) - (170);
      var windowFeatures = "status=no,height=" + 250 + ",width=" + 600 + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
      var u = location.href;

      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + ' - ' + encodeURIComponent(u) + '&via=sabarasaba','sharer', windowFeatures);
    break;

    case 'gplus':
      var leftPosition = (window.screen.width / 2) - (200);

      var topPosition = (window.screen.height / 2) - (170);
      var windowFeatures = "status=no,height=" + 250 + ",width=" + 600 + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
      var u = location.href;

      window.open('https://plusone.google.com/_/+1/confirm?hl=en&url=' + encodeURIComponent(u),'sharer', windowFeatures);
    break;

    case 'pinterest':
      var leftPosition = (window.screen.width / 2) - (200);

      var topPosition = (window.screen.height / 2) - (170);
      var windowFeatures = "status=no,height=" + 250 + ",width=" + 600 + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
      var u = location.href;

      window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(u) + '&media=' + encodeURIComponent(image) + '&description=' + encodeURIComponent(title),'sharer', windowFeatures);
    break;
  };
};


$(document).ready(function(){

  // Fancybox for movies view.
  $('#poster-image').fancybox();

  // Set trailer for movie view.
  setYoutubeTrailer($('.trailer'), $('.movie-title').text());

  $('.fancybox-media').fancybox({
    openEffect  : 'none',
    closeEffect : 'none',
    helpers : {
      media : {}
    }
  });

  // Give Feedback
  $('.movie-feedback').fancybox({
    width       : 600,
    height      : 300,
    fitToView   : false,
    autoSize    : false,
    closeClick  : false,
    openEffect  : 'none',
    closeEffect : 'none'
  });

  // Fav movie
  $('#fav-movie').click(function(e){
    e.preventDefault();

    var userID = $('#userID').val();
    var URI = '/api/movie-to-favs/' + userID + '/' + $('#movieID').val();

    if (userID !== 'null'){
      $.ajax({
        type: 'GET',
        url: URI,
        dataType: 'text',
        success: function(data, textStatus, jqXHR){
          console.log(textStatus);
          console.log(data);

          $('#fav-movie').addClass('faved');
        },

        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    }
    else{
      $('.text-message').addClass('color-red').empty().append('You have to be logged in for doing that.').fadeIn().delay(2500).fadeOut('slow');
    }
  });
});


