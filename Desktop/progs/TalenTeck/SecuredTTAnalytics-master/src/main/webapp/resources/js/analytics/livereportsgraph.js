var windowAspectLiveReportsGraph = "";
windowAspectLiveReportsGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 730 ) {
	lowerBoxesHeight = 730;
}
if ( lowerBoxesMobileHeight < 500 ) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height",lowerBoxesHeight+"px").css("padding","25px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

underlineOnlyThisLink("#liveReportLink");


// Show a "loading" animation

deactivateTopbarLinks();
//displayTableSpinner(windowAspectLiveReportsGraph);

// First develop the selector box
/*
$('head').append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">');
$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />');
$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" />');

$('head').append('<script>$(function() {$("#StartDate").datepicker();});</script>');
$('head').append('<script>$(function() {$("#EndDate").datepicker();});</script>');
*/

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Reports</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Selection and turnover rates for a panel of applicants, broken down by TalenTeck turnover risk score categories.</h4>');

var applicantReportButton = $("<button></button>").attr('id','applicantReportButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px").prop("disabled", true);


var employeeRiskButton = $("<button></button>").attr('id','employeeRiskButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px");


var laborMarketChartButton = $("<button></button>").attr('id','laborMarketChartButton').attr('class','btn btn-default btn-block').prop("disabled",true)
.text("Labor Markets").css("margin-bottom","10px").css("padding","10px");

/*var employeeScoreButton = $("<button></button>").attr('id','employeeScoreButton')
.attr('class','btn btn-default btn-block').text("Employee Scores")
.css("margin-bottom","10px").css("padding","10px");*/

$(selectorButtonBox).append(titleDiv).append(titleDescDiv).append(applicantReportButton).append(employeeRiskButton).append(laborMarketChartButton);//.append(employeeScoreButton);

/*var graphButton = $("<button></button>").attr('id','liveReportsGraphButton')
.attr('class','btn btn-default btn-block disabled').text("Graph")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','liveReportsTableButton')
.attr('class','btn btn-default btn-block').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);*/

if ( windowAspectLiveReportsGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableLiveReportsGraphSelectors();




var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var usedTable = {};
var liveReportsRawTable = {};
var formattedTable = [];
var liveReportsGraphHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var liveReportsSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var splitDate,miny,minm,mind,maxy,maxm,maxd;
var totalQuantiles = 4;

refreshLiveReportsGraph();


function fetchLiveReportsGraph(selectionList) {
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "livereporttable" ,
    			selectorlist : JSON.stringify(selectionList)
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log("Table returned:");
    		//console.log(data);
    		usedGraph = data.rows;
    		var graphStatistic = $("#Statistics option:selected").val();
			reshapedUsedGraph = reshapeLiveReportsGraph(usedGraph,graphStatistic);
			reportsTurnoverGraph = extractLiveReportsTurnoverGraph(usedGraph,graphStatistic);
			//console.log("Reshaped usedGraph:");
			//console.log(reshapedUsedGraph);
			if (usedGraph != null ) {
				redrawLiveReportsGraph(reshapedUsedGraph,reportsTurnoverGraph,graphStatistic);
			}		
    	}
    });
}

function refreshLiveReportsGraph() {

	var liveReportsSelectorsReturned = false;
	var liveReportsDataReturned = false;
	disableLiveReportsGraphSelectors();
    displayTableSpinner(windowAspectLiveReportsGraph);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getliveselectorsreports" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			selectorList = data.selectorList;
			//console.log("Initially, selectorList:")
			//console.log(selectorList);
			
			//console.log("Hash table:");
    		/*console.log(reportSelectionHashtable.entries());*/
			redrawLiveReportsSelectorBoxes();
			var selectionList = queryLiveReportsGraphSelectorValues();
			//console.log(selectionList);
			fetchLiveReportsGraph(selectionList);
		}
	});
	
}


function redrawLiveReportsSelectorBoxes() {

	var activeSelectorsList = [];
	//console.log("selectorList:")
	//console.log(selectorList);
	
	$(selectorList).each(function() {
		if(this.selectorName === "StartDate"){
			 splitDate = $(this.selectorValues)[0].valueName.split("/"); 
			 miny = parseInt(splitDate[2]);
			 minm = parseInt(splitDate[0]);
			 mind = parseInt(splitDate[1]);
		}
		if(this.selectorName === "EndDate"){
			 splitDate = $(this.selectorValues)[0].valueName.split("/"); 
			 maxy = parseInt(splitDate[2]);
			 maxm = parseInt(splitDate[0]);
			 maxd = parseInt(splitDate[1]);
		}
	});

	var dateTitleDiv = $("<div></div>")
		.attr("id","dateTitleDiv")
		.css("background-color","#44494C")
		.css("color","#FFFFFF")
		.css("margin-bottom","10px");
		//.html('<b>Select Dates</b>');
 	activeSelectorsList.push(dateTitleDiv);

	
	$(selectorList).each(function() {
		//console.log()
		if(this.selectorName === "StartDate" ||this.selectorName === "EndDate" ){
			 var thisSelector = $("<input></input>").attr("id",this.selectorName)
			.attr("class","form-control liveReportsGraphSelect").attr("width","300px")
			.attr("value",$(this.selectorValues)[0].valueName).text($(this.selectorValues)[0].valueLabel)
			.attr("readonly","true");
			//.click(function());
					//$("#StartDate").datepicker({minDate:new Date(2016,3-1,4),maxDate:new Date(2016,5-1,18),});
					//$("#EndDate").datepicker({minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd),});
		

		}
		else{	
		
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
			.attr("class","form-control liveReportsGraphSelect").attr("width","300px")
			.attr("defaultValue",this.defaultValue);
		$(this.selectorValues).each( function() {
    		var thisValue = $("<option></option>").attr("value",this.valueName)
			.text(this.valueLabel);
    		if ( this.valueName === "Tribeca" || this.valueName ==="Philippines") {
    			$(thisValue).attr("selected","selected");
				$(thisValue).prop("selected",true);
    		}
        	$(thisSelector).append(thisValue);    			
		});
		}
    	//activeSelectorsList.push(thisSelectorLabel);
    	activeSelectorsList.push(thisSelector);
      	if(this.selectorName==="EndDate"){
      		var filterTitleDiv = $("<div></div>")
      			.attr("id","filterTitleDiv")
      			.css("background-color","#44494C")
      			.css("color","#FFFFFF")
      			.css("margin-top","10px")
      			.css("margin-bottom","10px");
      			//.html('<b>Select Filters</b>');
      		 activeSelectorsList.push(filterTitleDiv);
      	}
	});
	
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var applicantReportButtonDetached = $("#applicantReportButton").detach();
	var employeeRiskButtonDetached = $("#employeeRiskButton").detach();
	var laborMarketChartButtonDetached = $("#laborMarketChartButton").detach();
	//var employeeScoreButtonDetached = $("#employeeScoreButton").detach();

	//Not used for this sheet:
	/*var liveReportsGraphButtonDetached = $("#liveReportsGraphButton").detach();
	var liveReportsTableButtonDetached = $("#liveReportsTableButton").detach();*/
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantReportButtonDetached);
	$(selectorButtonBox).append(employeeRiskButtonDetached);
	$(selectorButtonBox).append(laborMarketChartButtonDetached);
	//$(selectorButtonBox).append(employeeScoreButtonDetached);

	
	/*$(selectorButtonBox).append(liveReportsGraphButtonDetached);
	$(selectorButtonBox).append(liveReportsTableButtonDetached);*/
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);		
	});
}

function queryLiveReportsGraphSelectorValues() {
	var selectionList = [];
	$(".liveReportsGraphSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return selectionList;
}

function reshapeLiveReportsGraph(usedGraph,statistic) {

	var rate = $("#Rate option:selected").val().substring(1);
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
		if ( statistic === "Count" ) {
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

function extractLiveReportsTurnoverGraph(usedGraph,statistic) {

	var rate = $("#Rate option:selected").val();
	//The graph given to us is grouped by quantiles, and for AmCharts, we need to group it by stages
	var returnGraph = [
			{ 
				category : rate +" Turnover",
				categoryLabel : "left the company within " +rate+" days"
					}
	];

	$(usedGraph).each(function() {
		returnGraph[0]["q"+this.quantileNumber+"GraphValue"] = (this.turnover == -1 ? 0 : (this.turnover/100));
		returnGraph[0]["q"+this.quantileNumber+"LabelValue"] = toPercent((this.turnover/100),(this.turnover/100)+1);		
	});
	//console.log("Exctracted turnover graph:");
	//console.log(returnGraph);
	return returnGraph;
	
}



function redrawLiveReportsGraph(chartData,turnoverChartData,statistic) {
	//console.log("Chart data:");
	//console.log(chartData);
	var chartContainerWidth = (windowAspectLiveReportsGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 730 ) {
		lowerBoxesHeight = 730;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if ( windowAspectLiveReportsGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}
	var mainGraphHeight = chartContainerHeight - 100;


	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");		
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','liveReportsTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','liveReportsGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	
	liveReportsChartDiv = $("<div></div>")
		.attr("id","liveReportsChartDiv")
		.css("height",chartContainerHeight+"px")
		.css("width",chartContainerWidth)
		.css("vertical-align","middle")
		.css("display","inline-block")
		.css("margin-top","30px");
	//Attach first, otherwise AmCharts won't work....

	liveReportsChartMainGraphDiv = $("<div></div>")
	.attr("id","liveReportsChartMainGraphDiv")
	.css("height",mainGraphHeight+"px")
	.css("width","100%");
	
	liveReportsChartMainGraphTD = $("<td></td>")
	.attr("id","liveReportsChartMainGraphTD")
	.css("height",mainGraphHeight+"px")
	.css("width","75%")
	.html(liveReportsChartMainGraphDiv);

	liveReportsChartTurnoverGraphDiv = $("<div></div>")
	.attr("id","liveReportsChartTurnoverGraphDiv")
	.css("height",mainGraphHeight+"px")
	.css("width","100%");
	
	liveReportsChartTurnoverGraphTD = $("<td></td>")
	.attr("id","liveReportsChartTurnoverGraphTD")
	.css("height",mainGraphHeight+"px")
	.css("width","25%")
	.html(liveReportsChartTurnoverGraphDiv);

	liveReportsChartGraphTR = $("<tr></tr>")
		.attr("id","liveReportsChartGraphTR")
		.css("height",mainGraphHeight+"px")
		.html(liveReportsChartMainGraphTD)
		.append(liveReportsChartTurnoverGraphTD);

	liveReportsChartLegendDiv = $("<div></div>")
		.attr("id","liveReportsChartLegendDiv")
		.css("height","100px")
		.css("width","100%");

	liveReportsChartLegendTD = $("<td></td>")
		.attr("id","liveReportsChartLegendTD")
		.attr("colspan",2)
		.css("height","100px")
		.css("width","100%")
		.css("padding-left","100px")
		.html(liveReportsChartLegendDiv);

	liveReportsChartLegendTR = $("<tr></tr>")
		.attr("id","liveReportsChartLegendTR")
		.css("height","100px")
		.html(liveReportsChartLegendTD);
	
	liveReportsChartTbody = $("<tbody></tbody>")
		.attr("id","liveReportsChartTable")
		.css("width","100%")
		.css("height","100%")
		.html(liveReportsChartGraphTR)
		.append(liveReportsChartLegendTR);
	
	liveReportsChartTable = $("<table></table>")
		.attr("id","liveReportsChartTable")
		.css("width","100%")
		.css("height","100%")
		.html(liveReportsChartTbody);
	
	$(liveReportsChartDiv).html(liveReportsChartTable);
	
	if ( windowAspectLiveReportsGraph == "desktop") {
		$("#display-area").html(menuDiv);
		$("#display-area").append(liveReportsChartDiv);
	}
	else {
		$("#display-area").html(menuDiv);
		$("#display-area-xs").append(liveReportsChartDiv);
	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#menuDiv").css("width",displayWidth);
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

	//redrawLiveReportsGraphSelectorBoxes();
	liveReportsChart = generateLiveReportsChart("liveReportsChartMainGraphDiv",chartData,statistic);
	liveReportsTurnoverChart = generateLiveReportsTurnoverChart("liveReportsChartTurnoverGraphDiv",turnoverChartData,statistic);
	liveReportsChart.validateData();
	liveReportsChart.animateAgain();
	liveReportsTurnoverChart.validateData();
	liveReportsTurnoverChart.animateAgain();
	addLiveReportsGraphResizeListener();
	enableLiveReportsGraphSelectors();
	activateLiveReportsGraphSelectors();

}		    	


function generateLiveReportsChart(id , chartData,statistic) {
	//var colors = ["#555555","blue","lighter blue","even lighter blue","lightest blue"];
	var colors = ["#555555","#5CA4B4","#84BCC6","#ACD4D8","#F4C99C","#F0AD6A","#EC9138"];
	var yAxisTitle = "Number of Candidates";
	var yAxisMaximum = "";
	
	//console.log("Turnover chart data:");
	//console.log(chartData);
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
	case "Count":
		yAxisTitle = "Number of Candidates";
		yAxisMaximum = undefined;
		statisticDescription = " applicants who had a score in the ";
		statisticDescriptionTail = " [[categoryLabel]].";
	break;
	case "Absolute Percent":
		yAxisTitle = "Absolute Percent of Candidates"
		yAxisMaximum = 1;
		statisticDescription = " of those who [[categoryLabel]] had a score in the "
		statisticDescriptionTail = " of applicants.";
	break;
	case "Conditional Percent":
		yAxisTitle = "Conditional Percent of Candidates"
		yAxisMaximum = 1;
		statisticDescription = " of those applicants who had a score in the "
		statisticDescriptionTail = " of applicants [[categoryLabel]].";
	break;
	case "Average Score":
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
		case 4:
			thisQuantileTitle = "4th " + quantileLabel;
			thisQuantileTitleLower = "4th " + quantileLabel;
			break;
		case 5:
			thisQuantileTitle = "5th " + quantileLabel;
			thisQuantileTitleLower = "5th " + quantileLabel;
			break;
		case totalQuantiles:
			thisQuantileTitle = "Worst " + quantileLabel;
			thisQuantileTitleLower = "worst " + quantileLabel;
			break;
		}
		if(i == totalQuantiles) {
			thisQuantileTitle = "Worst " + quantileLabel;
			thisQuantileTitleLower = "worst " + quantileLabel;
		}
		
		thisGraph = {
	            id: "quantile"+i+"Graph",
	            valueAxis: "liveReportsAxis",
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
            id: "liveReportsAxis",
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
        	divId : "liveReportsChartLegendDiv",
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


function generateLiveReportsTurnoverChart(id , chartData,statistic) {
	var colors = ["#555555","#5CA4B4","#84BCC6","#ACD4D8","#F4C99C","#F0AD6A","#EC9138"];
	
	var graphRate = $("#Rate option:selected").val().substring(1);

	
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
		case 4:
			thisQuantileTitle = "4th " + quantileLabel;
			thisQuantileTitleLower = "4th " + quantileLabel;
			break;
		case 5:
			thisQuantileTitle = "5th " + quantileLabel;
			thisQuantileTitleLower = "5th " + quantileLabel;
			break;
		case totalQuantiles:
			thisQuantileTitle = "Worst " + quantileLabel;
			thisQuantileTitleLower = "worst " + quantileLabel;
			break;
		}
		if(i == totalQuantiles) {
			thisQuantileTitle = "Worst " + quantileLabel;
			thisQuantileTitleLower = "worst " + quantileLabel;
		}
		
		thisGraph = {
	            id: "quantile"+i+"TurnoverGraph",
	            valueAxis: "liveReportsTurnoverAxis",
	            title: thisQuantileTitle,
	            type: "column",
	            //clustered: false, 
	            valueField: "q"+i+"GraphValue",
	            //alphaField: "alpha",
	            labelText : "[[q"+i+"LabelValue]]",
	            balloonText: "<span style='font-size:12px;'>For hires who scored in the " + thisQuantileTitleLower + " of applicants, the " + graphRate + " turnover rate was [[q"+i+"LabelValue]]</span>",
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
            id: "liveReportsTurnoverAxis",
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


function disableLiveReportsGraphSelectors() {
	deactivateTopbarLinks();
	$(".liveReportsGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#liveReportsTableButton").prop("disabled",true);
	//$("#applicantReportButton").prop("disabled",true);
	$("#employeeRiskButton").prop("disabled",true);
	$("#laborMarketChartButton").prop("disabled",true);
	//$("#employeeScoreButton").prop("disabled",true);	
}

function enableLiveReportsGraphSelectors() {
	activateTopbarLinks();
	$(".liveReportsGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});

	
	//if(linksTable.containsKey("employeerisk") &&  linksTable.get("employeerisk") === true ) {
	if(empReportUser  == "true"){
		$("#employeeRiskButton").prop("disabled",false);
	}

	//if(linksTable.containsKey("elmreport") &&  linksTable.get("elmreport") === true ) {
	if(laborMarketUser  == "true"){
		$("#laborMarketChartButton").prop("disabled",false);
	}
	
	/*if(empScoreUser  == "true"){
		$("#employeeScoreButton").prop("disabled",false);
	}*/
	
	
	
	$("#liveReportsTableButton").prop("disabled",false);
	//$("#applicantReportButton").prop("disabled",false);
	//$("#employeeRiskButton").prop("disabled",false);
	//$("#laborMarketChartButton").prop("disabled",false);

}


function activateLiveReportsGraphSelectors() {
	$(".liveReportsGraphSelect").each(function() {
		$(this).unbind("change");
		
		$(function() {
			$("#StartDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(miny, minm-1, mind),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd)});
			});
		 $(function(){
			$("#EndDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(maxy, maxm-1, maxd),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd)});
				 });
		$(this).change(function() {
			disableLiveReportsGraphSelectors()
			var selectionList = queryLiveReportsGraphSelectorValues();
			//console.log("Selectors:");
			//console.log(selectionList);
			$("#liveReportsGraphDiv").detach();
		    displayTableSpinner(windowAspectLiveReportsGraph);
			fetchLiveReportsGraph(selectionList);

		});
	});
	$("#liveReportsTableButton").unbind("click");
	$("#liveReportsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
	});
	$("#employeeRiskButton").unbind("click");
	$("#employeeRiskButton").click(function(){
		if(empReportUser  == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeerisktable.js",dataType: "script"});
		}else if(empScoreUser   == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
		}
	});
	$("#laborMarketChartButton").unbind("click");
	$("#laborMarketChartButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
	});
	/*$("#employeeScoreButton").unbind("click");
	$("#employeeScoreButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
	});*/
	

}

function addLiveReportsGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectLiveReportsGraph + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectLiveReportsGraph == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var liveReportsGraphHolder = $("#liveReportsGraphDiv").detach();
			$("#display-area-xs").append(liveReportsGraphHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectLiveReportsGraph = "mobile";
		}
		if ( windowAspectLiveReportsGraph != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);
			var liveReportsGraphHolder = $("#liveReportsGraphDiv").detach();
			$("#display-area").append(liveReportsGraphHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectLiveReportsGraph = "desktop";
		}
		
		var tableContainerWidth = (windowAspectLiveReportsGraph == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectLiveReportsGraph != "mobile" ) {
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
		
		var displayWidth = (windowAspectLiveReportsGraph == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#liveReportsGraphDiv").css("width",tableContainerWidth);
		var selectionList = queryLiveReportsGraphSelectorValues();
		//var usedTable = liveReportsGraphHashtable.get(selectionList);
		//console.log("usedTable:");
		//console.log(usedTable);

		var graphStatistic = $("#Statistics option:selected").val();
		reshapedUsedGraph = reshapeLiveReportsGraph(usedGraph,graphStatistic);
		reportsTurnoverGraph = extractLiveReportsTurnoverGraph(usedGraph,graphStatistic);
		//console.log("Reshaped usedGraph:");
		//console.log(reshapedUsedGraph);
		if (usedGraph != null ) {
			redrawLiveReportsGraph(reshapedUsedGraph,reportsTurnoverGraph,graphStatistic);
		}		
		
		if ( windowAspectLiveReportsGraph == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#liveReportsGraphDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#liveReportsGraphDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




function liveReportsCellColor(tstat){
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


function drawCalendar(start,end){
	calendar.set("date");
}
