
var windowAspectReportsGraph = "";
windowAspectReportsGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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
//displayGraphSpinner(windowAspectReportsGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Applicant Report</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("padding-top","15px")
.css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.css("margin-bottom","10px").html('<h4  style="font-weight: lighter;">Number of applicants, offers, acceptances, hires and new hire turnover rates broken down by TalenTeck New Hire Turnover Risk Score Quartiles. New Hire Turnover Models were estimated on sample from August 2012 - June 2015 and tested on sample from July 2015 - December 2015</h4>');

$(selectorButtonBox).append(titleDiv);

/*$(selectorButtonBox).append(titleDiv);
var graphButton = $("<button></button>")
	.attr('id','reportsGraphButton')
	.attr('class','btn btn-default btn-block disabled')
	.text("Graph")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>")
	.attr('id','reportsTableButton')
	.attr('class','btn btn-default btn-block')
	.text("Table")
	.css("margin-bottom","10px")
	.css("padding","10px")
	.prop("disabled",true);
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
}

*/


var robustnessButton = $("<button></button>").attr('id','robustnessButton')
.attr('class','btn btn-default btn-block').text("Model Robustness")
.css("margin-bottom","10px").css("padding","10px");

$(selectorButtonBox).append(robustnessButton);

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

if ( windowAspectReportsGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableReportsGraphSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var reportsRawGraph = {};
var formattedGraph = [];
var graphStatistic = "n";
var graphRate = "365";
//Total quantiles is verified by the reshape graph routine
var totalQuantiles = 4;
var reshapedUsedGraph = {};
var reportsTurnoverGraph = {};
var reportsGraphHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var reportsSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;

refreshReportsGraph();

function refreshReportsGraph() {

	var reportsSelectorsReturned = false;
	var reportsDataReturned = false;
	disableReportsGraphSelectors();
    displayGraphSpinner(windowAspectReportsGraph);
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
				redrawReportsGraphSelectorBoxes();
				var selectionList = queryReportsGraphSelectorValues();
				//console.log(selectionList);
				var usedGraph = reportsGraphHashtable.get(selectionList);
				$(selectionList).each(function() {
					if (this.selectorName === "statistic") {
						graphStatistic = this.selectorValue;
					}
					if (this.selectorName === "rate") {
						graphRate = this.selectorValue.substring(1);
					}
				});
				reshapedUsedGraph = reshapeReportsGraph(usedGraph,graphStatistic);
				reportsTurnoverGraph = extractReportsTurnoverGraph(usedGraph,graphStatistic);
				//console.log("Reshaped usedGraph:");
				//console.log(reshapedUsedGraph);
				if (usedGraph != null ) {
					redrawReportsGraph(reshapedUsedGraph,reportsTurnoverGraph,graphStatistic);
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
    		reportsRawGraph = data;
    		$(data.rows).each(function() {
    			reportsGraphHashtable.put(this.selectorValues , this.quantiles);
    			reportsSelectionsHashtable.put(this.selectorValues , this.hasObservations);
    		});
    		//console.log("Hash table:");
    		//console.log(reportsSelectionsHashtable.entries());    		
    		reportsDataReturned = true;
			if (reportsSelectorsReturned ) {
				redrawReportsGraphSelectorBoxes();
				var selectionList = queryReportsGraphSelectorValues();
				//console.log(selectionList);
				var usedGraph = reportsGraphHashtable.get(selectionList);
				var statistic = "n";
				$(selectionList).each(function() {
					if (this.selectorName === "statistic") {
						graphStatistic = this.selectorValue;
					}
					if (this.selectorName === "rate") {
						graphRate = this.selectorValue.substring(1);
					}
				});
				reshapedUsedGraph = reshapeReportsGraph(usedGraph,statistic);
				reportsTurnoverGraph = extractReportsTurnoverGraph(usedGraph,graphStatistic);
				//console.log("Reshaped usedGraph:");
				//console.log(reshapedUsedGraph);
				if (usedGraph != null ) {
					redrawReportsGraph(reshapedUsedGraph,reportsTurnoverGraph,graphStatistic);
				}		
			}
    	}
    });
}


function redrawReportsGraphSelectorBoxes() {
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
		.attr("class","form-control reportsGraphSelect").attr("width","300px")
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


function queryReportsGraphSelectorValues() {
	var selectionList = [];
	$(".reportsGraphSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function reshapeReportsGraph(usedGraph,statistic) {

	var rate = $("#rate option:selected").val().substring(1);
	//The graph given to us is grouped by quantiles, and for AmCharts, we need to group it by stages
	var returnGraph = [
			{ 
				category : "Applied",
				categoryLabel : "applied for a job"  
					},
			{ 
				category : "Offered",
				categoryLabel : "were offered for a job"
					},
			{ 
				category : "Accepted offer",
				categoryLabel : "accepted a job offer"
						},
			{ 
				category : "Hired",
				categoryLabel : "were hired"
					}
	];
	var maxQuantile = 0;
	$(usedGraph).each(function() {
		if ( statistic === "n" ) {
			returnGraph[0]["q"+this.quantileNumber+"GraphValue"] = (this.applied == -1 ? 0 : this.applied);
			returnGraph[1]["q"+this.quantileNumber+"GraphValue"] = (this.offered == -1 ? 0 : this.offered);
			returnGraph[2]["q"+this.quantileNumber+"GraphValue"] = (this.accepted == -1 ? 0 : this.accepted);
			returnGraph[3]["q"+this.quantileNumber+"GraphValue"] = (this.hired == -1 ? 0 : this.hired);
			returnGraph[0]["q"+this.quantileNumber+"LabelValue"] = (this.applied == -1 ? 0 : addCommas(this.applied));
			returnGraph[1]["q"+this.quantileNumber+"LabelValue"] = (this.offered == -1 ? 0 : addCommas(this.offered));
			returnGraph[2]["q"+this.quantileNumber+"LabelValue"] = (this.accepted == -1 ? 0 : addCommas(this.accepted));
			returnGraph[3]["q"+this.quantileNumber+"LabelValue"] = (this.hired == -1 ? 0 : addCommas(this.hired));
		}
		else {
			returnGraph[0]["q"+this.quantileNumber+"GraphValue"] = (this.applied == -1 ? 0 : this.applied);
			returnGraph[1]["q"+this.quantileNumber+"GraphValue"] = (this.offered == -1 ? 0 : this.offered);
			returnGraph[2]["q"+this.quantileNumber+"GraphValue"] = (this.accepted == -1 ? 0 : this.accepted);
			returnGraph[3]["q"+this.quantileNumber+"GraphValue"] = (this.hired == -1 ? 0 : this.hired);
			returnGraph[0]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.applied,this.applied+1);
			returnGraph[1]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.offered,this.offered+1);
			returnGraph[2]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.accepted,this.accepted+1);
			returnGraph[3]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.hired,this.hired+1);
		}
		if ( parseFloat(this.quantileNumber) > maxQuantile ) {
			maxQuantile = this.quantileNumber;
		}
	});
	totalQuantiles = maxQuantile;
	return returnGraph;
	
}

function extractReportsTurnoverGraph(usedGraph,statistic) {

	var rate = $("#rate option:selected").val().substring(1);
	//The graph given to us is grouped by quantiles, and for AmCharts, we need to group it by stages
	var returnGraph = [
			{ 
				category : rate +"-Day Turnover",
				categoryLabel : "left the company within " +rate+" days"
					}
	];

	$(usedGraph).each(function() {
		returnGraph[0]["q"+this.quantileNumber+"GraphValue"] = (this.turnover == -1 ? 0 : this.turnover);
		returnGraph[0]["q"+this.quantileNumber+"LabelValue"] = toPercent(this.turnover,this.turnover+1);		
	});
	return returnGraph;
	
}



function redrawReportsGraph(chartData,turnoverChartData,statistic) {
	//console.log("Chart data:");
	//console.log(chartData);
	var chartContainerWidth = (windowAspectReportsGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 620 ) {
		lowerBoxesHeight = 620;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if ( windowAspectReportsGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}
	var mainGraphHeight = chartContainerHeight - 100;

	reportsChartDiv = $("<div></div>")
		.attr("id","reportsChartDiv")
		.css("height",chartContainerHeight+"px")
		.css("width",chartContainerWidth)
		.css("vertical-align","middle")
		.css("display","inline-block")
		.css("margin-top","30px");
	//Attach first, otherwise AmCharts won't work....

	reportsChartMainGraphDiv = $("<div></div>")
	.attr("id","reportsChartMainGraphDiv")
	.css("height",mainGraphHeight+"px")
	.css("width","100%");
	
	reportsChartMainGraphTD = $("<td></td>")
	.attr("id","reportsChartMainGraphTD")
	.css("height",mainGraphHeight+"px")
	.css("width","75%")
	.html(reportsChartMainGraphDiv);

	reportsChartTurnoverGraphDiv = $("<div></div>")
	.attr("id","reportsChartTurnoverGraphDiv")
	.css("height",mainGraphHeight+"px")
	.css("width","100%");
	
	reportsChartTurnoverGraphTD = $("<td></td>")
	.attr("id","reportsChartTurnoverGraphTD")
	.css("height",mainGraphHeight+"px")
	.css("width","25%")
	.html(reportsChartTurnoverGraphDiv);

	reportsChartGraphTR = $("<tr></tr>")
		.attr("id","reportsChartGraphTR")
		.css("height",mainGraphHeight+"px")
		.html(reportsChartMainGraphTD)
		.append(reportsChartTurnoverGraphTD);

	reportsChartLegendDiv = $("<div></div>")
		.attr("id","reportsChartLegendDiv")
		.css("height","100px")
		.css("width","100%");

	reportsChartLegendTD = $("<td></td>")
		.attr("id","reportsChartLegendTD")
		.attr("colspan",2)
		.css("height","100px")
		.css("width","100%")
		.css("padding-left","100px")
		.html(reportsChartLegendDiv);

	reportsChartLegendTR = $("<tr></tr>")
		.attr("id","reportsChartLegendTR")
		.css("height","100px")
		.html(reportsChartLegendTD);
	
	reportsChartTbody = $("<tbody></tbody>")
		.attr("id","reportsChartTable")
		.css("width","100%")
		.css("height","100%")
		.html(reportsChartGraphTR)
		.append(reportsChartLegendTR);
	
	reportsChartTable = $("<table></table>")
		.attr("id","reportsChartTable")
		.css("width","100%")
		.css("height","100%")
		.html(reportsChartTbody);
	
	$(reportsChartDiv).html(reportsChartTable);
	
	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','reportsTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','reportsGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	
	if ( windowAspectReportsGraph == "desktop") {
		$("#display-area").html(menuDiv);
		$("#display-area").append(reportsChartDiv);
	}
	else {
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(reportsChartDiv);
	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#menuDiv").css("width",displayWidth);
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

	redrawReportsGraphSelectorBoxes();
	reportsChart = generateReportsChart("reportsChartMainGraphDiv",chartData,statistic);
	reportsTurnoverChart = generateReportsTurnoverChart("reportsChartTurnoverGraphDiv",turnoverChartData,statistic);
	reportsChart.validateData();
	reportsChart.animateAgain();
	reportsTurnoverChart.validateData();
	reportsTurnoverChart.animateAgain();
	addReportsGraphResizeListener();
	enableReportsGraphSelectors();
	activateReportsGraphSelectors();

}		    	


function generateReportsChart(id , chartData,statistic) {
	//var colors = ["#555555","blue","lighter blue","even lighter blue","lightest blue"];
	var colors = ["#555555","#5CA4B4","#ACD4D8","#F4C99C"," #EC9138"];
	var yAxisTitle = "Number of Candidates";
	var yAxisMaximum = "";
	
	var quantileLabel = "quantile";
	switch (totalQuantiles) {
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
	
	switch(statistic) {
	case "n":
		yAxisTitle = "Number of Candidates";
		yAxisMaximum = undefined;
		statisticDescription = " applicants who had a score in the ";
		statisticDescriptionTail = " [[categoryLabel]].";
	break;
	case "freq":
		yAxisTitle = "Fraction of Candidates"
		yAxisMaximum = 1;
		statisticDescription = " of those who [[categoryLabel]] had a score in the "
		statisticDescriptionTail = " of applicants.";
	break;
	case "rate":
		yAxisTitle = "Fraction of Applicants in Quantile"
		yAxisMaximum = 1;
		statisticDescription = " of those applicants who had a score in the "
		statisticDescriptionTail = " of applicants [[categoryLabel]].";
	break;
	case "mpt":
		yAxisTitle = "Mean Turnover Score"
		yAxisMaximum = 1;
		statisticDescription = " was the average test score of those in the overall "
		statisticDescriptionTail = " who [[categoryLabel]].";
	break;
	}
	
	var graphStructure = [];
	for ( var i = 1 ; chartData[0]["q"+i+"GraphValue"] != undefined && chartData[0]["q"+i+"GraphValue"] != null ; i++) {

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
	//console.log("Amcharts graph object:");
	//console.log(graphStructure);
	
    var chart = AmCharts.makeChart(id, {
        type: "serial",
        theme: "light",
        dataDateFormat: "YYYY-MM",
        dataProvider: chartData,
        addClassNames: true,
        startDuration: 0.5,
        //        color: "#FFFFFF",
        mouseWheelScrollEnabled: true,
        //         maxSelectedTime: 63072000000, // 1 year in milliseconds
        minSelectedTime: 31536000000,
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
            maximum: yAxisMaximum,
            position: "left",
            title: yAxisTitle,
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
        	divId : "reportsChartLegendDiv",
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

    return chart;
}


function generateReportsTurnoverChart(id , chartData,statistic) {
	var colors = ["#555555","#5CA4B4","#ACD4D8","#F4C99C"," #EC9138"];
	
	var quantileLabel = "quantile";
	switch (totalQuantiles) {
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
		
	var graphStructure = [];
	for ( var i = 1 ; chartData[0]["q"+i+"GraphValue"] != undefined && chartData[0]["q"+i+"GraphValue"] != null ; i++) {

		var thisQuantileTitle = i + "th " + quantileLabel;
		var thisQuantileTitleLower = i + "th " + quantileLabel;
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
	            id: "quantile"+i+"TurnoverGraph",
	            valueAxis: "reportsTurnoverAxis",
	            title: thisQuantileTitle,
	            type: "column",
	            //clustered: false, 
	            valueField: "q"+i+"GraphValue",
	            //alphaField: "alpha",
	            labelText : "[[q"+i+"LabelValue]]",
	            balloonText: "<span style='font-size:12px;'>For hires who scored in the " + thisQuantileTitleLower + " of applicants, the " + graphRate + "-day turnover rate was [[q"+i+"LabelValue]]</span>",
	            fillAlphas: 0.7,
	            color: "#000000",
	            fillColors: colors[i],
	            lineColor: colors[i],
	        					
		};
		graphStructure.push(thisGraph);
	}
	//console.log("Amcharts turover graph object:");
	//console.log(graphStructure);
	
    var chart = AmCharts.makeChart(id, {
        type: "serial",
        theme: "light",
        dataDateFormat: "YYYY-MM",
        dataProvider: chartData,
        addClassNames: true,
        startDuration: 0.5,
        //        color: "#FFFFFF",
        mouseWheelScrollEnabled: true,
        //         maxSelectedTime: 63072000000, // 1 year in milliseconds
        minSelectedTime: 31536000000,
        marginLeft: 0,
        marginRight: 30,
        height: "100%",
        fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
        valueAxes: [ {
            id: "reportsTurnoverAxis",
            //            axisAlpha: 1,
            axisThickness: 1,
            //"stackType": "regular",
            gridAlpha: 0,
            axisAlpha: 1,
            minimum: 0,
            maximum: 1,
            position: "right",
            title: "Turnover Rate",
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
            title: "Post-Hire" ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            gridAlpha: 0,
            axisThickness: 1,
            fontSize: 14,
            titleFontSize: 16
        }/*,
        legend: {
            position: "bottom",
        	divId : "legendDiv",
            valueText: "[[value]]",
            valueWidth: 40,
            valueAlign: "left",
            equalWidths: true,
            useGraphSettings: true,
            maxColumns: 4,
            switchable: false,
            textClickEnabled : true
        }*/,
        "balloon": {
    	    fillAlpha: 1,
    	    horizontalPadding: 2,
    	    "fillColor": "#fff"
    		}
    });

    return chart;
}



function disableReportsGraphSelectors() {
	deactivateTopbarLinks();
	$(".reportsGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#reportsTableButton").prop("disabled",true);
	/*$("#robustnessGraphButton").prop("disabled",true);
	$("#interviewerTableButton").prop("disabled",true);*/
	$("#robustnessButton").prop("disabled",true);
	$("#interviewerButton").prop("disabled",true);


}

function enableReportsGraphSelectors() {
	activateTopbarLinks();
	$(".reportsGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#reportsTableButton").prop("disabled",false);
	/*$("#robustnessGraphButton").prop("disabled",false);
	$("#interviewerTableButton").prop("disabled",false);*/
	$("#robustnessButton").prop("disabled",false);
	$("#interviewerButton").prop("disabled",false);
}

function addReportsGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		redrawReportsGraph(reshapedUsedGraph,graphStatistic);
	});
}


function activateReportsGraphSelectors() {
	$(".reportsGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableReportsGraphSelectors();
			var selectionList = queryReportsGraphSelectorValues();
			//console.log(selectionList);
			var usedGraph = reportsGraphHashtable.get(selectionList);
			$(selectionList).each(function() {
				if (this.selectorName === "statistic") {
					graphStatistic = this.selectorValue;
				}
				if (this.selectorName === "rate") {
					graphRate = this.selectorValue.substring(1);
				}
			});
			reshapedUsedGraph = reshapeReportsGraph(usedGraph,graphStatistic);
			reportsTurnoverGraph = extractReportsTurnoverGraph(usedGraph,graphStatistic);
			//console.log("Reshaped usedGraph:");
			//console.log(reshapedUsedGraph);
			if (usedGraph != null ) {
				redrawReportsGraph(reshapedUsedGraph,reportsTurnoverGraph,graphStatistic);
			}		
		});
	});
	$("#reportsTableButton").unbind("click");
	$("#reportsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
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

