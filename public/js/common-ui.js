var validatePassword = function(p1, p2){
  if (p1.value != p2.value || p1.value == '' || p2.value == '') {
    p2.setCustomValidity('Passwords doesnt match');
  }
  else{
    p2.setCustomValidity('');
  }
};

$(document).ready(function(){

  // Always select the default input when a view is loaded.
  $('.default-input').focus();

  // Toggle for the donate button on the navigation bar.
  $('#donateButton').hover(function(){
    $('.header-donate').fadeToggle('fast', function(){
    });
  });

  $('#submit-new-password').on('click', function(e){
    e.preventDefault();

    //app.get('/api/resetPassword/:id/:token/:password', api.resetPassword)
    var uri = '/api/resetPassword/' + $('#id').val() + '/' + $('#token').val() + '/' + $('#password').val();

    $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'text',
      success: function(data, textStatus, jqXHR){
        console.log('success');
        console.log(data);
        console.log(textStatus);

        window.location.href = '/login';
      },

      error: function(jqXHR, textStatus, errorThrown){
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  });

});