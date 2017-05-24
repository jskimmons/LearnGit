$(document).ready(function(){
	//NOT SMOOTH SCROLL-ON-CLICK
	// $("a[href='#home']").click(function() {
	// 	$("html, body").animate({ scrollTop: 0 }, "slow");
	// 	return false;
	// });

	//not exactly sure how this works but it does
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
		    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		    if (target.length) {
	  	        $('html,body').animate({
			        scrollTop: target.offset().top - 70
			    }, "slow");
			    return false;
			}
		}
	});
});

//highlight nav bar items when scrolled to a certain section of the page
//http://blog.grayghostvisuals.com/js/detecting-scroll-position/
//http://stackoverflow.com/questions/14161132/jquery-scroll-change-navigation-active-class-as-the-page-is-scrolling-relative

$(window).scroll(function() {
	var windscroll = $(window).scrollTop();
    if (windscroll >= 580) { //when past "landing page"
        $('.section').each(function(i) { //selects each ".section" element and loops through them
            if ($(this).position().top <= windscroll +150) { //account for the nav bar
                $('nav li a.active').removeClass('active'); //remove highlighting from previous nav element
                $('nav li a').eq(i).addClass('active'); //add highlighting to new nav element
            }
        });

    } else {
	    $('nav a.active').removeClass('active'); //on the "landing page" remove all highlighting
    }

}).scroll();