/**
 * 
 */


var windowAspectReportsTable = "";
windowAspectReportsTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 620 ) {
	lowerBoxesHeight = 620;
}
if ( lowerBoxesMobileHeight < 500 ) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height",lowerBoxesHeight+"px").css("padding","25px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

underlineOnlyThisLink("#robustnessLink");


// Show a "loading" animation

deactivateTopbarLinks();
//displayTableSpinner(windowAspectReportsTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Applicant Report</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("padding-top","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h4  style="font-weight: lighter;">Number of applicants, offers, acceptances, hires and new hire turnover rates broken down by TalenTeck New Hire Turnover Risk Score Quartiles. New Hire Turnover Models were estimated on sample from August 2012 - June 2015 and tested on sample from July 2015 - December 2015</h4>');

$(selectorButtonBox).append(titleDiv);

/*var graphButton = $("<button></button>")
	.attr('id','reportsGraphButton')
	.attr('class','btn btn-default btn-block')
	.text("Graph")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','reportsTableButton')
.attr('class','btn btn-default btn-block disabled').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);

var robustnessButton = $("<button></button>")
.attr('id','robustnessGraphButton')
.attr('class','btn btn-default btn-block')
.text("Robustness")
.css("margin-bottom","10px")
.css("padding","10px")
.prop("disabled",true);
;
$(selectorButtonBox).append(robustnessButton);

if ( linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true  ) {
	var interviewerTableButton = $("<button></button>").attr('id','interviewerTableButton')
	.attr('class','btn btn-default btn-block')
	.text("Interviewer Report")
	.css("margin-bottom","10px").css("padding","10px")
	.prop("disabled",true);
	$(selectorButtonBox).append(interviewerTableButton);
}*/

if (  linksTable.containsKey("robustness") &&  linksTable.get("robustness") === true ) {
var robustnessButton = $("<button></button>").attr('id','robustnessButton')
.attr('class','btn btn-default btn-block').text("Model Robustness")
.css("margin-bottom","10px").css("padding","10px");

$(selectorButtonBox).append(robustnessButton);
}

if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
var applicantButton = $("<button></button>").attr('id','applicantButton')
.attr('class','btn btn-default btn-block').text("Applicant Report")
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);
$(selectorButtonBox).append(applicantButton);
}

if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
var interviewerButton = $("<button></button>").attr('id','interviewerButton')
.attr('class','btn btn-default btn-block').text("Interviewer Report")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(interviewerButton);
}
$(selectorButtonBox).append(titleDescDiv);
if ( windowAspectReportsTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableReportsTableSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var reportsRawTable = {};
var formattedTable = [];
var reportsTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var reportsSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

refreshReportsTable();

function refreshReportsTable() {

	var reportsSelectorsReturned = false;
	var reportsDataReturned = false;
	disableReportsTableSelectors();
    displayTableSpinner(windowAspectReportsTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsreports" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			selectorList = data.selectorList;
			//console.log("Initially, selectorList:")
			//console.log(selectorList);
			
			reportsSelectorsReturned = true;
			if (reportsDataReturned ) {
				//console.log("Hash table:");
	    		/*console.log(reportSelectionHashtable.entries());*/
				redrawReportsSelectorBoxes();
				var selectionList = queryReportsTableSelectorValues();
				//console.log(selectionList);
				var usedTable = reportsTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleReportsTable(usedTable);
					displayVisibleReportsTable(visibleTable);
				}				
			}
		}
	});

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "reportstable"  
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		reportsRawTable = data;
    		$(data.rows).each(function() {
    			reportsTableHashtable.put(this.selectorValues , this.quantiles);
    			reportsSelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		//console.log("Hash table:");
    		//console.log(reportsSelectionsHashtable.entries());    		
    		reportsDataReturned = true;
			if (reportsSelectorsReturned ) {
				redrawReportsSelectorBoxes();
				var selectionList = queryReportsTableSelectorValues();
				//console.log(selectionList);
				var usedTable = reportsTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleReportsTable(usedTable);
					displayVisibleReportsTable(visibleTable);
				}
			}
    	}
    });
}


function redrawReportsSelectorBoxes() {
	var activeSelectorsList = [];
	//console.log("selectorList:")
	//console.log(selectorList);
	$(selectorList).each(function() {
		var defaultFound = false;
		var allSelected = false;
		if (selectorsEverDrawn ) {
			var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
			if ( $("#" + this.selectorName + " option:selected").text().substring(0,6) !== "Select" && $("#" + this.selectorName + " option:selected").val() == this.defaultValue ) {
				allSelected = true;
			}
		}
		else {
			var usedDefaultValue = this.defaultValue;
		}
		  //$(selectorButtonBox).append(this.selectorName);
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
		.attr("class","form-control reportsTableSelect").attr("width","300px")
		.attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		$(this.selectorValues).each( function() {
    		var checkedSelectorValue = this.valueName;
    		if ( selectorsEverDrawn ) {
    			var thisSelection = [];
    			$(selectorList).each(function() {
    				if (this.selectorName != checkedSelectorName ) {
    					thisSelection.push({selectorName : this.selectorName ,
    										selectorValue : $("#" + this.selectorName + " option:selected").val() });
    				}
    				else {
    					thisSelection.push({selectorName : checkedSelectorName , 
    								selectorValue : checkedSelectorValue });
    				}
    			});
				var checkedHashEntry = reportsSelectionsHashtable.get(thisSelection);
				if ( checkedHashEntry != null ) {

					if ( checkedHashEntry == true ) {
		        		var thisValue = $("<option></option>").attr("value",checkedSelectorValue)
		    			.text(this.valueLabel);
		        		if ( this.valueLabel.substring(0,6) === "Select") {
		        			$(thisValue).attr("value", "All");
		        			$(thisValue).attr("disabled",true);
		        		}
		        		//console.log("checkedSelectorValue" + checkedSelectorValue + "usedDefaultValue" + usedDefaultValue);
		        		
		        		if ( defaultFound === false && checkedSelectorValue == usedDefaultValue && allSelected == false ) {
		        			$(thisValue).attr("selected","selected")
		        			defaultFound = true;
		        			//console.log("Checked off " + this.valueLabel + "with no allSelected");
		        		}
		        		if (allSelected == true && this.valueLabel.substring(0,6) !== "Select" && checkedSelectorValue == defaultValueHolder ) {
		        			$(thisValue).attr("selected","selected")
		        			defaultFound = true;		        			
		        			//console.log("Checked off " + this.valueLabel + "with allSelected");
		        		}
		            	$(thisSelector).append(thisValue);    			
		            	console.log(JSON.stringify(thisSelection) + " checked out!");
					}
					else {
						//console.log(JSON.stringify(thisSelection) + " did not check out. :(");
					}
				}
				else {
					//console.log("Did not find " + JSON.stringify(thisSelection));
				}
    		}
    		else {
        		var thisValue = $("<option></option>").attr("value",this.valueName)
    			.text(this.valueLabel);
        		if ( this.valueLabel.substring(0,6) === "Select") {
        			$(thisValue).attr("disabled",true);
        		}
            	$(thisSelector).append(thisValue);    			
    		}

    	});
    	activeSelectorsList.push(thisSelector);
	});
	/*var titleDivDetached = $("#titleDiv").detach();
	var reportsGraphButtonDetached = $("#reportsGraphButton").detach();
	var reportsTableButtonDetached = $("#reportsTableButton").detach();
	if (  linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true ) {
		var interviewerTableButtonDetached = $("#interviewerTableButton").detach();		
	}
	if (  linksTable.containsKey("robustness") &&  linksTable.get("robustness") === true ) {
		var robustnessGraphButtonDetached = $("#robustnessGraphButton").detach();		
	}

	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(reportsGraphButtonDetached);
	$(selectorButtonBox).append(reportsTableButtonDetached);
	$(selectorButtonBox).append(robustnessGraphButtonDetached);
	if (  linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true ) {
		$(selectorButtonBox).append(interviewerTableButtonDetached);		
	}*/
	
	var titleDivDetached = $("#titleDiv").detach();
	var interviewerButtonDetached = $("#interviewerButton").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var applicantButtonDetached = $("#applicantButton").detach();
	var robustnessButtonDetached = $("#robustnessButton").detach();
	
	$(selectorButtonBox).html(titleDivDetached);
	if (  linksTable.containsKey("robustness") &&  linksTable.get("robustness") === true ) {
	$(selectorButtonBox).append(robustnessButtonDetached);
	}
	
	if ( linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
		$(selectorButtonBox).append(applicantButtonDetached);
	}
	if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
		$(selectorButtonBox).append(interviewerButtonDetached);
	}
	
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	selectorsEverDrawn = true;
	$(selectorButtonBox).append(titleDescDivDetached);

	//console.log(activeSelectorsList);
}


function queryReportsTableSelectorValues() {
	var selectionList = [];
	$(".reportsTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
			console.log(thisSelection);
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function createVisibleReportsTable(tableData) {
	
	//console.log("tableData:");
	//console.log(tableData);
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectReportsTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectReportsTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 6*Math.floor((tableContainerWidth-60)/6);
	var columnWidth = Math.floor((tableWidth-60)/6);
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max((columnWidth-100)/2,5);
	
	var statistic = $("#statistic option:selected").val();
	var rate = $("#rate option:selected").val().substring(1);

	var rowLabels = ["Total Applicants","Total Offers","Total Accepts","Total Hires"];
	var narrowRowLabels = ["Total<br>Applied","Total<br>Offers","Total<br>Accepts","Total<br>Hires"];
	
	switch(statistic) {
	case "n":
		rowLabels = ["Total Applicants","Total Offers","Total Accepts","Total Hires"];
		narrowRowLabels = ["Total<br>Applied","Total<br>Offers","Total<br>Accepts","Total<br>Hires"];
	break;
	case "rate":
		rowLabels = ["Application Rate","Offer Rate","Accept Rate","Hire Rate"];
		narrowRowLabels = ["App<br>Rate","Offer<br>Rate","Accept<br>Rate","Hire<br>Rate"];
	break;
	case "freq":
		rowLabels = ["Fraction of Applicants","Fraction of  Offers","Fraction of Accepts","Fraction of Hires"];
		narrowRowLabels = ["Fraction<br>Applied","Fraction<br>Offers","Fraction<br>Accepts","Fraction<br>Hires"];
	break;
	case "mpt":
		rowLabels = ["Mean Score of Applicants","Mean Score of Offers","Mean Score of Accepts","Mean Score of Hires"];
		narrowRowLabels = ["Applied<br>Score","Offered<br>Score","Accepts<br>Score","Hired<br>Score"];
	break;
		
	}
	
	
	//console.log("Widths are "  + tableContainerWidth + " , "+ tableWidth + " , " + columnWidth);
	var visibleTable = $("<table></table>").attr("id","reportsTable").attr("class","table")
						.css("width",tableWidth)
						//.css("height",tableContainerHeight)
						.css("padding-left","0px")
						.css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>")
						.attr("id","reportsThead")
						.css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>")
						.attr("id","reportsTbody")
						.css("width",tableWidth);
						//.css("overflow-y","scroll").css("position","absolute")

	var titleRow = $("<tr></tr>").attr("id","titleRow")
						.css("width",tableWidth);

	var headerRightPadding = Math.max((columnWidth-150)/2,5);
	if ( tableWidth < 850 ) {
		var headerRightPadding = Math.max((columnWidth-100)/2,5);
		var quantileTH = $("<th></th>")
			.html("Score<br>Qtile")
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("padding-left","10px")
			.css("padding-right",headerRightPadding+"px");
		var appliedTH = $("<th></th>")
			.html(narrowRowLabels[0])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var offeredTH = $("<th></th>")
			.html(narrowRowLabels[1])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var acceptedTH = $("<th></th>")
			.html(narrowRowLabels[2])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var hiredTH = $("<th></th>")
			.html(narrowRowLabels[3])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var turnoverTH = $("<th></th>")
			.html(rate+"-Day<br>TO")
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		
	}
	else {
		var quantileTH = $("<th></th>")
			.html("Applicant Score")
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("padding-left","10px")
			.css("padding-right",headerRightPadding+"px");
		var appliedTH = $("<th></th>")
			.html(rowLabels[0])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var offeredTH = $("<th></th>")
			.html(rowLabels[1])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var acceptedTH = $("<th></th>")
			.html(rowLabels[2])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var hiredTH = $("<th></th>")
			.html(rowLabels[3])
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		var turnoverTH = $("<th></th>")
			.html(rate+"-Day Turnover")
			.attr("class","reportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","right")
			.css("padding-right",headerRightPadding+"px");
		
	}
	//var tailTH = $("<th></th>").attr("class","reportsRowLabelTD").css("width",45).css("padding-right","0px");
	
	$(titleRow).append(quantileTH).append(appliedTH).append(offeredTH).append(acceptedTH).append(hiredTH)
		.append(turnoverTH);
	$(visibleThead).append(titleRow);

	var largestQuantile  = 0;
	$(tableData).each( function(index) {
		if (this.quantileNumber > largestQuantile ) {
			largestQuantile = this.quantileNumber;
		}
	});

	
	$(tableData).each( function(index) {
		if ( this.quantileNumber != 0 ) {
			var quantileLabel = (this.quantileNumber == 1) ? "Best Quartile" :
				(this.quantileNumber == largestQuantile) ? "Worst Quartile" : 
					(this.quantileNumber == 2) ? "2nd Quartile" :
						(this.quantileNumber == 3) ? "3rd Quartile" :
							this.quantileNumber;
 			var thisRow = $("<tr></tr>")
				.css("height","25px")
				.css("width",tbodyWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px");
			var titleTD = $("<td></td>")
				.text(quantileLabel)			
				.attr("class","reportsRowLabelTD")
				.css("width",columnWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px")
				.css("padding-left","10px")
				.css("padding-right",rightPadding+"px");
			if ( statistic === "n" ) {
				var appliedTD = $("<td></td>")
					.text(addCommas(this.applied))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(addCommas(this.offered))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(addCommas(this.accepted))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(addCommas(this.hired))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(toPercent(this.turnover,this.turnover+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}
			else {
				var appliedTD = $("<td></td>")
					.text(toPercent(this.applied,this.applied+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(toPercent(this.offered,this.offered+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(toPercent(this.accepted,this.accepted+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(toPercent(this.hired,this.hired+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(toPercent(this.turnover,this.turnover+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}

			$(thisRow).append(titleTD).append(appliedTD).append(offeredTD).append(acceptedTD).append(hiredTD)
			.append(turnoverTD);
			$(visibleTbody).append(thisRow);
		}
		
			
	});
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber == 0 ) {
			var thisRow = $("<tr></tr>")
				.css("height","25px")
				.css("width",tbodyWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px");
			var titleTD = $("<td></td>")
				.text("Overall")
				.attr("class","reportsRowLabelTD")
				.css("width",columnWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px")
				.css("padding-left","10px")
				.css("padding-right",rightPadding+"px");

			if ( statistic === "n" ) {
				var appliedTD = $("<td></td>")
					.text(addCommas(this.applied))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(addCommas(this.offered))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(addCommas(this.accepted))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(addCommas(this.hired))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(toPercent(this.turnover,this.turnover+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}
			else {
				var appliedTD = $("<td></td>")
					.text(toPercent(this.applied,this.applied+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(toPercent(this.offered,this.offered+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(toPercent(this.accepted,this.accepted+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(toPercent(this.hired,this.hired+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(toPercent(this.turnover,this.turnover+1))
					.attr("class","reportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}

			$(thisRow).append(titleTD).append(appliedTD).append(offeredTD).append(acceptedTD).append(hiredTD)
				.append(turnoverTD);
			$(visibleTbody).append(thisRow);
		}
	});
	
	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}

function displayVisibleReportsTable(visibleTable) {
	windowAspectReportsTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectReportsTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	if(displayAreaHeight < 690) {
		displayAreaHeight = 690;
	}
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	reportsTableDiv = $("<div></div>").attr("id","reportsTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");

	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','reportsTableButton');
	var menuItem2 = $('<a class="btn btn-default">Graph</a>').attr('id','reportsGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	
	if ( windowAspectReportsTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area").append(reportsTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").html(reportsTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#reportsTableDiv").css("height",tableContainerMobileHeight);
	}

	$(reportsTableDiv).html(visibleTable);
	redrawReportsSelectorBoxes();
	addReportsTableResizeListener();
	enableReportsTableSelectors();
	activateReportsTableSelectors();

}

function objSelectionIsEqual(obj1 , obj2) {
	var isEqual = true;
	$(selectorList).each(function() {
		if ( obj1[this.selectorName] !== obj2[this.selectorName] ) {
			isEqual = false;
		}
	});
	return isEqual;
}

function selectionIsEqual(selection1,selection2) {
	if ( selection1.length != selection2.length ) {
		return false;
	}
	$(selection1).each(function() {
		var foundSelector = false;
		var checkSelectorName = this.selectorName;
		var checkSelectorValue = this.selectorValue;
		$(selection2).each(function() {
			if ( checkSelectorName === this.selectorName ) {
				if (checkSelectorValue !== this.selectorValue ) {
					return false;
				}
				foundSelector = true;
			}
		});
		if ( foundSelector == false ) {
			return false;
		}
	});
	return true;
	
}

function selectionHashCode(selection) {
	return JSON.stringify(selection);
}


function disableReportsTableSelectors() {
	deactivateTopbarLinks();
	$(".reportsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#reportsGraphButton").prop("disabled",true);
	//$("#robustnessGraphButton").prop("disabled",true);
	$("#robustnessButton").prop("disabled",true);
	$("#interviewerButton").prop("disabled",true);


}

function enableReportsTableSelectors() {
	activateTopbarLinks();
	$(".reportsTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#reportsGraphButton").prop("disabled",false);
	//$("#robustnessGraphButton").prop("disabled",false);
	//$("#interviewerTableButton").prop("disabled",false);
	$("#robustnessButton").prop("disabled",false);
	$("#interviewerButton").prop("disabled",false);
}


function activateReportsTableSelectors() {
	$(".reportsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableReportsTableSelectors()
			var selectionList = queryReportsTableSelectorValues();
			var usedTable = reportsTableHashtable.get(selectionList);
			//console.log("usedTable:");
			//console.log(usedTable);
			if (usedTable != null ) {
				visibleTable = createVisibleReportsTable(usedTable);
				displayVisibleReportsTable(visibleTable);
			}
		});
	});
	$("#reportsGraphButton").unbind("click");
	$("#reportsGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportsgraph.js",dataType: "script"});
	});
	/*$("#interviewerTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitygraph.js",dataType: "script"});
	});
	$("#robustnessGraphButton").unbind("click");
	$("#robustnessGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnessgraph.js",dataType: "script"});
	});*/
	$("#robustnessButton").unbind("click");
	$("#robustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
	});
	
	$("#interviewerButton").unbind("click");
	$("#interviewerButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitygraph.js",dataType: "script"});
	});

}

function addReportsTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectReportsTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectReportsTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);		
			var reportsTableHolder = $("#reportsTableDiv").detach();
			$("#display-area-xs").html(reportsTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectReportsTable = "mobile";
		}
		if ( windowAspectReportsTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);		
			var reportsTableHolder = $("#reportsTableDiv").detach();
			$("#display-area").html(reportsTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectReportsTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectReportsTable != "mobile" ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		if(displayAreaHeight < 620) {
			displayAreaHeight = 620;
		}
		var displayAreaMobileHeight = 500;
		var tableContainerMobileHeight = 450;
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#reportsTableDiv").css("width",tableContainerWidth);
		var selectionList = queryReportsTableSelectorValues();
		var usedTable = reportsTableHashtable.get(selectionList);
		//console.log("usedTable:");
		//console.log(usedTable);
		if (usedTable != null ) {
			visibleTable = createVisibleReportsTable(usedTable);
		}
		$("#reportsTableDiv").html(visibleTable);
		
		if ( windowAspectReportsTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#reportsTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#reportsTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




function reportsCellColor(tstat){
	if ( tstat < -2.576 ) {
		return "#99ff99";
	}
	if ( tstat < -1.96 ) {
		return "#bbffbb";
	}
	if ( tstat < -1.645 ) {
		return "ddffdd";
	}
	if ( tstat > 2.576 ) {
		return "#ff9999";
	}
	if ( tstat > 1.96 ) {
		return "#ffbbbb";
	}
	if ( tstat > 1.645 ) {
		return "#ffdddd";
	}
	
	return "#ffffff";
}

