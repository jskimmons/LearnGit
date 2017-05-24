loadCSS = function(href) {
     var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
     $("head").append(cssLink); 
};
loadCSS("../resources/css/analytics/trim.css");
var windowAspectTRImGraph = "";
windowAspectTRImGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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

underlineOnlyThisLink("#trimLink");


// Show a "loading" animation

deactivateTopbarLinks();
displayGraphSpinner(windowAspectTRImGraph);

// First develop the selector box

$("#leftbar-div").empty();
$("#leftbar-div-xs").empty();
delete selectorButtonBox;
delete window.selectorButtonBox;
var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
$(selectorButtonBox).empty();		

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Impact</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Turnover Reduction Impact Calculator (TRIm) estimates bottom-line financial impact due to reductions in turnover.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);


if ( windowAspectTRImGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}
var dataVaryingSelector = "";
var selectorList = [];
var formattedGraph = [];
var trimSchemeExists = false;
var trimFilterName = "";
var displayedFilterValue = "";

var impactTableData = {};
var uniformGraphData = {};
var schemeGraphData = {};
requeryTRImGraphData();
function requeryTRImGraphData() {
	disableTRImGraphSelectors();
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "trimgraph" , filtervalue : $("#trimShowBySelector option:selected").val() } ,
		dataType: "json" ,
		success: function(data) {
			//console.log("filterName" + data.filterName);
			//console.log("schemeExists" + data.schemeExists);
			//console.log("filterValues" + JSON.stringify(data.filterValues));
			//console.log("filterValueGraphs" + JSON.stringify(data.filterValueGraphs));
			//console.log("schemeGraphs" + JSON.stringify(data.schemeGraphs));
			
			trimFilterName = data.filterName;
			
			if ( data.schemeExists === true ) {
				trimSchemeExists = true;
			}
			impactTableData = data.filterValues;


			if ( trimSchemeExists ) {
				schemeGraphData = data.schemeGraphs;
			}
			uniformGraphData = data.filterValueGraphs;				
			
			generateSelectors(data);

			
			var thisRateData = {};
			var selectedScheme = $("#trimGraphSchemeSelector option:selected").val();
			
			$(impactTableData).each(function(){
				if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
					$(this.table).each(function() {
						if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
							thisRateData = this;
						}						
					});
				}

			});
			
			var thisGraphData = {};
			var schemeIsUniform = true;
			if ( trimSchemeExists ) {
				$(schemeGraphData).each(function() {
					if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
						if ( this.schemeIsUniform == false ) {
							thisGraphData = this.graph;							
							schemeIsUniform = false;
						}
						else {
							$(uniformGraphData).each(function() {

								if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
									thisGraphData = this.graph;
								}						
							});
						}
					}						
				});
			}
			else {
				$(uniformGraphData).each(function() {
					if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
						thisGraphData = this.graph;
					}						
				});
			}
			
			//console.log("thisRateData" + JSON.stringify(thisRateData));
			//console.log("thisGraphData" + JSON.stringify(thisGraphData));
			//console.log("schemeIsUniform" + JSON.stringify(schemeIsUniform));


					
			redrawTRImGraph(thisRateData,thisGraphData,selectedScheme,schemeIsUniform);
			
		}
	});
}

function generateSelectors(data) {
	var trimGraphSchemeSelector = $("<select></select>").attr("id","trimGraphSchemeSelector").attr("class","form-control").attr("width","200px");
	var defaultChosen = false;
	$(data.schemeGraphs).each(function() {
		  //$(selectorButtonBox).append(this.selectorName);
    		var showByValue = $("<option></option>").attr("value",this.schemeLabel).text(this.schemeLabel);
    		
    		/*if(this.schemeLabel === "Reduction Plan 1"){
	    		showByValue.attr("selected","selected");
	    		showByValue.prop("selected",true);
	    	}*/
    		if ( defaultChosen == false && this.schemeLabel == "5% increase" ) {
    			showByValue.attr("selected","selected");
    			defaultChosen=true;
    		}
    		$(trimGraphSchemeSelector).append(showByValue);
	});
	var trimShowBySelector = $("<select></select>").attr("id","trimShowBySelector").attr("class","form-control").attr("width","200px");
	var defaultValue = $("<option></option>").attr("value","All").text("Select " + data.filterName).attr("disabled",true);
	var allValue = $("<option></option>").attr("value","All").text("All").attr("selected","selected");
	$(trimShowBySelector).append(defaultValue);
	$(trimShowBySelector).append(allValue);
	$(data.filterValues).each(function() {
		  //Put "All" above so it's first
		if ( this.filterValue != "All" ) {
    		var showByValue = $("<option></option>").attr("value",this.filterValue).text(this.filterValue);
    		$(trimShowBySelector).append(showByValue);
		}
	});
	var showSchemeDiv = $("<div></div>").attr("id","showSchemeDiv")
	.css("background-color","#44494C").css("margin-top","10px")
	.css("margin-bottom","0px");
	
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	$("#selectorButtonBox").html(titleDivDetached);
	$("#selectorButtonBox").append(titleDescDivDetached);
	$(showSchemeDiv).append("<p>Reduction plan:</p>").attr("class","h3").css("color","#dddddd");
	$(showSchemeDiv).append(trimGraphSchemeSelector);
	$("#selectorButtonBox").append(showSchemeDiv);
	$("#selectorButtonBox").append(trimShowBySelector);			

	
}

function redrawTRImGraph(thisRateData,graphData,selectedScheme,schemeIsUniform) {
	var chartContainerWidth = (windowAspectTRImGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	chartContainerWidth = chartContainerWidth + "px";
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if ( windowAspectTRImGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}
	
	var mainRow = $("<tr></tr>").attr("id","mainRow");
	var trimTableBlocks = $("<table></table>").css("width","100%").attr("id","trimTableBlocks");

	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default ">TRIm Inputs</a>').attr('id','trimTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">TRIm</a>').attr('id','trimGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	var chartHeader = $("<table></table>").attr("class","chart-header");
	var chartHeaderTR = $("<tr></tr>");
	
	var turnoverRate = $("<div></div>").attr("class","turnoverRateTableDiv");
		var turnoverRateTable = $("<table></tabe>").attr("class","turnoverRateTable");	
			var turnoverRateTableTR1=$("<tr></tr>").append($("<td></td>").text("Rate").attr("class","rateTD1")/*.css("border-bottom","1px solid black")*/)
			.append($("<td></td>").text("Current").attr("class","currentTD"))
			.append($("<td></td>").text("New").attr("class","newTD"));	
			var turnoverRateTableTR2=$("<tr></tr>").append($("<td></td>").text("New Hire Turnover Rate").attr("class","rateTD1").css("text-align","right"))
			.append($("<td></td>").attr("id","hireTurnoverRateCurrent").attr("class","currentTD1").text((thisRateData.newHireTurnoverRateCurrent*100).toFixed(0) +"%"))
			.append($("<td></td>").attr("class","newTD1").attr("id","hireTurnoverRateNew").text((thisRateData.newHireTurnoverRateNew*100).toFixed(0)+"%"));	
			var turnoverRateTableTR3=$("<tr></tr>").append($("<td></td>").text("Seat Turnover Rate").attr("class","rateTD1").css("text-align","right"))
			.append($("<td></td>").attr("id","seatTurnoverRateCurrent").attr("class","currentTD1").text((thisRateData.seatTurnoverRateCurrent*100).toFixed(0)+"%"))
			.append($("<td></td>").attr("class","newTD1").attr("id","seatTurnoverRateNew").text((thisRateData.seatTurnoverRateNew*100).toFixed(0)+"%"));	
		turnoverRateTable.append(turnoverRateTableTR1).append(turnoverRateTableTR2).append(turnoverRateTableTR3);
		turnoverRate.html(turnoverRateTable);
	
		
	var turnoverReduction = $("<div></div>").attr("class","turnoverReductionDiv");		
		var turnoverReductionTable = $("<table></tabe>").attr("class","turnoverReductionTable");
			var turnoverReductionTR1=$("<tr></tr>").append($("<td></td>").text("Reduction").attr("class","reductionTD"));	
			var turnoverReductionTR2=$("<tr></tr>").append($("<td></td>").text((thisRateData.newHireTurnoverRateReduction).toFixed(0) +"%"));	
			var turnoverReductionTR3=$("<tr></tr>").append($("<td></td>").text((thisRateData.seatTurnoverRateReduction*100).toFixed(0) +"%"));	
		turnoverReductionTable.append(turnoverReductionTR1).append(turnoverReductionTR2).append(turnoverReductionTR3);
		turnoverReduction.html(turnoverReductionTable)

		
	var savings = $("<div></div>").attr("class","savingsDiv");
		var tblSavings = $("<table></table>").attr("class","tblSavings");
			var tdGains=$("<td></td>").attr("class","gains").html("Top Line Gains<br><span class='topgain'>$"+addCommas((thisRateData.topLineGain).toFixed(0)) + "</span>");
			var tdPlus=$("<td></td>").html("<span class='plus'>+</p>");
			var tdCostSavings=$("<td></td>").attr("class","costSavings").html("Cost Savings<br><span class='save'>$" +addCommas((thisRateData.costSavings).toFixed(0)) + "</span>");
		tblSavings.append(($("<tr></tr>")).append(tdCostSavings).append(tdPlus).append(tdGains));
		savings.append(tblSavings);


	var totalEBITDA = $("<div></div>").attr("class","totalEBITDADiv").html("Total EBITDA Improvement<br><span class='bottomimpact'>$" + addCommas((thisRateData.bottomLineImpact).toFixed(0))+ "</span>");

	chartHeaderTR.append($("<td></td>").attr("class","turnoverRate").append(turnoverRate));
	chartHeaderTR.append($("<td></td>").attr("class","turnoverReduction").append(turnoverReduction));
	chartHeaderTR.append($("<td></td>").attr("class","savings").append(savings));
	chartHeaderTR.append($("<td></td>").attr("class","totalEBITDA").append(totalEBITDA));
	chartHeader.append(chartHeaderTR);
	
	
	var chartContainerDiv = $("<div></div>").attr("class","chartContainerDiv");
	var tchart = $("<div></div>").attr("id","tchart").attr("class","chart");	
	tchart.append("<svg></svg>");
	chartContainerDiv.append(tchart);

	//var chartFooter = $("<div></div>").attr("id","trimlegend");//.attr("class","trimlegend");//.css("color","red");

	
	var chartFooter = $("<div></div>").attr("class","chartFooterDiv").css("border-bottom","1px solid #f2f5f8");
	chartFooter.html($("<p></p>").css("height","20px").css("width","20px").css("font-weight","bold").css("float","left").text("EBITDA Impact").css("width","20%"));

	var tblFooter = $("<table></table>").attr("class","chartFooterTable").attr("width","75%").attr('font-size','10px');
	var tblFooterTR=$("<tr></tr>").attr("class","impacts");

	
	for(var i=0; i<graphData.length; i++) {
		tblFooterTR.append("<td class='impact'>" + graphData[i].ebitdaImpact.toFixed(0) +"%</td>");
    }
    var impactWidth = 100/(graphData.length+1);
    $(".impact").css("width",impactWidth + "px");
    tblFooter.append(tblFooterTR);
    
	
	trimChartDiv =$("<div></div>").attr("id","trimChartDiv").html(chartHeader).append(chartContainerDiv);
	/*if(schemeIsUniform) {
		chartFooter.append(tblFooter);
		trimChartDiv.append(chartFooter);
	}*/



	//Attach first, otherwise AmCharts won't work....
	if ( windowAspectTRImGraph == "desktop") {
		$("#display-area").html(menuDiv);
		$("#display-area").append(trimChartDiv);

	}
	else {
		var chartWidth = $('.chart').width();
		$("#display-area").html(menuDiv);
		$("#display-area").append(trimChartDiv);

	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#menuDiv").css("width",displayWidth);
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");
	


	var localSelectorButtonBox = $("#selectorButtonBox").detach();
	
	if ( windowAspectTRImGraph == "mobile" ) {
		$("#leftbar-div-xs").html(localSelectorButtonBox);
	}
	else {
		$("#leftbar-div").html(localSelectorButtonBox);
		
	}
	
	if (schemeIsUniform ) {
		thisImpactGraph = impactGraph("tchart",graphData);		
	}
	else {
		thisImpactGraph = schemeGraph("tchart",graphData);
	}
	thisImpactGraph.validateData();
	thisImpactGraph.animateAgain();
	//addTRImResizeListener();
	enableTRImGraphSelectors();
	activateTRImGraphSelectors();
	addTRImResizeListener();
}
function schemeGraph(id,graphData){
	//console.log("Scheme graph got:");
	//console.log(graphData);
	 var chart = AmCharts.makeChart(id, {
        type: "serial",
        theme: "light",
        dataProvider: graphData ,
        marginLeft: 15,
        marginRight: 15,
        height: "50%",
        fixedColumnWidth:0.3,
        backgroundColor: "#eeeeee",
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        valueAxes: [{
            id: "impactAxis",
            stackType : "regular",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "left",
            offset: 0,
            strictMinMax: "true",
            //minMaxMultiplier: 1.5,
            minimum: 0,
            title: "Total EBITDA Improvement",
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return "$" + Math.floor(number/1000000) + "M";
            }

        }],
        graphs:   [ {
            title: "Cost Savings",
            balloonFunction: schemeBaloon,
            fillAlphas: 0.8,
            lineAlpha: 0,
            type: "column",
            valueField: "costSavings",
            lineColor: "#348CA2"
          },{
            title: "Top-Line Gains",
            balloonFunction: schemeBaloon,
            "fillAlphas": 0.8,
            "lineAlpha": 0,
            "type": "column",
            "valueField": "topLineGain",
            "lineColor": "#E87506"
          } ] ,
        categoryField: "filterValue",
        categoryAxis: {
            position: "bottom",
            gridPosition: "start",
            title: trimFilterName ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            lineAlpha: 0,
            gridAlpha : 0 ,
            axisThickness: 2,
            fontSize: 14,
            titleFontSize: 16,
            axisColor : "#555555",
            labelRotation : 45,
            labelFrequency : 1,
            forceShowField : "forceShow",
            tickLength : 0,
            minHorizontalGap : 20,
            labelFunction : function(category,label,axis) {
            	return category;
            }
        },
        legend: {
            position: "top",
            valueText: "[[value]]",
            valueWidth: 20,
            valueAlign: "left",
            equalWidths: false,
            useGraphSettings: true,
            maxColumns: 4
        }

    });

/*	 chart.addListener('rendered', function(event) {
		 chart.customLegend = document.getElementById('trimlegend');
		 var innerHTML = "<table><tbody><tr><td>EDITDA Impact</td>";
		  for(var i=0; i<graphData.length; i++) {
			  innerHTML += "<td class='legend-item'>" + graphData[i].ebitdaImpact.toFixed(0) +"%</td>";
		  }
		  innerHTML +="</tr></tbody></table>";
		  trimlegend.innerHTML=innerHTML;
		});
	 	    */
return chart;
}

function impactGraph(id,graphData){
	//console.log("Scheme graph got:");
	//console.log(graphData);
	
    var chart = AmCharts.makeChart(id, {
        type: "serial",
        theme: "light",
        dataProvider: graphData ,
        marginLeft: 0,
        marginRight: 0,
        height: "100%",
        fixedColumnWidth:0.3,
        backgroundColor: "#eeeeee",
        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        valueAxes: [{
            id: "impactAxis",
            stackType : "regular",
            axisThickness: 2,
            axisAlpha: 1,
            gridAlpha: 0,
            position: "left",
            offset: 0,
            strictMinMax: "true",
            //minMaxMultiplier: 1.5,
            minimum: 0,
            title: "Total EBITDA Improvement",
            fontSize: 14,
            titleFontSize: 14,
            axisColor : "#555555",
            labelFunction : function(number,label,axis) {
            	return "$" + Math.floor(number/1000000) + "M";
            }

        }],
        graphs:   [ {
            title: "Cost Savings",
            balloonFunction: trimBaloon,
            fillAlphas: 0.8,
            lineAlpha: 0,
            type: "column",
            valueField: "costSavings",
            lineColor: "#348CA2"
          },{
            title: "Top-Line Gain",
            balloonFunction: trimBaloon,
            fillAlphas: 0.8,
            lineAlpha: 0,
            type: "column",
            valueField: "topLineGain",
            lineColor: "#E87506"
          } ] ,
        categoryField: "filterValue",
        categoryAxis: {
            position: "bottom",
            title: "Turnover Reduction" ,
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            lineAlpha: 0,
            gridAlpha : 0 ,
            axisThickness: 2,
            titleFontSize: 14,
            axisColor : "#555555",
            labelRotation : 0,
            labelFrequency : 1,
            forceShowField : "forceShow",
            tickLength : 0,
            minHorizontalGap : 20,
            labelFunction : function(category,label,axis) {
            	return category + "%";
            }
        },
        legend: {
            position: "top",
            valueText: "[[value]]",
            valueWidth: 20,
            valueAlign: "left",
            equalWidths: false,
            useGraphSettings: true,
            maxColumns: 4
        }

    });

    return chart;	
}


function schemeBaloon(graphDataItem,graph){
	//console.log(graphDataItem);
    var valueWithCommas = addCommas(graphDataItem.values.bottomLineImpact);
    return trimFilterName + ": <b>" + graphDataItem.category + "</b><br>Top-Line Gain: " + addCommas(graphDataItem.dataContext.topLineGain)  + "<br>Cost Savings: " + addCommas(graphDataItem.dataContext.costSavings) + "<br>Bottom-Line Impact: <b>" + addCommas(graphDataItem.dataContext.bottomLineImpact) + "</b>";
}

function trimBaloon(graphDataItem,graph){

    var valueWithCommas = addCommas(graphDataItem.values.bottomLineImpact);
    return "Cutoff" + ": <b>" + graphDataItem.category + "</b><br>Top-Line Gain: " + addCommas(graphDataItem.dataContext.topLineGain)  + "<br>Cost Savings: " + addCommas(graphDataItem.dataContext.costSavings) + "<br>Bottom-Line Impact: <b>" + addCommas(graphDataItem.dataContext.bottomLineImpact) + "</b>";
}

function disableTRImGraphSelectors(){
	deactivateTopbarLinks();
	$("#trimShowBySelector").unbind("change");
	$("#trimShowBySelector").prop("disabled",true);
	$("#trimGraphSchemeSelector").unbind("change");
	$("#trimGraphSchemeSelector").prop("disabled",true);
	$("#trimTableButton").unbind("click");
	$("#trimTableButton").prop("disabled",true);
	$("#trimRefreshProductivityButton").unbind("click");
	$("#trimRefreshProductivityButton").prop("disabled",true);
	$("#trimUpdateProductivityButton").unbind("click");
	$("#trimUpdateProductivityButton").prop("disabled",true);

}

function enableTRImGraphSelectors() {
	activateTopbarLinks();
	$("#trimShowBySelector").prop("disabled",false);
	$("#trimGraphSchemeSelector").prop("disabled",false);
	$("#trimTableButton").prop("disabled",false);
	$("#trimRefreshProductivityButton").prop("disabled",false);
	$("#trimUpdateProductivityButton").prop("disabled",false);
}

function activateTRImGraphSelectors() {
	$("#trimTableButton").unbind("click");
	$("#trimTableButton").click(function() {
		$.ajax({type: "GET",url: "../resources/js/analytics/trimtable.js",dataType: "script"});
	});
	$("#trimShowBySelector").change(function() {
		var thisRateData = {};
		var selectedScheme= $("#trimGraphSchemeSelector option:selected").val();
		$(impactTableData).each(function(){

			if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
				//console.log("impactTableData.filterValue" + this.filterValue);
				$(this.table).each(function() {
					if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
						thisRateData = this;
						}						
				});
			}

		});
		
		var thisGraphData = {};
		var schemeIsUniform = true;
		if ( trimSchemeExists ) {
			$(schemeGraphData).each(function() {
				if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
					//console.log("schemeGraphData.filterValue" + this.schemeLabel);

					if ( this.schemeIsUniform == false ) {
						thisGraphData = this.graph;							
						schemeIsUniform = false;
					}
					else {
						$(uniformGraphData).each(function() {
							if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
								//console.log("uniformGraphData.filterValue" + this.filterValue);
								thisGraphData = this.graph;
							}						
						});
					}
				}						
			});
		}
		else {
			$(uniformGraphData).each(function() {

				if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
					//console.log("uniformGraphData.filterValue" + this.filterValue);
					thisGraphData = this.graph;
				}						
			});
		}
				
		redrawTRImGraph(thisRateData,thisGraphData,selectedScheme,schemeIsUniform);
	});
	
	$("#trimGraphSchemeSelector").change(function() {
		disableTRImGraphSelectors();
		var thisRateData = {};
		var selectedScheme= $("#trimGraphSchemeSelector option:selected").val();

		$(impactTableData).each(function(){
			if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
				$(this.table).each(function() {
					if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
						thisRateData = this;
					}						
				});
			}

		});
		
		var thisGraphData = {};
		var schemeIsUniform = true;
		if ( trimSchemeExists ) {
			$(schemeGraphData).each(function() {
				if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
					if ( this.schemeIsUniform == false ) {
						thisGraphData = this.graph;	
						schemeIsUniform = false;
					}
					else {
						$(uniformGraphData).each(function() {
							if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
								thisGraphData = this.graph;
							}						
						});
					}
				}						
			});
		}
		else {
			$(uniformGraphData).each(function() {
				if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
					thisGraphData = this.graph;
				}						
			});
		}
				
		redrawTRImGraph(thisRateData,thisGraphData,selectedScheme,schemeIsUniform);
	});

	$("#trimRefreshProductivityButton").click(function() {
		refreshTRImProductivityData();
	});
	$("#trimUpdateProductivityButton").click(function() {
		//console.log("Clicked!!");
		updateTRImProductivityData();
	});
}

function addTRImResizeListener() {
	//console.log("resize");
	$(window).off("resize");
	$(window).resize(function() {
		var selectedScheme= $("#trimGraphSchemeSelector option:selected").val();

		var thisRateData = {};
		$(impactTableData).each(function(){
			if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
				$(this.table).each(function() {
					if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
						thisRateData = this;
					}						
				});
			}

		});
		//console.log("resizefunc");

		var thisGraphData = {};
		var schemeIsUniform = true;
		if ( trimSchemeExists ) {
			$(schemeGraphData).each(function() {
				if (this.schemeLabel == $("#trimGraphSchemeSelector option:selected").val()) {
					if ( this.schemeIsUniform == false ) {
						thisGraphData = this.graph;
						schemeIsUniform = false;
					}
					else {
						$(uniformGraphData).each(function() {
							if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
								thisGraphData = this.graph;
							}						
						});
					}
				}						
			});
		}
		else {
			$(uniformGraphData).each(function() {
				if (this.filterValue == $("#trimShowBySelector option:selected").val()) {
					thisGraphData = this.graph;
				}						
			});
		}
				
		redrawTRImGraph(thisRateData,thisGraphData,selectedScheme,schemeIsUniform);
		adjustTopbarPadding();


		});
		
}



function refreshTRImProductivityData() {
	disableTRImGraphSelectors();
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "trimgraph" , filtervalue : $("#trimShowBySelector option:selected").val() } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			
			productivity0to30 = data.productivity0to30;
			productivity31to60 = data.productivity31to60;
			productivity61to90 = data.productivity61to90;
			productivity91to180 = data.productivity91to180;
			productivity181to365 = data.productivity181to365;
			$("#productivity0to30Box").val(productivity0to30);
			$("#productivity31to60Box").val(productivity31to60);
			$("#productivity61to90Box").val(productivity61to90);
			$("#productivity91to180Box").val(productivity91to180);
			$("#productivity181to365Box").val(productivity181to365);			
			enableTRImGraphSelectors(); 
			activateTRImGraphSelectors(); 
		}
	});

}

function updateTRImProductivityData() {
	disableTRImGraphSelectors();
	updatedValues = {
			productivity0to30 : $("#productivity0to30Box").val() ,
			productivity31to60 : $("#productivity31to60Box").val(),
			productivity61to90 : $("#productivity61to90Box").val(),
			productivity91to180 : $("#productivity91to180Box").val(),
			productivity181to365 : $("#productivity181to365Box").val(),
			};
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "trimupdateproductivity" , productivityvalues : JSON.stringify(updatedValues) },
		dataType: "json" ,
		success: function(data) {
			//console.log(data);			
			requeryTRImGraphData();
		}
	});

}


