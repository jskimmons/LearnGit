
var windowAspectDriversGraph = "";
windowAspectDriversGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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

underlineOnlyThisLink("#driversLink");


// Show a "loading" animation

deactivateTopbarLinks();
displayGraphSpinner(windowAspectDriversGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#bbbbbb").css("margin-top","0px")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Drivers</h2><h4  style="font-weight: lighter;">Ranking variables by their influence in multiple turnover regression models and assessing potential impact of each turnover driver individually.</h4>');
$(selectorButtonBox).append(titleDiv);
var graphButton = $("<button></button>").attr('id','driversGraphButton')
					.attr('class','btn btn-default btn-block disabled').text("Graph")
					.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','driversTableButton')
.attr('class','btn btn-default btn-block').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);
if ( windowAspectDriversGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableDriversGraphSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var driverTypeSelector = {};
var driversRawGraph = {};
var formattedGraph = [];
var selectorsEverDrawn = false;
var driversSelectorValuesHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});

queryDriversTableSelectors();

function queryDriversTableSelectors() {
	var selectorListReturned = false;
	var selectorValuesReturned = false;
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorsdriver" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			selectorList = data.selectorList;
			selectorListReturned = true;
			if ( selectorValuesReturned ) {
				redrawDriversTableSelectorBoxes();
				var selectionList = queryDriversSelectorValues();
				//console.log(selectionList);
				refreshDriversGraph(queryDriversSelectorValues());		    
			}
			
			
		}
	});
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getselectorvaluesdriver" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			$(data.selections).each(function() {
				driversSelectorValuesHashtable.put(this,true);
			});
			selectorValuesReturned = true;
			if ( selectorListReturned ) {
				redrawDriversTableSelectorBoxes();
				var selectionList = queryDriversSelectorValues();
				//console.log("Selection is : ");
				//console.log(selectionList);
				refreshDriversGraph(queryDriversSelectorValues());		    
			}

		}
	});
	
}


function redrawDriversTableSelectorBoxes() {
	var activeSelectorsList = [];
	//console.log("selectorList:" + selectorList);
	var driverTypeSelector = {};
	var driverTypeDiv = $("<div></div>").attr("id","driverTypeDiv").css("padding","15px")
					.css("background-color","#51a351").css("margin-top","10px")
					.css("margin-bttom","10px");
	$(driverTypeDiv).append("<p>Driver category:</p>").attr("class","h3").css("color","#dddddd");
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
		.attr("class","form-control driversGraphSelect").attr("width","200px")
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
				var checkedHashEntry = driversSelectorValuesHashtable.get(thisSelection);
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
    	if ( this.selectorName === "driverType" ) {
    		$(driverTypeDiv).append(thisSelector);
    	}
    	else {
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

	var titleDivDetached = $("#titleDiv").detach();
	var driversGraphButtonDetached = $("#driversGraphButton").detach();
	var driversTableButtonDetached = $("#driversTableButton").detach();
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(driversGraphButtonDetached);
	$(selectorButtonBox).append(driversTableButtonDetached);
	$(selectorButtonBox).append(driverTypeDiv);
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

function refreshDriversGraph(selectorList) {
    disableDriversGraphSelectors();
    displayGraphSpinner(windowAspectDriversGraph);
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "driversgraph" , 
    			selectorlist : selectorList,
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		driversRawGraph = data;
    		driverIndex = 0;
    		redrawDriversGraph(driversRawGraph);
    	}
    });
}

function queryDriversSelectorValues() {
	var selectionList = [];
	$(".driversGraphSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return JSON.stringify(selectionList);
}

function disableDriversGraphSelectors() {
	deactivateTopbarLinks();
	$(".driversGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#rateSelect").unbind("change");
	$("#rateSelect").prop("disabled",true);
	$("#driversTableButton").prop("disabled",true);
	$("#driversPrevButton").prop("disabled",true);
	$("#driversNextButton").prop("disabled",true);

}

function enableDriversGraphSelectors() {
	activateTopbarLinks();
	$(".driversGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#rateSelect").prop("disabled",false);
	$("#driversTableButton").prop("disabled",false);
	$("#driversPrevButton").prop("disabled",false);
	$("#driversNextButton").prop("disabled",false);
}


function activateDriversGraphSelectors() {
	$(".driversGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var selectorList = queryDriversSelectorValues();
			//console.log(selectorList);
			refreshDriversGraph(selectorList);
		});
	});
	$("#rateSelect").change(function() {
	    disableDriversGraphSelectors();
		redrawDriversGraph(driversRawGraph);
	});
	$("#driversPrevButton").unbind("click");
	$("#driversPrevButton").click(function(){
		if ( driverIndex > 0 ) {
			driverIndex--;
		}
	    disableDriversGraphSelectors();
		redrawDriversGraph(driversRawGraph);
	});
	$("#driversNextButton").unbind("click");
	$("#driversNextButton").click(function(){
		if ( driverIndex < driversRawGraph.drivers.length - 1 ) {
			driverIndex++;
		}
	    disableDriversGraphSelectors();
		redrawDriversGraph(driversRawGraph);
	});
	$("#driversTableButton").unbind("click");
	$("#driversTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/driverstable.js",dataType: "script"});
	});
}

function driverColumnColor(tstat){
	if ( tstat < -2.576 ) {
		return "#99ff99";
	}
	if ( tstat < -1.96 ) {
		return "#99dd99";
	}
	if ( tstat < -1.645 ) {
		return "#99bb99";
	}
	if ( tstat > 2.576 ) {
		return "#ff9999";
	}
	if ( tstat > 1.96 ) {
		return "#dd9999";
	}
	if ( tstat > 1.645 ) {
		return "#bb9999";
	}
	
	return "#999999";
}

function redrawDriversGraph(rawGraph) {

	var chartContainerWidth = (windowAspectDriversGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	chartContainerWidth = chartContainerWidth + "px";
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 600 ) {
		lowerBoxesMobileHeight = 600;
	}
	var chartContainerHeight = lowerBoxesHeight - 125;
	if ( windowAspectDriversGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 150;
	}

	var driversChartTable = $("<table></table>").attr("id","driversChartTable")
							.css("margin","20px");
	var driversChartTbody = $("<tbody></tbody>").attr("id","driversChartTbody");
	var driversChartTR = $("<tr></tr>").attr("id","driversChartTR");
	var driversChartTD = $("<td></td>").attr("id","driversChartTD").attr("colspan","2");
	
	
	driversChartDiv = $("<div></div>").attr("id","driversChartDiv")
		.css("height",chartContainerHeight+"px").css("width",chartContainerWidth).css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px");

	$(driversChartTD).html(driversChartDiv);
	$(driversChartTR).html(driversChartTD);
	$(driversChartTbody).append(driversChartTR);
	var driversButtonTR = $("<tr></tr>").attr("id","driversButtonTR");
	var driversPrevButtonTD = $("<td></td>").attr("id","driversPrevButtonTD").css("width","50%");
	var driversNextButtonTD = $("<td></td>").attr("id","driversNextButtonTD").css("width","50%");
	var driversPrevButton = $("<button></button>").attr("id","driversPrevButton")
						.css("width","90%")
						.css("margin-bottom","10px").css("padding","10px");
	if ( driverIndex == 0 ) {
		$(driversPrevButton).attr('class','btn btn-default btn-block disabled').text("Previous Driver");
	}
	else {
		$(driversPrevButton).text("Previous Driver:" + rawGraph.drivers[driverIndex-1]["driverLabel"])
							.attr('class','btn btn-default btn-block');
	}
	$(driversPrevButtonTD).html(driversPrevButton);
	var driversNextButton = $("<button></button>").attr("id","driversNextButton")
						.css("width","90%")
						.css("margin-bottom","10px").css("padding","10px");
	if ( driverIndex >= rawGraph.drivers.length - 1 ) {
		$(driversNextButton).attr('class','btn btn-default btn-block disabled');
		$(driversNextButton).text("Next Driver");
	}
	else {
		$(driversNextButton).text("Next Driver:" + rawGraph.drivers[driverIndex+1]["driverLabel"])
							.attr('class','btn btn-default btn-block');
	}
	$(driversNextButtonTD).html(driversNextButton);
	$(driversButtonTR).append(driversPrevButtonTD).append(driversNextButtonTD);
	$(driversChartTbody).append(driversButtonTR);
	
	$(driversChartTable).html(driversChartTbody);
	
	//Attach first, otherwise AmCharts won't work....
	if ( windowAspectDriversGraph == "desktop") {
		$("#display-area").html(driversChartTable);
	}
	else {
		$("#display-area-xs").html(driversChartTable);
	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");


	driversChart = generateDriversChart(rawGraph,"driversChartDiv");
	driversChart.validateData();
	driversChart.animateAgain();
	redrawDriversTableSelectorBoxes();
	addDriversResizeListener();
	enableDriversGraphSelectors();
	activateDriversGraphSelectors();

}


function generateDriversChart(rawGraph,id) {
	
	var thisChartData = rawGraph.drivers[driverIndex];
	//console.log(thisChartData);
	var rawModelInfluence = thisChartData["influence"+$("#rateSelect option:selected").val()];
	switch ( rawModelInfluence ) {
	case -2 :
		var subtitle = "";
		break;
	case -1 :
		var subtitle = "Variable Not Incldued in Model for This Segment";
		break;
	case 0: 
		var subtitle = "Influence Level in Model: None";
		break;
	default:
		var subtitle = "Influence Level in Model: " + toPercent(rawModelInfluence/100,rawModelInfluence);
		break;
	}
	var formattedData = [];
	var maxProportion = 0;
	var maxTurnover = 0;
	$(thisChartData.categoryValues).each(function() {
		if ( this.proportion > maxProportion ) {
			maxProportion = this.proportion;
		}
		if ( this["p"+$("#rateSelect option:selected").val()] > maxTurnover ) {
			maxTurnover = this["p"+$("#rateSelect option:selected").val()];
		}
	});
	var turnoverAxisMax = Math.round(15*maxTurnover)/10;
	var proportionAxisMax = Math.round(15*maxProportion)/10;
	
	$(thisChartData.categoryValues).each(function() {
		if ( this["n"+$("#rateSelect option:selected").val()] == 0  ) {
			var thisDataPoint = {
					"category" : this.categoryValue,
					"turnover" : 0 ,
					"turnoverPct" : "No data" ,
					"color" : "#999999",
					"proportion" : (this.proportion == -1) ? 0 : this.proportion ,
					"proportionPct" : (this.proportion == -1) ? "N/A" : Math.round(1000*this.proportion)/10 + "%"
			};			
		} 
		else {
			var thisDataPoint = {
					"category" : this.categoryValue,
					"turnover" : this["p"+$("#rateSelect option:selected").val()] ,
					"turnoverPct" : Math.round(1000*this["p"+$("#rateSelect option:selected").val()])/10 + "%" ,
					"color" : driverColumnColor(this["t"+$("#rateSelect option:selected").val()]),
					"proportion" : (this.proportion == -1) ? 0 : this.proportion ,
					"proportionPct" : (this.proportion == -1) ? "N/A" : Math.round(1000*this.proportion)/10 + "%"
			};

		}
		
		formattedData.push(thisDataPoint);
	});
	//console.log(formattedData);
	//console.log("maxProportion is " + maxProportion + " and maxTurnover is " + maxTurnover);
	
    var chart = AmCharts.makeChart(id, {
    	type: "serial",
        theme: "light",
        dataProvider: formattedData ,
        marginLeft: 0,
        marginRight: 0,
        height: "80%",
        backgroundColor: "#eeeeee",
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        "titles" : [  {
        	text: "Effect of " + thisChartData.driverLabel + " on " + ($("#rateSelect option:selected").val()).substring(1) + "-day Turnover Rate",
        	size : 24
        },
        {
        	text: subtitle,
        	size : 14
        }],
        valueAxes: [{
            id: "proportionAxis",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "left",
            offset: 0,
            "strictMinMax": "true",
            //minMaxMultiplier: 1.5,
            minimum: 0,
            maximum : 1,
            //maximum : proportionAxisMax , 
            title: "Proportion of Respondents (Blue)",
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        },{
            id: "turnoverAxis",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "right",
            offset: 0,
            "strictMinMax": "true",
            //minMaxMultiplier: 1.5,
            minimum: 0,
            //maximum : turnoverAxisMax ,
            maximum : 1,
            title: "Individual Turnover Rate (Grey/Green/Red)",
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        }],
        graphs:   [ {
            "balloonText": thisChartData.driverLabel + ": <b>[[category]]</b>:<br>Proportion of Respondents: <b>[[value]]</b>",
            "fillAlphas": 0.8,
            "lineAlpha": 0,
            "type": "column",
            "valueField": "proportion",
            "valueAxis" : "proportionAxis",
            "lineColor": "#DDEEFF",
            "color" : "#oooooo" ,
            "columnWidth" : 0.5 , 
            "labelText": "[[proportionPct]]",
            "labelPosition" : "top" ,
            "labelOffset" : 5,
            "fontSize" : 16
          },{
              "balloonText": thisChartData.driverLabel + ": <b>[[category]]</b>:<br>" + ($("#rateSelect option:selected").val()).substring(1) + "-day turnover rate: <b>[[value]]</b>",
              "fillAlphas": 0.8,
              "lineAlpha": 0,
              "type": "column",
              "valueField": "turnover",
              "valueAxis" : "turnoverAxis",
              "colorField": "color",
              "labelText": "[[turnoverPct]]",
              "labelPosition" : "top" ,
              "labelOffset" : 5,
              "fontSize" : 16
            } ] ,
        categoryField: "category",
        categoryAxis: {
            position: "bottom",
            title: thisChartData.driverLabel ,
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
            gridCount : 7
        },
        "legend": {
        	"title" : "Significance level of\nturnover increase (red)\nor decrease (green):" ,
        	"maxColumns" : 3,
        	"data":  [{
                title: "10 percent", 
                color: "#99bb99"
            }, {
                title: "5 percent", 
                color: "#99dd99"
        	}, {
                title: "1 percent", 
                color: "#99ff99"},
            {
                title: "10 percent", 
                color: "#bb9999"
            }, {
            	title: "5 percent", 
            	color: "#dd9999"
            }, {
            	title: "1 percent", 
            	color: "#ff9999"
    		} , {
            	title: "Not significant", 
            	color: "#999999"
    		} , {
            	title: "Proportion", 
            	color: "#000033"}
                ]
        }
    });

    return chart;

	
}


function addDriversResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var localDriversChartHolder , localSelectorButtonBox;
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

		if ( windowAspectDriversGraph == "desktop" && newWindowAspect == "mobile" ) {
	   		localDriversChartHolder = $("#driversChartTable").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
	   		$("#display-area-xs").append(localDriversChartHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
			windowAspectDriversGraph = "mobile";
		}
		if ( windowAspectDriversGraph != "desktop" && newWindowAspect == "desktop" ) {
    		localDriversChartHolder = $("#driversChartTable").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area").append(localDriversChartHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			windowAspectDriversGraph = "desktop";
		}
		//console.log("Aspect was " + windowAspectDriversGraph + ", now " + newWindowAspect)

		var lowerBoxesHeight = $(window).height() - 51;
		var lowerBoxesMobileHeight = $(window).height() - 311;

		if ( lowerBoxesHeight < 500 ) {
			lowerBoxesHeight = 500;
		}
		if ( lowerBoxesMobileHeight < 600 ) {
			lowerBoxesMobileHeight = 600;
		}
		var chartContainerHeight = lowerBoxesHeight - 120;
		if ( windowAspectDriversGraph == "mobile" ) {
			chartContainerHeight = lowerBoxesMobileHeight - 150;
		}
		
		$("#leftbar-div").css("height",lowerBoxesHeight + "px");
		$("#display-area").css("height",lowerBoxesHeight + "px");
		$("#display-area-xs").css("height",lowerBoxesMobileHeight + "px");
				
		var chartContainerWidth = (windowAspectDriversGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
		if ( chartContainerWidth < 400 ) {
			chartContainerWidth = 400;
		}
		chartContainerWidth = chartContainerWidth + "px";
		$("#driversChartDiv").css("width",chartContainerWidth).css("height",chartContainerHeight+"px");
		var displayWidth =  $( window ).width() - 250;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);

		driversChart.animateAgain();
		adjustTopbarPadding();

	});
}
