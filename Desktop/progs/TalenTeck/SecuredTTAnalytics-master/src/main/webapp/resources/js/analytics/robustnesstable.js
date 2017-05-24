
var windowAspectRobustnessTable = "";
windowAspectRobustnessTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 690 ) {
	lowerBoxesHeight = 690;
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
//displayTableSpinner(windowAspectRobustnessTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Verification</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Models are estimated on a randomly chosen half of new hires; predicted and actual turnover rates are shown for the other half, broken down by TalenTeck turnover risk score categories.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

var applicantRobustnessButton = $("<button></button>").attr('id','applicantRobustnessButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);

var employeeRobustnessButton = $("<button></button>").attr('id','employeeRobustnessButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px");

$(selectorButtonBox).append(applicantRobustnessButton).append(employeeRobustnessButton);


/*var robustnessButton = $("<button></button>").attr('id','robustnessButton')
.attr('class','btn btn-default btn-block').text("Model Robustness")
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);

$(selectorButtonBox).append(robustnessButton);

if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
var applicantButton = $("<button></button>").attr('id','applicantButton')
.attr('class','btn btn-default btn-block').text("Applicant Report")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(applicantButton);
}

if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
var interviewerButton = $("<button></button>").attr('id','interviewerButton')
.attr('class','btn btn-default btn-block').text("Interviewer Report")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(interviewerButton);
}*/



if ( windowAspectRobustnessTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableRobustnessTableSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var robustnessRawTable = {};
var formattedTable = [];
var robustnessTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var robustnessSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

refreshRobustnessTable();

function refreshRobustnessTable() {

	var robustnessSelectorsReturned = false;
	var robustnessDataReturned = false;
	disableRobustnessTableSelectors();
    displayTableSpinner(windowAspectRobustnessTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsrobustness" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			var rawSelectorList = data.selectorList;
			var formattedSelectorList = [];
			//Get rid of time period selector
			$.each(rawSelectorList,function() {
				if ( this.selectorName != "periodName") {
					formattedSelectorList.push(this);
				}
			});
			selectorList = formattedSelectorList;
			//console.log("Initially, selectorList:")
			//console.log(selectorList);
			
			robustnessSelectorsReturned = true;
			if (robustnessDataReturned ) {
				//console.log("Hash table:");
				//console.log(robustnessTableHashtable.entries());
				redrawRobustnessSelectorBoxes();
				var selectionList = queryRobustnessTableSelectorValues();
				//console.log(selectionList);
				var usedTable = robustnessTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleRobustnessTable(usedTable);
					displayVisibleRobustnessTable(visibleTable);
				}
				
			}
		}
	});

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "robustnesstable"  
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		robustnessRawTable = data;
    		$(data.rows).each(function() {
    			robustnessTableHashtable.put(this.selectorValues , this.quantiles);
    			robustnessSelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		//console.log("Hash table:");
    		//console.log(robustnessSelectionsHashtable.entries());    		
    		robustnessDataReturned = true;
			if (robustnessSelectorsReturned ) {
				redrawRobustnessSelectorBoxes();
				var selectionList = queryRobustnessTableSelectorValues();
				//console.log(selectionList);
				var usedTable = robustnessTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleRobustnessTable(usedTable);
					displayVisibleRobustnessTable(visibleTable);
				}
			}
    	}
    });
}


function redrawRobustnessSelectorBoxes() {
	var activeSelectorsList = [];
	//console.log("selectorList:")
	//console.log(selectorList);
	$(selectorList).each(function() {
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
		.attr("class","form-control robustnessTableSelect").attr("width","300px")
		.attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;
		$(this.selectorValues).each( function() {
    		var checkedSelectorValue = this.valueName;
    		if ( selectorsEverDrawn ) {
    			//We've gotten rid of the time period selector, so we need to add it here.
    			var thisSelection = [ {selectorName : "periodName" , selectorValue : "All" } ];
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
				var checkedHashEntry = robustnessSelectionsHashtable.get(thisSelection);
				if ( checkedHashEntry != null ) {

					if ( checkedHashEntry == true ) {
		        		var thisValue = $("<option></option>").attr("value",checkedSelectorValue)
		    			.text(this.valueLabel);
		        		if ( this.valueLabel.substring(0,6) === "Select") {
		        			$(thisValue).attr("disabled",true);
		        		}
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
		            	//console.log(JSON.stringify(thisSelection) + " checked out!");
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
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var employeeRobustnessButtonDetached = $("#employeeRobustnessButton").detach();
	var applicantRobustnessButtonDetached = $("#applicantRobustnessButton").detach();

	/*var interviewerButtonDetached = $("#interviewerButton").detach();
	var applicantButtonDetached = $("#applicantButton").detach();
	var robustnessButtonDetached = $("#robustnessButton").detach();*/
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	
	$(selectorButtonBox).append(applicantRobustnessButtonDetached);
	$(selectorButtonBox).append(employeeRobustnessButtonDetached);


	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});

	selectorsEverDrawn = true;

	/*$(selectorButtonBox).append(robustnessButtonDetached);

	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
	$(selectorButtonBox).append(applicantButtonDetached);
	}
	if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
		$(selectorButtonBox).append(interviewerButtonDetached);
	}
	
	if (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) {
	var populationSelector = $("<select></select>")
	.attr("id","robustnessPopulationSelector")
	.attr("class","form-control")
	.attr("width","200px");
	var applicantOption = $("<option></option>")
	.attr("value","applicants")
	.text("Show Applicants")
	.attr("selected","selected");
	var employeeOption = $("<option></option>")
	.attr("value","employees")
	.text("Show Employees");
	$(populationSelector).append(applicantOption).append(employeeOption);
	
	$(selectorButtonBox).append(populationSelector);
}*/


	
	
	/*var robustnessGraphButtonDetached = $("#robustnessGraphButton").detach();
	var robustnessTableButtonDetached = $("#robustnessTableButton").detach();
	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
		var reportsTableButtonDetached = $("#reportsTableButton").detach();		
	}
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(robustnessGraphButtonDetached);
	$(selectorButtonBox).append(robustnessTableButtonDetached);
	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
		$(selectorButtonBox).append(reportsTableButtonDetached);
	}
	if (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) {
		var populationSelector = $("<select></select>")
			.attr("id","robustnessPopulationSelector")
			.attr("class","form-control")
			.attr("width","200px");
		var applicantOption = $("<option></option>")
			.attr("value","applicants")
			.text("Show Applicants")
			.attr("selected","selected");
		var employeeOption = $("<option></option>")
			.attr("value","employees")
			.text("Show Employees");
		$(populationSelector).append(applicantOption).append(employeeOption);
		$(selectorButtonBox).append(populationSelector);
	}*/
	

	/*var descriptionDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
	.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
	.css("margin-bottom","10px").html('<h4 style="font-size: 16px">Models are estimated on a randomly-chosen 50% of new hires; predicted turnover scores and actual turnover rates are shown for the other 50% of new hires.</h4>');
	$(selectorButtonBox).append(descriptionDiv);	*/
	
	//console.log(activeSelectorsList);
}


function queryRobustnessTableSelectorValues() {
	//We've gotten rid of the time period selector, so we need to add it here.
	var selectionList = [ {selectorName : "periodName" , selectorValue : "All" } ];
	$(".robustnessTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function createVisibleRobustnessTable(tableData) {
	
	//console.log("tableData:");
	//console.log(tableData);
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectRobustnessTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectRobustnessTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 11*Math.floor((tableContainerWidth-60)/11);
	var columnWidth = Math.floor((tableWidth-60)/11);
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max(10,(columnWidth - 40)/2);
	//console.log("Widths are "  + tableContainerWidth + " , "+ tableWidth + " , " + columnWidth);
	var visibleTable = $("<table></table>").attr("id","robustnessTable").attr("class","table")
						.css("width",tableWidth)
						.css("height",tableContainerHeight)
						.css("padding-left","0px")
						.css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>").attr("id","robustnessThead").css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id","robustnessTbody")
						.css("width",tableWidth);
						//.css("overflow-y","scroll").css("position","absolute")

	var titleRow = $("<tr></tr>").attr("id","titleRow").css("background-color","#dddddd")
						.css("width",tableWidth).css("border-top","2px solid #555555");
	if ( tableWidth < 850 ) {
		headerRightPadding = 5;
		var quantileTH = $("<th></th>").html("<br>Score<br>Qtile").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var pt30TH = $("<th></th>").html("Pred<br>30-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t30TH = $("<th></th>").html("Actual<br>30-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt60TH = $("<th></th>").html("Pred<br>60-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t60TH = $("<th></th>").html("Actual<br>60-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt90TH = $("<th></th>").html("Pred<br>90-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t90TH = $("<th></th>").html("Actual<br>90-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt180TH = $("<th></th>").html("Pred<br>180-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t180TH = $("<th></th>").html("Actual<br>180-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt365TH = $("<th></th>").html("Pred<br>365-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t365TH = $("<th></th>").html("Actual<br>365-Day<br>TO").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa").css("border-right","2px solid #555555");
		
	}
	else {
		headerRightPadding = 10;
		var quantileTH = $("<th></th>").html("<br>Score<br>Quantile").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var pt30TH = $("<th></th>").html("Predicted<br>30-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t30TH = $("<th></th>").html("Actual<br>30-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt60TH = $("<th></th>").html("Predicted<br>60-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t60TH = $("<th></th>").html("Actual<br>60-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt90TH = $("<th></th>").html("Predicted<br>90-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t90TH = $("<th></th>").html("Actual<br>90-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt180TH = $("<th></th>").html("Predicted<br>180-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t180TH = $("<th></th>").html("Actual<br>180-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt365TH = $("<th></th>").html("Predicted<br>365-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t365TH = $("<th></th>").html("Actual<br>365-Day<br>Turnover").attr("class","robustnessRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa").css("border-right","2px solid #555555");
		
	}
	//var tailTH = $("<th></th>").attr("class","robustnessRowLabelTD").css("width",45).css("padding-right","0px");
	
	$(titleRow).append(quantileTH).append(pt30TH).append(t30TH).append(pt60TH).append(t60TH)
		.append(pt90TH).append(t90TH).append(pt180TH).append(t180TH).append(pt365TH).append(t365TH);
	$(visibleThead).append(titleRow);
	
	var largestQuantile  = 0;
	$(tableData).each( function(index) {
		if (this.quantileNumber > largestQuantile ) {
			largestQuantile = this.quantileNumber;
		}
	});
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber != 0 ) {
				var quantileLabel = (this.quantileNumber == 1) ? "Best" :
					(this.quantileNumber == largestQuantile) ? "Worst" : 
						this.quantileNumber;
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#ffffff")
			.css("padding-top","5px").css("padding-bottom","5px");
			var titleTD = $("<td></td>").text(quantileLabel).attr("class","robustnessRowLabelTD").css("width",columnWidth)
							.css("background-color","#ffffff").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var pt30TD = $("<td></td>").text(toPercent(this.mpt30,this.nt30)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt30)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t30TD = $("<td></td>").text(toPercent(this.mt30,this.nt30)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt30)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt60TD = $("<td></td>").text(toPercent(this.mpt60,this.nt60)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt60)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t60TD = $("<td></td>").text(toPercent(this.mt60,this.nt60)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt60)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt90TD = $("<td></td>").text(toPercent(this.mpt90,this.nt90)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt90)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t90TD = $("<td></td>").text(toPercent(this.mt90,this.nt90)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt90)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt180TD = $("<td></td>").text(toPercent(this.mpt180,this.nt180)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt180)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t180TD = $("<td></td>").text(toPercent(this.mt180,this.nt180)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt180)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt365TD = $("<td></td>").text(toPercent(this.mpt365,this.nt365)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt365)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t365TD = $("<td></td>").text(toPercent(this.mt365,this.nt365)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",robustnessCellColor(this.tt365)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa")
							.css("border-right","2px solid #555555");

			$(thisRow).append(titleTD).append(pt30TD).append(t30TD).append(pt60TD).append(t60TD)
			.append(pt90TD).append(t90TD).append(pt180TD).append(t180TD).append(pt365TD).append(t365TD);
			$(visibleTbody).append(thisRow);
		}
		
			
	});
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber == 0 ) {
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#dddddd")
			.css("padding-top","5px").css("padding-bottom","5px").css("border-bottom","2px solid #555555");
			var titleTD = $("<td></td>").text("Overall").attr("class","robustnessContentTD").css("width",columnWidth)
							.css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var pt30TD = $("<td></td>").text(toPercent(this.mpt30,this.nt30)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t30TD = $("<td></td>").text(toPercent(this.mt30,this.nt30)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt60TD = $("<td></td>").text(toPercent(this.mpt60,this.nt60)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t60TD = $("<td></td>").text(toPercent(this.mt60,this.nt60)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt90TD = $("<td></td>").text(toPercent(this.mpt90,this.nt90)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t90TD = $("<td></td>").text(toPercent(this.mt90,this.nt90)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt180TD = $("<td></td>").text(toPercent(this.mpt180,this.nt180)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t180TD = $("<td></td>").text(toPercent(this.mt180,this.nt180)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt365TD = $("<td></td>").text(toPercent(this.mpt365,this.nt365)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t365TD = $("<td></td>").text(toPercent(this.mt365,this.nt365)).attr("class","robustnessContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa")
							.css("border-right","2px solid #555555");

			$(thisRow).append(titleTD).append(pt30TD).append(t30TD).append(pt60TD).append(t60TD)
			.append(pt90TD).append(t90TD).append(pt180TD).append(t180TD).append(pt365TD).append(t365TD);
			$(visibleTbody).append(thisRow);
		}
		
			
	});
	
	var legendTitleTD = $("<td></td>")
		.css("border","none")
		.attr("colspan",12)
		.html("<h5>Observed turnover rates are above (orange) or below (blue) mean of other categories at a significance level of:</h4>");
	var legendTitleTR = $("<tr></tr>")
			.css("height","25px")
			.css("max-height","25px")
			.css("border","none")
			.html(legendTitleTD);
	$(visibleTbody).append(legendTitleTR);
	
	var legendBlankRedRowTD = $("<td></td>")
			.css("border","none");
	var legendOnePercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(3),20));
	var legendOnePercentRedTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("1 percent");

	var legendFivePercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(2),20));
	var legendFivePercentRedTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("5 percent");

	var legendTenPercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(1.75),20));
	var legendTenPercentRedTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("10 percent");

	var legendRedTR = $("<tr></tr>")
			.attr("id","legendRedTR")
			.css("border","none")
			.css("height","25px")
			.css("max-height","25px")
			.html(legendBlankRedRowTD)
			.append(legendOnePercentRedTD)
			.append(legendOnePercentRedTitleTD)
			.append(legendFivePercentRedTD)
			.append(legendFivePercentRedTitleTD)
			.append(legendTenPercentRedTD)
			.append(legendTenPercentRedTitleTD);
	$(visibleTbody).append(legendRedTR);
	

	var legendBlankGreenRowTD = $("<td></td>")
			.css("border","none");
	var legendOnePercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(-3),20));
	var legendOnePercentGreenTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("1 percent");

	var legendFivePercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(-2),20));
	var legendFivePercentGreenTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("5 percent");

	var legendTenPercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(robustnessCellColor(-1.75),20));
	var legendTenPercentGreenTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("10 percent");

	var legendGreenTR = $("<tr></tr>")
			.attr("id","legendGreenTR")
			.css("border","none")
			.css("height","25px")
			.css("max-height","25px")
			.html(legendBlankGreenRowTD)
			.append(legendOnePercentGreenTD)
			.append(legendOnePercentGreenTitleTD)
			.append(legendFivePercentGreenTD)
			.append(legendFivePercentGreenTitleTD)
			.append(legendTenPercentGreenTD)
			.append(legendTenPercentGreenTitleTD);
	$(visibleTbody).append(legendGreenTR);
	

	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}

function displayVisibleRobustnessTable(visibleTable) {
	windowAspectRobustnessTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectRobustnessTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	if(displayAreaHeight < 690) {
		displayAreaHeight = 690;
	}
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	robustnessTableDiv = $("<div></div>").attr("id","robustnessTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");

	/*$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','robustnessTableButton');
	var menuItem2 = $('<a class="btn btn-default">Graph</a>').attr('id','robustnessGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);*/

	
	if ( windowAspectRobustnessTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		//$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		//$("#display-area").html(menuDiv);
		$("#display-area").html(robustnessTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		//$("#menuDiv").css("width",displayWidth);
		$("#display-area-xs").css("width",displayWidth);
		//$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").html(robustnessTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#robustnessTableDiv").css("height",tableContainerMobileHeight);
	}

	$(robustnessTableDiv).html(visibleTable);
	$("#legendRedTR").html($("#legendRedTR").html());
	$("#legendGreenTR").html($("#legendGreenTR").html());
	redrawRobustnessSelectorBoxes();
	addRobustnessTableResizeListener();
	enableRobustnessTableSelectors();
	activateRobustnessTableSelectors();

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


function disableRobustnessTableSelectors() {
	deactivateTopbarLinks();
	$(".robustnessTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#robustnessGraphButton").prop("disabled",true);
	$("#robustnessGraphButton").attr("disabled","disabled");
	$("#employeeRobustnessButton").prop("disabled",true);
	$("#employeeRobustnessButton").attr("disabled","disabled");
	
	/*$("#reportsTableButton").prop("disabled",true);
	$("#reportsTableButton").attr("disabled","disabled");
	$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").prop("disabled",true);
	$("#applicantButton").prop("disabled",true);
	$("#applicantButton").attr("disabled","disabled");
	$("#interviewerButton").prop("disabled",true);
	$("#interviewerButton").attr("disabled","disabled");*/

}

function enableRobustnessTableSelectors() {
	activateTopbarLinks();
	$(".robustnessTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#robustnessGraphButton").prop("disabled",false);
	$("#robustnessGraphButton").removeAttr("disabled");
	
	$("#employeeRobustnessButton").prop("disabled",false);
	$("#employeeRobustnessButton").removeAttr("disabled");
	
	/*$("#reportsTableButton").prop("disabled",false);
	$("#reportsTableButton").removeAttr("disabled");
	
	$("#robustnessPopulationSelector").prop("disabled",false);
	
	$("#applicantButton").prop("disabled",false);
	$("#applicantButton").removeAttr("disabled");
	$("#interviewerButton").prop("disabled",false);
	$("#interviewerButton").removeAttr("disabled");
	//console.log("Enabled!");*/
}


function activateRobustnessTableSelectors() {
	$(".robustnessTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableRobustnessTableSelectors()
			var selectionList = queryRobustnessTableSelectorValues();
			var usedTable = robustnessTableHashtable.get(selectionList);
			//console.log("usedTable:");
			//console.log(usedTable);
			if (usedTable != null ) {
				visibleTable = createVisibleRobustnessTable(usedTable);
				displayVisibleRobustnessTable(visibleTable);
			}
		});
	});

	$("#robustnessGraphButton").unbind("click");
	$("#robustnessGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnessgraph.js",dataType: "script"});
	});
	
	$("#employeeRobustnessButton").unbind("click");
	$("#employeeRobustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerobustnesstable.js",dataType: "script"});
	});
	/*
	 	$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").change(function() {
		disableRobustnessTableSelectors();		
		deactivateTopbarLinks();
		//console.log("listened");
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerobustnesstable.js",dataType: "script"});
	});
	
	$("#reportsTableButton").unbind("click");
	$("#reportsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});
	
	$("#applicantButton").unbind("click");
	$("#applicantButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});
	
	$("#interviewerButton").unbind("click");
	$("#interviewerButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitygraph.js",dataType: "script"});
	});*/

}

function addRobustnessTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectRobustnessTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectRobustnessTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			//var menuHolder = $("#menuDiv").detach();
			//$("#display-area-xs").html(menuHolder);			
			var robustnessTableHolder = $("#robustnessTableDiv").detach();
			$("#display-area-xs").append(robustnessTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectRobustnessTable = "mobile";
		}
		if ( windowAspectRobustnessTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			//var menuHolder = $("#menuDiv").detach();
			//$("#display-area").html(menuHolder);
			var robustnessTableHolder = $("#robustnessTableDiv").detach();
			$("#display-area").append(robustnessTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectRobustnessTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectRobustnessTable != "mobile" ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		
		var displayAreaHeight = $(window).height() - 51;
		if(displayAreaHeight < 690) {
			displayAreaHeight = 690;
		}
		var displayAreaMobileHeight = 500;
		var tableContainerMobileHeight = 450;
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		//$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#robustnessTableDiv").css("width",tableContainerWidth);
		var selectionList = queryRobustnessTableSelectorValues();
		var usedTable = robustnessTableHashtable.get(selectionList);
		//console.log("usedTable:");
		//console.log(usedTable);
		if (usedTable != null ) {
			visibleTable = createVisibleRobustnessTable(usedTable);
		}
		$("#robustnessTableDiv").html(visibleTable);
		$("#legendRedTR").html($("#legendRedTR").html());
		$("#legendGreenTR").html($("#legendGreenTR").html());

		
		if ( windowAspectRobustnessTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			//$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#robustnessTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			//$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#robustnessTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




function robustnessCellColor(tstat){
	if ( tstat < -2.576 ) {
		return "#5CA4B4";
	}
	if ( tstat < -1.96 ) {
		return "#84BCC6";
	}
	if ( tstat < -1.645 ) {
		return "#ACD4D8";
	}
	if ( tstat > 2.576 ) {
		return "#EC9138";
	}
	if ( tstat > 1.96 ) {
		return "#F0AD6A";
	}
	if ( tstat > 1.645 ) {
		return "#F4C99C";
	}
	
	return "#ffffff";
}

