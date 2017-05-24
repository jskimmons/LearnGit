$(document).ready(function(){
	$(".popup1-container").hide();
    $("#popup1_open").click(function(){
        $(".popup1-container").fadeIn();
    });
    $("#popup1_close").click(function(e){
    	if (!$(".popup1-video").is(e.target) && $(".popup1-video").has(e.target).length == 0) {
        	$(".popup1-container").fadeOut();
        	$(".popup1-video").get(0).currentTime = 0;
        }
    });
    $(".video").hide();
    $(".video-tour").click(function(){
        $(".video").slideToggle(300);
    });
});
