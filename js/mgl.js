jQuery(document).ready(function($) {

    // TEMPORARY : transforms a justified layout option into an horizontal slide one //
    if (mgl.settings.layout == "justified") {
        mgl.settings.layout = "horizontal-slider";
    }

	// TEMPORARY : Infinite loading settings
	mgl.settings.infinite_loading = {
		enabled: true,
		animated: true,
		batch_size: 20
	};

    // Check if there is a wordpress gallery on the page
    var gallery_exists = false;
    if ($('.gallery').length > 0) {
        gallery_exists = true;
    }

    // Check if there is more than one gallery
    var galleries_number = $('.gallery').length;

    /* ========================================= */
    /* MASONRY LAYOUT -------------------------- */
    /* ========================================= */
    if (mgl.settings.layout == "masonry" && gallery_exists) {

        var parameters = {
            gutter: mgl.settings.masonry.gutter,
            infinite_loading: {
                enabled: mgl.settings.infinite_loading.enabled,
                animated: mgl.settings.infinite_loading.animated,
                batch_size: mgl.settings.infinite_loading.batch_size,
            },
            context: {
                galleries_number: galleries_number,
            }
        };
        var mglMasonry = new MglMasonry(parameters);
        mglMasonry.run();

    }

    /* ========================================= */
    /* HORIZONTAL SLIDER LAYOUT ---------------- */
    /* ========================================= */
    if (mgl.settings.layout == "horizontal-slider" && gallery_exists) {

        // Adding classes and CSS
        $('.gallery').addClass('horizontal-slider-gallery');
        $('.gallery').css({
            'height': mgl.settings.horizontal_slider.slider_height + "px",
            'width': mgl.settings.horizontal_slider.slider_width + "%",
        });
        $('.gallery-item').css({
            'marginRight': mgl.settings.horizontal_slider.gutter + "px"
        });
        $('.gallery-item').find('img').css("cssText", "height: 100% !important; width: auto !important; max-width: none !important;");

        // Styling captions
        $('figcaption').hide();

        // In case something adds some br or p tags in the gallery
        $('br').remove();
        $('p').remove();

        // Declaring useful vars
        var items_middles_offsets = [];
        var gallery_width = $('.gallery').outerWidth();

        // Adding index to items and populating items_middles_offsets array
        $('.gallery-item').each(function(index) {
            items_middles_offsets.push(($(this).offset().left - $('.gallery').offset().left) + $(this).outerWidth() / 2);
            $(this).attr('data-horizontal-slider-index', index);
        });

        // Initialize
        $('.gallery-item').first().addClass('active-item');

        // When scrolling the gallery
        $('.gallery').on('scroll', function() {
            var scrollLeft = $(this).scrollLeft();
            var middleScrollLeft = scrollLeft + gallery_width / 2;
            var closest = 1000;
            var activeIndex = 0;
            items_middles_offsets.forEach(function(offset, index) {
                if (Math.abs(middleScrollLeft - offset) < closest) {
                    closest = Math.abs(middleScrollLeft - offset);
                    activeIndex = index;
                }
            });
            $('.gallery-item').removeClass('active-item');
            $('.gallery-item[data-horizontal-slider-index=' + (activeIndex) + ']').addClass('active-item');
        });

        // When clicking on an image
        $('.gallery-item').on('click', function(e) {

            // If it's the active item, we display a lightbox ( if there is one ).
            if ($(this).hasClass('active-item')) {
                $('#mwl-target').show();
            } else {
                // Prevent any lightbox if possible
                e.preventDefault();
                // Prevent Meow Lightbox for sure
                $('#mwl-target').hide();
            }

            // Scroll to the image
            var item_index = $(this).attr('data-horizontal-slider-index');
            var item_middle_offset = items_middles_offsets[item_index];
            var scroll_left = item_middle_offset - gallery_width / 2;
            $('.gallery').animate({
                scrollLeft: scroll_left
            }, 300);

        });

    }

});
