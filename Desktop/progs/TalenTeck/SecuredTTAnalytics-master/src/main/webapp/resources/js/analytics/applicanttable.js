/**
 * 
 */


//No reason for the background to leak past the bottom of the page, unless the page is really short


var windowAspectApplicantTable = "";
windowAspectApplicantTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 500 ) {
	lowerBoxesHeight = 500;
}
if ( lowerBoxesMobileHeight < 500 ) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height",lowerBoxesHeight+"px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

underlineOnlyThisLink("#applicantLink");


// Show a "loading" animation


displayTableSpinner(windowAspectApplicantTable);



// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Applicants</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Description of recruitment and selection process.</h4>');

if ( linksTable.containsKey("markets") &&  linksTable.get("markets") === true  ) {
	var laborMarketButton = $("<button></button>").attr('id','laborMarketButton').attr('class','btn btn-default btn-block')
	.text("Labor Markets").css("margin-bottom","10px").css("padding","10px");
}

var applicantButton = $("<button></button>").attr('id','applicantButton').attr('class','btn btn-default btn-block').prop("disabled",true)
.text("Applicants").css("margin-bottom","10px").css("padding","10px");

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);
$(selectorButtonBox).append(applicantButton);
$(selectorButtonBox).append(laborMarketButton);


if ( windowAspectApplicantTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}


disableApplicantTableSelectors();

var rawApplicantTable = [];
var fullApplicantTable = [];
//var headcountChart = {};
$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getperiodlistapplicant" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			var periodSelector = $("<select></select>").attr("id","periodSelector")
			.attr("class","form-control ApplicantTableSelect").attr("width","300px")
			.attr("defaultValue",data.defaultValue);
			var defaultValue = $("<option></option>").attr("value","")
						.text("Select Time Period").attr("disabled",true);
			$(periodSelector).append(defaultValue);
			$(data.periods).each( function() {
				var thisValue = $("<option></option>").attr("value",this.periodName)
				.text(this.periodLabel);
				$(periodSelector).append(thisValue);
			});
			//Okay, we have the selectors; add them to the page
			$(selectorButtonBox).append(periodSelector);
			//var titleDescDivDetached = $("#titleDescDiv").detach();
			//$(selectorButtonBox).append(titleDescDivDetached);

			var selectedPeriod = $("#periodSelector option:selected").val();			  
			windowAspectApplicantTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

			//$("#leftbar-div").html(selectorButtonBox.clone());

		    //console.log(defaultSelectorList);
		    
		      // And now use them to fetch the data with the default values
		    
		    disableApplicantTableSelectors();
		    
		    $.ajax({ type: "POST" ,
		    	url: "../ReturnQuery" , 
		    	data: { type : "applicanttable" , 
		    			period : selectedPeriod
    				  } ,
		    	dataType: "json" ,
		    	success: function(data) {
		    		//console.log(data);
					//console.log(fullApplicantTable);
					
					rawApplicantTable = data.filterList;
					//parseRawApplicantTable("applied");
					parseRawApplicantTable("filterValue");					
					windowAspectApplicantTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
					applicantTableDiv = $("<div></div>")
						.attr("id","applicantTableDiv")
						.css("vertical-align","middle")
						.css("display","inline-block")
						.css("margin-top","30px")
						.css("margin-left","25px")
						.css("margin-right","25px");
					
					var menuDiv = $("<div></div>").attr("id","menuDiv")
					.css("height","30px").css("width","100%").attr("class","btn-group-justified");

					var menuItem2 = $('<a class="btn btn-default">Graph</a>').attr('id','applicantGraphButton');
					var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','applicantTableButton');
					menuDiv.append(menuItem1).append(menuItem2);	
					
					if ( windowAspectApplicantTable == "desktop") {
			    		$("#display-area").html(menuDiv)
			    		$("#display-area").append(applicantTableDiv)
					}
					else {
			    		$("#display-area-xs").html(menuDiv)
			    		$("#display-area-xs").append(applicantTableDiv)
					}					
					redrawApplicantTable();
					addApplicantTableResizeListener();
					enableApplicantTableSelectors();
					activateApplicantTableSelectors();
					resetApplicantGraphButtonListener();
		    	}
	    	});

		} 
});

function parseRawApplicantTable(sortColumn) {
	fullApplicantTable = [];
	var allTable = [];
	$(rawApplicantTable).each( function(){
		var blankRow = {
				rowType: "blank",
				rowLabel: "",
				applied : "",
				offered : "",
				accepted : "",
				hired   : "",
				offerRate : "" ,
				acceptRate : "" , 
				employRate : ""
		};
		fullApplicantTable.push(blankRow);
		var groupLabelRow = {
				rowType: "groupLabel",
				rowLabel: this.filterName,
				applied : "",
				offered : "",
				accepted : "",
				hired   : "",
				offerRate : "" ,
				acceptRate : "" , 
				employRate : ""
		};
		if (this.filterName !== "All" ) {
			fullApplicantTable.push(groupLabelRow);		    				
		}
		switch(sortColumn) {
		case "filterValue":
			var sortedFilterValues = this.filterValues.sort(function(a,b) { 
				return ((a[sortColumn]).toString().localeCompare((b[sortColumn]).toString()));  
			});
			break;
			default:
				var sortedFilterValues = this.filterValues.sort(function(a,b) { 
					return Math.sign(b[sortColumn] - a[sortColumn]);  
				});
			break;
		}
		$(sortedFilterValues).each( function() {
			var dataRow = {
					rowType: "applicantDataRow",
					rowLabel: this.filterValue,
					applied : addCommas(this.applied),
					offered : this.offered == -1 ? "N/A" : addCommas(this.offered),
	   				accepted : this.accepted == -1 ? "N/A" : addCommas(this.accepted),
 					hired   : this.hired == -1 ? "N/A" : addCommas(this.hired),
					offerRate : toPercent(this.offerRate,this.offerRate + 1),
					acceptRate : toPercent(this.offeredAcceptRate,this.offeredAcceptRate + 1) , 
					employRate : toPercent(this.employRate,this.employRate + 1)
			};
			if ( this.filterValue == "All") {
				allTable.push(dataRow);
			}
			else {
				fullApplicantTable.push(dataRow);
			}
		});

	});
	Array.prototype.unshift.apply(fullApplicantTable, allTable);

}

function addApplicantTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		redrawApplicantTable();
	});
}
		
function redrawApplicantTable() {
	var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	if ( windowAspectApplicantTable == "desktop" && newWindowAspect == "mobile" ) {
		var applicantTableHolder = $("#applicantTableDiv").detach();
		var menuHolder = $("#menuDiv").detach();
		$("#display-area-xs").html(menuHolder);
		$("#display-area-xs").append(applicantTableHolder);
		$("#leftbar-div-xs").html(selectorButtonBox);
		windowAspectApplicantTable = "mobile";
	}
	if ( windowAspectApplicantTable != "desktop" && newWindowAspect == "desktop" ) {
		var applicantTableHolder = $("#applicantTableDiv").detach();
		var menuHolder = $("#menuDiv").detach();
		$("#display-area").html(menuHolder);
		$("#display-area").append(applicantTableHolder);
		$("#leftbar-div").html(selectorButtonBox);
		windowAspectApplicantTable = "desktop";
	}

	if ( $(window).width()  < 1200 ) {
		$("#appliedTH").html("<br>Applied");
		$("#offeredTH").html("<br>Offered");
		$("#acceptedTH").html("<br>Accepted");
		$("#hiredTH").html("<br>Hired");
		$("#offerRateTH").html("Offer<br>Rate");
		$("#acceptRateTH").html("Accept<br>Rate&nbsp;&nbsp;");
		$("#employRateTH").html("Hire<br>Rate");
	}
	else {
		$("#appliedTH").html("Applied");
		$("#offeredTH").html("Offered");
		$("#acceptedTH").html("Accepted");
		$("#hiredTH").html("Hired");
		$("#offerRateTH").html("Offer Rate");
		$("#acceptRateTH").html("Accept Rate");
		$("#employRateTH").html("Hire Rate");			
	}
	var tableContainerWidth = (windowAspectApplicantTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = $(window).height() - 331;
	var tableContainerMobileHeight = $(window).height() - 400;
	tableContainerHeight = tableContainerHeight + "px";
	tableContainerMobileHeight = tableContainerMobileHeight + "px";
	displayAreaHeight = displayAreaHeight  + "px";
	displayAreaMobileHeight = displayAreaMobileHeight  + "px";
	
	var displayWidth = (windowAspectApplicantTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	tableContainerWidth = tableContainerWidth + "px";
	$("#applicantTableDiv").css("width",tableContainerWidth);
	var visibleTable = createVisibleApplicantTable(fullApplicantTable);
	$("#applicantTableDiv").html(visibleTable);
	
	if ( windowAspectApplicantTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
		$("#applicantTableDiv").css("height",tableContainerHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#display-area-xs").css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#applicantTableDiv").css("height",tableContainerMobileHeight);
	}

	$(applicantTableDiv).html(visibleTable);

	var totalHeight = 0;
	/*var tbodyCSSHeight = parseFloat($("#applicantTbody").css("height"),10);
	$("#applicantTbody").children().each(function(){
	    totalHeight = totalHeight + $(this).outerHeight(true);
	});
	if ( tbodyCSSHeight > totalHeight ) {
		$("#applicantTbody").css("height",(totalHeight)+"px").css("overflow-y","visible");
		$("#tailTH").css("width","30px");
		var tailTailTH = $("<th></th>").attr("class","rowLabelTD").css("width","30px").css("padding-right","0px").css("background-color","#F2F5F8").css("border-bottom","none");
		$("#titleRow").append(tailTailTH);
		var tbodyCSSHeight = parseFloat($("#applicantTbody").css("height"),10);
	}	*/
	adjustTopbarPadding();
	addApplicantSortClickListeners();
}



function createVisibleApplicantTable(tableData) {	
	var tableContainerHeight = $(window).height() - 145;
	if (windowAspectApplicantTable == "mobile" ) {
		tableContainerHeight = 500;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectApplicantTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 515 ) {
		tableContainerWidth = 515;
	}
	var tableWidth = 410 + 7*Math.floor((tableContainerWidth - 515)/7);
	var firstColumnWidth = 125 + Math.floor((tableWidth-410)/7);
	var dataColumnWidth = 40 + Math.floor((tableWidth-410)/7);
	tbodyWidth = firstColumnWidth + 6*dataColumnWidth + 45;
		
	var visibleTable = $("<table></table>").attr("id","applicantTable").attr("class","table")
						.css("width",tableWidth)
						.css("padding-left","0px").css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>").attr("id","applicantThead").css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id","applicantTbody")
						.css("overflow-y","scroll").css("position","absolute")
						.css("height",tableContainerHeight).css("width",tbodyWidth);

	var titleRow = $("<tr></tr>").attr("class",this.rowType).attr("id","titleRow").css("min-width",tableWidth).css("background-color","#AAAAAA");
	$("groupLabel").css("font-weight", "bold");
	var blankTH = $("<th></th>").attr("class","rowLabelTD").css("min-width",firstColumnWidth).css("padding-right","0px").css("vertical-align","bottom");//.css("padding-bottom","4px")
	var appliedTH = $("<th></th>").html("Applied").attr("class","rowLabelTD").attr("id","appliedTH").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var offeredTH = $("<th></th>").html("Offered").attr("class","rowLabelTD").attr("id","offeredTH").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var acceptedTH = $("<th></th>").html("Accepted").attr("class","rowLabelTD").attr("id","acceptedTH").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var hiredTH = $("<th></th>").html("Hired").attr("class","rowLabelTD").attr("id","hiredTH").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var offerRateTH = $("<th></th>").attr("id","offerRateTH").html("Offer Rate").attr("class","rowLabelTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var acceptRateTH = $("<th></th>").attr("id","acceptRateTH").html("Accept Rate").attr("class","rowLabelTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	var employRateTH = $("<th></th>").attr("id","employRateTH").html("Hire Rate").attr("class","rowLabelTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
	if ( $(window).width()  < 1200 ) {
		$(appliedTH).html("<br>Applied");
		$(offeredTH).html("<br>Offered");
		$(acceptedTH).html("<br>Accepted");
		$(hiredTH).html("<br>Hired");
		$(offerRateTH).html("Offer<br>Rate");
		$(acceptRateTH).html("Accept<br>Rate&nbsp;&nbsp;");
		$(employRateTH).html("Hire<br>Rate");
	}
	var tailTH = $("<th></th>").attr("class","rowLabelTD").attr("id","tailTH").css("min-width","45px");//.css("padding-right","0px");
	$(titleRow).append(blankTH).append(appliedTH).append(offeredTH).append(acceptedTH).append(hiredTH).append(offerRateTH).append(employRateTH).append(tailTH);
	
	if ( !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ) {
		$(tailTH).css("min-width","30px");
		var tailTailTH = $("<th></th>").attr("class","rowLabelTD").css("min-width","30px").css("padding-right","0px").css("background-color","rgb(170, 170, 170)");
		$(titleRow).append(tailTailTH);
	}
	$(visibleThead).append(titleRow);
	
	$(fullApplicantTable).each( function(index) {
		var thisRow = $("<tr></tr>").attr("class",this.rowType).css("height","25px").css("min-width",tbodyWidth);//.css("display","inline-table");
		var titleTD = $("<td></td>").text(this.rowLabel).attr("class","rowLabelTD").css("min-width",firstColumnWidth).css("vertical-align","bottom");//.css("padding-right","0px");
		var appliedTD = $("<td></td>").text(this.applied).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		var offeredTD = $("<td></td>").text(this.offered).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		var acceptedTD = $("<td></td>").text(this.accepted).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		var hiredTD = $("<td></td>").text(this.hired).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		var offerRateTD = $("<td></td>").text(this.offerRate).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		var acceptRateTD = $("<td></td>").text(this.acceptRate).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		if(index == 0) {
			var employRateTD = $("<td></td>").text(this.employRate).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("font-weight", "bold").css("vertical-align","bottom");//.css("padding-right","0px");
		}
		else {
			var employRateTD = $("<td></td>").text(this.employRate).attr("class","contentTD").css("min-width",dataColumnWidth).css("text-align","right").css("vertical-align","bottom");//.css("padding-right","0px");
		}
		var tailTD = $("<td></td>").attr("class","contentTD").css("min-width","45px");//.css("padding-right","0px");
		thisRow.append(titleTD).append(appliedTD).append(offeredTD).append(acceptedTD).append(hiredTD).append(offerRateTD).append(employRateTD).append(tailTD);
		$(visibleTbody).append(thisRow);
			
	});
	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}


function resetApplicantGraphButtonListener() {
	$("#applicantGraphButton").unbind("click");
	$("#applicantGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/applicantgraph.js",dataType: "script"});
	});

}

function disableApplicantTableSelectors() {
	deactivateTopbarLinks();
	$("#periodSelector").unbind("change");
	$("#periodSelector").prop("disabled",true);
	$("#laborMarketButton").unbind("click");
	$("#laborMarketButton").prop("disabled",true);
}

function enableApplicantTableSelectors() {
	activateTopbarLinks();
	$("#periodSelector").prop("disabled",false);
	$("#laborMarketButton").prop("disabled",false);
}


function activateApplicantTableSelectors() {
	$("#periodSelector").unbind("change");
	$("#periodSelector").change(function() {
		requeryAndRefreshApplicantTable();
	});
	$("#laborMarketButton").click(function() {
		$.ajax({type: "GET",url: "../resources/js/analytics/marketsgraph.js",dataType: "script"});
	});
}

function requeryAndRefreshApplicantTable() {
	var selectedPeriod = $("#periodSelector option:selected").val();
	displayTableSpinner(windowAspectApplicantTable);
	disableApplicantTableSelectors();
	$.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "applicanttable" , 
    			period : selectedPeriod
			  } ,
    	dataType: "json" ,
    	success: function(data) {
			rawApplicantTable = data.filterList;
			parseRawApplicantTable("filterValue");
			windowAspectApplicantTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
			applicantTableDiv = $("<div></div>")
				.attr("id","applicantTableDiv")
				.css("vertical-align","middle")
				.css("display","inline-block")
				.css("margin-top","30px")
				.css("margin-left","25px")
				.css("margin-right","25px");
			var menuDiv = $("<div></div>").attr("id","menuDiv")
			.css("height","30px").css("width","100%").attr("class","btn-group-justified");

			var menuItem1 = $('<a class="btn btn-default">Graph</a>').attr('id','applicantGraphButton');
			var menuItem2 = $('<a class="btn btn-default disabled">Table</a>').attr('id','applicantTableButton');
			menuDiv.append(menuItem1).append(menuItem2);
			
			if ( windowAspectApplicantTable == "desktop") {
	    		$("#display-area").html(menuDiv)
	    		$("#display-area").append(applicantTableDiv)

			}
			else {
	    		$("#display-area-xs").html(menuDiv);
	    		$("#display-area-xs").append(applicantTableDiv);

			}
			redrawApplicantTable();			
			addApplicantTableResizeListener();
			enableApplicantTableSelectors();
			activateApplicantTableSelectors();
			resetApplicantGraphButtonListener();
    	}
	});
}

function displayTableSpinner(windowAspect) {
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


function addApplicantSortClickListeners() {
	$("#appliedTH").click(function() {
		parseRawApplicantTable("applied");
		redrawApplicantTable();
	});
	$("#appliedTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$("#offeredTH").click(function() {
		parseRawApplicantTable("offered");
		redrawApplicantTable();
	});
	$("#offeredTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$("#acceptedTH").click(function() {
		parseRawApplicantTable("accepted");
		redrawApplicantTable();
	});
	$("#acceptedTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$("#hiredTH").click(function() {
		parseRawApplicantTable("hired");
		redrawApplicantTable();
	});
	$("#hiredTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$("#offerRateTH").click(function() {
		parseRawApplicantTable("offerRate");
		redrawApplicantTable();
	});
	$("#offerRateTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$("#employRateTH").click(function() {
		parseRawApplicantTable("employRate");
		redrawApplicantTable();
	});			
	$("#employRateTH").hover(function() {
	    $(this).css('cursor','pointer');
	}, function() {
	    $(this).css('cursor','auto');
	});
	$(".groupLabel").each(function() {
		$(this).click(function() {
			parseRawApplicantTable("filterValue");
			redrawApplicantTable();
		});			
		$(this).hover(function() {
		    $(this).css('cursor','pointer');
		}, function() {
		    $(this).css('cursor','auto');
		});
	});
}