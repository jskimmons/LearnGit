

function displayGraphSpinner(aspect) {
	var spinnerMargin = (aspect == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
	spinnerMargin = spinnerMargin + "px";

	var spinnerDiv = $("<div></div>").attr("id","spinnerDiv").css("text-align","center")
					.css("position","absolute").css("left",spinnerMargin).css("top","100px");
	if ( $(window).width() >= 768 ) {
		$("#display-area").html(spinnerDiv);
	}
	else {
		$("#display-area-xs").html(spinnerDiv);
	}

	var opts = {
			lines: 13 // The number of lines to draw
			, length: 12 // The length of each line
			, width: 14 // The line thickness
			, radius: 12 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '120px' // Top position relative to parent
			, left: '80px' //spinnerMargin // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
	};
	var target = document.getElementById('spinnerDiv');
	var spinner = new Spinner(opts).spin(target);
	$("#spinnerDiv").append("<h2>Loading chart....</h2>");
}

function displayTableSpinner(windowAspect) {
	//console.log("Applicant table file: kinda trying to speak!");
	var spinnerMargin = (windowAspect == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
	spinnerMargin = spinnerMargin + "px";
	$("#spinnerDiv").detach();

	var spinnerDiv = $("<div></div>").attr("id","spinnerDiv").css("text-align","center")
					.css("position","absolute").css("left",spinnerMargin).css("top","100px");
	if ( $(window).width() >= 768 ) {
		$("#display-area").html(spinnerDiv);
	}
	else {
		$("#display-area-xs").html(spinnerDiv);
	}

	var opts = {
			lines: 13 // The number of lines to draw
			, length: 12 // The length of each line
			, width: 14 // The line thickness
			, radius: 12 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '120px' // Top position relative to parent
			, left: '80px' //spinnerMargin // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
	};
	var target = document.getElementById('spinnerDiv');
	var spinner = new Spinner(opts).spin(target);
	$("#spinnerDiv").append("<h2>Loading table....</h2>");
}



function addCommas(thisValue){
	if (thisValue == null ) {
		return null;
	}
	if (thisValue.toString().length <= 3) {
		return thisValue.toString();
	} 
	var returnString = "";
	var lastPosition = thisValue.toString().length - 3;
	var decimalPlace = thisValue.toString().indexOf(".");
	if ( decimalPlace >= 0 ) {
		lastPosition = decimalPlace - 3;
		returnString = thisValue.toString().substring(Math.max(decimalPlace,0), decimalPlace+2)
	}
	for ( var i = lastPosition ; i > 1 || (i >= 1 && thisValue.toString().substring(0,1) !== "-" ) ; i = i - 3 ) {
		returnString = "," + thisValue.toString().substring(i,i+3) + returnString;
	}
	returnString = thisValue.toString().substring(0,i+3) + returnString;
	return returnString;
}


function removeCommas(number) {
	return number.toString().replace(/,/g,"").replace(/[%]/g,"");
}

function adjustTopbarPadding() {
	if ($(window).width() < 1047 ) {
		$('.topbarWideTD').each(function() {
			$(this).css("padding-left",Math.max(($(window).width() - 733)/16,0)+"px");
			$(this).css("padding-right",Math.max(($(window).width() - 733)/16,0)+"px");
			$("#logoutTD").css("padding-left",Math.max(($(window).width() - 733)/16+3,0)+"px");
			$("#logoutTD").css("padding-right",Math.max(($(window).width() - 733)/16+3,0)+"px");
			$("#topbarBlankTD").css("padding-left",0+"px");
			$("#topbarBlankTD").css("padding-right",0+"px");
			//console.log("Adjusted!");
		});
	} 
	else {
		$('.topbarWideTD').each(function() {
			$(this).css("padding-left","30px");
			$(this).css("padding-right","0px");
			$("#logoutTD").css("padding-left","25px");
			$("#logoutTD").css("padding-right","25px");
			$("#topbarBlankTD").css("padding-left",0+"px");
			$("#topbarBlankTD").css("padding-right",0+"px");
		});		
	}
}

function toPercent(inputNumber,obs) {
	if ( obs == 0 ) {
		return "N/A";
	}
	if ( Math.round(100*Number(inputNumber)) == Math.round(1000*Number(inputNumber))/10 ) {
		return Math.round(1000*Number(inputNumber))/10 + ".0%";
	}
	return Math.round(1000*Number(inputNumber))/10 + "%";
	//return inputNumber + "#";
}

function toWholePercent(inputNumber,obs) {
	if ( obs == 0 ) {
		return "N/A";
	}
	return Math.round(100*Number(inputNumber)) + "%";
	//return inputNumber + "#";
}


function coloredBox(color,size) {
	//alert(color + size);
	var box = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		.attr("width",size+"px")
		.attr("height",size+"px")
		.attr("viewBox","0, 0, 10, 10")
		.attr("preserveAspectRatio","none");
		//.css("width","90%")
		//.css("height","100%");
	$(box).html('<g>' +
		    '<path d="M0,0 L10,0 L10,10 L0,10 L0,0 z" fill="' + color + '"/>' +
			'</g>');
	return box;
}

function underlineOnlyThisLink(linkID) {
	$(".sheetlink").each(function() {
		$(this).css("color","#44494C");
	});
	$(".sheetlinkTall").each(function() {
		$(this).css("color","#44494C");
	});
	/*$(linkID).html("BONKERS!!!!");*/
	$(linkID).css("color","#02955D");
	$(linkID+"Tall").css("color","#02955D");
}
