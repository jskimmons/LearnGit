

//No reason for the background to leak past the bottom of the page, unless the page is really short

var windowAspectHeadcountGraph = "";
windowAspectHeadcountGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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


underlineOnlyThisLink("#headcountLink");


// Show a "loading" animation


displayHeadcountGraphSpinner();
disableHeadcountGraphSelectors();

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Employees</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Employee headcount, new hires and terminations, and annual seat turnover rates.</h4>');


$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

if ( windowAspectHeadcountGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

var headcountHashtable = new Hashtable({ hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var chartData = [];
var headcountChart = {};
var selectorList = [];
var activeChartData = [];
refreshHeadcountGraph();

function refreshHeadcountGraph() {
	var selectorsUpToDate = false;
    var headcountGraphUpToDate = false;
    var headcountRawGraph = {};

    disableHeadcountGraphSelectors();
    displayGraphSpinner(windowAspectHeadcountGraph);
    $.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		//Use separationbytenure because it ends one year earlier
		data: { type : "getselectorsheadcount" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			var defaultSelectorList = [];
	    	selectorList = data.selectorList;
			selectorsUpToDate = true;
    		if (headcountGraphUpToDate ) {
    			redrawHeadcountSelectorBoxes();
    			activeChartData = selectedHeadcountGraph();
    			redrawHeadcountGraph(activeChartData);
    		}
		}
    });
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "headcountgraph" , 
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		headcountRawGraph = data;
    		$(headcountRawGraph.rows).each(function() {
    			var thisSelectionData = []; 
    			var thisRowData = {
    	            date: new Date(this.year,this.month-1,1),
    				employees 		: 	this.startEmployment,
    				employeesOver6	: 	this.startEmployment/6,
    				hires			: 	this.hires,
    				terminations 	: 	this.terminations,
    				seatTurnover	 : 	this.seatTurnover,
    				seatTurnoverPct	:	toWholePercent(this.seatTurnover,this.seatTurnover+1)
    			};
    			if ( headcountHashtable.get(this.selectorValues) != null ) {
    				thisSelectionData = headcountHashtable.get(this.selectorValues);
    			}
    			thisSelectionData.push(thisRowData);
    			headcountHashtable.put(this.selectorValues , thisSelectionData);
    		});
    		//console.log(headcountHashtable.entries());
    		headcountGraphUpToDate = true;
    		if (selectorsUpToDate ) {
    			redrawHeadcountSelectorBoxes();
    			activeChartData = selectedHeadcountGraph();
    			redrawHeadcountGraph(activeChartData);
    		}
    		
    	}
    });
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

function selectedHeadcountGraph() {
	var returnGraph = [];
	var selectedValueKey = [];
	//var selectedValueKey = {};
	//$(selectorList).each(function() {
	//	selectedValueKey[this.selectorName] = $("#" + this.selectorName + " option:selected").val();		
	//});
	$(selectorList).each(function() {
		selectedValueKey.push({ selectorName : this.selectorName , 
								selectorValue :  $("#" + this.selectorName + " option:selected").val()});
	});
	//console.log(selectedValueKey);
	return headcountHashtable.get(selectedValueKey);
	
}


function redrawHeadcountGraph(chartData) {
	//console.log("Chart data:");
	//console.log(chartData);
	var chartContainerWidth = (windowAspectHeadcountGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
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
	if ( windowAspectHeadcountGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}

	headcountChartDiv = $("<div></div>").attr("id","headcountChartDiv")
		.css("height",chartContainerHeight+"px").css("width",chartContainerWidth).css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px");
	//Attach first, otherwise AmCharts won't work....
	
	
	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default">Table</a>').attr('id','headcountTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','headcountGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);

	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	$("#menuDiv").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");
	
	if ( windowAspectHeadcountGraph == "desktop") {
		$("#display-area").html(menuDiv);
		$("#display-area").append(headcountChartDiv);
	}
	else {
		$("#display-area").html(menuDiv);
		$("#display-area-xs").append(headcountChartDiv);
	}


	redrawHeadcountSelectorBoxes();
	makeCustomZoomOut(headcountChartDiv);
	headcountChart = generateHeadcountChart("headcountChartDiv",chartData);
	headcountChart.addListener("rendered", zoomChart);
	headcountChartZoom = "in";
	$(".amcharts-legend-item-employees").attr("transform","translate(386,0)");
	headcountChart.validateData();
	headcountChart.animateAgain();
	makeCustomZoomOut(headcountChartDiv);
	addHeadcountResizeListener();
	enableHeadcountGraphSelectors();
	activateHeadcountGraphSelectors();

}		    	

function addHeadcountResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		redrawHeadcountGraph(activeChartData);
	});
}


function generateHeadcountChart(id , chartData) {

	        var chart = AmCharts.makeChart(id, {
	            type: "serial",
	            theme: "light",
	            dataDateFormat: "YYYY-MM",
	            dataProvider: chartData,
	            addClassNames: true,
	            startDuration: 0.0,
	            //        color: "#FFFFFF",
	            mouseWheelScrollEnabled: true,
	            //         maxSelectedTime: 63072000000, // 1 year in milliseconds
	            minSelectedTime: 31536000000,
	            marginLeft: 0,
	            marginRight: 30,
	            height: "50%",
	            fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
	            zoomOutButtonImage: "",
	            zoomOutButtonImageSize: 0,
	            zoomOutButtonPadding: 0,
	            zoomOutButtonAlpha: 1,
	            zoomOutText: "",
	            valueAxes: [{
	                id: "hired",
	                axisThickness: 2,
	                //            axisAlpha: 1,
	                axisAlpha: 0,
	                gridAlpha: 0,
	                position: "left",
	                offset: 50,
	                "strictMinMax": "true",
	                minMaxMultiplier: 4,
	                minimum: 0,
	                title: "Hires and Terminations",
	                fontSize: 14,
	                titleFontSize: 16
	            }, {
	                id: "turnover",
	                //            axisAlpha: 1,
	                axisThickness: 2,
	                gridAlpha: 0,
	                axisAlpha: 0,
	                minimum: 0,
	                position: "right",
	                title: "Annual Seat Turnover",
	                fontSize: 14,
	                titleFontSize: 16,
	                labelFunction : function(number,label,axis) {
	                	return Math.floor(number*1000)/10 + "%";
	                }

	            }],

	            graphs: [{
	                id: "hires",
	                valueAxis: "hired",
	                title: "Hires",
	                type: "column",
	                clustered: true,
	                valueField: "hires",
	                alphaField: "alpha",
	                balloonText: "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:16px;'>[[value]]</span> [[additional]]</span>",
	                fillAlphas: 0.7,
	                lineColor: "#348CA2" //"#67b7dc"
	            }, {
	                id: "terminations",
	                valueAxis: "hired",
	                title: "Terminations",
	                type: "column",
	                clustered: true,
	                valueField: "terminations",
	                balloonText: "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:16px;'>[[value]]</span>[[additional]]</span>",
	                lineColor: "#E87506",
	                alphaField: "alpha",
	                fillAlphas: 0.9,
	            },/* {
	                id: "employees",
	                valueAxis: "employees",


	                valueField: "employeesOver6",
	                bulletSize: 8,
	                hideBulletsCount: 50,
	                title: "Total Employees",
	                useLineColorForBulletBorder: true,
	                useNegativeColorIfDown: false,
	                labelText: "[[employees]]",
	                dashLengthField: "dashLength",
	                showBalloon: false,
	                lineThickness: 2,
	                legendValueText: "[[value]]",
	                labelFunction: returnStaggeredValue,
	                fontSize: 12,
	                showAllValueLabels: false,
	                descriptionField: "townName",
	                bulletSizeField: "townSize",
	                labelPosition: "top",
	                labelOffset: 8,
	                balloonText: "[[title]]:[[employees]]",
	                showBalloon: true,
	                animationPlayed: false,
	                lineColor: "#0000AA",
	                bulletColor: "#000000",
	                bulletBorderColor: "#0000AA",
	                bulletBorderAlpha: 1,
	                bulletBorderThickness: 2,
	                bullet: "round",
	            },*/{
	                id: "seatTurnover",
	                valueAxis: "turnover",
	                valueField: "seatTurnover",
	                bulletSize: 8,
	                hideBulletsCount: 50,
	                title: "Seat Turnover",
	                useLineColorForBulletBorder: true,
	                useNegativeColorIfDown: false,
	                labelText: "[[seatTurnoverPct]]",
	                dashLengthField: "dashLength",
	                showBalloon: false,
	                lineThickness: 2,
	                legendValueText: "[[value]]",
	                labelFunction: returnStaggeredPercent,
	                fontSize: 12,
	                showAllValueLabels: false,
	                labelPosition: "top",
	                labelOffset: 8,
	                balloonText: "[[title]]:[[seatTurnoverPct]]",
	                showBalloon: true,
	                animationPlayed: false,
	                lineColor: "#152D4F",
	                bulletColor: "#152D4F",
	                bulletBorderColor: "#152D4F",
	                bulletBorderAlpha: 1,
	                bulletBorderThickness: 2,
	                bullet: "round",
	            }],
	            chartScrollbar: {
	                graph: "employees",
	                scrollbarHeight: 30,
	                backgroundAlpha: 0,
	                selectedBackgroundAlpha: 0.6,
	                selectedBackgroundColor: "#000044",
	                graphFillAlpha: 0,
	                graphLineAlpha: 0.5,
	                selectedGraphFillAlpha: 1,
	                selectedGraphLineAlpha: 1,
	                autoGridCount: true,
	                color: "#000000",
	                resizeEnabled: false,
	                hideResizeGrips: true
	            },
	            chartCursor: {
	                pan: true,

	                categoryBalloonDateFormat: "MMM",
	                //            valueLineEnabled: true,
	                //            valueLineBalloonEnabled: true,
	                valueBalloonsEnabled: false,
	                cursorAlpha: 0,
	                //            valueLineAlpha: 0
	                gridCount: 50,
	                gridAlpha: 0.1	,
	                gridColor: "#000000",
	                axisColor: "#000000",
	            },
	            categoryField: "date",
	            categoryAxis: {
	                parseDates: true,
	                minPeriod: "MM",
	                dashLength: 1,
	                minorGridEnabled: true,
	                position: "top",
	                fontSize: 14,
	                offset: 15,
	                axisAlpha: 0,
	                axisThickness: 0,
	                labelFunction: returnCategory,
	                twoLineMode: true,
	                dateFormats: [{
	                    period: "MM",
	                    format: "MMM"
	                }, {
	                    period: "YYYY",
	                    format: "YYYY"
	                }]
	            },
	            legend: {
	                position: "bottom",
	                valueText: "",
	                valueWidth: 20,
	                valueAlign: "left",
	                equalWidths: false,
	                useGraphSettings: true,
	                maxColumns: 4
	                //            periodValueText: "total: [[value.sum]]"
	            },
	        	"balloon": {
	        	    fillAlpha: 1,
	        	    "fillColor": "#fff"
	        		}
	        	    
	        });

	        return chart;
	    }

//The default for AmCharts is to put the year second in a two-row label
//(I assume because it looks better when the label is on the bottom).
//This function reverses that.
function returnCategory(valueText,date,categoryAxis) {
	if ( valueText.length <= 4) {
		return "\n" + valueText;
	}
	return valueText.substring(4,8) + "\n" + valueText.substring(0,3);
}

	



function displayHeadcountGraphSpinner() {
	var spinnerMargin = (windowAspectHeadcountGraph == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
	spinnerMargin = spinnerMargin + "px";

	var spinnerDiv = $("<div></div>").attr("id","spinnerDiv").css("text-align","center")
					.css("position","absolute").css("left",spinnerMargin).css("top","100px");
	if ( $(window).width() >= 768 ) {
		$("#display-area").html(spinnerDiv);
	}
	else {
		$("#display-area-xs").html(spinnerDiv);
	}

	var opts = {
			lines: 13 // The number of lines to draw
			, length: 12 // The length of each line
			, width: 14 // The line thickness
			, radius: 12 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '120px' // Top position relative to parent
			, left: '80px' //spinnerMargin // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
	};
	var target = document.getElementById('spinnerDiv');
	var spinner = new Spinner(opts).spin(target);
	$("#spinnerDiv").append("<h2>Loading chart....</h2>");
}


function disableHeadcountGraphSelectors() {
	deactivateTopbarLinks();
	$(".headcountGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#headcountTableButton").unbind("click");
	$("#headcountTableButton").prop("disabled",true);

}

function enableHeadcountGraphSelectors() {
	activateTopbarLinks();
	$(".headcountGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#headcountTableButton").prop("disabled",false);
}


function activateHeadcountGraphSelectors() {
	$("#headcountTableButton").click(function() {
		$.ajax({type: "GET",url: "../resources/js/analytics/headcounttable.js",dataType: "script"});
	});
	$(".headcountGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableHeadcountGraphSelectors();
			activeChartData = selectedHeadcountGraph();
			redrawHeadcountGraph(activeChartData);
		});
	});
}


function redrawHeadcountSelectorBoxes() {
	var activeSelectorsList = [];
	//console.log("selectorList:" + selectorList);
	$(selectorList).each(function() {
		var allSelected = false;
		if (selectorsEverDrawn ) {
			var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
			if ( $("#" + this.selectorName + " option:selected").text().substring(0,6) !== "Select" && $("#" + this.selectorName + " option:selected").val() == "All" ) {
				allSelected = true;
			}
		}
		else {
			var usedDefaultValue = this.defaultValue;
		}
		  //$(selectorButtonBox).append(this.selectorName);
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
		.attr("class","form-control headcountGraphSelect").attr("width","300px")
		.attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;
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
				var checkedHashEntry = headcountHashtable.get(thisSelection);
				if ( checkedHashEntry != null ) {
					var hasValues = false;
					$(checkedHashEntry).each(function() {
						if ( 	this.employees != -1 ||
								this.hires != -1 ||
								this.terminations != -1 ||
								this.seatTurnover != -1 
							) {
							hasValues = true;
						}
					});
					
					if ( hasValues ) {
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
		        		if (allSelected == true && this.valueLabel.substring(0,6) !== "Select" && checkedSelectorValue == "All" ) {
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

	/*var headcountGraphButtonDetached = $("#headcountGraphButton").detach();
	var headcountTableButtonDetached = $("#headcountTableButton").detach();*/
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);

	/*$(selectorButtonBox).append(headcountGraphButtonDetached);
	$(selectorButtonBox).append(headcountTableButtonDetached);*/
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	selectorsEverDrawn = true;

	//console.log(activeSelectorsList);
}




function requeryAndRefresh() {
	var updatedSelectorList = [];
	$(".headcountGraphSelect").each(function() {
		var thisSelection = {
				selectorName : $(this).attr("id") ,
				selectorValue: $(this).find(":selected").val()		
		};
		updatedSelectorList.push(thisSelection);
	});
	//console.log(updatedSelectorList);
	var headcountChartDiv = $("#headcountChartDiv");
	displayHeadcountGraphSpinner();
	disableHeadcountGraphSelectors();
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "headcount" , selectorlist : JSON.stringify(updatedSelectorList) } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		var newChartData = [];
    		$(data.periodList).each( function(){
    			dataElement = {
    	                date: new Date(this.year,this.month-1,1),
    	                hires: this.hires,
    	                employees: this.startEmployment ,
    	                terminations: this.terminations

    			};
    			newChartData.push(dataElement);
    		});
    		//console.log(newChartData);
    		
    		// ... and finally render the chart
    		
			if ( windowAspectHeadcountGraph == "desktop") {
	    		$("#display-area").html(menuDiv);
	    		$("#display-area").append(headcountChartDiv);
			}
			else {
	    		$("#display-area-xs").html(menuDiv);
	    		$("#display-area-xs").append(headcountChartDiv);
			}
    		headcountChart.dataProvider = newChartData;
    		headcountChart.validateData();
    		headcountChart.animateAgain();
    		$(".amcharts-legend-item-employees").attr("transform","translate(386,0)");
    		enableHeadcountGraphSelectors();
    		activateHeadcountGraphSelectors();

    	}
	});

}

function makeCustomZoomOut(chartDiv) {
	var zoomOutDiv = $("<a></a>").attr("id","zoomLink").click(function(){
							headcountChartZoom = "out";
							headcountChart.zoomToIndexes(0, headcountChart.dataProvider.length - 1);
							makeZoomZoomIn();
						}).text("Zoom Out")
						.css({"position": "absolute", 
								"bottom": "150px",
								"right": "225px",
								"border": "1px solid #000055",
								"border-radius": "1px",
								"padding": "10px",
								"cursor": "pointer",
								"color": "#000000",
								"font-size": "14px",
								"font-weight": "bold",
								"background": "#888888"});
	$(chartDiv).append(zoomOutDiv);
	
}

var headcountChartZoom = "in"; 
function makeZoomZoomIn() {
	$("#zoomLink").text("Zoom In").click(function() {
		headcountChartZoom = "in";
		zoomChart();
		makeZoomZoomOut();
		makeCustomZoomOut();
		//headcountChart.animateAgain();
	});
	
}
function makeZoomZoomOut() {
	$("#zoomLink").text("Zoom Out").click(function() {
		headcountChartZoom = "out";
		headcountChart.zoomToIndexes(0, headcountChart.dataProvider.length - 1);
		makeZoomZoomIn();
		makeCustomZoomOut();
		//headcountChart.animateAgain();
	});
	
}

function zoomChart() {
    // Zooms to the first 12 months
	if ( headcountChart.dataProvider.length >= 12 ) {
		headcountChart.zoomToIndexes(headcountChart.dataProvider.length - 12, headcountChart.dataProvider.length - 1);
		headcountChartZoom = "in";
	}
	else {
		headcountChart.zoomToIndexes(0, headcountChart.dataProvider.length - 1);
		headcountChartZoom = "out";
		
	}
}

var headcountLabelAlternator = 0;
function returnStaggeredValue(value,valueText,categoryAxis) {
	if ( headcountChartZoom == "in" || headcountChart.dataProvider.length < 24 ) {
		return addCommas(valueText);
	}
	if ( headcountLabelAlternator == 0 ) {
		headcountLabelAlternator = 1;
		return "";
		//return "\n" + valueText;	
	}
	headcountLabelAlternator = 0;
	return addCommas(valueText);
}
var seatTurnoverLabelAlternator = 0;
function returnStaggeredPercent(value,valueText,categoryAxis) {
	if ( headcountChartZoom == "in" || headcountChart.dataProvider.length < 24 ) {
		return valueText;
	}
	if ( seatTurnoverLabelAlternator == 0 ) {
		seatTurnoverLabelAlternator = 1;
		return "";
		//return "\n" + valueText;	
	}
	seatTurnoverLabelAlternator = 0;
	return valueText;
}
