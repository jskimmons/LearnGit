
var windowAspectRobustnessGraph = "";
windowAspectRobustnessGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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

underlineOnlyThisLink("#robustnessLink");


//console.log("Clicked");
// Show a "loading" animation

deactivateTopbarLinks();
displayGraphSpinner(windowAspectRobustnessGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Verification</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Models are estimated on a randomly chosen half of new hires; predicted and actual turnover rates are shown for the other half, broken down by TalenTeck turnover risk score categories.</h4>');

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);


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
}
*/

if ( windowAspectRobustnessGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableRobustnessGraphSelectors();

var selectorList = [];
var robustnessRawGraph = {};
var formattedGraph = [];
var selectorsEverDrawn = false;
var robustnessSelectorValuesHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});

queryRobustnessTableSelectors();

function queryRobustnessTableSelectors() {
	var selectorListReturned = false;
	var selectorValuesReturned = false;
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
			selectorListReturned = true;
			if ( selectorValuesReturned ) {
				redrawRobustnessGraphSelectorBoxes();
				var selectionList = queryRobustnessSelectorValues();
				//console.log(selectionList);
				refreshRobustnessGraph(queryRobustnessSelectorValues());		    
			}
			
			
		}
	});
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorvaluesrobustness" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			$(data.selections).each(function() {
				robustnessSelectorValuesHashtable.put(this,true);
			});
			selectorValuesReturned = true;
			if ( selectorListReturned ) {
				redrawRobustnessGraphSelectorBoxes();
				var selectionList = queryRobustnessSelectorValues();
				//console.log(selectionList);
				refreshRobustnessGraph(queryRobustnessSelectorValues());		    
			}

		}
	});
	
}

function redrawRobustnessGraphSelectorBoxes() {
	//console.log("Active links hash table:");
	//console.log(linksTable.entries());
	var activeSelectorsList = [];
	//console.log("selectorList:" + selectorList);
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
			.attr("class","form-control robustnessGraphSelect").attr("width","200px")
			.attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
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
				var checkedHashEntry = robustnessSelectorValuesHashtable.get(thisSelection);
				if ( checkedHashEntry != null ) {
					//console.log("Found " +  JSON.stringify(thisSelection))
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
	//console.log("Turnover usedDefaultValue:" + usedDefaultValue);
	
	/*var titleDivDetached = $("#titleDiv").detach();
	var robustnessGraphButtonDetached = $("#robustnessGraphButton").detach();
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
}
*/
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	
	var rateSelector = $("<select></select>").attr("id","rateSelect").attr("class","form-control").attr("width","200px");
	var defaultValue = $("<option></option>").attr("value","t365").text("Select Turnover Rate").attr("disabled",true);
	if (allSelected == false && "t365" == usedDefaultValue ) {
		/*$(defaultValue).attr("selected","selected");*/
		defaultFound = true;		        			
		//console.log("Checked off Select all with no allSelected");
	}
	$(rateSelector).append(defaultValue);
	$(["30","60","90","180","365"]).each(function() {
		var thisSelectorValue = $("<option></option>").attr("value","t"+this).text(this+"-day");
		if ( defaultFound === false && "t"+this == usedDefaultValue && allSelected == false ) {
			$(thisSelectorValue).attr("selected","selected");
			defaultFound = true;
			//console.log("Checked off " + this + "-day with no allSelected");
		}
		if (allSelected == true && "t"+this == defaultTurnoverRate ) {
			$(thisSelectorValue).attr("selected","selected");
			defaultFound = true;		        			
			//console.log("Checked off " + this.valueLabel + "with allSelected");
		}
		$(rateSelector).append(thisSelectorValue);
	});
	$(selectorButtonBox).append(rateSelector);


	selectorsEverDrawn = true;
	//console.log(activeSelectorsList);	
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



function refreshRobustnessGraph(selectorList) {
    disableRobustnessGraphSelectors();
    displayGraphSpinner(windowAspectRobustnessGraph);
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "robustnessgraph" , 
    			selectorlist : selectorList,
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		robustnessRawGraph = data;
    		redrawRobustnessGraph(robustnessRawGraph);
    	}
    });
}

function queryRobustnessSelectorValues() {
	//We've gotten rid of the time period selector, so we need to add it here.
	var selectionList = [ {selectorName : "periodName" , selectorValue : "All" } ];
	$(".robustnessGraphSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return JSON.stringify(selectionList);
}

function disableRobustnessGraphSelectors() {
	deactivateTopbarLinks();
	$(".robustnessGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#rateSelect").unbind("change");
	$("#rateSelect").prop("disabled",true);
	
	$("#robustnessTableButton").prop("disabled",true);
	$("#robustnessTableButton").attr("disabled","disabled");
	$("#employeeRobustnessButton").prop("disabled",true);
	$("#employeeRobustnessButton").attr("disabled","disabled");
	
	/*$("#reportsTableButton").prop("disabled",true);
	$("#applicantButton").prop("disabled",true);
	$("#interviewerButton").prop("disabled",true);

	$("#robustnessTableButton").prop("disabled",true);
	$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").prop("disabled",true);*/

}

function enableRobustnessGraphSelectors() {
	activateTopbarLinks();
	$(".robustnessGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#rateSelect").prop("disabled",false);
	$("#robustnessTableButton").prop("disabled",false);
	$("#robustnessTableButton").removeAttr("disabled");
	
	$("#employeeRobustnessButton").prop("disabled",false);
	$("#employeeRobustnessButton").removeAttr("disabled");
	/*$("#reportsTableButton").prop("disabled",false);
	$("#applicantButton").prop("disabled",false);
	$("#interviewerButton").prop("disabled",false);
	$("#robustnessTableButton").prop("disabled",false);
	$("#robustnessPopulationSelector").prop("disabled",false);*/
}


function activateRobustnessGraphSelectors() {
	$(".robustnessGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var selectorList = queryRobustnessSelectorValues();
			//console.log(selectorList);
			refreshRobustnessGraph(selectorList);
		});
	});
	$("#rateSelect").change(function() {
	    disableRobustnessGraphSelectors();
		redrawRobustnessGraph(robustnessRawGraph);
	});
	
	$("#employeeRobustnessButton").unbind("click");
	$("#employeeRobustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerobustnesstable.js",dataType: "script"});
	});
	
	$("#robustnessTableButton").unbind("click");
	$("#robustnessTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
	});
	/*$("#reportsTableButton").unbind("click");
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
	});

	$("#robustnessPopulationSelector").unbind("change");
	$("#robustnessPopulationSelector").change(function() {
		disableRobustnessGraphSelectors();		
		deactivateTopbarLinks();
		//console.log("listened");
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerobustnessgraph.js",dataType: "script"});
	});*/

}


function redrawRobustnessGraph(rawGraph) {

	var chartContainerWidth = (windowAspectRobustnessGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	//chartContainerWidth = chartContainerWidth;
	var chartWidth = (windowAspectRobustnessGraph == "mobile" ) ? chartContainerWidth - 100 : chartContainerWidth/2 - 100;
	var lowerBoxesHeight = $(window).height() - 51; 
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 1000 ) {
		lowerBoxesMobileHeight = 1000;
	}
	var chartContainerHeight = (windowAspectRobustnessGraph == "mobile" ) ? (lowerBoxesMobileHeight - 250)/2 : lowerBoxesHeight - 175;
	
	
	var robustnessChartTable = $("<table></table>").attr("id","robustnessChartTable")
							.css("margin","20px").css("width",chartContainerWidth+"px");
	var robustnessChartTbody = $("<tbody></tbody>").attr("id","robustnessChartTbody");
	var robustnessChartTR = $("<tr></tr>").attr("id","robustnessChartTR").css("height",chartContainerHeight+"px");
	var rocChartTD = $("<td></td>").attr("id","rocChartTD")
						.css("height",chartContainerHeight+"px")
						.css("padding-left","50px").css("padding-right","50px")
						.css("background-color","#cccccc");;

	
	rocChartDiv = $("<div></div>").attr("id","rocChartDiv")
		.css("height",chartContainerHeight+"px").css("width","100%").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px");

	$(rocChartTD).html(rocChartDiv);

	var robustnessChartTD = $("<td></td>").attr("id","robustnessChartTD").css("height",chartContainerHeight+"px")
											.css("padding-left","50px").css("padding-right","50px")
											.css("background-color","#dddddd");
	
	
	robustnessChartDiv = $("<div></div>").attr("id","robustnessChartDiv")
		.css("height",chartContainerHeight+"px").css("width",chartWidth+"px")
		.css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px");

	$(robustnessChartTD).html(robustnessChartDiv);

	var legendTR = $("<tr></tr>").attr("id","legendTR").css("height","50px");
	var legendTD = $("<td></td>").attr("id","legendTD").css("background-color","#dddddd");
	var blankTD = $("<td></td>").css("background-color","#cccccc");

	legendDiv = $("<div></div>").attr("id","legendDiv")
	.css("height","50px").css("width","100%").css("vertical-align","middle")
	.css("display","inline-block");
	$(legendTD).html(legendDiv).css("padding-left","100px").css("padding-right","50px");
	
	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','robustnessTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','robustnessGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	
	//Attach first, otherwise AmCharts won't work....
	if ( windowAspectRobustnessGraph == "desktop") {
		$(rocChartTD).css("width","50%");
		$(robustnessChartTD).css("width","50%");
		$(robustnessChartTR).append(rocChartTD).append(robustnessChartTD);
		$(legendTR).html(blankTD).append(legendTD);
		$(robustnessChartTbody).append(robustnessChartTR).append(legendTR);	
		$(robustnessChartTable).html(robustnessChartTbody);
		$("#display-area").html(menuDiv);
		$("#display-area").append(robustnessChartTable);
	}
	else {
		$(rocChartTD).css("width","100%");
		$(robustnessChartTD).css("width","100%");
		var rocChartTR = $("<tr></tr>").attr("id","rocChartTR").css("height",chartContainerHeight+"px");
		$(rocChartTR).append(rocChartTD);
		$(robustnessChartTR).append(robustnessChartTD);
		$(legendTR).html(legendTD);
		$(robustnessChartTbody).append(rocChartTR).append(robustnessChartTR).append(legendTR);	
		$(robustnessChartTable).html(robustnessChartTbody);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(robustnessChartTable);
	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#menuDiv").css("width",displayWidth);
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");


	rocChart = generateROCChart(rawGraph,"rocChartDiv");
	rocChart.validateData();
	rocChart.animateAgain();
	robustnessChart = generateRobustnessChart(rawGraph,"robustnessChartDiv");
	robustnessChart.validateData();
	robustnessChart.animateAgain();
	redrawRobustnessGraphSelectorBoxes();
	addRobustnessResizeListener();
	enableRobustnessGraphSelectors();
	activateRobustnessGraphSelectors();

}

function generateROCChart(rawGraph,id) {
	
	var thisChartData = rawGraph.quantiles;
	//console.log(thisChartData);
	var formattedData = rawGraph.quantiles;
	var thisAUC = "auct" + ($("#rateSelect option:selected").val()).substring(1);
	var thisROC = "roct" + ($("#rateSelect option:selected").val()).substring(1);
	
    var chart = AmCharts.makeChart(id, {
    	type: "serial",
        theme: "light",
        dataProvider: formattedData ,
        marginLeft: 0,
        marginRight: 50,
        height: "100%",
        backgroundColor: "#eeeeee",
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        "titles" : [  {
        	text: "Receiver Operating Characteristic Curve for " + ($("#rateSelect option:selected").val()).substring(1) + "-day Model",
        	size : 19
        },
        {
        	text: "Area Under Curve: " + Math.round(1000*rawGraph[thisAUC])/10 + "%",
        	size : 16
        }],
        valueAxes: [{
            id: "tprAxis",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "left",
            offset: 0,
            "strictMinMax": "true",
            minimum: 0,
            maximum : 1 , 
            title: "True Positive Rate",
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        }],
        graphs:   [ {
            "balloonText": "False Positive Rate: <b>[[category]]</b>:<br>True Positive Rate: <b>[[value]]</b>",
            "fillAlphas": 0.8,
            "lineAlpha": 1,
            "type": "line",
            "valueField": thisROC,
            "valueAxis" : "tprAxis",
            "lineColor": "#02955D",
            "color" : "#oooooo" ,
            //"labelText": "[[proportionPct]]",
            //"labelPosition" : "top" ,
            //"labelOffset" : 5,
            "fontSize" : 16
          } ] ,
        categoryField: "quantileNumber",
        categoryAxis: {
            position: "bottom",
            title: "False Positive Rate" ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            lineAlpha: 0,
            gridAlpha : 0 ,
            axisThickness: 2,
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            //autoGridCount : false ,
            //gridCount : 7,
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*10)/10 + "%";
            }
        }
    
    });

    return chart;

	
}



function generateRobustnessChart(rawGraph,id) {
	
	var thisChartData = rawGraph.quantiles;
	//console.log(thisChartData);
	var formattedData = rawGraph.quantiles;
	var maxProportion = 0;
	var maxTurnover = 0;
	var thismpt = "mpt" + ($("#rateSelect option:selected").val()).substring(1);
	var thismt = "mt" + ($("#rateSelect option:selected").val()).substring(1);
	var thislb = "lbt" + ($("#rateSelect option:selected").val()).substring(1);
	var thisub = "ubt" + ($("#rateSelect option:selected").val()).substring(1);
	var thisBandwidth = "bandwidthT" + ($("#rateSelect option:selected").val()).substring(1);
	
    var chart = AmCharts.makeChart(id, {
    	type: "xy",
        theme: "light",
        dataProvider: formattedData ,
        marginLeft: 0,
        marginRight: 50,
        height: "100%",
        backgroundColor: "#eeeeee",
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        "titles" : [  {
        	text: "Predicted vs. Actual Turnover for " + ($("#rateSelect option:selected").val()).substring(1) + "-day Model",
        	size : 19
        },
        {
        	text: "Epanechnikov kernel, bandwidth = " + Math.round(rawGraph[thisBandwidth]*1000)/1000,
        	size : 16
        }],
        	valueAxes: [{
            id: "actualAxis",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "left",
            offset: 0,
            "strictMinMax": "true",
            minMaxMultiplier: 1.2,
            minimum: 0,
            //maximum : proportionAxisMax , 
            title: "Actual Turnover Rate",
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        },{
            position: "bottom",
            title: "Predicted Turnover Rate" ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            lineAlpha: 0,
            gridAlpha : 0 ,
            axisThickness: 2,
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            autoGridCount : false ,
            gridCount : 7,
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        }],
        graphs:   [ {
            "balloonText": "Predicted Turnover Rate: <b>[[" + thismpt +  "]]</b>:<br>Actual Turnover Rate: <b>[[y]]</b>",
            "fillAlphas": 0,
            "lineAlpha": 1,
            "lineThickness" : 2,
            "type": "line",
            "xField": thismpt,
            "yField": thismt,
            "valueAxis" : "actualAxis",
            "lineColor": "#02955D",
            "color" : "#oooooo" ,
            //"labelText": "[[proportionPct]]",
            //"labelPosition" : "top" ,
            //"labelOffset" : 5,
            "fontSize" : 16
          }, {
              "balloonText": "Predicted Turnover Rate: <b>[[" + thismpt +  "]]</b>:<br>95% Confidence Interval Lower Bound: <b>[[y]]</b>",
              "fillAlphas": 0,
              "lineAlpha": 1,
              "lineThickness" : 2,
              "type": "line",
              "xField": thismpt,
              "yField": thislb,
              "valueAxis" : "actualAxis",
              "lineColor": "#66C19D",
              "color" : "#oooooo" ,
              //"labelText": "[[proportionPct]]",
              //"labelPosition" : "top" ,
              //"labelOffset" : 5,
              "fontSize" : 16
            }, {
                "balloonText": "Predicted Turnover Rate: <b>[[" + thismpt +  "]]</b>:<br>95% Confidence Interval Upper Bound: <b>[[y]]</b>",
                "fillAlphas": 0,
                "lineAlpha": 1,
                "lineThickness" : 2,
                "type": "line",
                "xField": thismpt,
                "yField":  thisub,
                "valueAxis" : "actualAxis",
                "lineColor": "#66C19D",
                "color" : "#oooooo" ,
                //"labelText": "[[proportionPct]]",
                //"labelPosition" : "top" ,
                //"labelOffset" : 5,
                "fontSize" : 16
              }, {
                  "balloonText": "45-Degree Line Representing Perfect Fit",
                  "fillAlphas": 0,
                  "lineAlpha": 1,
                  "lineThickness" : 2,
                  "type": "line",
                  "xField": thismpt,
                  "yField": thismpt,
                  "valueAxis" : "actualAxis",
                  "lineColor": "#555555",
                  "color" : "#oooooo" ,
                  //"labelText": "[[proportionPct]]",
                  //"labelPosition" : "top" ,
                  //"labelOffset" : 5,
                  "fontSize" : 16
                } ] ,
        "legend": {
        	"data":  [{
                title: "95% Confidence Interval Boundary", 
                color: "#66C19D"
            }, {
                title: "Actual Turnover Rate", 
                color: "#02955D"
        	}, {
                title: "45-Degree Line (Ideal Fit)", 
                color: "#555555"}],
            "divId" : "legendDiv"
        }
    });

    return chart;

	
}


function addRobustnessResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var localRobustnessChartHolder , localSelectorButtonBox;
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

		if ( windowAspectRobustnessGraph == "desktop" && newWindowAspect == "mobile" ) {
	   		localmenuHolder = $("#menuDiv").detach();
	   		localRobustnessChartHolder = $("#robustnessChartTable").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
	   		$("#display-area-xs").append(localmenuHolder);
	   		$("#display-area-xs").append(localRobustnessChartHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
			var rocChartTR = $("<tr></tr>").attr("id","rocChartTR").css("height",chartContainerHeight+"px");
			var rocChartTD = $("#rocChartTD").detach();
			var robustnessChartTD = $("#robustnessChartTD").detach();
			$(rocChartTR).html(rocChartTD);
			$("#robustnessChartTR").html(robustnessChartTD);
			var robustnessChartTR = $("#robustnessChartTR").detach();
			var legendTR = $("#legendTR").detach();
			$("#robustnessChartTbody").html(rocChartTR).append(robustnessChartTR).append(legendTR);	
			windowAspectRobustnessGraph = "mobile";
		}
		if ( windowAspectRobustnessGraph != "desktop" && newWindowAspect == "desktop" ) {
	   		localmenuHolder = $("#menuDiv").detach();
			localRobustnessChartHolder = $("#robustnessChartTable").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
	   		$("#display-area").append(localmenuHolder);
	   		$("#display-area").append(localRobustnessChartHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			var rocChartTD = $("#rocChartTD").detach();
			var robustnessChartTD = $("#robustnessChartTD").detach();
			$("#robustnessChartTR").html(rocChartTD).append(robustnessChartTD);
			var robustnessChartTR = $("#robustnessChartTR").detach();
			var blankTD = $("<td></td>").css("background-color","#cccccc");
			var legendTD = $("#legendTD").detach();
			var legendTR = $("<tr></tr>").html(blankTD).append(legendTD);
			//var oldLegendTR = $("#legendTR").detach();
			$("#robustnessChartTbody").html(robustnessChartTR).append(legendTR);	
			windowAspectRobustnessGraph = "desktop";
		}
		//console.log("Aspect was " + windowAspectRobustnessGraph + ", now " + newWindowAspect);

		var chartContainerWidth = (windowAspectRobustnessGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
		if ( chartContainerWidth < 400 ) {
			chartContainerWidth = 400;
		}
		var chartWidth = (windowAspectRobustnessGraph == "mobile" ) ?  chartContainerWidth - 100 : chartContainerWidth/2 - 100;
		var lowerBoxesHeight = $(window).height() - 51;
		var lowerBoxesMobileHeight = $(window).height() - 311;

		if ( lowerBoxesHeight < 500 ) {
			lowerBoxesHeight = 500;
		}
		if ( lowerBoxesMobileHeight < 1000 ) {
			lowerBoxesMobileHeight = 1000;
		}
		var chartContainerHeight = (windowAspectRobustnessGraph == "mobile" ) ? (lowerBoxesMobileHeight - 250)/2 : lowerBoxesHeight - 175;

		$("#leftbar-div").css("height",lowerBoxesHeight + "px");
		$("#display-area").css("height",lowerBoxesHeight + "px");
		$("#display-area-xs").css("height",lowerBoxesMobileHeight + "px");
				
		$("#robustnessChartTable").css("width",chartContainerWidth);
		$("#robustnessChartDiv").css("width",chartWidth+"px");
		$("#robustnessChartTR").css("height",chartContainerHeight+"px");
		$("#rocChartTR").css("height",chartContainerHeight+"px");
		$("#robustnessChartTD").css("height",chartContainerHeight+"px");
		$("#rocChartTD").css("height",chartContainerHeight+"px");
		$("#robustnessChartDiv").css("height",chartContainerHeight+"px");
		$("#rocChartDiv").css("height",chartContainerHeight+"px");
		var displayWidth =  $( window ).width() - 250;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);

		robustnessChart.animateAgain();
		rocChart.animateAgain();
		adjustTopbarPadding();

	});
};

