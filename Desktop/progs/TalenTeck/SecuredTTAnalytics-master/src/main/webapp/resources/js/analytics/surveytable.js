var windowAspectSurveyTable = "";
windowAspectSurveyTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 500 ) {
	lowerBoxesHeight = 500;
}
if ( lowerBoxesMobileHeight < 500 ) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height",lowerBoxesHeight+"px").css("padding","25px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

underlineOnlyThisLink("#surveysLink");


// Show a "loading" animation

deactivateTopbarLinks();
//displayTableSpinner(windowAspectSurveyTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Surveys</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Survey instruments to improve predictive power of TalenTeck turnover risk scores.</h4>');
$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

var applicantSurveyButton = $("<button></button>")
	.attr('id','applicantSurveyButton')
	.attr('class','btn btn-default btn-block')
	.text("Applicant Survey")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(applicantSurveyButton);

var interviewerSurveyButton = $("<button></button>")
	.attr('id','interviewerSurveyButton')
	.attr('class','btn btn-default btn-block')
	.text("Interviewer Survey")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(interviewerSurveyButton);

var referrerSurveyButton = $("<button></button>")
	.attr('id','referrerSurveyButton')
	.attr('class','btn btn-default btn-block')
	.text("Referrer Survey")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(referrerSurveyButton);

var executiveSurveyButton = $("<button></button>")
	.attr('id','executiveSurveyButton')
	.attr('class','btn btn-default btn-block')
	.text("Management Survey")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(executiveSurveyButton);

if ( windowAspectSurveyTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

var surveyTable = [];
var visibleSurveyTable = {};
var activeTable = "";

disableSurveyTableSelectors();
displayTableSpinner(windowAspectSurveyTable);

$.ajax({ type: "POST" ,
	url: "../ReturnQuery" , 
	data: { type : "surveytable" } ,
	dataType: "json" ,
	success: function(data) {
		//console.log("Survey table:");
		//console.log(data);
		surveyTable = data.questions;
		activeTable = "applicant";
		visibleSurveyTable = createVisibleSurveyTable("applicant");
		displayVisibleSurveyTable(visibleSurveyTable);
	}
});


function createVisibleSurveyTable(tableType) {

	var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"];
	
	var titleHTML = "";
	switch(tableType) {
	case "applicant":
		titleHTML = "<h2>Applicant Survey</h2>";
		break;
	case "interviewer":
		titleHTML = "<h2>Interviewer Survey</h2>";
		break;
	case "referrer":
		titleHTML = "<h2>Referrer Survey</h2>";
		break;
	case "executive":
		titleHTML = "<h2>Management Survey</h2>";
		break;
		
	}
	
	var tableContainerWidth = 
		(windowAspectSurveyTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
	if ( tableContainerWidth < 450 && windowAspectSurveyTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = tableContainerWidth;
	var columnWidth = tableWidth;
	
	var tableContainerHeight = 
		(windowAspectSurveyTable == "mobile" ) ?  450 : $(window).height() - 151;
	
	var visibleTable = $("<table></table>").attr("id","surveyTable").attr("class","table")
		.css("width",tableWidth)
		.css("height",tableContainerHeight)
		.css("padding-left","0px")
		.css("padding-right","0px")
		.css("border","none");
	var visibleThead = $("<thead></thead>")
		.attr("id","surveyThead")
		.css("width",tableWidth);
	$(visibleTable).append(visibleThead);
	var visibleTbody = $("<tbody></tbody>")
		.attr("id","surveyTbody")
		.css("width",tableWidth)
		.css("height",tableContainerHeight - 50)
		.css("overflow-y","scroll")
		.css("position","absolute");
	$(visibleTable).append(visibleTbody);

	var titleRow = $("<tr></tr>")
		.attr("id","titleRow")
		.css("background-color","#dddddd")
		.css("width",tableWidth)
		.css("border-top","2px solid #555555");

	var titleTD = $("<th></th>")
		.css("width","100%")
		.html(titleHTML);
	$(titleRow).append(titleTD);
	$(visibleThead).append(titleRow);
	var questionNumber = 0;
	
	$.each(surveyTable,function(questionKey, questionValue) {
		
		//do this for every question in survey table
		if ( this.survey == tableType ) {
			questionNumber++;
 			var thisRow = $("<tr></tr>")
 			//.css("height","25px")
 				.css("width",tableWidth)
 				.css("background-color","#ffffff")
 				.css("padding-top","5px")
 				.css("padding-bottom","5px");
 			var questionSpan = $('<span id="responses'+questionKey+'"></span>')
 			.attr("hidden", true);
			var questionTD = $("<td></td>")
//				.text(questionNumber + ". " + this.questionText)
				.attr("class","surveyTableTD")
				.css("width",columnWidth)
				.css("background-color","#ffffff")
				.css("padding-top","10px")
				.css("padding-bottom","10px")
				.css("padding-left","10px")
				.css("padding-right","10px");
			var questionTextCollapse = $('<p id="question' + questionKey + '"></p>')
				.text(questionNumber + ". " + this.questionText)
				.css("cursor", "pointer");
			questionTD.append(questionTextCollapse);
			$(questionTD).append(questionSpan);
			var useLetters = ( typeof this.responses !== "undefined" && this.responses.length > 1 );
			$.each(this.responses,function(key,value) {
				//do this for every answer for that question
				
//				$(questionTD).append("<br>");
//				if ( key == 0 ) {
//					$(questionSpan).append("<br>");
//				}
				
				var thisResponse = $("<p></p>")
					.css("text-indent","25px")
					.css("margin","0px")
					.html(useLetters ? letters[key] + ". " + value : value);
				$(questionSpan).append(thisResponse);
				
			});
			
			$(thisRow).append(questionTD);
			$(visibleTbody).append(thisRow);

		}
	});
	
	return visibleTable;
	
}


function displayVisibleSurveyTable(visibleTable) {
	windowAspectSurveyTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectSurveyTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectSurveyTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	surveyTableDiv = $("<div></div>").attr("id","surveyTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");

	if ( windowAspectSurveyTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").html(surveyTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#display-area-xs").html(surveyTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#surveyTableDiv").css("height",tableContainerMobileHeight);
	}
	

	$(surveyTableDiv).html(visibleTable);
	addSurveyTableResizeListener();
	enableSurveyTableSelectors();
	activateSurveyTableSelectors();
	$("#" + activeTable + "SurveyButton").prop("disabled",true);

}


function addSurveyTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectSurveyTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectSurveyTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var surveyTableHolder = $("#surveyTableDiv").detach();
			$("#display-area-xs").html(surveyTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectSurveyTable = "mobile";
		}
		if ( windowAspectSurveyTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var surveyTableHolder = $("#surveyTableDiv").detach();
			$("#display-area").html(surveyTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectSurveyTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectSurveyTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectSurveyTable != "mobile" ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		var displayAreaMobileHeight = 500;
		var tableContainerMobileHeight = 450;
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectSurveyTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#surveyTableDiv").css("width",tableContainerWidth);
		visibleSurveyTable = createVisibleSurveyTable(activeTable);
		$("#surveyTableDiv").html(visibleSurveyTable);
		
		if ( windowAspectSurveyTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#surveyTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#surveyTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}

function disableSurveyTableSelectors() {
	deactivateTopbarLinks();
	$("#applicantSurveyButton").prop("disabled",true);
	$("#interviewerSurveyButton").prop("disabled",true);
	$("#referrerSurveyButton").prop("disabled",true);
	$("#executiveSurveyButton").prop("disabled",true);

}

function enableSurveyTableSelectors() {
	activateTopbarLinks();
	$("#applicantSurveyButton").prop("disabled",false);
	$("#interviewerSurveyButton").prop("disabled",false);
	$("#referrerSurveyButton").prop("disabled",false);
	$("#executiveSurveyButton").prop("disabled",false);
}


function activateSurveyTableSelectors() {
	$("#applicantSurveyButton").unbind("click");
	$("#applicantSurveyButton").click(function() {
		activeTable = "applicant";
		visibleSurveyTable = createVisibleSurveyTable("applicant");
		displayVisibleSurveyTable(visibleSurveyTable);
		
	});

	$("#interviewerSurveyButton").unbind("click");
	$("#interviewerSurveyButton").click(function() {
		activeTable = "interviewer";
		visibleSurveyTable = createVisibleSurveyTable("interviewer");
		displayVisibleSurveyTable(visibleSurveyTable);
		
	});

	$("#referrerSurveyButton").unbind("click");
	$("#referrerSurveyButton").click(function() {
		activeTable = "referrer";
		visibleSurveyTable = createVisibleSurveyTable("referrer");
		displayVisibleSurveyTable(visibleSurveyTable);
		
	});

	$("#executiveSurveyButton").unbind("click");
	$("#executiveSurveyButton").click(function() {
		activeTable = "executive";
		visibleSurveyTable = createVisibleSurveyTable("executive");
		displayVisibleSurveyTable(visibleSurveyTable);		
	});

	$.each(surveyTable,function(questionKey, questionValue) {
		$("#question"+questionKey).unbind("click");
		$("#question"+questionKey).click(function() {
			$("#responses"+questionKey).toggle();
			//console.log("question "+questionKey+ " clicked");
		});
		//console.log("question " + questionKey +" defined");
	});
	
}

