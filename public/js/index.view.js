/*

<div id="postswrapper">
   <div class="item">content</div>
   ...
   <div id="loadmoreajaxloader" style="display:none;"><center><img src="ajax-loader.gif" /></center></div>
</div>

$(window).scroll(function()
{
    if($(window).scrollTop() == $(document).height() - $(window).height())
    {
        $('div#loadmoreajaxloader').show();
        $.ajax({
	        url: "loadmore.php",
	        success: function(html)
	        {
	            if(html)
	            {
	                $("#postswrapper").append(html);
	                $('div#loadmoreajaxloader').hide();
	            }else
	            {
	                $('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
	            }
	        }
        });
    }
});

*/

$(document).ready(function() {

	var $qtab = $('#qualitytab');
	var $gtab = $('#genretab');
	var $ttab = $('#titletab');

	var showTab = function(tab){
		$('.quality').removeClass('active');
		$('.genre').removeClass('active');
		$('.title').removeClass('active');

		$qtab.addClass('hidden');
		$gtab.addClass('hidden');
		$ttab.addClass('hidden');

		if (tab == 'quality'){
			$('.quality').addClass('active');
			$('.main').css('height', '40px');
			$qtab.removeClass('hidden');
		}
		if (tab == 'genre'){
			$('.genre').addClass('active');
			$('.main').css('height', '40px');
			$gtab.removeClass('hidden');
		}
		if (tab == 'title'){
			$('.title').addClass('active');
			$('.main').css('height', '40px');
			$ttab.removeClass('hidden');
		}
	}

    $('.quality').click(function(){
    	if ($qtab.hasClass('hidden')){
    		showTab('quality');
    	}
    });

    $('.genre').click(function(){
    	if ($gtab.hasClass('hidden')){
    		showTab('genre');
    	}
    });

    $('.title').click(function(){
    	if ($ttab.hasClass('hidden')){
    		showTab('title');
    	}
    });
});