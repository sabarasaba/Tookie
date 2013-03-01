$(document).ready(function(){

  // Open search filters.
  $('#filters-button').click(function(e){
    e.preventDefault();

    $('.search-filters').fadeToggle('fast', function(){});
  });

  // Handle ad-blockers.
  setTimeout(function(){
    if (($('.ads-main').css('display') == 'none') || ($('.ads-main').height() == '0' )){
      $('.ads-main').empty().append('Dont like ads? Me neither, but it would be awesome if you could <span>whitelist</span> Tookie in your AdBlock.');
    }
  }, 1000);

});