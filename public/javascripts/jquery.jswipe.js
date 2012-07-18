(function($){$.fn.swipe=function(options){var defaults={threshold:{x:30,y:10},swipeLeft:function(){alert('swiped left')},swipeRight:function(){alert('swiped right')}};var options=$.extend(defaults,options);if(!this)return false;return this.each(function(){var me=$(this)
var originalCoord={x:0,y:0}
var finalCoord={x:0,y:0}
function touchStart(event){originalCoord.x=event.targetTouches[0].pageX
originalCoord.y=event.targetTouches[0].pageY}
function touchMove(event){event.preventDefault();finalCoord.x=event.targetTouches[0].pageX
finalCoord.y=event.targetTouches[0].pageY}
function touchEnd(event){var changeY=originalCoord.y- finalCoord.y
if(changeY<defaults.threshold.y&&changeY>(defaults.threshold.y*-1)){changeX=originalCoord.x- finalCoord.x
if(changeX>defaults.threshold.x){defaults.swipeLeft()}
if(changeX<(defaults.threshold.x*-1)){defaults.swipeRight()}}}
function touchStart(event){originalCoord.x=event.targetTouches[0].pageX
originalCoord.y=event.targetTouches[0].pageY
finalCoord.x=originalCoord.x
finalCoord.y=originalCoord.y}
function touchCancel(event){}
this.addEventListener("touchstart",touchStart,false);this.addEventListener("touchmove",touchMove,false);this.addEventListener("touchend",touchEnd,false);this.addEventListener("touchcancel",touchCancel,false);});};})(jQuery);