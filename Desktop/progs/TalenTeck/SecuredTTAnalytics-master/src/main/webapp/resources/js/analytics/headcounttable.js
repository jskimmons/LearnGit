loadCSS = function(href) {
     var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
     $("head").append(cssLink); 
};
loadCSS("../resources/css/analytics/headcounttable.css");


// No selectors for this table, so we just need the table/chart switcher....

var windowAspectHeadcountGraph = "";
windowAspectHeadcountGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

displayHeadcountTableSpinner();


var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Employees</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Employee headcount, new hires and terminations, and annual seat turnover rates.</h4>');


$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

if ( windowAspectHeadcountGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

underlineOnlyThisLink("#headcountLink");


//Display a "loading" spinner......

disableHeadcountTableSelectors();

var fullHeadcountTable = [];
var firstColumn = 0;
var headcountTableDiv;
$.ajax({ type: "POST" ,
	url: "../ReturnQuery" , 
	data: { type : "headcounttable" } ,
	dataType: "json" ,
	success: function(data) {
		//console.log(data);
		var headcountPeriodRow = {
				rowType: "headcountPeriodRow",
				rowLabel: "",
				rowAllValue: "Past Year",
				rowData: []
		};
		var firstMonthNo = 12*data.firstMonthYear + data.firstMonth - 1;
		var lastMonthNo = 12*data.lastMonthYear + data.lastMonth - 1;
		
		var headcountPeriodRowData = [];
		var shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		for (var thisMonthNo = firstMonthNo ; thisMonthNo <= lastMonthNo ; thisMonthNo++ ) {
			var thisMonthYear = Math.floor(thisMonthNo/12);
			var thisMonthMonthNo = thisMonthNo - 12*thisMonthYear;
			var thisMonthMonth = shortMonths[thisMonthMonthNo];
			var thisMonthLabel = thisMonthMonth + " " + thisMonthYear;
			//console.log([thisMonthYear,thisMonthMonthNo,thisMonthMonth,thisMonthLabel]);
			headcountPeriodRowData.unshift(thisMonthLabel);
		}
		//console.log(headcountPeriodRowData);
		//console.log([data.firstMonthYear, data.firstMonth, data.lastMonthYear , data.lastMonth, firstMonthNo, lastMonthNo,0]);
		headcountPeriodRow.rowData = headcountPeriodRowData;
		//Do this down below so we can get the "all" part at the top first:
		//fullHeadcountTable.push(headcountPeriodRow);

		var allTable = [];
		$(data.filterList).each( function(){
			var blankRow = {
					rowType: "blank",
					rowLabel: "",
					rowAllValue: "",
					rowData: []
			};
			fullHeadcountTable.push(blankRow);
			var groupLabelRow = {
					rowType: "groupLabel",
					rowLabel: this.filterName,
					rowAllValue: "",
					rowData: []
			};
			if ( this.filterName !== "All") {
				fullHeadcountTable.push(groupLabelRow);				
			}
			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
			$(sortedFilterValues).each( function() {
				var categoryLabelRow = {
						rowType: "categoryLabel",
						rowLabel: this.filterValue,
						rowAllValue: "",
						rowData: []
				};
				if ( this.filterValue == "All") {
					categoryLabelRow.rowType = "groupLabel";
					allTable.push(categoryLabelRow);
				}
				else {
					fullHeadcountTable.push(categoryLabelRow);
				}
				var thisEmploymentRow = {
						rowType: "headcountDataRow",
						rowLabel: "Employees",
						rowAllValue: "",
						rowData: []
				}; 
				var thisHiresRow = {
						rowType: "headcountDataRow",
						rowLabel: "Hires",
						rowAllValue: "",
						rowData: []
				}; 
				var thisTerminationsRow = {
						rowType: "headcountDataRow",
						rowLabel: "Terminations",
						rowAllValue: "",
						rowData: []
				}; 
				var thisTurnoverRow = {
						rowType: "headcountDataRow",
						rowLabel: "Seat Turnover",
						rowAllValue: "",
						rowData: []
				}; 
				var employmentArray = [];
				var hiresArray = [];
				var terminationsArray = [];
				var turnoverArray=[];
				var lastYearEmployment = 0;
				var lastYearHires = 0;
				var lastYearTerminations = 0;
				var lastYearTurnover=0;
				$(this.periodList).each( function() {
					if ( this.month == 0 && this.year == 0 ) {
						lastYearEmployment = addCommas(this.startEmployment);
						lastYearHires = addCommas(this.hires);
						lastYearTerminations = addCommas(this.terminations);
						lastYearTurnover=toPercent(((this.hires+this.terminations)/2)/this.startEmployment,this.startEmployment);
					}
					else {
						employmentArray.unshift(addCommas(this.startEmployment));
						hiresArray.unshift(addCommas(this.hires));
						terminationsArray.unshift(addCommas(this.terminations));
						turnoverArray.unshift(toPercent(((this.hires+this.terminations)*6)/this.startEmployment,this.startEmployment));
					}
				});
				
				thisEmploymentRow.rowData = employmentArray;
				thisHiresRow.rowData = hiresArray;
				thisTerminationsRow.rowData = terminationsArray;
				thisTurnoverRow.rowData = turnoverArray;
				thisEmploymentRow.rowAllValue = lastYearEmployment;
				thisHiresRow.rowAllValue = lastYearHires;
				thisTerminationsRow.rowAllValue = lastYearTerminations;
				thisTurnoverRow.rowAllValue = lastYearTurnover;

				if ( this.filterValue == "All") {
					allTable.push(thisEmploymentRow);
					allTable.push(thisHiresRow);
					allTable.push(thisTerminationsRow);
					allTable.push(thisTurnoverRow);
					Array.prototype.unshift.apply(fullHeadcountTable, allTable);
					//fullHeadcountTable.unshift(allTable);

				}
				else {
					fullHeadcountTable.push(thisEmploymentRow);
					fullHeadcountTable.push(thisHiresRow);
					fullHeadcountTable.push(thisTerminationsRow);
					fullHeadcountTable.push(thisTurnoverRow);
				}

			});

		});
		fullHeadcountTable.unshift(headcountPeriodRow);


		//console.log(fullHeadcountTable);
		
		// ... and finally render the chart

		windowAspectHeadcountGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

		var tableContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		var displayedColumns =  Math.max(Math.floor((tableContainerWidth-250)/100),2);
		tableContainerWidth = tableContainerWidth + "px";

		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		//var displayAreaMobileHeight = $(window).height() - 331;
		var displayAreaMobileHeight = Math.max($(window).height() - 366,500);
		var tableContainerMobileHeight = Math.max($(window).height() - 401,440);
		
		var visibleTable = createVisibleHeadcountTable(fullHeadcountTable);
		headcountTableDiv = $("<div></div>").attr("id","headcountTableDiv")
			.css("height",tableContainerHeight).css("width",tableContainerWidth).css("vertical-align","middle")
			.css("display","inline-block").css("margin-top","30px").css("margin-left","25px");
		//Attach first, otherwise AmCharts won't work....
		/*var outerTable = $('<table><tbody>' +
				'<tr id="overTableTR"></tr>' +
				'<tr id="tableTR"><td id="tableTD"></td></tr>' +
				'</tbody></table>').attr("id","outerTable");*/
		//$(headcountTableDiv).html(outerTable);
		$("#menuDiv").detach();

		var menuDiv = $("<div></div>").attr("id","menuDiv")
				.css("height","30px").attr("class","btn-group-justified");
		
		var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','headcountTableButton');
		var menuItem2 = $('<a class="btn btn-default ">Graph</a>').attr('id','headcountGraphButton');
		menuDiv.append(menuItem1).append(menuItem2);
		
		
		if ( windowAspectHeadcountGraph == "desktop") {
			var displayWidth = $( window ).width() - 250;
			$("#menuDiv").css("width",displayWidth);
			$("#display-area").html(menuDiv);
    		$("#display-area").append(headcountTableDiv).css("width",displayWidth+"px").css("height",displayAreaHeight+"px");
    		$("#leftbar-div").css("height",displayAreaHeight);
		}
		else {
			var displayWidth = $( window ).width();
			$("#menuDiv").css("width",displayWidth);
			$("#display-area-xs").html(menuDiv);
    		$("#display-area-xs").append(headcountTableDiv).css("width",displayWidth+ "px");
    		$("#display-area-xs").css("height",displayAreaMobileHeight+ "px");
    		$("#headcountTableDiv").css("height",tableContainerMobileHeight+ "px");
		}

		//$("#tableTD").html(visibleTable);
		$(headcountTableDiv).html(visibleTable);
		addHeadcountResizeListener();
		addScrollButtonListeners();
		enableHeadcountTableSelectors();
		resetGraphButtonListener();

	}
});

function addHeadcountResizeListener() {
	   $(window).off("resize");
	   $(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectHeadcountGraph + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectHeadcountGraph == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
	   		//var headcountTableHolder = $("#headcountTableDiv");
			var headcountTableHolder = $("#headcountTableDiv").detach();
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			$("#display-area-xs").append(headcountTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectHeadcountGraph = "mobile";
		}
		if ( windowAspectHeadcountGraph != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			//var headcountTableHolder = $("#headcountTableDiv");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);
			var headcountTableHolder = $("#headcountTableDiv").detach();
			$("#display-area").append(headcountTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectHeadcountGraph = "desktop";
		}
		
		var tableContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		var displayAreaMobileHeight = Math.max($(window).height() - 366,500);
		var tableContainerMobileHeight = Math.max($(window).height() - 401,440);
		
		var displayWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() : $( window ).width() - 250;
		$("#display-area").css("width",displayWidth+ "px");
		$("#headcountTableDiv").css("width",tableContainerWidth+ "px");
		var visibleTable = createVisibleHeadcountTable(fullHeadcountTable);
		$("#headcountTableDiv").html(visibleTable);
		
		if ( windowAspectHeadcountGraph == "desktop") {
			var displayWidth = $( window ).width() - 250;
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight+ "px");
    		$("#leftbar-div").css("height",displayAreaHeight+ "px");
    		$("#headcountTableDiv").css("height",tableContainerHeight+ "px");
		}
		else {
			var displayWidth = $( window ).width();
    		$("#display-area-xs").css("width",displayWidth+ "px");
    		$("#display-area-xs").css("height",displayAreaMobileHeight+ "px");
    		$("#headcountTableDiv").css("height",tableContainerMobileHeight+ "px");
		}
		addScrollButtonListeners();
		resetGraphButtonListener();
		adjustTopbarPadding();

	
	});
}

function oldFnScroll() {
    var _left = $('#headcountTableContainer').scrollLeft();
    $('#table th').css('left', _left);
   // $("#table th").css({'-webkit-transform': 'translate3d(' + $("#headcountTableContainer").scrollLeft() + 'px, 0, 0)'});
}

function fnScroll() {
	$('#periodLabelDiv').scrollLeft($('#scrollingDiv').scrollLeft());
	  $('#leftColumnDiv').scrollTop($('#scrollingDiv').scrollTop());
	  //console.log("Scrolls are " + $('#scrollingDiv').scrollLeft() + " and " + $('#scrollingDiv').scrollTop());
}

function createVisibleHeadcountTable(tableData) {
	
	var tableContainerHeight = $(window).height() - 111;
	if (windowAspectHeadcountGraph == "mobile" ) {
		tableContainerHeight = 440;
	}
	var tableContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var tbodyWidth = tableContainerWidth;
	//var lesserWidth = 250 + (lastPeriod-firstPeriod+1)*100;
	//var extraWidth = tbodyWidth - lesserWidth+100;
	//var lesserWidth = tableContainerWidth - 25;
	//var padding = extraWidth - 90;
	var scrollingWidth = tbodyWidth - 240;
	var scrollingHeight = tableContainerHeight - 35;
	var titleBarWidth = scrollingWidth - 15;
	var leftColumnHeight = scrollingHeight - 15;
	
	var visibleTable =  $("<table></table>")
						.attr("id","headcountTable");
	var visibleBody=$("<tbody></tbody>")
						.css("height",tableContainerHeight+"px");
	var periodLabelTbody =  $("<tbody></tbody>")
		.attr("id","periodLabelTbody");
	var headcountPeriodLabelTable =  $("<table></table>")
		.attr("id","headcountPeriodLabelTable")
		.html(periodLabelTbody);
	var periodLabelDiv = $("<div></div>")
		.attr("id","periodLabelDiv")
		.html(headcountPeriodLabelTable)
		.css("overflow","hidden")
		.css("width",(titleBarWidth+15) +"px");
	var leftColumnTbody =  $("<tbody></tbody>")
		.attr("id","leftColumnTbody");
	var headcountLeftColumnTable =  $("<table></table>")
		.attr("id","headcountLeftColumnTable")
		.html(leftColumnTbody);
	var leftColumnDiv = $("<div></div>")
		.attr("id","leftColumnDiv")
		.html(headcountLeftColumnTable)
		.css("overflow","hidden")
		.css("height",leftColumnHeight+"px");
	var scrollingTbody =  $("<tbody></tbody>")
		.attr("id","scrollingTbody");
	var scrollingTable =  $("<table></table>")
		.attr("id","headcountScrollingTable")
		.html(scrollingTbody);
	var scrollingDiv = $("<div></div>")
		.attr("id","scrollingDiv")
		.css("overflow","scroll")
		.css("width",scrollingWidth+"px")
		.css("height",scrollingHeight+"px")
		.css("position","relative")
		.scroll(function() {
			$('#periodLabelDiv').scrollLeft($('#scrollingDiv').scrollLeft());
			$('#leftColumnDiv').scrollTop($('#scrollingDiv').scrollTop());
			//console.log("Scrolls are " + $('#scrollingDiv').scrollLeft() + " and " + $('#scrollingDiv').scrollTop());
		})
		.html(scrollingTable);

	var pastYearTD = $("<td></td>")
			.attr("class","lastYearTD")
			.attr("id","headcountCornerTD")
			.html("Past Year")
			.css("width","240px")
			.css("padding-right","10px")
			.css("text-align","right");			
	var periodLabelOuterTD = $("<td></td>")
			.attr("id","periodLabelOuterTD")
			.html(periodLabelDiv);
	var rightMarginTD = $("<td></td>")
			.attr("class","lastYearTD")
			.attr("id","headcountRightMarginTD")
			.css("width","15px");
	var fixedTR = $("<tr></tr>")
			.attr("id","fixedTR")
			.html(pastYearTD)
			.append(periodLabelOuterTD);
			//.append(rightMarginTD);
	var leftColumnOuterTD = $("<td></td>")
			.attr("id","leftColumnOuterTD")
			.html(leftColumnDiv);
	var scrollingOuterTD = $("<td></td>")
			.attr("id","scrollingOuterTD")
			.attr("rowspan","2")
			.attr("colspan","2")
			.html(scrollingDiv);
	var movingTR = $("<tr></tr>")
			.attr("id","movingTR")
			.html(leftColumnOuterTD)
			.append(scrollingOuterTD);
	var footerTD = $("<td></td>")
			.attr("id","headcountFooterTD")
			.attr("class","footerTD");
	var footerTR = $("<tr></tr>")
	.attr("id","headcountFooterTR")
	.html(footerTD)
	.css("height","15px");
	$(visibleTable).html(fixedTR).append(movingTR).append(footerTR);

	if ( !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ) {
	//if ( true ) {
		//$(rightMarginTD).css("background-color","#EEEEEE");
		$(footerTD).css("background-color","#EEEEEE");
		$(leftColumnDiv).css("height",(leftColumnHeight+15)+"px");
		$(periodLabelDiv).css("width",(titleBarWidth+15)+"px");
		$(footerTR).css("height","0px");
		$(footerTD).css("height","0px");
		$(leftColumnOuterTD).css("width","0px")
	}

	
	$(fullHeadcountTable).each( function(index) {
		if ( index == 0) {
			/*var freezeHeaderRow = $("<tr></tr>")
									.attr("class",this.rowType)
									.attr("id","headcountPeriodRow");
			var titleTD = $("<th></th>")
							.append(  $("<div></div>").html(this.rowLabel).attr("class","tableCell")  )
							.attr("class","rowLabelTD");			
			var lastYearTD = $("<th></th>")
							.append( $("<div></div>").html(this.rowAllValue).attr("class","tableCell"))
							.attr("class","lastYearTD");	
			freezeHeaderRow.append(titleTD).append(lastYearTD);*/
			var periodRowInnerTR = $("<tr></tr>")
									.attr("id","periodRowInnerTR");
			for (var i = 0 ; i  < fullHeadcountTable[0].rowData.length ; i++ ) {		        
				var contentTD = $("<td></td>")
								.html(this.rowData[i])
								.attr("class","contentTD");
				periodRowInnerTR.append(contentTD);
			}
			$(headcountPeriodLabelTable).append(periodRowInnerTR);
		}
		else {
			var fixedRow = $("<tr></tr>").attr("class",this.rowType);
			var movingRow = $("<tr></tr>").attr("class",this.rowType);
			var titleTD = $("<td></td>")
							.html(this.rowLabel)
							.attr("class","rowLabelTD")
							.css("min-width","120px");
			
			var lastYearTD = $("<td></td>")
							.html(this.rowAllValue)
							.attr("class","lastYearTD")
							.css("min-width","120px")
							
			fixedRow.append(titleTD).append(lastYearTD);

			for (var i = 0 ; i < fullHeadcountTable[0].rowData.length ; i++ ) {
					var contentTD = $("<td></td>")
								.html(this.rowData[i])
								.attr("class","contentTD")
					if($(contentTD).html()){
						$(contentTD).css("background-color","#FFFFFF");
					}
				movingRow.append(contentTD);
			}
			$(leftColumnTbody).append(fixedRow);
			$(scrollingTbody).append(movingRow);
		}		
	});
	


	return visibleTable;
	
}

// When the table is redrawn, the scroll bar resets.  So this function
// is to shift the time period without redrawing the table
function shiftPeriodInPlace(firstPeriod){
	//console.log(firstPeriod);
	$("#headcountPeriodRow").children().each(function(index) {
		//console.log(this);
		//console.log(fullHeadcountTable[0].rowData[firstPeriod+index-2]);
		if ( index >= 2 && index <= fullHeadcountTable[0].rowData.length - firstPeriod + 1 ) {
			$(this).html(fullHeadcountTable[0].rowData[firstPeriod+index-2]);
			//console.log(fullHeadcountTable[0].rowData[firstPeriod+index-2]);
		}
	});
	$("#headcountTbody").children().each(function(rowIndex){
		if (rowIndex >= 1) {
			$(this).children().each(function(colIndex) {
				if ( colIndex >= 2 && colIndex <= fullHeadcountTable[0].rowData.length - firstPeriod + 1 ) {
					$(this).html(fullHeadcountTable[rowIndex+1].rowData[firstPeriod+colIndex-2]);
				}
			});
		}		
	});
}

// Not sure why, but each time the table gets rendered, the scroll buttons can
// lose their listening function and also their CSS attributes.  So this function refreshes it.
function addScrollButtonListeners() {
	$("#scrollLeftButton").unbind("click");
	if ( firstColumn < fullHeadcountTable[0].rowData.length - 1 ) {
		$("#scrollRightButton").attr("class","btn btn-info btn-sm");
	}
	if ( firstColumn > 0 ) {
		$("#scrollLeftButton").attr("class","btn btn-info btn-sm");
	}
	$("#scrollLeftButton").click(function() {
		if ( firstColumn > 0 ) {
			firstColumn--;
		}
		// Can't do "else" because value might have just decremented
		if (firstColumn <= 0) {
			$("#scrollLeftButton").attr("class","btn btn-sm disabled");
		}
		if ( firstColumn < fullHeadcountTable[0].rowData.length - 1 ) {
			$("#scrollRightButton").attr("class","btn btn-info btn-sm");
		}
		var tableContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		shiftPeriodInPlace(firstColumn);
	});
	$("#scrollRightButton").unbind("click");
	$("#scrollRightButton").click(function() {
		if ( firstColumn < fullHeadcountTable[0].rowData.length - $("#headcountPeriodRow").children().length +2 ) {
			firstColumn++;
		}
		// Can't do "else" because value might have just incremented
		if ( firstColumn >= fullHeadcountTable[0].rowData.length - $("#headcountPeriodRow").children().length +2 ) {
			$("#scrollRightButton").attr("class","btn btn-sm disabled");
		}
		if ( firstColumn > 0 ) {
			$("#scrollLeftButton").attr("class","btn btn-info btn-sm");
		}
		var tableContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		shiftPeriodInPlace(firstColumn);
	});

}

// For some reason this keeps coming unbound when one resets from mobile
// to desktop view. I think it's a bootstrap bug but anyway the solution
// is just to reset the binding when the view gets reset....
function resetGraphButtonListener() {
	$("#headcountGraphButton").unbind("click");
	$("#headcountGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/headcountgraph.js",dataType: "script"});
	});

}

function disableHeadcountTableSelectors() {
	deactivateTopbarLinks();
	$("#headcountGraphButton").unbind("click");
	$("#headcountGraphButton").prop("disabled",true);

}

function enableHeadcountTableSelectors() {
	activateTopbarLinks();
	$("#headcountGraphButton").prop("disabled",false);
}



function displayHeadcountTableSpinner() {
	var spinnerMargin = (windowAspectHeadcountGraph == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
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
	$("#spinnerDiv").append("<h2>Loading table....</h2>");
}

