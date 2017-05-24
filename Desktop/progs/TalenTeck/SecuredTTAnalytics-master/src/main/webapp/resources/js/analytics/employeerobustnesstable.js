
var windowAspectEmployeeRobustnessTable = "";
windowAspectEmployeeRobustnessTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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

underlineOnlyThisLink("#robustnessLink");

// Show a "loading" animation

deactivateTopbarLinks();
//displayTableSpinner(windowAspectEmployeeRobustnessTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Verification</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Models are estimated on a randomly chosen half of employees; predicted and actual turnover rates are shown for the other half, broken down by TalenTeck turnover risk score categories.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

var applicantRobustnessButton = $("<button></button>").attr('id','applicantRobustnessButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px");

var employeeRobustnessButton = $("<button></button>").attr('id','employeeRobustnessButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);

$(selectorButtonBox).append(applicantRobustnessButton).append(employeeRobustnessButton);

/*if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
var applicantButton = $("<button></button>").attr('id','applicantButton')
.attr('class','btn btn-default btn-block').text("Applicant Report")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(applicantButton);
}

if (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) {
var interviewerButton = $("<button></button>").attr('id','interviewerButton')
.attr('class','btn btn-default btn-block').text("Interviewer Report")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(interviewerButton);
}*/

if ( windowAspectEmployeeRobustnessTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableEmployeeRobustnessTableSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var employeeRobustnessRawTable = {};
var formattedTable = [];
var employeeRobustnessTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var rateHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var employeeRobustnessSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

rateHashtable.put("t0","30");
rateHashtable.put("t30","60");
rateHashtable.put("t90","90");
rateHashtable.put("t180","180");


refreshEmployeeRobustnessTable();

function refreshEmployeeRobustnessTable() {

	var employeeRobustnessSelectorsReturned = false;
	var employeeRobustnessDataReturned = false;
	disableEmployeeRobustnessTableSelectors();
    displayTableSpinner(windowAspectEmployeeRobustnessTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsemployeerobustness" } ,
		dataType: "json" ,
		success: function(data) {
			var rawSelectorList = data.selectorList;
			var formattedSelectorList = [];
			//Get rid of time period selector
			$.each(rawSelectorList,function() {
				if ( this.selectorName != "periodName") {
					formattedSelectorList.push(this);
				}
			});
			selectorList = formattedSelectorList;
			employeeRobustnessSelectorsReturned = true;
			if (employeeRobustnessDataReturned ) {
				redrawEmployeeRobustnessSelectorBoxes();
				var selectionList = queryEmployeeRobustnessTableSelectorValues();
				var usedTable = employeeRobustnessTableHashtable.get(selectionList);
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleEmployeeRobustnessTable(usedTable,"t0");
					displayVisibleEmployeeRobustnessTable(visibleTable);
				}				
			}
		}
	});

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "employeerobustnesstable"  
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		employeeRobustnessRawTable = data;
    		$(data.rows).each(function() {
    			employeeRobustnessTableHashtable.put(this.selectorValues , this.quantiles);
    			employeeRobustnessSelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		employeeRobustnessDataReturned = true;
			if (employeeRobustnessSelectorsReturned ) {
				redrawEmployeeRobustnessSelectorBoxes();
				var selectionList = queryEmployeeRobustnessTableSelectorValues();
				var usedTable = employeeRobustnessTableHashtable.get(selectionList);
				if (usedTable != null ) {
					visibleTable = createVisibleEmployeeRobustnessTable(usedTable,"t0");
					displayVisibleEmployeeRobustnessTable(visibleTable);
				}
			}
    	}
    });
}


function redrawEmployeeRobustnessSelectorBoxes() {
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		if(this.selectorName!="Country"){
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
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
		.attr("class","form-control employeeRobustnessTableSelect").attr("width","300px")
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
				//var checkedHashEntry = employeeRobustnessSelectionsHashtable.get(thisSelection);
				//if ( checkedHashEntry != null ) {

					//if ( checkedHashEntry == true ) {
		        		var thisValue = $("<option></option>").attr("value",checkedSelectorValue)
		    			.text(this.valueLabel);
		        		if ( this.valueLabel.substring(0,6) === "Select") {
		        			$(thisValue).attr("disabled",true);
		        		}
		        		if ( defaultFound === false && checkedSelectorValue == usedDefaultValue && allSelected == false ) {
		        			$(thisValue).attr("selected","selected")
		        			$(thisValue).text(checkedSelectorName +": "+ this.valueLabel)

		        			defaultFound = true;
		        			//console.log("Checked off " + this.valueLabel + "with no allSelected");
		        		}
		        		if (allSelected == true && this.valueLabel.substring(0,6) !== "Select" && checkedSelectorValue == defaultValueHolder ) {
		        			$(thisValue).attr("selected","selected")
		        			$(thisValue).text(checkedSelectorName +": "+ this.valueLabel)
		        			defaultFound = true;		        			
		        			//console.log("Checked off " + this.valueLabel + "with allSelected");
		        		}
		            	$(thisSelector).append(thisValue);    			
						//console.log(JSON.stringify(thisSelection) + " checked out!");
					//}
					/*else {
						//console.log(JSON.stringify(thisSelection) + " did not check out. :(");
						
					}*/
				//}
				/*else {
					//console.log("Did not find " + JSON.stringify(thisSelection));
				}*/
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
		}
	});
	
	
	//Do the turnover rate selector
	var defaultTurnoverRate = "t365";
	var defaultFound = false;
	var allSelected = false;
	if (selectorsEverDrawn ) {
		var usedDefaultValue = $("#rateSelect option:selected").val();
		if ( $("#rateSelect option:selected").text().substring(0,6) !== "Select" && $("#rateSelect option:selected").val() == defaultTurnoverRate ) {
			allSelected = true;
		}
	}
	else {
		var usedDefaultValue = defaultTurnoverRate;
	}
	
	/*var titleDivDetached = $("#titleDiv").detach();
	var employeeRobustnessGraphButtonDetached = $("#employeeRobustnessGraphButton").detach();
	var employeeRobustnessTableButtonDetached = $("#employeeRobustnessTableButton").detach();
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(employeeRobustnessGraphButtonDetached);
	$(selectorButtonBox).append(employeeRobustnessTableButtonDetached);
	if (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) {
		var populationSelector = $("<select></select>")
			.attr("id","robustnessPopulationSelector")
			.attr("class","form-control")
			.attr("width","200px");
		var applicantOption = $("<option></option>")
			.attr("value","applicants")
			.text("Show Applicants");
		var employeeOption = $("<option></option>")
			.attr("value","employees")
			.text("Show Employees")
			.attr("selected","selected");
		$(populationSelector).append(applicantOption).append(employeeOption);
		$(selectorButtonBox).append(populationSelector);
	}*/
	
	var titleDivDetached = $("#titleDiv").detach();
	var interviewerButtonDetached = $("#interviewerButton").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var employeeRobustnessButtonDetached = $("#employeeRobustnessButton").detach();
	var applicantRobustnessButtonDetached = $("#applicantRobustnessButton").detach();

	
	//var applicantButtonDetached = $("#applicantButton").detach();
	//var robustnessButtonDetached = $("#robustnessButton").detach();
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);

	$(selectorButtonBox).append(applicantRobustnessButtonDetached);
	$(selectorButtonBox).append(employeeRobustnessButtonDetached);



	/*if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
	$(selectorButtonBox).append(applicantButtonDetached);
	}
	
	if (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) {
	$(selectorButtonBox).append(interviewerButtonDetached);
	var populationSelector = $("<select></select>")
	.attr("id","robustnessPopulationSelector")
	.attr("class","form-control")
	.attr("width","200px");
	var applicantOption = $("<option></option>")
	.attr("value","applicants")
	.text("Show Applicants")
	;
	var employeeOption = $("<option></option>")
	.attr("value","employees")
	.text("Show Employees").attr("selected","selected");
	$(populationSelector).append(applicantOption).append(employeeOption);
	
	$(selectorButtonBox).append(populationSelector);
}*/

	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	

	var descriptionDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
	.css("background-color","#dddddd").css("margin-top","0px")
	.css("margin-bottom","10px").html('<h4>Models are estimated on a randomly-chosen 50% of new hires; predicted turnover scores and actual turnover rates are shown here for the other 50% of new hires.</h4>');
	//$(selectorButtonBox).append(descriptionDiv);
	
	
	var rateSelector = $("<select></select>").attr("id","rateSelect").attr("class","form-control").attr("width","200px");
	var defaultValue = $("<option></option>").attr("value","t365").text("Select Tenure").attr("disabled",true);
	if (allSelected == false && "t365" == usedDefaultValue ) {
		/*$(defaultValue).attr("selected","selected");*/
		defaultFound = true;		        			
		//console.log("Checked off Select all with no allSelected");
	}
	$(rateSelector).append(defaultValue);
	$(["0","30","90","180"]).each(function() {
		var textVal = "";//this=="0"?"Tenure: 0":this;
		//console.log(textVal);
		var thisSelectorValue = $("<option></option>").attr("value","t"+this).text(this +" Days");
		
		if ( defaultFound === false && "t"+this == usedDefaultValue && allSelected == false ) {
			$(thisSelectorValue).attr("selected","selected");
			$(thisSelectorValue).text("Tenure: "+ usedDefaultValue.substring(1) +" Days");
			defaultFound = true;
			//console.log("Checked off " + this + "-day with no allSelected");
		}
		if (allSelected == true && "t"+this == defaultTurnoverRate ) {
			$(thisSelectorValue).attr("selected","selected");
			$(thisSelectorValue).text("Tenure: "+ defaultTurnoverRate +" Days");

			defaultFound = true;		        			
			//console.log("Checked off " + this.valueLabel + "with allSelected");
		}
		$(rateSelector).append(thisSelectorValue);
	});
	$(selectorButtonBox).append(rateSelector);
	
	
	selectorsEverDrawn = true;
	//console.log(activeSelectorsList);
}


function queryEmployeeRobustnessTableSelectorValues() {
	//We've gotten rid of the time period selector, so we need to add it here.
	var selectionList = [ {selectorName : "periodName" , selectorValue : "All" } ];
	selectionList.push({selectorName : "Country" , selectorValue : "All" });
	$(".employeeRobustnessTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
			
			//console.log("thisSelection" + JSON.stringify(thisSelection));
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function createVisibleEmployeeRobustnessTable(tableData,rateSelect) {
	console.log("rateSelect" + rateSelect);
	var rateToDisplay = rateHashtable.get(rateSelect);
	console.log("rateToDisplay" + rateToDisplay);

	/*var tableContainerHeight = $(window).height() - 479;
	if (windowAspectEmployeeRobustnessTable == "mobile" ) {
		tableContainerHeight = 250;
	}
	tableContainerHeight = tableContainerHeight + "px";
	
	var tableContainerWidth = (windowAspectEmployeeRobustnessTable == "mobile" ) ?  $( window ).width()-300 : $( window ).width() -780;
	
	var tableWidth = 11*Math.floor((tableContainerWidth-60)/11);
	var columnWidth = Math.floor((tableWidth-120)/11);
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max(10,(columnWidth - 40)/2);
		
	var visibleTable = $("<table></table>").attr("id","employeeRobustnessTable").attr("class","table").css("width",tableContainerWidth + "px").css("height",tableContainerHeight +"px").css("margin-left","180px").css("margin-top","80px");
	var visibleThead = $("<thead></thead>").attr("id","employeeRobustnessThead");
	var visibleTbody = $("<tbody></tbody>").attr("id","employeeRobustnessTbody");
	*/
	
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectEmployeeRobustnessTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectEmployeeRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectEmployeeRobustnessTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 11*Math.floor((tableContainerWidth-60)/11);
	var columnWidth = Math.floor((tableWidth-60)/11);
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max(10,(columnWidth - 40)/2);
	//console.log("Widths are "  + tableContainerWidth + " , "+ tableWidth + " , " + columnWidth);
	var visibleTable = $("<table></table>").attr("id","employeeRobustnessTable").attr("class","table")
						.css("width",tableWidth-50)
						.css("height",tableContainerHeight-400)
						.css("margin-left","20px")
						.css("padding-left","0px")
						.css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>").attr("id","employeeRobustnessThead").css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id","employeeRobustnessTbody")
						.css("width",tableWidth);
						//.css("overflow-y","scroll").css("position","absolute")
	 var headerRow = $("<tr></tr>").attr("id","headerRow").css("background-color","#AAAAAA");
		var headerTH = $("<th></th>").attr("colspan","3").html("<b>Turnover Rates in Next " + rateToDisplay +" Days</b>").css("font-size","16px").css("text-align","center");
		$(headerRow).append(headerTH);
		
	var titleRow = $("<tr></tr>").attr("id","titleRow").css("background-color","#dddddd").css("width",tableWidth);
	if ( tableWidth < 850 ) {
		headerRightPadding = 5;
		var quantileTH = $("<th></th>").html("<br>Score<br>Qtile").attr("class","employeeRobustnessRowLabelTD").css("text-align","left").css("width",columnWidth-40).css("padding-right",headerRightPadding+"px").css("padding-left",rightPadding+"px");
		var pt30TH = $("<th></th>").html("Pred TO").attr("class","employeeRobustnessRowLabelTD").css("width",columnWidth+20).css("text-align","right").css("padding-right",headerRightPadding+20+"px");
		var t30TH = $("<th></th>").html("Actual TO").attr("class","employeeRobustnessRowLabelTD").css("width",columnWidth+20).css("text-align","right").css("padding-right",headerRightPadding+20+"px");
	}else {
			headerRightPadding = 10;
			var quantileTH = $("<th></th>").html("Score Quantile").attr("class","employeeRobustnessRowLabelTD").css("text-align","left").css("width",columnWidth-40).css("padding-right",headerRightPadding+"px").css("padding-left",rightPadding+"px");
			var pt30TH = $("<th></th>").html("Predicted Turnover").attr("class","employeeRobustnessRowLabelTD").css("width",columnWidth+20).css("text-align","right").css("padding-right",headerRightPadding+20+"px");
			var t30TH = $("<th></th>").html("Actual Turnover").attr("class","employeeRobustnessRowLabelTD").css("width",columnWidth+20).css("text-align","right").css("padding-right",headerRightPadding+20+"px");
		}
		//var tailTH = $("<th></th>").attr("class","employeeRobustnessRowLabelTD").css("width",45).css("padding-right","0px");
		
		$(titleRow).append(quantileTH).append(pt30TH).append(t30TH);//.append(pt60TH).append(t60TH)
			//.append(pt90TH).append(t90TH).append(pt180TH).append(t180TH).append(pt365TH).append(t365TH);
		$(visibleThead).append(headerRow).append(titleRow);
		
		$(tableData).each( function(index) {
			if ( this.quantileNumber != 0 ) {
				var mpt = eval("this.mpt"+rateToDisplay);
				var mt = eval("this.mt"+rateToDisplay);
				var nt = eval("this.nt"+rateToDisplay);
				var tt = eval("this.tt"+rateToDisplay);
				
				var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#ffffff")
				.css("padding-top","5px").css("padding-bottom","5px");
				var titleTD = $("<td></td>").text(this.quantileNumber).attr("class","employeeRobustnessRowLabelTD").css("width",columnWidth-40)
								.css("background-color","#ffffff").css("padding-top","5px").css("text-align","left")
								.css("padding-bottom","5px").css("padding-left",rightPadding+10+"px")
								.css("padding-right",rightPadding+"px");
				var pt30TD = $("<td></td>").text(toPercent(mpt,nt)).attr("class","employeeRobustnessContentTD").css("width",columnWidth+20)
								.css("text-align","right").css("background-color",employeeRobustnessCellColor(tt)).css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
								.css("padding-right",rightPadding+"px");
				var t30TD = $("<td></td>").text(toPercent(mt,nt)).attr("class","employeeRobustnessContentTD").css("width",columnWidth+20)
								.css("text-align","right").css("background-color",employeeRobustnessCellColor(tt)).css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
								.css("padding-right",rightPadding+"px");
				$(thisRow).append(titleTD).append(pt30TD).append(t30TD);
				$(visibleTbody).append(thisRow);
			}
			
				
		});
		
		$(tableData).each( function(index) {
			if ( this.quantileNumber == 0 ) {
				var mpt = eval("this.mpt"+rateToDisplay);
				var mt = eval("this.mt"+rateToDisplay);
				var nt = eval("this.nt"+rateToDisplay);
				var tt = eval("this.tt"+rateToDisplay);

				var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#dddddd")
				.css("padding-top","5px").css("padding-bottom","5px");
				var titleTD = $("<td></td>").text("Overall").attr("class","employeeRobustnessContentTD").css("width",columnWidth-40).css("text-align","left")
								.css("background-color","#dddddd").css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left",rightPadding+10+"px")
								.css("padding-right",rightPadding+"px");
				var pt30TD = $("<td></td>").text(toPercent(mpt,nt)).attr("class","employeeRobustnessContentTD").css("width",columnWidth+20)
								.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
								.css("padding-right",rightPadding+"px");
				var t30TD = $("<td></td>").text(toPercent(mt,nt)).attr("class","employeeRobustnessContentTD").css("width",columnWidth+20)
								.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
								.css("padding-right",rightPadding+"px");

				$(thisRow).append(titleTD).append(pt30TD).append(t30TD);
				$(visibleTbody).append(thisRow);
			}				
		});
		
		var legendTitleTD = $("<td></td>")
		.css("border","none")
		.attr("colspan",3)
		.html("<h5>Observed turnover rates are above (orange) or below (blue) mean of other categories at a significance level of:</h4>");
	var legendTitleTR = $("<tr></tr>")
			.css("height","25px")
			.css("max-height","25px")
			.css("border","none")
			.html(legendTitleTD);
	$(visibleTbody).append(legendTitleTR);
	
	//var legendBlankRedRowTD = $("<td></td>").css("border","none");
	var legendOnePercentRedTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(3),20)).append(" 1 percent");
	//var legendOnePercentRedTitleTD = $("<td></td>").attr("colspan",2).css("border","none").html("1 percent");
	var legendFivePercentRedTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(2),20)).append(" 5 percent");

	var legendTenPercentRedTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(1.75),20)).append(" 10 percent");
	

	var legendRedTR = $("<tr></tr>")
			.attr("id","legendRedTR")
			.css("border","none")
			.css("height","25px")
			.css("max-height","25px")
			//.html(legendBlankRedRowTD)
			.html(legendOnePercentRedTD)
			//.append(legendOnePercentRedTitleTD)
			.append(legendFivePercentRedTD)
			//.append(legendFivePercentRedTitleTD)
			.append(legendTenPercentRedTD)
			//.append(legendTenPercentRedTitleTD);
	$(visibleTbody).append(legendRedTR);
	

	var legendOnePercentGreenTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(-3),20)).append(" 1 percent");

	var legendFivePercentGreenTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(-2),20)).append(" 5 percent");

	var legendTenPercentGreenTD = $("<td></td>").css("border","none").html(coloredBox(employeeRobustnessCellColor(-1.75),20)).append(" 10 percent");


	var legendGreenTR = $("<tr></tr>")
			.attr("id","legendGreenTR")
			.css("border","none")
			.css("height","25px")
			.css("max-height","25px")
			.html(legendOnePercentGreenTD)
			.append(legendFivePercentGreenTD)
			.append(legendTenPercentGreenTD)
	$(visibleTbody).append(legendGreenTR);

		
	/* sakthi start
	 * 
	 var headerRow = $("<tr></tr>").attr("id","headerRow").css("background-color","#AAAAAA");
	var headerTH = $("<th></th>").attr("colspan","3").html("<b>Turnover Rates in Next " + rateToDisplay +" Days</b>").css("text-align","center");
	$(headerRow).append(headerTH);

	//if ( tableWidth < 250 ) {

		var titleRow = $("<tr></tr>").attr("id","titleRow").css("background-color","#dddddd");
		var quantileTH = $("<th></th>").html("Score Quantile").css("width","140px");
		var pt30TH = $("<th></th>").html("Predicted").css("width","250px").css("text-align","right").css("padding-right","40px");
		var t30TH = $("<th></th>").html("Actual").css("width","250px").css("text-align","right").css("padding-right","30px");
	$(titleRow).append(quantileTH).append(pt30TH).append(t30TH)
	
	$(visibleThead).append(headerRow).append(titleRow);
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber != 0 ) {
			var mpt = eval("this.mpt"+rateToDisplay);
			var mt = eval("this.mt"+rateToDisplay);
			var nt = eval("this.nt"+rateToDisplay);
			var tt = eval("this.tt"+rateToDisplay);

			var thisRow = $("<tr></tr>").css("background-color","#ffffff");
			var titleTD = $("<td></td>").text(this.quantileNumber).css("width","140px").css("text-indent","20px");
			var pt30TD = $("<td></td>").text(toPercent(mpt,nt)).css("width","250px").css("text-align","right").css("padding-right","40px").css("background-color",employeeRobustnessCellColor(tt));
			var t30TD = $("<td></td>").text(toPercent(mt,nt)).css("width","250px").css("text-align","right").css("padding-right","30px").css("background-color",employeeRobustnessCellColor(tt));
						
			$(thisRow).append(titleTD).append(pt30TD).append(t30TD);
			$(visibleTbody).append(thisRow);
		}			
	});
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber == 0 ) {
			var mpt = eval("this.mpt"+rateToDisplay);
			var mt = eval("this.mt"+rateToDisplay);
			var nt = eval("this.nt"+rateToDisplay);
			var tt = eval("this.tt"+rateToDisplay);

			var thisRow = $("<tr></tr>").css("background-color","#dddddd");
			var titleTD = $("<td></td>").html("<b>" + "Mean" +"</b>").css("width","140px");
			var pt30TD = $("<td></td>").html("<b>" + toPercent(mpt,nt) +"</b>").css("text-align","right").css("padding-right","40px");
			//.css("background-color",employeeRobustnessCellColor(tt));
			var t30TD = $("<td></td>").html("<b>" + toPercent(mt,nt)+"</b>").css("text-align","right").css("padding-right","30px");
			//.css("background-color",employeeRobustnessCellColor(tt));

			$(thisRow).append(titleTD).append(pt30TD).append(t30TD)
			$(visibleTbody).append(thisRow);
		}			
	});

Sakthi end*/

	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;	
}

function displayVisibleEmployeeRobustnessTable(visibleTable) {
	windowAspectEmployeeRobustnessTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectEmployeeRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectEmployeeRobustnessTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	employeeRobustnessTableDiv = $("<div></div>").attr("id","employeeRobustnessTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","80px").css("margin-left","25px").css("margin-right","25px");

	/*$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','employeeRobustnessTableButton');
	var menuItem2 = $('<a class="btn btn-default">Graph</a>').attr('id','employeeRobustnessGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);*/
	
	
	/*var legendTable = $("<table></table>")	.attr("class","table").css("width","720px").css("height","25px").css("margin-left","180px").css("margin-top","20px");

	var legendTitleTD = $("<td></td>")
	.css("border","none")
	.attr("colspan",12)
	.html("<h5>Observed turnover rates are above (orange) or below (blue) mean of other categories at a significance level of:</h4>");
var legendTitleTR = $("<tr></tr>")
		.css("height","25px")
		.css("max-height","25px")
		.css("border","none")
		.html(legendTitleTD);
$(legendTable).append(legendTitleTR);

var legendBlankRedRowTD = $("<td></td>")
		.css("border","none");
var legendOnePercentRedTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(3),20));
var legendOnePercentRedTitleTD = $("<td></td>")
		.attr("colspan",2)
		.css("border","none")
		.html("1 percent");

var legendFivePercentRedTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(2),20));
var legendFivePercentRedTitleTD = $("<td></td>")
		.attr("colspan",2)
		.css("border","none")
		.html("5 percent");

var legendTenPercentRedTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(1.75),20));
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
$(legendTable).append(legendRedTR);


var legendBlankGreenRowTD = $("<td></td>")
		.css("border","none");
var legendOnePercentGreenTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(-3),20));
var legendOnePercentGreenTitleTD = $("<td></td>")
		.attr("colspan",2)
		.css("border","none")
		.html("1 percent");

var legendFivePercentGreenTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(-2),20));
var legendFivePercentGreenTitleTD = $("<td></td>")
		.attr("colspan",2)
		.css("border","none")
		.html("5 percent");

var legendTenPercentGreenTD = $("<td></td>")
		.css("border","none")
		.html(coloredBox(employeeRobustnessCellColor(-1.75),20));
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
$(legendTable).append(legendGreenTR);

	*/
	
	if ( windowAspectEmployeeRobustnessTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		//$("#menuDiv").css("width",displayWidth);
		//$("#display-area").html(menuDiv);
		$("#display-area").html(employeeRobustnessTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		//$("#menuDiv").css("width",displayWidth);
		//$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").html(employeeRobustnessTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#employeeRobustnessTableDiv").css("height",tableContainerMobileHeight);
	}

	$(employeeRobustnessTableDiv).html(visibleTable);
	//$(employeeRobustnessTableDiv).append(legendTable);
	$("#legendRedTR").html($("#legendRedTR").html());
	$("#legendGreenTR").html($("#legendGreenTR").html());
	redrawEmployeeRobustnessSelectorBoxes();
	addEmployeeRobustnessTableResizeListener();
	enableEmployeeRobustnessTableSelectors();
	activateEmployeeRobustnessTableSelectors();

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


function disableEmployeeRobustnessTableSelectors() {
	deactivateTopbarLinks();
	$(".employeeRobustnessTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#employeeRobustnessGraphButton").prop("disabled",true);
	$("#employeeRobustnessGraphButton").attr("disabled","disabled");

	$("#applicantRobustnessButton").prop("disabled",true);
	$("#applicantRobustnessButton").attr("disabled","disabled");
	
	/*$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").prop("disabled",true);
	$("#applicantButton").prop("disabled",true);
	$("#applicantButton").attr("disabled","disabled");
	$("#interviewerButton").prop("disabled",true);
	$("#interviewerButton").attr("disabled","disabled");*/

}

function enableEmployeeRobustnessTableSelectors() {
	activateTopbarLinks();
	$(".employeeRobustnessTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#employeeRobustnessGraphButton").prop("disabled",false);
	$("#employeeRobustnessGraphButton").removeAttr("disabled");

	$("#applicantRobustnessButton").prop("disabled",false);
	$("#applicantRobustnessButton").removeAttr("disabled");
	
	/*$("#robustnessPopulationSelector").prop("disabled",false);

	$("#applicantButton").prop("disabled",false);
	$("#applicantButton").removeAttr("disabled");

	$("#interviewerButton").prop("disabled",false);
	$("#interviewerButton").removeAttr("disabled");*/
}


function activateEmployeeRobustnessTableSelectors() {
	$(".employeeRobustnessTableSelect").each(function() {
		$(this).unbind("change");
		
		$(this).change(function() {
			disableEmployeeRobustnessTableSelectors()
			var selectionList = queryEmployeeRobustnessTableSelectorValues();
			var rateSelect = $("#rateSelect").val();

			var usedTable = employeeRobustnessTableHashtable.get(selectionList);
			if (usedTable != null ) {
				visibleTable = createVisibleEmployeeRobustnessTable(usedTable,rateSelect);
				displayVisibleEmployeeRobustnessTable(visibleTable);
			}
		});
		$("#rateSelect").change(function(){
			disableEmployeeRobustnessTableSelectors()
			var selectionList = queryEmployeeRobustnessTableSelectorValues();
			var rateSelect = $("#rateSelect").val();

			var usedTable = employeeRobustnessTableHashtable.get(selectionList);
			if (usedTable != null ) {
				visibleTable = createVisibleEmployeeRobustnessTable(usedTable,rateSelect);
				displayVisibleEmployeeRobustnessTable(visibleTable);
			}
		});
		
	});

	$("#employeeRobustnessGraphButton").unbind("click");
	$("#employeeRobustnessGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerobustnessgraph.js",dataType: "script"});
	});
	

	$("#applicantRobustnessButton").unbind("click");
	$("#applicantRobustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
	});
	
	/*$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").change(function() {
		disableEmployeeRobustnessTableSelectors();		
		deactivateTopbarLinks();
		//console.log("listened");
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
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

function addEmployeeRobustnessTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectEmployeeRobustnessTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectEmployeeRobustnessTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			//var menuHolder = $("#menuDiv").detach();
			//$("#display-area-xs").html(menuHolder);
			var employeeRobustnessTableHolder = $("#employeeRobustnessTableDiv").detach();
			$("#display-area-xs").html(employeeRobustnessTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectEmployeeRobustnessTable = "mobile";
		}
		if ( windowAspectEmployeeRobustnessTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			//var menuHolder = $("#menuDiv").detach();
			//$("#display-area").html(menuHolder);
			var employeeRobustnessTableHolder = $("#employeeRobustnessTableDiv").detach();
			$("#display-area").html(employeeRobustnessTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectEmployeeRobustnessTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectEmployeeRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectEmployeeRobustnessTable != "mobile" ) {
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
		
		var displayWidth = (windowAspectEmployeeRobustnessTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		//$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#employeeRobustnessTableDiv").css("width",tableContainerWidth);
		var selectionList = queryEmployeeRobustnessTableSelectorValues();
		var rateSelect = $("#rateSelect").val();
		var usedTable = employeeRobustnessTableHashtable.get(selectionList,rateSelect);
		//console.log("usedTable:");
		//console.log(usedTable);
		if (usedTable != null ) {
			visibleTable = createVisibleEmployeeRobustnessTable(usedTable,rateSelect);
		}
		$("#employeeRobustnessTableDiv").html(visibleTable);
		$("#legendRedTR").html($("#legendRedTR").html());
		$("#legendGreenTR").html($("#legendGreenTR").html());

		
		if ( windowAspectEmployeeRobustnessTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			//$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#employeeRobustnessTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			//$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#employeeRobustnessTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




/*function employeeRobustnessCellColor(tstat){
	console.log(tstat);
	if ( tstat < -2.576 ) {
		return "#99ff99";
	}
	if ( tstat < -1.96 ) {
		return "#bbffbb";
	}
	if ( tstat < -1.645 ) {
		return "#ddffdd";
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
}*/
function employeeRobustnessCellColor(tstat){
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

