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
                        //var video_frame="<iframe width='420' height='236' src='http://www.youtube.com/embed/"+video_id+"' frameborder='0' type='text/html'></iframe>";
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
}


$()

$(document).ready(function() {
    
    setYoutubeTrailer($('.trailer'), $('.title').text());

    $('.fancybox-media').fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
            media : {}
        }
    });

    $.prettySociable();

    $.prettySociable.settings.urlshortener.bitly.active = false;

    $.prettySociable.settings.websites.facebook.active=true;
    $.prettySociable.settings.websites.twitter.active=true;
    $.prettySociable.settings.websites.delicious.active=false;
    $.prettySociable.settings.websites.digg.active=false;
    $.prettySociable.settings.websites.linkedin.active=false;
    $.prettySociable.settings.websites.reddit.active=true;
    $.prettySociable.settings.websites.stumbleupon.active=false;
    $.prettySociable.settings.websites.tumblr.active=true;
});