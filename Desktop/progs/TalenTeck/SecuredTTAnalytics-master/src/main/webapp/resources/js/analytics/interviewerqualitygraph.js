
var windowAspectInterviewerQualityGraph = "";
windowAspectInterviewerQualityGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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
//displayGraphSpinner(windowAspectInterviewerQualityGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Interviewers</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("padding-top","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h4  style="font-weight: lighter;">Shows differences in turnover rates of applicants approved by various interviewers.</h4>');
$(selectorButtonBox).append(titleDiv);

/*$(selectorButtonBox).append(titleDiv);
var graphButton = $("<button></button>").attr('id','interviewerQualityGraphButton')
					.attr('class','btn btn-default btn-block disabled').text("Graph")
					.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','interviewerQualityTableButton')
.attr('class','btn btn-default btn-block').text("Table")
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
var robustnessButton = $("<button></button>").attr('id','robustnessButton')
.attr('class','btn btn-default btn-block').text("Model Robustness")
.css("margin-bottom","10px").css("padding","10px");

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
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);
$(selectorButtonBox).append(interviewerButton);
}
$(selectorButtonBox).append(titleDescDiv);

if ( windowAspectInterviewerQualityGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableInterviewerQualityGraphSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var interviewerQualityRawGraph = {};
var formattedGraph = [];
var interviewerQualityGraphHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var interviewerQualitySelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

refreshInterviewerQualityGraph();

function refreshInterviewerQualityGraph() {

	var interviewerQualitySelectorsReturned = false;
	var interviewerQualityDataReturned = false;
	disableInterviewerQualityGraphSelectors();
    displayGraphSpinner(windowAspectInterviewerQualityGraph);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsinterviewerqualitygraph" } ,
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
	    		//console.log(interviewerQualityGraphHashtable.entries());
				redrawInterviewerQualitySelectorBoxes();
				var selectionList = queryInterviewerQualityGraphSelectorValues();
				//console.log(selectionList);
				var usedGraph = interviewerQualityGraphHashtable.get(selectionList);
				//console.log("usedGraph:");
				//console.log(usedGraph);
				if (usedGraph != null ) {
					displayVisibleInterviewerQualityGraph(usedGraph);
				}
				
			}
		}
	});

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "interviewerqualitygraph"  
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		interviewerQualityRawGraph = data;
    		$(data.rows).each(function() {
    			interviewerQualityGraphHashtable.put(this.selectorValues , this.quantiles);
    			interviewerQualitySelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		//console.log("Hash table:");
    		//console.log(interviewerQualitySelectionsHashtable.entries());    		
    		interviewerQualityDataReturned = true;
			if (interviewerQualitySelectorsReturned ) {
				redrawInterviewerQualitySelectorBoxes();
				var selectionList = queryInterviewerQualityGraphSelectorValues();
				//console.log(selectionList);
				var usedGraph = interviewerQualityGraphHashtable.get(selectionList);
				//console.log("usedGraph:");
				//console.log(usedGraph);
				if (usedGraph != null ) {
					displayVisibleInterviewerQualityGraph(usedGraph);
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
		.attr("class","form-control interviewerQualityGraphSelect").attr("width","300px")
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


function queryInterviewerQualityGraphSelectorValues() {
	//We've gotten rid of the time period selector, so we need to add it here.
	var selectionList = [];
	$(".interviewerQualityGraphSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function createVisibleInterviewerQualityGraph(graphData,div) {
	
	//console.log("graphData:");
	//console.log(graphData);
	
	var largestQuantile  = 0;
	$(graphData).each( function(index) {
		if (this.quantileNumber > largestQuantile ) {
			largestQuantile = this.quantileNumber;
		}
	});

	// Extract the bottom quantile
	
	var bottomQuantile = {
			meanturnover : 0,
			expectedturnover : 0 ,
			turnoverpremium : 0 
	};
	$.each(graphData,function(){
		if ( this.quantileNumber == 1 ) {
			bottomQuantile = {
					meanturnover : this.meanturnover,
					expectedturnover : this.expectedturnover ,
					turnoverpremium : this.turnoverpremium ,
			};
			
		}
		
	})
	
	
	var rate = $("#rate option:selected").val().substring(1);
	//The graph given to us is grouped by quantiles, and for AmCharts, we need to group it by stages
	var chartData = [
			{ 
				category : "Excess Turnover",
				categoryLabel : "excess turnover"  
					},
			{ 
				category : "Corrected Excess Turnover",
				categoryLabel : "corrected excess turnover"
					},
	];
	var maxQuantile = 0;
	$(graphData).each(function() {
		if ( this.quantileNumber > 1 ) {
			chartData[0]["q"+this.quantileNumber+"GraphValue"] = (this.meanturnover == -1 ? 0 : this.meanturnover - bottomQuantile.meanturnover);
			chartData[1]["q"+this.quantileNumber+"GraphValue"] = (this.turnoverpremium == -1 ? 0 : this.turnoverpremium - bottomQuantile.turnoverpremium );
			chartData[0]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.meanturnover - bottomQuantile.meanturnover,this.meanturnover+1);
			chartData[1]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.turnoverpremium - bottomQuantile.turnoverpremium ,this.turnoverpremium+1);			
		}
	});
	totalQuantiles = largestQuantile;

	
	
	var colors = ["#555555","#00124d","#001e80","#809dff"," #ccd8ff"];
	
	var quantileLabel = "quantile";
	switch ( largestQuantile ) {
	case 2:
		quantileLabel = "half";
		break;
	case 3:
		quantileLabel = "third";
		break;
	case 4:
		quantileLabel = "quartile";
		break;
	case 5:
		quantileLabel = "quintile";
		break;
	case 10:
		quantileLabel = "decile";
		break;
	}

	statisticDescription = "Increase in interviewee turnover when compared to the top " + quantileLabel + " of interviewers";
	statisticDescriptionTail = "";
	
	var graphStructure = [];
	$.each(graphData, function(i,value) {
		if ( i > 1 ) {
			var thisQuantileTitle = i + "th " + quantileLabel;
			switch(i) {
			case 1:
				thisQuantileTitle = "Best " + quantileLabel;
				thisQuantileTitleLower = "best " + quantileLabel;
				break;
			case 2:
				thisQuantileTitle = "2nd " + quantileLabel;
				thisQuantileTitleLower = "2nd " + quantileLabel;
				break;
			case 3:
				thisQuantileTitle = "3rd " + quantileLabel;
				thisQuantileTitleLower = "3rd " + quantileLabel;
				break;
			case totalQuantiles:
				thisQuantileTitle = "Worst " + quantileLabel;
				thisQuantileTitleLower = "worst " + quantileLabel;
				break;
			}
			
			thisGraph = {
		            id: "quantile"+i+"Graph",
		            valueAxis: "reportsAxis",
		            title: thisQuantileTitle,
		            type: "column",
		            //clustered: false, 
		            valueField: "q"+i+"GraphValue",
		            //alphaField: "alpha",
		            labelText : "[[q"+i+"LabelValue]]",
		            balloonText: "<span style='font-size:12px;'>[[q"+i+"LabelValue]]" + statisticDescription + thisQuantileTitleLower + statisticDescriptionTail + "</span>",
		            fillAlphas: 0.7,
		            color: "#000000",
		            fillColors: colors[i],
		            lineColor: colors[i]				
			};
			graphStructure.push(thisGraph);	
		}
	});
	//console.log("Amcharts graph object:");
	//console.log(graphStructure);
	
    var chart = AmCharts.makeChart(div, {
        type: "serial",
        theme: "light",
        dataProvider: chartData,
        addClassNames: true,
        startDuration: 0.5,
        //        color: "#FFFFFF",
        marginLeft: 30,
        marginRight: 30,
        height: "100%",
        fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
        valueAxes: [ {
            id: "reportsAxis",
            //            axisAlpha: 1,
            axisThickness: 1,
            //"stackType": "regular",
            gridAlpha: 0,
            axisAlpha: 1,
            minimum: 0,
            maximum: 1,
            position: "left",
            title: "Excess Turnover Rate",
            //tickLength : 0,
            //axisTitleOffset : 0 ,
            fontSize: 14,
            titleFontSize: 16,
            //labelsEnabled : false
            //labelFunction : function(number,label,axis) {
            //	return Math.floor(number*1000)/10 + "%";
            //}
        }],
        graphs:  graphStructure,
        categoryField: "category",
        categoryAxis: {
            position: "bottom",
            title: "Application Stage" ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            gridAlpha: 0,
            axisThickness: 1,
            fontSize: 14,
            titleFontSize: 16
        },
        legend: {
            position: "bottom",
        	divId : "interviewerQualityChartLegendDiv",
            valueText: "[[value]]",
            valueWidth: 40,
            fontSize : 16 ,
            valueAlign: "left",
            equalWidths: true,
            useGraphSettings: true,
            maxColumns: 4,
            switchable: false,
            textClickEnabled : true
        },
        "balloon": {
    	    fillAlpha: 1,
    	    "fillColor": "#fff"
    		}
    });

		
	
	//return chart;
	
}

function displayVisibleInterviewerQualityGraph(visibleGraph) {
	windowAspectInterviewerQualityGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var graphContainerWidth = (windowAspectInterviewerQualityGraph == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( graphContainerWidth < 450 && windowAspectInterviewerQualityGraph != "mobile" ) {
		graphContainerWidth = 450;
	}

	var graphContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = 500;
	var graphContainerMobileHeight = 450;
	
	interviewerQualityGraphDiv = $("<div></div>").attr("id","interviewerQualityGraphDiv")
		.css("height",graphContainerHeight).css("width",graphContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");

	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','interviewerQualityTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','interviewerQualityGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	
	if ( windowAspectInterviewerQualityGraph == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area").append(interviewerQualityGraphDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(interviewerQualityGraphDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#interviewerQualityGraphDiv").css("height",graphContainerMobileHeight);
	}

	createVisibleInterviewerQualityGraph(visibleGraph,"interviewerQualityGraphDiv");

	$("#legendRedTR").html($("#legendRedTR").html());
	$("#legendGreenTR").html($("#legendGreenTR").html());
	redrawInterviewerQualitySelectorBoxes();
	addInterviewerQualityGraphResizeListener();
	enableInterviewerQualityGraphSelectors();
	activateInterviewerQualityGraphSelectors();

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


function disableInterviewerQualityGraphSelectors() {
	deactivateTopbarLinks();
	$(".interviewerQualityGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#interviewerQualityTableButton").prop("disabled",true);
	//$("#reportsTableButton").prop("disabled",true);
	$("#applicantButton").prop("disabled",true);
	$("#robustnessButton").prop("disabled",true);
}

function enableInterviewerQualityGraphSelectors() {
	activateTopbarLinks();
	$(".interviewerQualityGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	//$("#reportsTableButton").prop("disabled",false);
	$("#interviewerQualityTableButton").prop("disabled",false);
	$("#applicantButton").prop("disabled",false);
	$("#robustnessButton").prop("disabled",false);
}


function activateInterviewerQualityGraphSelectors() {
	$(".interviewerQualityGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableInterviewerQualityGraphSelectors()
			var selectionList = queryInterviewerQualityGraphSelectorValues();
			var usedGraph = interviewerQualityGraphHashtable.get(selectionList);
			//console.log("usedGraph:");
			//console.log(usedGraph);
			if (usedGraph != null ) {
				displayVisibleInterviewerQualityGraph(usedGraph);
			}
		});
	});
	$("#interviewerQualityTableButton").unbind("click");
	$("#interviewerQualityTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitytable.js",dataType: "script"});
	});
	/*$("#reportsTableButton").unbind("click");
	$("#reportsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});*/
	$("#interviewerQualityGraphButton").unbind("click");
	$("#interviewerQualityGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitygraph.js",dataType: "script"});
	});
	$("#robustnessButton").unbind("click");
	$("#robustnessButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});
	});
	
	$("#applicantButton").unbind("click");
	$("#applicantButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	});

}

function addInterviewerQualityGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectInterviewerQualityGraph + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectInterviewerQualityGraph == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var interviewerQualityGraphHolder = $("#interviewerQualityGraphDiv").detach();
			$("#display-area-xs").append(interviewerQualityGraphHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectInterviewerQualityGraph = "mobile";
		}
		if ( windowAspectInterviewerQualityGraph != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);
			var interviewerQualityGraphHolder = $("#interviewerQualityGraphDiv").detach();
			$("#display-area").append(interviewerQualityGraphHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectInterviewerQualityGraph = "desktop";
		}
		
		var graphContainerWidth = (windowAspectInterviewerQualityGraph == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( graphContainerWidth < 450 && windowAspectInterviewerQualityGraph != "mobile" ) {
			graphContainerWidth = 450;
		}
		var graphContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		var displayAreaMobileHeight = 500;
		var graphContainerMobileHeight = 450;
		graphContainerHeight = graphContainerHeight + "px";
		graphContainerMobileHeight = graphContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectInterviewerQualityGraph == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		graphContainerWidth = graphContainerWidth + "px";
		$("#interviewerQualityGraphDiv").css("width",graphContainerWidth);
		var selectionList = queryInterviewerQualityGraphSelectorValues();
		var usedGraph = interviewerQualityGraphHashtable.get(selectionList);
		//console.log("usedGraph:");
		//console.log(usedGraph);
		if (usedGraph != null ) {
			visibleGraph = createVisibleInterviewerQualityGraph(usedGraph);
		}
		$("#interviewerQualityGraphDiv").html(visibleGraph);
		$("#legendRedTR").html($("#legendRedTR").html());
		$("#legendGreenTR").html($("#legendGreenTR").html());

		
		if ( windowAspectInterviewerQualityGraph == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#interviewerQualityGraphDiv").css("height",graphContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#interviewerQualityGraphDiv").css("height",graphContainerMobileHeight);
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

