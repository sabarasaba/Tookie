$(document).ready(function(){

  var closeModal = function(){
    setTimeout(function() {
      parent.jQuery.fancybox.close();
    }, 2000);
  };

  $('#feedback-send').click(function(){
    var uri = '/movie/feedback/' + $('#movieID').val() + '/' + $('#feedback-type').find(":selected").text() + '/' + $('#feedback-description').val();

    $('.feedback-container').hide();
    $('.feedback-loading').show();

    $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'text',
      success: function(data, textStatus, jqXHR){
        console.log(data);
        console.log(textStatus);

        $('.feedback-loading').append('<p>Thanks for your feedback!</p>');
        closeModal();
      },

      error: function(jqXHR, textStatus, errorThrown){
        console.log(textStatus);
        console.log(errorThrown);

        $('.feedback-loading').append('<p>There was an error sending the information. Please try again later.</p>');
        closeModal();
      },
      complete: function(jqXHR, textStatus){
        $('.feedback-loading > img').hide();
      }
    });
  });

});