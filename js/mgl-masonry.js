jQuery(document).ready(function($) {

    window.MglMasonry = function (parameters) {
        var gutter = parameters.gutter;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        this.run = function() {
            // Adding layout class to the gallery
    		$('.gallery').addClass('masonry');

    		// Adding gutter
    		$('.gallery-item').css('padding', gutter + "px");

            // Styling captions
            $('figcaption').css({
                'left': gutter + 'px',
                'bottom': gutter + 'px'
            });

            $('figcaption').each(function() {
                var caption = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if(caption != caption.substr(0,50)) {
                    var truncated_caption = caption.substr(0, 50) + "...";
                    $(this).html(truncated_caption);
                }
            });

            var style_captions = function() {
                $('figcaption').each(function() {
                    var $figcaption_parent = $(this).parent();
                    $(this).css('width', ( $figcaption_parent.outerWidth() - 2*gutter ) + 'px');
                    $(this).css('max-height', ($figcaption_parent.height()/2) + 'px');
                });
            };

            $(window).on('resize', function() {
                style_captions();
            });


    		var $grid;

    		// NON INFINITE LOADING MODE ========
    		if(!infinite_loading.enabled || galleries_number > 1) {
    			// Creating $grid masonry object
    			$grid = $('.gallery').masonry({
    				percentPosition: true,
    				itemSelector: '.gallery-item',
    				transitionDuration: 0,
    			});

    	        // Calculate the layout immediately
    	        $grid.masonry('layout');

    	        // Everytime an image is loaded in the grid, recalculate the layout
    	        $grid.imagesLoaded().progress(function() {
    	            $grid.masonry('layout');
                    style_captions();
    	        });

                // Recalculate layout on resize
                $(window).on('resize', function() {
                    $grid.masonry('layout');
                    style_captions();
                });

    		}
    		// INFINITE LOADING MODE ============
    		else {

                window.Meowapps_masonry_infinite_loading = function (infinite_loading) {
                    this.listen = function() {
                        // Adding animation class depending on setting
            			if(infinite_loading.animated) {
            				$('.gallery-item').addClass('not-loaded');
            			}

            			// Initialize items_array
            			var items_array = [];

            			// We run through all the items
            			$('.gallery-item').each(function(index, item) {
            				// We add them index
            				$(this).attr('data-mgl-index', index);
            				// We store them in the items_array
            				items_array.push( $(this).clone() );
            				// We delete them from the DOM
            				$(this).remove();
            			});

            			// NOW WE CAN START !

            			// Declaring some useful vars
            			var number_of_items = items_array.length;
            			var batch_size = infinite_loading.batch_size;
            			var last_item_displayed = 0;
            			var all_images_loaded = false;

            			// First of all, let's put the first items in the grid
            			for(var i=0; i < batch_size; i++) {
            				$('.gallery').append(items_array[i]);
            				last_item_displayed = i;
            			}

            			// Then let's masonryfy them
            			$grid = $('.gallery').masonry({
            				percentPosition: true,
            				itemSelector: '.gallery-item',
            				transitionDuration: 0,
            			});
            			$grid.imagesLoaded().progress(function(imgLoad, image) {
            	            $grid.masonry('layout');
                            style_captions();
            				$(image.img).closest('.gallery-item').removeClass('not-loaded');
            	        });
            			$grid.imagesLoaded(function() {
                            style_captions();
            				all_images_loaded = true;
            			});

                        // Function dealing with the scrolling logic, callback() takes care of the rest
                        var infinite_scroll = function(container, callback) {
                            $(window).on('scroll', function() {
                                if(all_images_loaded && last_item_displayed <= number_of_items - 1) {
                                    var containerBottomOffset = container.offset().top + container.outerHeight();
                                    var scrollTop = $(this).scrollTop();
                                    var scrollTopBottom = scrollTop + $(this).outerHeight();
                                    // If we are scrolling after the end of the gallery container
                                    if(scrollTopBottom > containerBottomOffset) {
                                        // Everything is ok to load more items, let's do it !
                                        callback();
                                    }
                                }
                            });
                        };

            			infinite_scroll($('.gallery'), function() {
            				// We start to load new images
            				all_images_loaded = false;
            				// Display 20 more items
            				var count = 0;
            				while(count < 20) {
            					$('.gallery').append(items_array[last_item_displayed + 1]);
            					//$grid.masonry('appended', items_array[last_item_displayed + 1]);
            					$grid.masonry('addItems', items_array[last_item_displayed + 1]);
            					last_item_displayed++;
            					count++;
            				}
            				$grid.imagesLoaded().progress(function(imgLoad, image) {
            		            $grid.masonry('layout');
                                style_captions();
            					$(image.img).closest('.gallery-item').removeClass('not-loaded');
            		        });
            				// When these new items are loaded, we say it
            				$grid.imagesLoaded(function() {
                                style_captions();
            					all_images_loaded = true;
            				});
            			});
                    };
                };

                if(typeof Meowapps_masonry_infinite_loading == "function") {
                    var meowapps_masonry_infinite_loading = new Meowapps_masonry_infinite_loading(infinite_loading);
                    meowapps_masonry_infinite_loading.listen();
                }

    		}

        };
    };

});
