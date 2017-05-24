
var windowAspectInterviewerQualityTable = "";
windowAspectInterviewerQualityTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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
//displayTableSpinner(windowAspectInterviewerQualityTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Interviewers</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("padding-top","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h4  style="font-weight: lighter;">Shows differences in turnover rates of applicants approved by various interviewers.</h4>');
$(selectorButtonBox).append(titleDiv);

/*var graphButton = $("<button></button>").attr('id','interviewerQualityGraphButton')
					.attr('class','btn btn-default btn-block').text("Graph")
					.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','interviewerQualityTableButton')
.attr('class','btn btn-default btn-block disabled').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);
if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
	var reportsTableButton = $("<button></button>")
		.attr('id','reportsTableButton')
		.attr('class','btn btn-default btn-block')
		.text("Applicant Report")
		.css("margin-bottom","10px")
		.css("padding","10px")
		.prop("disabled",true);
	$(selectorButtonBox).append(reportsTableButton);
	
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
	.css("margin-bottom","10px").css("padding","10px");
	$(selectorButtonBox).append(applicantButton);
	}

	if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
	var interviewerButton = $("<button></button>").attr('id','interviewerButton')
	.attr('class','btn btn-default btn-block').text("Interviewer Report")
	.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);
	$(selectorButtonBox).append(interviewerButton);
	}
	
$(selectorButtonBox).append(titleDescDiv);

if ( windowAspectInterviewerQualityTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableInterviewerQualityTableSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var interviewerQualityRawTable = {};
var formattedTable = [];
var interviewerQualityTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var interviewerQualitySelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

refreshInterviewerQualityTable();

function refreshInterviewerQualityTable() {

	var interviewerQualitySelectorsReturned = false;
	var interviewerQualityDataReturned = false;
	disableInterviewerQualityTableSelectors();
    displayTableSpinner(windowAspectInterviewerQualityTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsinterviewerquality" } ,
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
			
			interviewerQualitySelectorsReturned = true;
			if (interviewerQualityDataReturned ) {
	    		//console.log("Hash table:");
	    		//console.log(interviewerQualityTableHashtable.entries());
				redrawInterviewerQualitySelectorBoxes();
				var selectionList = queryInterviewerQualityTableSelectorValues();
				//console.log(selectionList);
				var usedTable = interviewerQualityTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleInterviewerQualityTable(usedTable);
					displayVisibleInterviewerQualityTable(visibleTable);
				}
				
			}
		}
	});

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "interviewerqualitytable"  
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		interviewerQualityRawTable = data;
    		$(data.rows).each(function() {
    			interviewerQualityTableHashtable.put(this.selectorValues , this.quantiles);
    			interviewerQualitySelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		//console.log("Hash table:");
    		//console.log(interviewerQualitySelectionsHashtable.entries());    		
    		interviewerQualityDataReturned = true;
			if (interviewerQualitySelectorsReturned ) {
				redrawInterviewerQualitySelectorBoxes();
				var selectionList = queryInterviewerQualityTableSelectorValues();
				//console.log(selectionList);
				var usedTable = interviewerQualityTableHashtable.get(selectionList);
				//console.log("usedTable:");
				//console.log(usedTable);
				if (usedTable != null ) {
					visibleTable = createVisibleInterviewerQualityTable(usedTable);
					displayVisibleInterviewerQualityTable(visibleTable);
				}
			}
    	}
    });
}


function redrawInterviewerQualitySelectorBoxes() {
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
		.attr("class","form-control interviewerQualityTableSelect").attr("width","300px")
		.attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;
		$(this.selectorValues).each( function() {
    		var checkedSelectorValue = this.valueName;
    		if ( selectorsEverDrawn ) {
    			//We've gotten rid of the time period selector, so we need to add it here.
    			//var thisSelection = [ {selectorName : "periodName" , selectorValue : "All" } ];
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
				var checkedHashEntry = interviewerQualitySelectionsHashtable.get(thisSelection);
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
	/*var titleDivDetached = $("#titleDiv").detach();
	var interviewerQualityGraphButtonDetached = $("#interviewerQualityGraphButton").detach();
	var interviewerQualityTableButtonDetached = $("#interviewerQualityTableButton").detach();
	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
		var reportsTableButtonDetached = $("#reportsTableButton").detach();		
	}
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(interviewerQualityGraphButtonDetached);
	$(selectorButtonBox).append(interviewerQualityTableButtonDetached);
	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
		$(selectorButtonBox).append(reportsTableButtonDetached);
	}
	if (linksTable.containsKey("employeeinterviewerQuality") &&  linksTable.get("employeeinterviewerQuality") === true) {
		var populationSelector = $("<select></select>")
			.attr("id","interviewerQualityPopulationSelector")
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
	var titleDivDetached = $("#titleDiv").detach();
	var interviewerButtonDetached = $("#interviewerButton").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var applicantButtonDetached = $("#applicantButton").detach();
	var robustnessButtonDetached = $("#robustnessButton").detach();
	
	$(selectorButtonBox).html(titleDivDetached);
	
	if (  linksTable.containsKey("robustness") &&  linksTable.get("robustness") === true ) {
	$(selectorButtonBox).append(robustnessButtonDetached);
	}
	
	if (  linksTable.containsKey("reports") &&  linksTable.get("reports") === true ) {
	$(selectorButtonBox).append(applicantButtonDetached);
	}
	if (linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true) {
		$(selectorButtonBox).append(interviewerButtonDetached);
	}
	
	if (linksTable.containsKey("employeeinterviewerQuality") &&  linksTable.get("employeeinterviewerQuality") === true) {
	var populationSelector = $("<select></select>")
	.attr("id","interviewerQualityPopulationSelector")
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
}

	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	
	/*
	var descriptionDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
	.css("background-color","#dddddd").css("margin-top","0px")
	.css("margin-bottom","10px").html('<h4 style="font-size: 16px">Models are estimated on a randomly-chosen 50% of new hires; predicted turnover scores and actual turnover rates are shown for the other 50% of new hires.</h4>');
	$(selectorButtonBox).append(descriptionDiv);	
	*/
	
	selectorsEverDrawn = true;
	$(selectorButtonBox).append(titleDescDivDetached);

	//console.log(activeSelectorsList);
}


function queryInterviewerQualityTableSelectorValues() {
	//We've gotten rid of the time period selector, so we need to add it here.
	var selectionList = [];
	$(".interviewerQualityTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function createVisibleInterviewerQualityTable(tableData) {
	
	//console.log("tableData:");
	//console.log(tableData);
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectInterviewerQualityTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectInterviewerQualityTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectInterviewerQualityTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 11*Math.floor((tableContainerWidth-60)/11);
	var columnWidth = Math.floor((tableWidth-60)/11);
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max(10,(columnWidth - 40)/2);
	//console.log("Widths are "  + tableContainerWidth + " , "+ tableWidth + " , " + columnWidth);
	var visibleTable = $("<table></table>").attr("id","interviewerQualityTable").attr("class","table")
						.css("width",tableWidth)
						.css("height",tableContainerHeight)
						.css("padding-left","0px")
						.css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>").attr("id","interviewerQualityThead").css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id","interviewerQualityTbody")
						.css("width",tableWidth);
						//.css("overflow-y","scroll").css("position","absolute")

	var titleRow = $("<tr></tr>").attr("id","titleRow").css("background-color","#dddddd")
						.css("width",tableWidth).css("border-top","2px solid #555555");
	if ( tableWidth < 850 ) {
		headerRightPadding = 5;
		var quantileTH = $("<th></th>").html("<br>Score<br>Qtile").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var pt30TH = $("<th></th>").html("<br>30-Day<br>TO<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t30TH = $("<th></th>").html("30-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt60TH = $("<th></th>").html("60-Day<br>TO<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t60TH = $("<th></th>").html("60-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt90TH = $("<th></th>").html("90-Day<br>TO<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t90TH = $("<th></th>").html("90-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt180TH = $("<th></th>").html("180-Day<br>TO<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t180TH = $("<th></th>").html("180-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt365TH = $("<th></th>").html("365-Day<br>TO<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t365TH = $("<th></th>").html("365-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa").css("border-right","2px solid #555555");
		
	}
	else {
		headerRightPadding = 10;
		var quantileTH = $("<th></th>").html("<br>Score<br>Quantile").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var pt30TH = $("<th></th>").html("30-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t30TH = $("<th></th>").html("30-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt60TH = $("<th></th>").html("60-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t60TH = $("<th></th>").html("60-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt90TH = $("<th></th>").html("90-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t90TH = $("<th></th>").html("90-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt180TH = $("<th></th>").html("180-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t180TH = $("<th></th>").html("180-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa");
		var pt365TH = $("<th></th>").html("365-Day<br>Turnover<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","2px solid #555555");
		var t365TH = $("<th></th>").html("365-Day<br>Corrected<br>Difference").attr("class","interviewerQualityRowLabelTD").css("width",columnWidth).css("text-align","center").css("padding-right",headerRightPadding+"px").css("border-left","1px solid #aaaaaa").css("border-right","2px solid #555555");
		
	}
	//var tailTH = $("<th></th>").attr("class","interviewerQualityRowLabelTD").css("width",45).css("padding-right","0px");
	
	$(titleRow).append(quantileTH).append(pt30TH).append(t30TH).append(pt60TH).append(t60TH)
		.append(pt90TH).append(t90TH).append(pt180TH).append(t180TH).append(pt365TH).append(t365TH);
	$(visibleThead).append(titleRow);
	
	var largestQuantile  = 0;
	$(tableData).each( function(index) {
		if (this.quantileNumber > largestQuantile ) {
			largestQuantile = this.quantileNumber;
		}
	});

	// Extract the bottom quantile
	
	var bottomQuantile = {
			meant30 : 0,
			expectedt30 : 0 ,
			t30premium : 0 ,
			meant60 : 0,
			expectedt60 : 0 ,
			t60premium : 0 ,
			meant90 : 0,
			expectedt90 : 0 ,
			t90premium : 0 ,
			meant180 : 0,
			expectedt180 : 0 ,
			t180premium : 0 ,
			meant365 : 0,
			expectedt365 : 0 ,
			t365premium : 0 
	};
	$.each(tableData,function(){
		if ( this.quantileNumber == 1 ) {
			bottomQuantile = {
					meant30 : this.meant30,
					expectedt30 : this.expectedt30 ,
					t30premium : this.t30premium ,
					meant60 : this.meant60 ,
					expectedt60 : this.expectedt60 ,
					t60premium : this.t60premium ,
					meant90 : this.meant90,
					expectedt90 : this.expectedt90 ,
					t90premium : this.t90premium ,
					meant180 : this.meant180 ,
					expectedt180 : this.expectedt180 ,
					t180premium : this.t180premium ,
					meant365 : this.meant365 ,
					expectedt365 : this.expectedt365 ,
					t365premium : this.t365premium 
			};
			
		}
		
	})
	
	$(tableData).each( function(index) {
		if ( this.quantileNumber != 0 ) {
				var quantileLabel = (this.quantileNumber == 1) ? "Best" :
					(this.quantileNumber == largestQuantile) ? "Worst" : 
						this.quantileNumber;
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#ffffff")
			.css("padding-top","5px").css("padding-bottom","5px");
			var titleTD = $("<td></td>").text(quantileLabel).attr("class","interviewerQualityRowLabelTD").css("width",columnWidth)
							.css("background-color","#ffffff").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var pt30TD = $("<td></td>").text(toPercent(this.meant30-bottomQuantile.meant30,this.meant30)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt30)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t30TD = $("<td></td>").text(toPercent(this.t30premium-bottomQuantile.t30premium)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt30)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt60TD = $("<td></td>").text(toPercent(this.meant60-bottomQuantile.meant60)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt60)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t60TD = $("<td></td>").text(toPercent(this.t60premium-bottomQuantile.t60premium)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt60)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt90TD = $("<td></td>").text(toPercent(this.meant90-bottomQuantile.meant90)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt90)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t90TD = $("<td></td>").text(toPercent(this.t90premium-bottomQuantile.t90premium)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt90)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt180TD = $("<td></td>").text(toPercent(this.meant180-bottomQuantile.meant180)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt180)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t180TD = $("<td></td>").text(toPercent(this.t180premium-bottomQuantile.t180premium)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt180)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt365TD = $("<td></td>").text(toPercent(this.meant365-bottomQuantile.meant365)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt365)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t365TD = $("<td></td>").text(toPercent(this.t365premium-bottomQuantile.t365premium)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color",interviewerQualityCellColor(this.tt365)).css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa")
							.css("border-right","2px solid #555555");

			$(thisRow).append(titleTD).append(pt30TD).append(t30TD).append(pt60TD).append(t60TD)
			.append(pt90TD).append(t90TD).append(pt180TD).append(t180TD).append(pt365TD).append(t365TD);
			$(visibleTbody).append(thisRow);
		}
		
			
	});
	/*
	$(tableData).each( function(index) {
		if ( this.quantileNumber == 0 ) {
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#dddddd")
			.css("padding-top","5px").css("padding-bottom","5px").css("border-bottom","2px solid #555555");
			var titleTD = $("<td></td>").text("Overall").attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var pt30TD = $("<td></td>").text(toPercent(this.mpt30,this.nt30)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t30TD = $("<td></td>").text(toPercent(this.mt30,this.nt30)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt60TD = $("<td></td>").text(toPercent(this.mpt60,this.nt60)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t60TD = $("<td></td>").text(toPercent(this.mt60,this.nt60)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt90TD = $("<td></td>").text(toPercent(this.mpt90,this.nt90)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t90TD = $("<td></td>").text(toPercent(this.mt90,this.nt90)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt180TD = $("<td></td>").text(toPercent(this.mpt180,this.nt180)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t180TD = $("<td></td>").text(toPercent(this.mt180,this.nt180)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa");
			var pt365TD = $("<td></td>").text(toPercent(this.mpt365,this.nt365)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","2px solid #555555");
			var t365TD = $("<td></td>").text(toPercent(this.mt365,this.nt365)).attr("class","interviewerQualityContentTD").css("width",columnWidth)
							.css("text-align","right").css("background-color","#dddddd").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left",rightPadding+"px")
							.css("padding-right",rightPadding+"px").css("border-left","1px solid #aaaaaa")
							.css("border-right","2px solid #555555");

			$(thisRow).append(titleTD).append(pt30TD).append(t30TD).append(pt60TD).append(t60TD)
			.append(pt90TD).append(t90TD).append(pt180TD).append(t180TD).append(pt365TD).append(t365TD);
			$(visibleTbody).append(thisRow);
		}
		
			
	});
	*/
	
	var legendTitleTD = $("<td></td>")
		.css("border","none")
		.attr("colspan",12)
		.html("<h5>Observed turnover rates are above (red) or below (green) mean of other categories at a significance level of:</h4>");
	var legendTitleTR = $("<tr></tr>")
			.css("height","25px")
			.css("max-height","25px")
			.css("border","none")
			.html(legendTitleTD);
	//$(visibleTbody).append(legendTitleTR);
	
	var legendBlankRedRowTD = $("<td></td>")
			.css("border","none");
	var legendOnePercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(3),20));
	var legendOnePercentRedTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("1 percent");

	var legendFivePercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(2),20));
	var legendFivePercentRedTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("5 percent");

	var legendTenPercentRedTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(1.75),20));
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
	//$(visibleTbody).append(legendRedTR);
	

	var legendBlankGreenRowTD = $("<td></td>")
			.css("border","none");
	var legendOnePercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(-3),20));
	var legendOnePercentGreenTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("1 percent");

	var legendFivePercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(-2),20));
	var legendFivePercentGreenTitleTD = $("<td></td>")
			.attr("colspan",2)
			.css("border","none")
			.html("5 percent");

	var legendTenPercentGreenTD = $("<td></td>")
			.css("border","none")
			.html(coloredBox(interviewerQualityCellColor(-1.75),20));
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
	//$(visibleTbody).append(legendGreenTR);
	

	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}

function displayVisibleInterviewerQualityTable(visibleTable) {
	windowAspectInterviewerQualityTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectInterviewerQualityTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectInterviewerQualityTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	interviewerQualityTableDiv = $("<div></div>").attr("id","interviewerQualityTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");

	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','interviewerQualityTableButton');
	var menuItem2 = $('<a class="btn btn-default">Graph</a>').attr('id','interviewerQualityGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	
	if ( windowAspectInterviewerQualityTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area").append(interviewerQualityTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(interviewerQualityTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#interviewerQualityTableDiv").css("height",tableContainerMobileHeight);
	}

	$(interviewerQualityTableDiv).html(visibleTable);
	$("#legendRedTR").html($("#legendRedTR").html());
	$("#legendGreenTR").html($("#legendGreenTR").html());
	redrawInterviewerQualitySelectorBoxes();
	addInterviewerQualityTableResizeListener();
	enableInterviewerQualityTableSelectors();
	activateInterviewerQualityTableSelectors();

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


function disableInterviewerQualityTableSelectors() {
	deactivateTopbarLinks();
	$(".interviewerQualityTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#interviewerQualityGraphButton").prop("disabled",true);
	//$("#reportsTableButton").prop("disabled",true);
	$("#interviewerQualityPopulationSelector").unbind("change");
	$("#interviewerQualityPopulationSelector").prop("disabled",true);
	$("#applicantButton").prop("disabled",true);
	$("#robustnessButton").prop("disabled",true);


}

function enableInterviewerQualityTableSelectors() {
	activateTopbarLinks();
	$(".interviewerQualityTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#interviewerQualityGraphButton").prop("disabled",false);
	//$("#reportsTableButton").prop("disabled",false);
	$("#interviewerQualityPopulationSelector").prop("disabled",false);
	$("#applicantButton").prop("disabled",false);
	$("#robustnessButton").prop("disabled",false);
}


function activateInterviewerQualityTableSelectors() {
	$(".interviewerQualityTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableInterviewerQualityTableSelectors()
			var selectionList = queryInterviewerQualityTableSelectorValues();
			var usedTable = interviewerQualityTableHashtable.get(selectionList);
			//console.log("usedTable:");
			//console.log(usedTable);
			if (usedTable != null ) {
				visibleTable = createVisibleInterviewerQualityTable(usedTable);
				displayVisibleInterviewerQualityTable(visibleTable);
			}
		});
	});
	$("#interviewerQualityPopulationSelector").unbind("change");
	$("#interviewerQualityPopulationSelector").change(function() {
		disableInterviewerQualityTableSelectors();		
		deactivateTopbarLinks();
		//console.log("listened");
		$.ajax({type: "GET",url: "../resources/js/analytics/employeeinterviewerqualitytable.js",dataType: "script"});
	});
	$("#interviewerQualityGraphButton").unbind("click");
	$("#interviewerQualityGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitygraph.js",dataType: "script"});
	});
	/*$("#reportsTableButton").unbind("click");
	$("#reportsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});*/
	$("#robustnessButton").unbind("click");
	$("#robustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
	});
	
	$("#applicantButton").unbind("click");
	$("#applicantButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});


}

function addInterviewerQualityTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectInterviewerQualityTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectInterviewerQualityTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var interviewerQualityTableHolder = $("#interviewerQualityTableDiv").detach();
			$("#display-area-xs").append(interviewerQualityTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectInterviewerQualityTable = "mobile";
		}
		if ( windowAspectInterviewerQualityTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);
			var interviewerQualityTableHolder = $("#interviewerQualityTableDiv").detach();
			$("#display-area").append(interviewerQualityTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectInterviewerQualityTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectInterviewerQualityTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectInterviewerQualityTable != "mobile" ) {
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
		
		var displayWidth = (windowAspectInterviewerQualityTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#interviewerQualityTableDiv").css("width",tableContainerWidth);
		var selectionList = queryInterviewerQualityTableSelectorValues();
		var usedTable = interviewerQualityTableHashtable.get(selectionList);
		//console.log("usedTable:");
		//console.log(usedTable);
		if (usedTable != null ) {
			visibleTable = createVisibleInterviewerQualityTable(usedTable);
		}
		$("#interviewerQualityTableDiv").html(visibleTable);
		$("#legendRedTR").html($("#legendRedTR").html());
		$("#legendGreenTR").html($("#legendGreenTR").html());

		
		if ( windowAspectInterviewerQualityTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#interviewerQualityTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#interviewerQualityTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




function interviewerQualityCellColor(tstat){
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
}

