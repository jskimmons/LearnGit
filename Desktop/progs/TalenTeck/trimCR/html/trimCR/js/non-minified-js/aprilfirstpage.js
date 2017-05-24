$(document).ready(function(){
	$("header nav li a").css("-webkit-animation","ccspin .2s infinite linear");
	$('header .login_sec a').text("¯\\_(ツ)_/¯");
	$('nav').mouseover(function(){
		$('header .login_sec a').text("(ノಠ益ಠ)ノ彡┻━┻");
		$('header .login_sec').css({"border":"2px solid #000","border-radius":"6px","position":"absolute","top":"0","right":"0","margin-top":"15px","margin-right":"20px","padding":"0px","z-index":"1"})
		$("nav").css("margin-right","188px");
	});
	$('nav').mouseleave(function(){
		$('header .login_sec a').text("¯\\_(ツ)_/¯");
		$('header .login_sec').css({"border":"2px solid #000","border-radius":"6px","position":"absolute","top":"0","right":"0","margin-top":"15px","margin-right":"20px","padding":"0px","z-index":"1"})
		$("nav").css("margin-right","138px");
	});
});