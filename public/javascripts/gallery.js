$(function() {
	// ======================= imagesLoaded Plugin ===============================
	// original: mit license. paul irish. 2010.
	// contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

	$.fn.imagesLoaded 		= function( callback ) {
	var $images = this.find('img'),
		len 	= $images.length,
		_this 	= this,
		blank 	= 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

	function triggerCallback() {
		callback.call( _this, $images );
	}

	function imgLoaded() {
		if ( --len <= 0 && this.src !== blank ){
			setTimeout( triggerCallback );
			$images.off( 'load error', imgLoaded );
		}
	}

	if ( !len ) {
		triggerCallback();
	}

	$images.on( 'load error',  imgLoaded ).each( function() {
		// cached images don't fire load sometimes, so we reset src.
		if (this.complete || this.complete === undefined){
			var src = this.src;
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			// data uri bypasses webkit log warning (thx doug jones)
			this.src = blank;
			this.src = src;
		}
	});

	return this;
	};

	// gallery container
	var $rgGallery			= $('#rg-gallery'),
	// carousel container
	$esCarousel			= $rgGallery.find('div.es-carousel-wrapper'),
	// the carousel items
	$items				= $esCarousel.find('ul > li'),
	// total number of items
	itemsCount			= $items.length;
	
	Gallery				= (function() {
			// index of the current item
		var current			= 0, 
			// mode : carousel || fullview
			mode 			= 'carousel',
			// control if one image is being loaded
			anim			= false,
			init			= function() {
				
				// (not necessary) preloading the images here...
				$items.add('<img src="images/ajax-loader.gif"/><img src="images/black.png"/>').imagesLoaded( function() {
					// add options
					_addViewModes();
					
					// add large image wrapper
					$('#img-wrapper-tmpl').tmpl( {itemsCount : itemsCount} ).appendTo( $rgGallery );
					_addImageWrapper();
					
					// show first image
					_showImage( $items.eq( current ) );
						
				});
				
				// initialize the carousel
				if( mode === 'carousel' )
					_initCarousel();
				
			},
			_initCarousel	= function() {
				
				// we are using the elastislide plugin:
				// http://tympanus.net/codrops/2011/09/12/elastislide-responsive-carousel/
				$esCarousel.show().elastislide({
					imageW 	: 60,
					imageH 	: 90,
					onClick	: function( $item ) {
						if( anim ) return false;
						anim	= true;
						// on click show image
						_showImage($item);
						// change current
						current	= $item.index();
					}
				});
				
				// set elastislide's current to current
				$esCarousel.elastislide( 'setCurrent', current );
				
			},
			_addViewModes	= function() {
				
				// top right buttons: hide / show carousel
				
				var $viewfull	= $('<a href="#" class="rg-view-full"></a>'),
					$viewthumbs	= $('<a href="#" class="rg-view-thumbs rg-view-selected"></a>'),
					$all        = $('<i class="rg-view-filter" id="rg-view-all" original-title="All movies"></i>'),
					$good       = $('<i class="rg-view-filter" id="rg-view-good" original-title="Blu-ray and dvd"></i>'),
					$br         = $('<i class="rg-view-filter" id="rg-view-br" original-title="Blu-ray"></i>'),
					$dvd        = $('<i class="rg-view-filter" id="rg-view-dvd" original-title="Dvd"></i>'),
					$screener   = $('<i class="rg-view-filter" id="rg-view-screener" original-title="Screener"></i>');
				
				$rgGallery.prepend( $('<div class="rg-view"/>').append( $viewfull ).append( $viewthumbs ).append( $all ).append($good).append($br).append($dvd).append($screener));

				var $filterAll  = $('#rg-view-all'),
					$filterGood = $('#rg-view-good'),
					$filterBR   = $('#rg-view-br'),
					$filterDVD  = $('#rg-view-dvd'),
					$filterScr  = $('#rg-view-screener');

				$filterAll.tipsy({gravity: 's'});
				$filterGood.tipsy({gravity: 's'});
				$filterBR.tipsy({gravity: 's'});
				$filterDVD.tipsy({gravity: 's'});
				$filterScr.tipsy({gravity: 's'});

				//.rg-selected-view
				var url = window.location.href;

				// Home
				if (url.substr(url.length-1, url.length) == '/')
					$('#rg-view-all').addClass('rg-selected-view');

				// Good
				if (url.substr(url.lastIndexOf('/') + 1, url.length) == 'good')
					$filterGood.addClass('rg-selected-view');

				// Blu-ray 
				if (url.substr(url.lastIndexOf('/') + 1, url.length) == 'br')
					$filterBR.addClass('rg-selected-view');

				// Dvd
				if (url.substr(url.lastIndexOf('/') + 1, url.length) == 'dvd')
					$filterDVD.addClass('rg-selected-view');
				// Screener
				if (url.substr(url.lastIndexOf('/') + 1, url.length) == 'screener')
					$filterScr.addClass('rg-selected-view');


				$all.on('click.rgGallery', function( event ){
					if (!$filterAll.hasClass('rg-selected-view'))
						$(location).attr('href', '/');
				});

				$good.on('click.rgGallery', function( event ){
					if (!$filterGood.hasClass('rg-selected-view'))
						$(location).attr('href', '/good');
				});

				$br.on('click.rgGallery', function( event ){
					if (!$filterBR.hasClass('rg-selected-view'))
						$(location).attr('href', '/br');
				});

				$dvd.on('click.rgGallery', function( event ){
					if (!$filterDVD.hasClass('rg-selected-view'))
						$(location).attr('href', '/dvd');
				});

				$screener.on('click.rgGallery', function( event ){
					if (!$filterScr.hasClass('rg-selected-view'))
						$(location).attr('href', '/screener');
				});
				
				$viewfull.on('click.rgGallery', function( event ) {
						if( mode === 'carousel' )
							$esCarousel.elastislide( 'destroy' );
						$esCarousel.hide();
					$viewfull.addClass('rg-view-selected');
					$viewthumbs.removeClass('rg-view-selected');
					mode	= 'fullview';
					return false;
				});
				
				$viewthumbs.on('click.rgGallery', function( event ) {
					_initCarousel();
					$viewthumbs.addClass('rg-view-selected');
					$viewfull.removeClass('rg-view-selected');
					mode	= 'carousel';
					return false;
				});
				
				if( mode === 'fullview' )
					$viewfull.trigger('click');
					
			},
			_addImageWrapper= function() {
				
				// adds the structure for the large image and the navigation buttons (if total items > 1)
				// also initializes the navigation events
				
				if( itemsCount > 1 ) {
					// addNavigation
					var $navPrev		= $rgGallery.find('a.rg-image-nav-prev'),
						$navNext		= $rgGallery.find('a.rg-image-nav-next'),
						$imgWrapper		= $rgGallery.find('div.rg-image');
						
					$navPrev.on('click.rgGallery', function( event ) {
						_navigate( 'left' );
						return false;
					});	
					
					$navNext.on('click.rgGallery', function( event ) {
						_navigate( 'right' );
						return false;
					});
				
					// add touchwipe events on the large image wrapper
					$imgWrapper.touchwipe({
						wipeLeft			: function() {
							_navigate( 'right' );
						},
						wipeRight			: function() {
							_navigate( 'left' );
						},
						preventDefaultEvents: false
					});
				
					$(document).on('keyup.rgGallery', function( event ) {
						if (event.keyCode == 39)
							_navigate( 'right' );
						else if (event.keyCode == 37)
							_navigate( 'left' );	
					});

					$('#rg-image-wrapper').touchwipe({
						wipeLeft			: function() {
							_navigate( 'right' );
						},
						wipeRight			: function() {
							_navigate( 'left' );
						},
						preventDefaultEvents: false
					});
					
				}
				
			},
			_navigate		= function( dir ) {
				
				// navigate through the large images
				
				if( anim ) return false;
				anim	= true;
				
				if( dir === 'right' ) {
					if( current + 1 >= itemsCount )
						current = 0;
					else
						++current;
				}
				else if( dir === 'left' ) {
					if( current - 1 < 0 )
						current = itemsCount - 1;
					else
						--current;
				}
				
				_showImage( $items.eq( current ) );
				
			},
			_showImage		= function( $item ) {
				
				// shows the large image that is associated to the $item
				
				$('.loading').hide();
				var $loader	= $rgGallery.find('div.rg-loading').show();
				
				$items.removeClass('selected');
				$item.addClass('selected');
					 
				var $thumb		= $item.find('img'),
					largesrc	= $thumb.data('large'),
					title		= $thumb.data('title'),
					rating      = $thumb.data('rating'),
					description = $thumb.data('description'),
					torrent     = $thumb.data('torrent'),
					genre       = $thumb.data('genre'),
					format      = $thumb.data('format');
					released    = $thumb.data('released');
					cast        = $thumb.data('cast');
				
				$('<img/>').load( function() {
					
					$rgGallery.find('div.rg-title').empty().append(title);
					$rgGallery.find('div.rg-caption').show().children('p').empty().text( description );
					$rgGallery.find('div.rg-image').empty().append('<img src="' + largesrc + '" />');
					$rgGallery.find('div.rg-format').empty().append('<span>Format: '+ format +'</span>');
					$rgGallery.find('div.rg-genre').empty().append('<span>Genre: '+ genre +'</span>');
					$rgGallery.find('div.rg-released').empty().append('<span>Released: '+ released +'</span>');
					$rgGallery.find('div.rg-cast').empty().append('<span>Cast:&nbsp;&nbsp;<p>'+ cast +'</p></span>');

					if (rating > 0){
						$rgGallery.find('span.rg-score').empty().append('<code>'+rating+'/10</code>');
						$rgGallery.find('span.rg-stars').empty().raty({
							readOnly	: true,
							half  		: true,
							number      : 10,
							score		: rating
						});
					}
					else{
						$rgGallery.find('span.rg-score').empty().append('<code> not available</code>');
						$rgGallery.find('span.rg-stars').empty();
					}
					
					$rgGallery.find('div.rg-torrent').empty().append('<a href="'+torrent+'"> Download Torrent</a>');
					setYoutubeTrailer($rgGallery.find('div.rg-trailer').empty(), title + "trailer");
					
					$loader.hide();
					
					if( mode === 'carousel' ) {
						$esCarousel.elastislide( 'reload' );
						$esCarousel.elastislide( 'setCurrent', current );
					}
					
					anim	= false;
					
				}).attr( 'src', largesrc );
				
			},
			addItems		= function( $new ) {
			
				$esCarousel.find('ul').append($new);
				$items 		= $items.add( $($new) );
				itemsCount	= $items.length; 
				$esCarousel.elastislide( 'add', $new );
				_showImage( $items.eq( current ) );
				_addImageWrapper();
			
			},
			reload = function(){
				_addImageWrapper();
				_showImage( $items.eq( current ) );
				$esCarousel.elastislide( 'reload' );
				$esCarousel.elastislide( 'setCurrent', 0 );
				console.log("reloaded");
			};
		
		return { 
			init 		: init,
			addItems	: addItems,
			reload      : reload
		};
	
	})();

	Gallery.init();
});