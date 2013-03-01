$(document).ready(function(){

  $('#change-picture').tipsy({gravity: 'n'});

  var enableTab = function(enable){
    $('.account-toolbar li').removeAttr('class');
    $(enable).addClass('selected');
  };

  var enableContent = function(enable){
    $('.account-user-info > div').hide();
    $(enable).show();
  };

  // account-user-info
  $('#user-button').click(function(e){
    e.preventDefault();

    enableTab('#user');
    enableContent('#user-content');
    $('.account-user-sidebar').show();
    $('.account-user-info').css('width', '63%');
  });


  $('#favs-button').click(function(e){
    e.preventDefault();

    enableTab('#favs');
    enableContent('#favs-content');
    $('.account-user-sidebar').hide();
    $('.account-user-info').css('width', '100%');
  });

});