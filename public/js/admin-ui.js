$(document).ready(function(){

  var makeUserAdmin = function(user, state){
    var uri = '/api/admin/makeAdmin/' + user + '/' + state;

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
  };

  $("#admin-user-edit").fancybox({
    maxWidth  : 600,
    maxHeight : 310,
    fitToView : false,
    width   : '70%',
    height    : '70%',
    autoSize  : false,
    closeClick  : false,
    openEffect  : 'none',
    closeEffect : 'none',

    beforeClose: function() {

      var pressedButton = $('.fancybox-iframe').contents().find('#buttonState').val();

      if (pressedButton !== 'cancel'){
        var userObject = {
          actualName:    $('.fancybox-iframe').contents().find('#user-name').data('name'),
          userName:      $('.fancybox-iframe').contents().find('#user-name').val(),
          userEmail:     $('.fancybox-iframe').contents().find('#user-email').val(),
          userPassword:  $('.fancybox-iframe').contents().find('#user-password').val()
        };

        var uri = '/api/admin/updateUser/' + userObject.actualName;
        var dataString = 'name='+ userObject.userName + '&email=' + userObject.userEmail + '&password=' + userObject.userPassword;

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

$('#admin-feedback-solve').fancybox({
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

        console.log('log object:');
        console.log(movieObject);

        var uri = '/api/admin/updateFeedback/' + movieObject.id;
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

  $('.admin-action-icons').on('click', '#admin-feedback-delete', function(e){
    e.preventDefault();

    var ignoreFeedback = confirm('Are you sure you wanna ignore this feedback?');

    if (ignoreFeedback){
      var uri = '/api/admin/deleteFeedback/' + $(this).attr('data-feedbackid');

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


  $('.admin-action-icons').on('click', '#admin-user-makeAdmin', function(e){
    e.preventDefault();

    var makeAdmin = confirm('Are you sure you wanna make this user an admin?');

    if (makeAdmin){
      console.log('make admin');
      makeUserAdmin($(this).parent().parent().children('td').eq(1).text().trim(), true);
    }
    else{
      makeUserAdmin($(this).parent().parent().children('td').eq(1).text().trim(), false);
    }
  });


  $('.admin-action-icons').on('click', '#admin-user-delete', function(e){
    e.preventDefault();

    var deleteUser = confirm('Are you sure you wanna delete this user?');

    if (deleteUser){
      var uri = '/api/admin/deleteUser/' + $(this).parent().parent().children('td').eq(1).text().trim();

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