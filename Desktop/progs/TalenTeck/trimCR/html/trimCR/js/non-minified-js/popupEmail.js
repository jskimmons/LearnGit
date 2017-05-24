$(document).ready(function(){
    $(".popup2-container").hide();
    $(".popup2_open").click(function(){
        $(".popup2-container").fadeIn();
    });
    $("#popup2_close").click(function(e){
    	if (!$(".popup2-wrapper").is(e.target) && $(".popup2-wrapper").has(e.target).length == 0) {
        	$(".popup2-container").fadeOut();
        }
    });
    $("#popup1_close").click(function(e){
        if (!$(".popup1-video").is(e.target) && $(".popup1-video").has(e.target).length == 0) {
            $(".popup1-container").fadeOut();
            $(".popup1-video").get(0).currentTime = 0;
        }
    });
});