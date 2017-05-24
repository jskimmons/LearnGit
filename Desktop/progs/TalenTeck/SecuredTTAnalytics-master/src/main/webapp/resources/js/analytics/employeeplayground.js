//console.log("Started spewing.");

var windowAspectEmployeePlaygroundGraph = "";
windowAspectEmployeePlaygroundGraph = ($(window).width() >= 768) ? "desktop"
		: "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if (lowerBoxesHeight < 500) {
	lowerBoxesHeight = 500;
}
if (lowerBoxesMobileHeight < 500) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height", lowerBoxesHeight + "px").css("padding", "25px");
$("#display-area").css("height", lowerBoxesHeight + "px");
$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

underlineOnlyThisLink("#employeePlaygroundLink");

// Show a "loading" animation

deactivateTopbarLinks();
displayGraphSpinner(windowAspectEmployeePlaygroundGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Models</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Applicant characteristics and employee events that drive turnover rates.</h4>');

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);

var applicantModelsButton = $("<button></button>").attr('id', 'applicantModelsButton').attr('class', 'btn btn-default btn-block').text("Applicants")
.css("margin-bottom", "10px").css("padding", "10px");

var employeeModelsButton = $("<button></button>").attr('id', 'employeeModelsButton').attr('class', 'btn btn-default btn-block').text("Employees")
.css("margin-bottom", "10px").css("padding", "10px").prop('disabled',true);

$(selectorButtonBox).append(applicantModelsButton).append(employeeModelsButton);

if (windowAspectEmployeePlaygroundGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
} else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

// disableEmployeePlaygroundGraphSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";

var selectorList = [];
var selectorsEverDrawn = false;
var activeSelectors = [];

var employeePlaygroundRawGraph = {};
var formattedGraph = [];
var graphStatistic = "n";
var graphRate = "365";
// Total quantiles is verified by the reshape graph routine
var totalQuantiles = 4;
var reshapedUsedGraph = {};
var employeePlaygroundRawGraph = {};
var employeePlaygroundGraphHashtable = new Hashtable({
	hashCode : employeePlaygroundHashCode,
	equals : employeePlaygroundIsEqual
});
var employeePlaygroundGraphSelectionHashtable = new Hashtable({
	hashCode : employeePlaygroundHashCode,
	equals : employeePlaygroundIsEqual
});
var currentModelHashtable = new Hashtable({
	hashCode : employeePlaygroundHashCode,
	equals : employeePlaygroundIsEqual
});
var employeePlaygroundCoordHashtable = new Hashtable({
	hashCode : employeePlaygroundHashCode,
	equals : employeePlaygroundIsEqual
});
var employeePlaygroundModelSelector = {};
var currentModelData = {};
var chartData = [];
var firstGeneration = true;
var variableSelectorTbody = $("<tbody></tbody>").attr("id",
		"variableSelectorTbody");

refreshEmployeePlaygroundGraph();
var selectorList = [];

function refreshEmployeePlaygroundGraph() {

	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "employeeplaygroundSelectors"
		},
		dataType : "json",
		success : function(data) {
			var defaultSelectorList = [];
			selectorList = data.selectorList;
			redrawSelectorBoxes();
			activeSelectors = selectedFilters();
		}
	});

	$
			.ajax({
				type : "POST",
				url : "../ReturnQuery",
				data : {
					type : "employeeplayground"
				},
				dataType : "json",
				success : function(data) {
					//console.log("data" + JSON.stringify(data));

					employeePlaygroundRawGraph = data;
					$.each(data.filterValues, function() {
						employeePlaygroundGraphHashtable.put(this.filterValue
								+ "-" + this.tenure, this);
					});
					$.each(data.graphData, function() {
						employeePlaygroundCoordHashtable.put(this.location,
								this);
					});
					employeePlaygroundGraphSelectionHashtableFillDefaults(employeePlaygroundRawGraph.defaultFilterValue
							+ "-" + "0");
					// redrawEmployeePlaygroundGraph(employeePlaygroundRawGraph.defaultFilterValue);
					redrawEmployeePlaygroundGraph([
							{
								selectorName : "Location",
								selectorValue : employeePlaygroundRawGraph.defaultFilterValue
							}, {
								selectorName : "Tenure",
								selectorValue : "0"
							} ]);
				}
			});
}

function redrawSelectorBoxes() {
	var activeSelectorsList = [];

	$(selectorList).each(function() {
		if (selectorsEverDrawn) {
			var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
			if ($("#" + this.selectorName + " option:selected").text().substring(0, 6) !== "Select" && $("#" + this.selectorName + " option:selected").val() == "All") {
					allSelected = true;
					}
			} else {
				var usedDefaultValue = this.defaultValue;
			}
			var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("class","form-control employeeplaygroundSelect").attr("width", "300px").attr("defaultValue",usedDefaultValue);
			var defaultValueHolder = this.defaultValue;
			var checkedSelectorName = this.selectorName;

			var defaultFound = false;
			$(this.selectorValues).each(function() {
				var checkedSelectorValue = this.valueName;
					if (!selectorsEverDrawn) {
						var thisValue = $("<option></option>").attr("value",(checkedSelectorName == "Tenure") ? this.valueName : this.valueName)
										.text((checkedSelectorName == "Tenure") ? this.valueLabel + " Days": this.valueLabel);
						
						if (this.valueLabel.substring(0, 6) === "Select") {
							$(thisValue).attr("disabled", true);
						}
						if (this.valueLabel === usedDefaultValue) {
							$(thisValue).attr("selected","selected");
		        			$(thisValue).text(checkedSelectorName +": "+ this.valueLabel);
						}
						$(thisSelector).append(thisValue);
					} else {
						var selectedVal = $("#"+ checkedSelectorName + " option:selected").val();
						var thisValue = $("<option></option>").attr("value",(checkedSelectorName == "Tenure") ? this.valueName: this.valueName)
										.text((checkedSelectorName == "Tenure") ? this.valueLabel+ " Days": this.valueLabel);
						if (this.valueLabel.substring(0, 6) === "Select") {
							$(thisValue).attr("disabled", true);
						}
						if (this.valueLabel === selectedVal) {
							$(thisValue).attr("selected","selected");
		        			$(thisValue).text((checkedSelectorName == "Tenure") ? checkedSelectorName + ": " + this.valueLabel+ " Days": checkedSelectorName + ": " +  this.valueLabel);
						}
						$(thisSelector).append(thisValue);
						}
					});
						activeSelectorsList.push(thisSelector);
					});

	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var employeeModelsButtonDetached=$("#employeeModelsButton").detach();
	var applicantModelsButtonDetached=$("#applicantModelsButton").detach();

	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantModelsButtonDetached);
	$(selectorButtonBox).append(employeeModelsButtonDetached);
	$.each(activeSelectorsList, function() {
		$(selectorButtonBox).append(this);
	});
	selectorsEverDrawn = true;
}

function selectedFilters() {
	var selectedValueKey = [];
	$(selectorList).each(
			function() {
				selectedValueKey.push({
					selectorName : this.selectorName,
					selectorValue : $(
							"#" + this.selectorName + " option:selected").val()
				});
			});
	return selectedValueKey;
}

function convertEmployeePlaygroundCoordinates(dataSet) {
	chartData = [];
	if (dataSet) {
		$.each(dataSet.graphData, function() {
			var tempDatapoint = {
				"tenure" : this.count,
				"goodTurnover" : this.goodScore,
				"averageTurnover" : this.averageScore,
				"badTurnover" : this.badScore
			};
			chartData.push(tempDatapoint);
		});
	}
}

function employeePlaygroundIsEqual(selection1, selection2) {
	return selection1 === selection2;
}

function employeePlaygroundHashCode(selection) {
	return JSON.stringify(selection);
}

/*
 * function populateEmployeePlaygroundModelSelector() {
 * 
 * var modelSelector = $("<select></select>").attr("id",
 * "playgroundModelSelector").attr("class", "form-control").attr( "width",
 * "300px").attr("defaultValue", employeePlaygroundRawGraph.defaultFilterValue);
 * $.each(employeePlaygroundRawGraph.filterValues, function() { var thisOption =
 * $("<option></option>").attr("value", this.filterValue)
 * .text(this.filterValue); $(modelSelector).append(thisOption); }); return
 * modelSelector;
 *  }
 */

function employeePlaygroundGraphSelectionHashtableFillDefaults(filterValue) {
	$.each(employeePlaygroundGraphHashtable.get(filterValue).variables,
			function() {
				employeePlaygroundGraphSelectionHashtable.put(
						this.variableName, this.defaultCategory);
			});
}

function redrawEmployeePlaygroundVariables(location, tenure,
		variableSelectorTbody) {
	$(variableSelectorTbody).html("");
	var rawVariableData = employeePlaygroundGraphHashtable.get(location + "-"
			+ tenure).variables;
	currentModelData = employeePlaygroundGraphHashtable.get(location + "-"
			+ tenure);

	currentModelHashtable = new Hashtable({
		hashCode : employeePlaygroundHashCode,
		equals : employeePlaygroundIsEqual
	});

	var counter = 0;
	$.each(rawVariableData, function() {
		var thisShownCategory = employeePlaygroundGraphSelectionHashtable.get(this.variableName);
		if (thisShownCategory == null) {
			thisShownCategory = this.defaultCategory;
		}
		var thisVariableSelector = $("<select></select>").attr("class",
				"form-control categoryselector").attr("id",
				"selector" + this.variableName).attr("width", "300px");
		// console.log("Default value: " + thisShownCategory);

		var thisVariableCoefficientTable = new Hashtable({
			hashCode : employeePlaygroundHashCode,
			equals : employeePlaygroundIsEqual
		});
		var sortedCategories = this.categories.sort(function(a, b) {
			return (a["sortOrder"] == b["sortOrder"] ? 0
					: a["sortOrder"] > b["sortOrder"] ? 1 : -1);
		});
		$(sortedCategories).each(
				function() {
					var thisOption = $("<option></option>").attr("value",
							this.categoryName).text(this.categoryLabel);
					$(thisVariableSelector).append(thisOption);
					if (this.categoryName === thisShownCategory) {
						thisOption.attr("selected", "selected");
					}

					thisVariableCoefficientTable.put(this.categoryName,
							this.coefficient);
				});
		var thisVariableTitleTD = $("<td></td>").attr("class",
				"employeePlaygroundLabelTD").attr("id", "label" + counter)
				.html(this.variableLabel).css("padding-left", "10px").css(
						"padding-right", "30px").css("width", "250px").css(
						"background-color", "#EEEEEE").css("border",
						"1px solid grey");
		if (counter == 3 || counter == 8 || counter == 13) {
			$(thisVariableTitleTD).css("border-top", "1px solid black");
			// console.log("Counter " + counter + " black border")
		}
		$(thisVariableSelector).attr("defaultValue", thisShownCategory);
		// console.log("AFDS " + thisShownCategory);
		var thisVariableSelectorTD = $("<td></td>").attr("class",
				"employeePlaygroundSelectorTD").html(thisVariableSelector).css(
				"border", "1px solid black").css("width", "250px");
		var thisVariableSelectorTR = $("<tr></tr>").html(thisVariableTitleTD)
				.append(thisVariableSelectorTD);
		$(variableSelectorTbody).append(thisVariableSelectorTR);

		currentModelHashtable.put(this.variableName,
				thisVariableCoefficientTable);
		counter++;
	});
}

function redrawEmployeePlaygroundGraph(selectedFilters) {
	// console.log(selectedFilters);
	var location = selectedFilters[0].selectorValue;
	var tenure = selectedFilters[1].selectorValue;
	//console.log(tenure);
	var tenureList = new Hashtable({hashCode : employeePlaygroundHashCode,equals : employeePlaygroundIsEqual});
	tenureList.put("0",30);
	tenureList.put("30",60);
	tenureList.put("90",90);
	tenureList.put("180",180);
	var tenureDisp = tenureList.get(tenure);
	//console.log(tenureDisp);

	// tenure = tenure.replace(' Days','');

	convertEmployeePlaygroundCoordinates(employeePlaygroundCoordHashtable
			.get(location));

	var variableSelectorThead = $("<thead></thead>").attr("id",
			"variableSelectorThead").css("width", "100%");
	var variableSelectorTable = $("<table></table>").attr("id",
			"variableSelectorTable").css("border", "1px solid black").css(
			"border-collapse", "collapse").html(variableSelectorThead);
	$(variableSelectorTable).append(variableSelectorTbody);

	variableSelectorThead
			.html("<tr><th colspan='2' style='text-align:center;height:40px;background-color:#888888;border:1px solid black'><h4><b>Inputs</b></h4></th><tr>");
	variableSelectorThead
			.append("<tr><th style='height:30px;padding-left:10px;border:1px solid black;background-color:#BBBBBB'>Variables</th><th style='height:30px;padding-left:17px;border:1px solid black;background-color:#BBBBBB'>Selection</th></tr>");

	if (firstGeneration) {
		redrawEmployeePlaygroundVariables(location, tenure,
				variableSelectorTbody)
		firstGeneration = false;
	}
	windowAspectEmployeePlaygroundGraph = ($(window).width() >= 768) ? "desktop"
			: "mobile";

	var chartContainerWidth = (windowAspectEmployeePlaygroundGraph == "mobile") ? $(
			window).width() - 50
			: $(window).width() - 300;
	if (chartContainerWidth < 400) {
		chartContainerWidth = 400;
	}

	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if (lowerBoxesHeight < 300) {
		lowerBoxesHeight = 300;
	}
	if (lowerBoxesMobileHeight < 1000) {
		lowerBoxesMobileHeight = 1000;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if (windowAspectEmployeePlaygroundGraph == "mobile") {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}
	var mainGraphHeight = chartContainerHeight - 100;

	employeePlaygroundDiv = $("<div></div>")
			.attr("id", "employeePlaygroundDiv").css("height",
					chartContainerHeight + "px").css("width",
					chartContainerWidth).css("vertical-align", "middle").css(
					"display", "inline-block").css("margin-top", "0");
	// Attach first, otherwise AmCharts won't work....

	employeePlaygroundChartTable = $("<table></table>").attr("id",
			"employeePlaygroundChartTable").css("width", "100%").css("height",
			"100%").css("margin-left", "30px").css("margin-top", "30px");
	$(employeePlaygroundDiv).html(employeePlaygroundChartTable);

	employeePlaygroundChartTbody = $("<tbody></tbody>").attr("id",
			"employeePlaygroundChartTbody").css("width", "100%").css("height",
			"100%");
	$(employeePlaygroundChartTbody).html("");
	$(employeePlaygroundChartTable).append(employeePlaygroundChartTbody);

	var employeePlaygroundChartTopTR = $("<tr></tr>").attr("id",
			"employeePlaygroundChartTopTR");
	var employeePlaygroundChartBotTR = $("<tr></tr>").attr("id",
			"employeePlaygroundChartBotTR").css("height", "80%");
	$(employeePlaygroundChartTbody).append(employeePlaygroundChartTopTR)
			.append(employeePlaygroundChartBotTR);

	var employeePlaygroundSelectorTD = $("<td rowspan='2'></td>").attr("id",
			"employeePlaygroundSelectorTD").html(variableSelectorTable).css(
			"width", "50%").css("margin-right", "40px").css("vertical-align",
			"top").css("padding-right", "40px");
	$(employeePlaygroundChartTopTR).html(employeePlaygroundSelectorTD);
	// THIS SHOULD PROBABLY BE CHANGED BY TAVIS BC IT IS A QUICK FIX
	// $(variableSelectorTable).css("height", mainGraphHeight + 30 + "px");
	$(variableSelectorTbody).css("overflow-y", "scroll");

	var employeePlaygroundChartTD = $("<td></td>").attr("id",
			"employeePlaygroundChartTD").css("width", "50%");
	$(employeePlaygroundChartTopTR).append(employeePlaygroundSelectorTD);

	var outputsPlaygroundChartTD = $("<td></td>").attr("id",
			"outputsPlaygroundChartTD").css("width", "50%").css(
			"vertical-align", "top").css("padding-top", "0px");
	var outputsTable = $("<table></table>").attr("id", "outputsTable").css(
			"width", "100%").css("border", "1px solid black").css(
			"border-collapse", "collapse");
	$(outputsPlaygroundChartTD).html(outputsTable);
	$(employeePlaygroundChartTopTR).append(outputsPlaygroundChartTD);

	employeePlaygroundChartDiv = $("<div></div>").attr("id",
			"employeePlaygroundChartDiv").css("height", "100%");

	// try to get graph header here:
	var chartTable = $("<table></table>").attr("id", "chartTable").css(
			"height", "100%").css("border", "1px solid black");
	var chartHeader = $("<tr></tr>")
			.html(
					"<td style='text-align:center; background-color: #888888;border-bottom: 1px solid black'><h4><b>Tenure Turnover Profile</b></h4></td>")
			.css("height", "40px");
	$(chartTable).html(chartHeader)
			.append(
					$("<tr></tr>").html(
							$("<td>/td>").html(employeePlaygroundChartDiv)));

	// employeePlaygroundChartDiv
	$(employeePlaygroundChartTD).append(chartTable);

	if (windowAspectEmployeePlaygroundGraph == "desktop") {
		$(employeePlaygroundChartBotTR).append(employeePlaygroundChartTD);
		$("#display-area-xs").empty();
		$("#display-area").html(employeePlaygroundDiv);
		$(employeePlaygroundSelectorTD).css("width",
				($(variableSelectorTbody).width()) + "px");
		$(employeePlaygroundChartTD).css(
				"width",
				($(employeePlaygroundChartTable).width() - $(
						variableSelectorTbody).width())
						+ "px");
		$(employeePlaygroundChartDiv).css(
				"width",
				($(employeePlaygroundChartTable).width() - $(
						variableSelectorTbody).width())
						+ "px");

	} else {
		var employeePlaygroundChartSecondTR = $("<tr></tr>");
		$(employeePlaygroundChartSecondTR).html(employeePlaygroundChartTD);
		$(employeePlaygroundChartTbody).append(employeePlaygroundChartSecondTR);
		$("#display-area").empty();
		$("#display-area-xs").html(employeePlaygroundDiv);
		$("#employeePlaygroundSelectorTD").css("width", "100%");
		$("#employeePlaygroundChartTD").css("width", "100%");
		$("#employeePlaygroundChartDiv").css("width", "100%");
		$(variableSelectorTable).css("height", "500px");
		$(variableSelectorTbody).css("height", "500px");
		$(employeePlaygroundChartDiv).css("height", "450px");

	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

	var predictedTurnover = fetchPredictedTurnoverRate();

	$(outputsTable).html("<th colspan='2' style='text-align:center;background-color:#888888;height:40px;vertical-align:middle;border:1px solid black'><h4><b>Outputs</b></h4></th>");
	var outputsMeanTR = $("<tr></tr>").attr("id", "outputsMeanTR").css('height', "30px");
	outputsMeanTR.append("<td style='background-color:#EEEEEE;border-bottom:1px solid grey;border-right:1px solid black;padding-left:5px'>Mean " + tenureDisp +"-Day Turnover Rate</td>");
	outputsMeanTR.append("<td id='meanT30TD' style='text-align:center;background-color:#BBBBBB'>"+ (100 * currentModelData.meanOutput).toFixed(1) + "%</td>");
	var outputsPredictedTR = $("<tr></tr>").attr("id", "outputsPredictedTR").css('height', "30px");
	outputsPredictedTR.append("<td style='background-color:#EEEEEE;border-right:1px solid black;padding-left:5px'>Predicted " + tenureDisp + "-Day Turnover Rate</td>");
	outputsPredictedTR.append("<td id='predictedT30TD' style='text-align:center; background-color:rgba(0, 102, 204, .4); border-top:1px solid grey'>"+ (100 * predictedTurnover).toFixed(1) + "%</td>");
	outputsTable.append(outputsMeanTR).append(outputsPredictedTR);

	employeePlaygroundChart = generateEmployeePlaygroundChart(
			"employeePlaygroundChartDiv", currentModelData.meanOutput,
			predictedTurnover);
	employeePlaygroundChart.validateData();
	employeePlaygroundChart.animateAgain();
	redrawSelectorBoxes();
	addEmployeePlaygroundGraphResizeListener();
	enableEmployeePlaygroundGraphSelectors();
	activateEmployeePlaygroundGraphSelectors();

	$('[data-toggle="tooltip"]').tooltip();
}

function fetchPredictedTurnoverRate() {

	var turnoverScore = currentModelData.constantTerm;
	// console.log("turnoverScore" + turnoverScore);
	$(".categoryselector").each(
			function() {
				var selectedValue = $(this).val();
				// console.log("Selector is " + $(this).attr("id").substring(8)
				// + ", value is " + selectedValue);
				turnoverScore += currentModelHashtable.get(
						$(this).attr("id").substring(8)).get(selectedValue);
			});
	// console.log("Turnover score: " + (1 / (1 + Math.exp(-turnoverScore))))
	return 1 / (1 + Math.exp(-turnoverScore));

}

function generateEmployeePlaygroundChart(chartDiv, overallMean,
		thisSelectionMean) {

	var chart = AmCharts.makeChart(chartDiv, {
		type : "serial",
		theme : "light",
		dataProvider : chartData,
		// marginLeft : 0,
		// marginRight : 0,
		//height : "100%",
		//fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
		valueAxes : [ {
			id : "turnoverAxis",
			axisThickness : 2,
			axisAlpha : 1,
			gridAlpha : 0,
			position : "left",
			offset : 0,
			maximum : .4,
			minimum : 0,
			title : "30-day Turnover Rate",
			fontSize : 12,
			titleBold : false,
			titleFontSize : 14,
			axisColor : "#555555",
			labelFunction : function(number, label, axis) {
				return Math.floor(number * 1000) / 10 + "%";
			}
		} ],
		categoryField : "tenure",
		categoryAxis : {
			id : "tenureAxis",
			axisThickness : 2,
			axisAlpha : 1,
			gridAlpha : 0.07,
			position : "bottom",
			offset : 0,
			maximum : 12,
			minimum : 0,
			title : "Tenure in Months",
			fontSize : 12,
			titleBold : false,
			titleFontSize : 14,
			axisColor : "#555555"
		},
		legend : [ {
			equalWidths:"true",		
			"autoMargins": true,
	        //valueWidth: 70,
			data : [ {
				title : "Good Score",
				color : "#269900"
			}, {
				title : "Average Score",
				color : "#BBBBBB"
			}, {
				title : "Good Score",
				color : "#A00000"
			} ]
		} ],
		graphs : [ {
			id : "goodScore",
			valueField : "goodTurnover",
			bulletSize : 8,
			hideBulletsCount : 50,
			title : "Good Score",
			balloonText : "[[value]]",
			legendValueText : "Good Score",
			lineColor : "#269900",
			borderColor:"red",
			lineThickness : "3px",
			horizontalGap:2,
			spacing:0,
			verticalGap:2,
			valueWidth:2
		}, {
			id : "averageScore",
			valueField : "averageTurnover",
			bulletSize : 8,
			hideBulletsCount : 50,
			title : "Average Score",
			balloonText : "[[value]]",
			legendValueText : "Average Score",
			lineColor : "#BBBBBB",
			borderColor:"red",
			lineThickness : "3px"
		}, {
			id : "badScore",
			valueField : "badTurnover",
			bulletSize : 8,
			hideBulletsCount : 50,
			title : "Bad Score",
			balloonText : "[[value]]",
			legendValueText : "Bad Score",
			lineColor : "#A00000",
			borderColor:"red",
			lineThickness : "3px"
		} ]
	});

	return chart;

}

function disableEmployeePlaygroundGraphSelectors() {
	deactivateTopbarLinks();
	$(".categoryselector").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled", true);
	});
	$(".employeeplaygroundSelect").unbind("change");
	$(".employeeplaygroundSelect").prop("disabled", true);
	$("#applicantModelsButton").prop("disabled",true);
	/* $("#employeePlaygroundTableButton").prop("disabled",true); */

}

function enableEmployeePlaygroundGraphSelectors() {
	activateTopbarLinks();
	$(".categoryselector").each(function() {
		$(this).prop("disabled", false);
	});
	$(".employeeplaygroundSelect").prop("disabled", false);
	$("#applicantModelsButton").prop("disabled",false);

	/* $("#employeePlaygroundTableButton").prop("disabled",false); */
}

function activateEmployeePlaygroundGraphSelectors() {
	$(".categoryselector").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var predictedTurnover = fetchPredictedTurnoverRate();
			// redrawEmployeePlaygroundGraph($(".employeeplaygroundSelect").val());
			activeSelectors = selectedFilters();
			// console.log("activeSelectors" + JSON.stringify(activeSelectors));
			redrawEmployeePlaygroundGraph(activeSelectors);
		});
	});
	$(".employeeplaygroundSelect").change(function() {
		firstGeneration = true;
		// console.log("employeeplaygroundSelect change" +
		// JSON.stringify(activeSelectors) );
		//redrawEmployeePlaygroundGraph($(".employeeplaygroundSelect").val());
		activeSelectors = selectedFilters();
		redrawEmployeePlaygroundGraph(activeSelectors);

	});
	$("#applicantModelsButton").unbind("click");
	  $("#applicantModelsButton").click(function(){ 
		 $.ajax({
			 type:"GET",
			 url: "../resources/js/analytics/applicantplayground.js",
			 dataType:"script"
				 }); 
		 });
	/*
	 * $("#employeePlaygroundTableButton").unbind("click");
	 * $("#employeePlaygroundTableButton").click(function(){ $.ajax({type:
	 * "GET",url: "../resources/js/analytics/robustnesstable.js",dataType:
	 * "script"}); });
	 */
}

function addEmployeePlaygroundGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		//var newModel = $(".employeeplaygroundSelect").val();
		//redrawEmployeePlaygroundGraph(newModel);
		activeSelectors = selectedFilters();
		//console.log("activeSelectors" + JSON.stringify(activeSelectors));
		redrawEmployeePlaygroundGraph(activeSelectors);

		adjustTopbarPadding();
	});
}
