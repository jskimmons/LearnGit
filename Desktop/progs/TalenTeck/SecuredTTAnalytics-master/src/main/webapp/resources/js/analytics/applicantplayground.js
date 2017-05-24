//console.log("Started spewing.");

var windowAspectApplicantPlaygroundGraph = "";
windowAspectApplicantPlaygroundGraph = ($(window).width() >= 768) ? "desktop"
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
displayGraphSpinner(windowAspectApplicantPlaygroundGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Models</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Applicant characteristics and employee events that drive turnover rates.</h4>');

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);

var applicantModelsButton = $("<button></button>").attr('id', 'applicantModelsButton').attr('class', 'btn btn-default btn-block').text("Applicants")
.css("margin-bottom", "10px").css("padding", "10px").prop('disabled',true);

var employeeModelsButton = $("<button></button>").attr('id', 'employeeModelsButton').attr('class', 'btn btn-default btn-block').text("Employees")
.css("margin-bottom", "10px").css("padding", "10px");

$(selectorButtonBox).append(applicantModelsButton).append(employeeModelsButton);

if (windowAspectApplicantPlaygroundGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
} else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

// disableApplicantPlaygroundGraphSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";

var selectorList = [];
var selectorsEverDrawn = false;
var activeSelectors = [];

var applicantPlaygroundRawGraph = {};
var formattedGraph = [];
var graphStatistic = "n";
var graphRate = "365";
// Total quantiles is verified by the reshape graph routine
var totalQuantiles = 4;
var reshapedUsedGraph = {};
var applicantPlaygroundRawGraph = {};
var applicantPlaygroundGraphHashtable = new Hashtable({
	hashCode : applicantPlaygroundHashCode,
	equals : applicantPlaygroundIsEqual
});
var applicantPlaygroundGraphSelectionHashtable = new Hashtable({
	hashCode : applicantPlaygroundHashCode,
	equals : applicantPlaygroundIsEqual
});
var currentModelHashtable = new Hashtable({
	hashCode : applicantPlaygroundHashCode,
	equals : applicantPlaygroundIsEqual
});
var applicantPlaygroundCoordHashtable = new Hashtable({
	hashCode : applicantPlaygroundHashCode,
	equals : applicantPlaygroundIsEqual
});
var applicantPlaygroundModelSelector = {};
var currentModelData = {};
var chartData = [];
var firstGeneration = true;
var variableSelectorTbody = $("<tbody></tbody>").attr("id",
		"variableSelectorTbody");

refreshApplicantPlaygroundGraph();
var selectorList = [];
var driversBox;
var ttBox;

function refreshApplicantPlaygroundGraph() {
	
	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "applicantplaygroundselectors"
		},
		dataType : "json",
		success : function(data) {
			//console.log("data" + JSON.stringify(data));
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
					type : "applicantplayground"
				},
				dataType : "json",
				success : function(data) {
					// console.log("data" + JSON.stringify(data));

					applicantPlaygroundRawGraph = data;
					$.each(data.filterValues, function() {
						applicantPlaygroundGraphHashtable.put(this.filterValue+ "-" + this.turnoverRate, this);
					});
					applicantPlaygroundGraphSelectionHashtableFillDefaults(applicantPlaygroundRawGraph.defaultFilterValue + "-" + applicantPlaygroundRawGraph.defaultFilterValue2);
					// redrawApplicantPlaygroundGraph(applicantPlaygroundRawGraph.defaultFilterValue);
					redrawApplicantPlaygroundGraph([
							{
								selectorName : "Location",
								selectorValue : applicantPlaygroundRawGraph.defaultFilterValue
							},
							{
								selectorName : "Turnover Rate",
								selectorValue : applicantPlaygroundRawGraph.defaultFilterValue2
							} ]);
				}
			});
}

function redrawSelectorBoxes() {
	var activeSelectorsList = [];
	var activeDriversSelectorsList = [];

	$(selectorList).each(function() {
		if (selectorsEverDrawn) {
			var usedDefaultValue = $("#" + this.selectorName+ " option:selected").val();
			if ($("#" + this.selectorName + " option:selected").text().substring(0, 6) !== "Select" && $("#" + this.selectorName + " option:selected").val() == "All") {
					allSelected = true;
				}
		} else {
			var usedDefaultValue = this.defaultValue;
		}
		var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("class","form-control applicantplaygroundSelect").attr("width", "300px").attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;

		$(this.selectorValues).each(function() {
			var checkedSelectorValue = this.valueName;
			if (!selectorsEverDrawn) {
				var thisValue = $("<option></option>").attr("value",(checkedSelectorName == "TurnoverRate") ? this.valueName: this.valueName)
								.text((checkedSelectorName == "TurnoverRate") ? this.valueLabel: this.valueLabel);
				if (this.valueLabel.substring(0, 6) === "Select") {
					$(thisValue).attr("disabled", true);
				}
				if (this.valueLabel === usedDefaultValue) {
					$(thisValue).attr("selected","selected");
        			$(thisValue).text((checkedSelectorName == "TurnoverRate") ? "Turnover Rate: "+ this.valueLabel:checkedSelectorName +": "+ this.valueLabel);

				}
				$(thisSelector).append(thisValue);
			} else {
				var selectedVal = $("#"+ checkedSelectorName + " option:selected").val();
				var thisValue = $("<option></option>").attr("value",(checkedSelectorName == "Turnover Rate") ? this.valueName: this.valueName)
								.text((checkedSelectorName == "TurnoverRate") ? this.valueLabel: this.valueLabel);
				if (this.valueLabel.substring(0, 6) === "Select") {
					$(thisValue).attr("disabled", true);
				}
				if (this.valueLabel === selectedVal) {
					$(thisValue).attr("selected","selected");
        			$(thisValue).text((checkedSelectorName == "TurnoverRate") ? "Turnover Rate: "+ this.valueLabel:checkedSelectorName +": "+ this.valueLabel);
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
	
	var driversTable = $("<table></table>")
			.attr("id", "driversTable")
			.css("border-collapse", "collapse")
			.css("width", "100%")
			.css("border", "1px solid black")
			.append(
					"<tr style='height:30px'><th colspan='2' style='background-color:#888888;text-align:center;border:1px solid black'><h4><b>Drivers</b></h4></th></tr>");

	driversBox = $("<div></div>").attr("id", "driversBox").css("width", "100%");
	$(driversBox).html(driversTable);

	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantModelsButtonDetached);
	$(selectorButtonBox).append(employeeModelsButtonDetached);
	
	$.each(activeSelectorsList, function() {
		$(selectorButtonBox).append(this);
	});
//	$
//			.each(
//					activeSelectorsList,
//					function() {
//
//						var tempRow = $("<tr></tr>").css("width", "100%");
//						$(tempRow)
//								.append(
//										"<td style='background-color:rgba(0, 102, 204, .4);border:1px solid black;width:50%'><b>"
//												+ $(this).attr('id')
//												+ "</b></td>");
//						$(tempRow).append(
//								$("<td></td>").html(this).css(
//										"background-color", "#EEEEEE").css(
//										"width", "50%").css("border",
//										"1px solid black"));
//
//						ttTable.append(tempRow);
//						// ttTable.append($(tempRow).clone());
//					});

	selectorsEverDrawn = true;

	// do ttTable here
}

function selectedFilters() {
	var selectedValueKey = [];
	$(selectorList).each(
			function() {
				//console.log("this.selectorName" + this.selectorName);
				selectedValueKey.push({selectorName : this.selectorName,selectorValue : $("#" + this.selectorName + " option:selected").val()});
			});
	return selectedValueKey;
}

function convertApplicantPlaygroundCoordinates(dataSet) {
	chartData = [];
	if (dataSet) {
		
//		selectorName : this.selectorName,
//		selectorValue : $(
//				"#" + this.selectorName + " option:selected").val()
		
		$.each(dataSet.variables, function() {
			var tempDatapoint = {
				"variable" : this.variableName,
				"influence" : Math.round(this.coefficient),
				"color" : "#999999"
			};
			chartData.push(tempDatapoint);
		});
		//console.log(chartData);
	}
}

function applicantPlaygroundIsEqual(selection1, selection2) {
	return selection1 === selection2;
}

function applicantPlaygroundHashCode(selection) {
	return JSON.stringify(selection);
}

/*
 * function populateApplicantPlaygroundModelSelector() {
 * 
 * var modelSelector = $("<select></select>").attr("id",
 * "playgroundModelSelector").attr("class", "form-control").attr( "width",
 * "300px").attr("defaultValue",
 * applicantPlaygroundRawGraph.defaultFilterValue);
 * $.each(applicantPlaygroundRawGraph.filterValues, function() { var thisOption =
 * $("<option></option>").attr("value", this.filterValue)
 * .text(this.filterValue); $(modelSelector).append(thisOption); }); return
 * modelSelector; }
 */

function applicantPlaygroundGraphSelectionHashtableFillDefaults(filterValue) {
	$.each(applicantPlaygroundGraphHashtable.get(filterValue).variables,
			function() {
				applicantPlaygroundGraphSelectionHashtable.put(
						this.variableName, this.defaultCategory);
			});
}

function redrawApplicantPlaygroundVariables(location, tenure,
		variableSelectorTbody) {
	$(variableSelectorTbody).html("");
	//console.log(applicantPlaygroundGraphHashtable.entries());

	var rawVariableData = applicantPlaygroundGraphHashtable.get(location + "-"
			+ tenure).variables;
	currentModelData = applicantPlaygroundGraphHashtable.get(location + "-"
			+ tenure);

	currentModelHashtable = new Hashtable({
		hashCode : applicantPlaygroundHashCode,
		equals : applicantPlaygroundIsEqual
	});

	var counter = 0;
	$.each(rawVariableData, function() {
		var thisShownCategory = applicantPlaygroundGraphSelectionHashtable
				.get(this.variableName);
		if (thisShownCategory == null) {
			thisShownCategory = this.defaultCategory;
		}

		var thisVariableSelectorTD = $("<td></td>").attr("class",
				"applicantPlaygroundLabelTD").attr("id", "variable" + counter)
				.html(this.variableName).css("padding-left", "10px").css(
						"border", "1px solid  #bfbfbf").css("background-color", "#FFFFFF")
				.css("width", "250px");

		var thisVariableTitleTD = $("<td></td>").attr("class",
				"applicantPlaygroundLabelTD").attr("id", "label" + counter)
				.html(this.variableLabel).css("padding-left", "10px").css(
						"padding-right", "30px").css("width", "250px").css(
						"background-color", categoryColor(this.variableLabel)).css(
								"border", "1px solid  #bfbfbf");
		// var thisVariableSelectorTD = $("<td></td>").attr("class",
		// "applicantPlaygroundSelectorTD").html(thisVariableSelector)
		// .css("border", "1px solid black").css("width", "250px");
		var thisVariableSelectorTR = $("<tr></tr>").html(thisVariableTitleTD)
				.append(thisVariableSelectorTD).css("height", "20px");
		$(variableSelectorTbody).append(thisVariableSelectorTR);

		// currentModelHashtable.put(this.variableName,
		// thisVariableCoefficientTable);
		counter++;
	});
}

function redrawApplicantPlaygroundGraph(selectedFilters) {
	//console.log(selectedFilters);
	var location = selectedFilters[0].selectorValue;
	var tenure = selectedFilters[1].selectorValue;
	//tenure = tenure.replace(' Days','');

	convertApplicantPlaygroundCoordinates(applicantPlaygroundGraphHashtable
			.get(location + "-" + tenure));

	var variableSelectorThead = $("<thead></thead>").attr("id",
			"variableSelectorThead").css("width", "100%");
	var variableSelectorTable = $("<table></table>").attr("id",
			"variableSelectorTable").css("border", "1px solid #bfbfbf").css(
			"border-collapse", "collapse").html(variableSelectorThead);
	$(variableSelectorTable).append(variableSelectorTbody);

	// variableSelectorThead
	// .html("<tr><th colspan='2'
	// style='text-align:center;height:40px;background-color:#888888;border:1px
	// solid black'><h4><b>Inputs</b></h4></th><tr>");
	variableSelectorThead
			.html("<tr><th style='height:30px;padding-left:10px;border:1px solid #bfbfbf;background-color:#BBBBBB'>Variable Type</th><th style='height:30px;padding-left:10px;border:1px solid #bfbfbf;background-color:#BBBBBB'>Variable</th></tr>");

	if (firstGeneration) {
		redrawApplicantPlaygroundVariables(location, tenure,
				variableSelectorTbody)
		firstGeneration = false;
	}
	windowAspectApplicantPlaygroundGraph = ($(window).width() >= 768) ? "desktop"
			: "mobile";

	var chartContainerWidth = (windowAspectApplicantPlaygroundGraph == "mobile") ? $(
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
	if (windowAspectApplicantPlaygroundGraph == "mobile") {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}

	$("#applicantPlaygroundChartDiv").detach();
	//$("#menuDiv").detach();

	/*var menuDiv = $("<div></div>").attr("id", "menuDiv").css("height", "30px")
			.css("width", chartContainerWidth + 20).attr("class",
					"btn-group-justified");

	var menuItem1 = $('<a class="btn btn-default">Employees</a>').attr('id',
			'employeePlaygroundButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Applicants</a>')
			.attr('id', 'applicantPlaygroundButton');
	menuDiv.append(menuItem1).append(menuItem2);*/

	var mainGraphHeight = chartContainerHeight - 100;

	applicantPlaygroundDiv = $("<div></div>").attr("id",
			"applicantPlaygroundDiv")
			.css("height", chartContainerHeight + "px").css("width",
					chartContainerWidth).css("vertical-align", "middle").css(
					"display", "inline-block").css("margin-top", "0");
	// Attach first, otherwise AmCharts won't work....

	applicantPlaygroundChartTable = $("<table></table>").attr("id",
			"applicantPlaygroundChartTable").css("width", "100%").css("height",
			"100%").css("margin-left", "30px").css("margin-top", "30px");
	$(applicantPlaygroundDiv).html(applicantPlaygroundChartTable);

	applicantPlaygroundChartTbody = $("<tbody></tbody>").attr("id",
			"applicantPlaygroundChartTbody").css("width", "100%").css("height",
			"100%");
	$(applicantPlaygroundChartTbody).html("");
	$(applicantPlaygroundChartTable).append(applicantPlaygroundChartTbody);

	var applicantPlaygroundChartBotTR = $("<tr></tr>").attr("id",
			"applicantPlaygroundChartBotTR").css("height", "80%");
	$(applicantPlaygroundChartTbody).html(applicantPlaygroundChartBotTR);

	var applicantPlaygroundSelectorTD = $("<td></td>").attr("id",
			"applicantPlaygroundSelectorTD").html(variableSelectorTable).css(
			"width", "50%").css("margin-right", "40px").css("vertical-align",
			"top").css("padding-right", "40px");

	var driversTableTD = $("<td></td>").attr("id", "driversTableTD").css(
			"width", "50%").css("margin-right", "40px").css("vertical-align",
			"top").css("padding-right", "40px").css("padding-top", "0px");
	$(driversTableTD).html(driversBox);
	$(applicantPlaygroundChartBotTR).html(applicantPlaygroundSelectorTD);
	// THIS SHOULD PROBABLY BE CHANGED BY TAVIS BC IT IS A QUICK FIX
	// $(variableSelectorTable).css("height", mainGraphHeight + 30 + "px");
	$(variableSelectorTbody).css("overflow-y", "scroll");

	if (windowAspectApplicantPlaygroundGraph == "desktop") {
		var applicantPlaygroundChartTD = $("<td></td>").attr("id",
				"applicantPlaygroundChartTD").css("width", "50%").css(
				"margin-bottom", "30px").css("height","332px");
	} else {
		var applicantPlaygroundChartTD = $("<td></td>").attr("id",
				"applicantPlaygroundChartTD").css("width", "100%").attr(
				"colspan", "2").css("padding-top", "20px");
	}

	applicantPlaygroundChartDiv = $("<div></div>").attr("id",
			"applicantPlaygroundChartDiv").css("height", "95%");

	var applicantPlaygroundChartTitle = $("<div></div>").attr("id",
			"applicantPlaygroundChartTitle").html("<b>Relative Influence</b>").css("text-align","center").css("background-color","#BBBBBB")
			.css("height","30px").css("padding","5px");
	
	
	// try to get graph header here:
	var chartTable = $("<table></table>").attr("id", "chartTable").css(
			"height", "100%").css("border", "1px solid black").css("width",
			"100%");
	var chartHeader = $("<tr></tr>")
			.html(
					"<td style='text-align:center; background-color: #888888;border-bottom: 1px solid #bfbfbf'><h4><b>Tenure Turnover Profile</b></h4></td>")
			.css("height", "40px");
	$(chartTable).html(
			$("<tr></tr>")
					.html($("<td>/td>").html(applicantPlaygroundChartTitle).append(applicantPlaygroundChartDiv)));

	// applicantPlaygroundChartDiv
	$(applicantPlaygroundChartTD).append(chartTable);

	if (windowAspectApplicantPlaygroundGraph == "desktop") {
		$(applicantPlaygroundChartBotTR).append(applicantPlaygroundChartTD);
		$("#display-area-xs").empty();
		//$("#display-area").html(menuDiv);
		$("#display-area").html(applicantPlaygroundDiv);
		$(applicantPlaygroundSelectorTD).css("width",
				($(variableSelectorTbody).width()) + "px");
		$(applicantPlaygroundChartTD).css(
				"width",
				($(applicantPlaygroundChartTable).width() - $(
						variableSelectorTbody).width())
						+ "px");
		$(applicantPlaygroundChartDiv).css(
				"width",
				($(applicantPlaygroundChartTable).width() - $(
						variableSelectorTbody).width())
						+ "px");

	} else {
		var applicantPlaygroundChartSecondTR = $("<tr></tr>");
		$(applicantPlaygroundChartSecondTR).html(applicantPlaygroundChartTD);
		$(applicantPlaygroundChartSecondTR).append("<td></td>");
		$(applicantPlaygroundChartTbody).append(
				applicantPlaygroundChartSecondTR);
		$("#display-area").empty();
		//$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").html(applicantPlaygroundDiv);
		$("#applicantPlaygroundSelectorTD").css("width", "100%");
		$("#applicantPlaygroundChartTD").css("width", "100%");
		$("#applicantPlaygroundChartDiv").css("width", "100%");
		$(variableSelectorTable).css("height", "500px");
		$(variableSelectorTbody).css("height", "500px");
		$(applicantPlaygroundChartDiv).css("height", "450px");

	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

	var predictedTurnover = fetchPredictedTurnoverRate();

	applicantPlaygroundChart = generateApplicantPlaygroundChart(
			"applicantPlaygroundChartDiv", currentModelData.meanOutput,
			predictedTurnover);
	applicantPlaygroundChart.validateData();
	applicantPlaygroundChart.animateAgain();
	redrawSelectorBoxes();
	addApplicantPlaygroundGraphResizeListener();
	enableApplicantPlaygroundGraphSelectors();
	activateApplicantPlaygroundGraphSelectors();

	$('[data-toggle="tooltip"]').tooltip();
}

function categoryColor(category) {
	if(category.localeCompare("Applicant Assessment") == 0) return "#267356";
	if(category.localeCompare("Referrer Information") == 0) return "#2A4E6E";
	if(category.localeCompare("External Labor Market") == 0) return "#5B9632";
	if(category.localeCompare("Demographics") == 0) return "#728DA5";
	if(category.localeCompare("Prior Presence") == 0) return "#1F4B00";
	return "#F2F5F8";
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

function generateApplicantPlaygroundChart(chartDiv, overallMean,
		thisSelectionMean) {

	var chart = AmCharts.makeChart(chartDiv, {
		type : "serial",
		theme : "light",
		dataProvider : chartData,
		// marginLeft : 0,
		// marginRight : 0,
		categoryField : "variable",
		fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
		valueAxes : [ {
			id : "turnoverAxis",
			axisThickness : 2,
			axisAlpha : 1,
			gridAlpha : 0,
			position : "bottom",
			offset : 0,
		} ],
		categoryAxis: {
		"gridThickness": 0,
		labelsEnabled:false,
		"axisAlpha": 0,
		axisThickness:2
		},
		graphs : [ {
			"balloonText": "<b>[[category]]: [[value]]</b>",
		    "fillColorsField": "color",
		    "fillAlphas": 0.9,
		    "lineAlpha": 0.2,
		    "type": "column",
		    "valueField": "influence"
		} ]
	});

	return chart;

}

function disableApplicantPlaygroundGraphSelectors() {
	deactivateTopbarLinks();
	$(".categoryselector").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled", true);
	});
	$(".applicantplaygroundSelect").unbind("change");
	$(".applicantplaygroundSelect").prop("disabled", true);
	$("#employeeModelsButton").prop("disabled",true);

	/* $("#applicantPlaygroundTableButton").prop("disabled",true); */

}

function enableApplicantPlaygroundGraphSelectors() {
	activateTopbarLinks();
	$(".categoryselector").each(function() {
		$(this).prop("disabled", false);
	});
	$(".applicantplaygroundSelect").prop("disabled", false);
	/* $("#applicantPlaygroundTableButton").prop("disabled",false); */
	$("#applicantPlaygroundButton").unbind("click");

	$("#employeeModelsButton").prop("disabled",false);

}

function activateApplicantPlaygroundGraphSelectors() {
	$(".categoryselector").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var predictedTurnover = fetchPredictedTurnoverRate();
			// redrawApplicantPlaygroundGraph($(".applicantplaygroundSelect").val());
			activeSelectors = selectedFilters();
			// console.log("activeSelectors" + JSON.stringify(activeSelectors));
			redrawApplicantPlaygroundGraph(activeSelectors);
		});
	});
	$(".applicantplaygroundSelect").change(function() {
		firstGeneration = true;
		// console.log("applicantplaygroundSelect change" +
		// JSON.stringify(activeSelectors) );
		// redrawApplicantPlaygroundGraph($(".applicantplaygroundSelect").val());
		activeSelectors = selectedFilters();
		redrawApplicantPlaygroundGraph(activeSelectors);

	});
	$("#applicantPlaygroundButton").unbind("click");

	$("#employeeModelsButton").unbind("click");
	$("#employeeModelsButton").click(function() {
		$.ajax({
			type : "GET",
			url : "../resources/js/analytics/employeeplayground.js",
			dataType : "script"
		});
	});
	/*
	 * $("#applicantPlaygroundTableButton").unbind("click");
	 * $("#applicantPlaygroundTableButton").click(function(){ $.ajax({type:
	 * "GET",url: "../resources/js/analytics/robustnesstable.js",dataType:
	 * "script"}); });
	 */
}

function addApplicantPlaygroundGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		// var newModel = $(".applicantplaygroundSelect").val();
		// redrawApplicantPlaygroundGraph(newModel);
		activeSelectors = selectedFilters();
		// console.log("activeSelectors" + JSON.stringify(activeSelectors));
		redrawApplicantPlaygroundGraph(activeSelectors);

		adjustTopbarPadding();
	});
}
