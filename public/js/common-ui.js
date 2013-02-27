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

});