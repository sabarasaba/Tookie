$(document).ready(function(){

  $('#save').click(function(e){
    $('#buttonState').val('save');

    parent.jQuery.fancybox.close();
  });

  $('#cancel').click(function(e){
    $('#buttonState').val('cancel');

    parent.jQuery.fancybox.close();
  });

});