windowAspectLEmpRiskReportsTable = ($(window).width() >= 768) ? "desktop": "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if (lowerBoxesHeight < 730) {
	lowerBoxesHeight = 730;
}
if (lowerBoxesMobileHeight < 500) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height", lowerBoxesHeight + "px").css("padding", "25px");
$("#display-area").css("height", lowerBoxesHeight + "px");
$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

underlineOnlyThisLink("#liveReportLink");

// Show a "loading" animation

deactivateTopbarLinks();
var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Reports</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Panel of employees at various tenure points broken down by TalenTeck turnover risk score categories.</h4>');

var applicantReportButton = $("<button></button>").attr('id','applicantReportButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px");

var employeeRiskButton = $("<button></button>").attr('id','employeeRiskButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px").prop("disabled", true);

var laborMarketChartButton = $("<button></button>").attr('id','laborMarketChartButton').attr('class','btn btn-default btn-block').prop("disabled",true)
.text("Labor Markets").css("margin-bottom","10px").css("padding","10px").prop("disabled",true);

/*var employeeScoreButton = $("<button></button>").attr('id','employeeScoreButton')
.attr('class','btn btn-default btn-block').text("Employee Scores")
.css("margin-bottom","10px").css("padding","10px");*/


var downloadButton = $("<button></button>").attr('id', "downloadButton").attr('class', 'btn btn-default btn-block').text("Download").css("margin-top", "10px").css("padding", "10px").css("background","rgb(2, 149, 93)").css("text-shadow","none");		


$(selectorButtonBox).append(titleDiv).append(titleDescDiv).append(applicantReportButton).append(employeeRiskButton).append(laborMarketChartButton).append(downloadButton);

if (windowAspectLEmpRiskReportsTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
} else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var usedTable = {};
var empriskReportRawTable = {};
var formattedTable = [];
var empriskReportTableHashtable = new Hashtable({
	hashCode : selectionHashCode,
	equals : selectionIsEqual
});
var empriskReportSelectionsHashtable = new Hashtable({
	hashCode : selectionHashCode,
	equals : selectionIsEqual
});
var selectorsEverDrawn = false;
var splitDate, miny, minm, mind, maxy, maxm, maxd;

var ua = navigator.userAgent.toLowerCase();
var isSafari = false;
if (ua.indexOf('safari') != -1) {
	if (ua.indexOf('chrome') > -1) {
		// Chrome
	} else {
		isSafari = true; // Safari
	}
}

refreshEmpRiskReportsTable();

function fetchEmpRiskReportsTable(selectionList) {
	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "employeeriskreporttable",
			selectorlist : JSON.stringify(selectionList)
		},
		dataType : "json",
		success : function(data) {
			//console.log("Table returned:");
			//console.log(data);
			usedTable = data.rows;
			visibleTable = createVisibleEmpRiskReportsTable(usedTable);
			displayVisibleEmpRiskReportsTable(visibleTable);
		}
	});
}

function refreshEmpRiskReportsTable() {
	var empRiskReportsSelectorsReturned = false;
	var empRiskReportsDataReturned = false;
	disableEmpRiskReportsTableSelectors();
	displayTableSpinner(windowAspectLEmpRiskReportsTable);
	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "getemployeeriskselectors"
		},
		dataType : "json",
		success : function(data) {
			selectorList = data.selectorList; 
			redrawEmpRiskReportsSelectorBoxes();
			var selectionList = queryEmpRiskReportsTableSelectorValues();
			fetchEmpRiskReportsTable(selectionList);
		}
	});

}

function redrawEmpRiskReportsSelectorBoxes() {
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		if (this.selectorName === "StartDate") {
			splitDate = $(this.selectorValues)[0].valueName.split("/");
			miny = parseInt(splitDate[2]);
			minm = parseInt(splitDate[0]);
			mind = parseInt(splitDate[1]);
		}
		if (this.selectorName === "EndDate") {
			splitDate = $(this.selectorValues)[0].valueName.split("/");
			maxy = parseInt(splitDate[2]);
			maxm = parseInt(splitDate[0]);
			maxd = parseInt(splitDate[1]);
		}
	});

	var dateTitleDiv = $("<div></div>").attr("id", "dateTitleDiv").css(
			"background-color", "#44494C").css("color", "#FFFFFF").css(
			"margin-bottom", "10px");//.html('<b>Select Dates</b>');
	activeSelectorsList.push(dateTitleDiv);

	$(selectorList).each(function() {
		var selectorName = this.selectorName;
		if (this.selectorName === "StartDate"){
			var thisSelector = $("<input></input>").attr("id",this.selectorName).attr("class","form-control empRiskReportsTableSelect").attr("width", "300px").val("Start Date: 05/01/2016").attr("readonly", "true");
		}
		else if(this.selectorName === "EndDate") {
			var thisSelector = $("<input></input>").attr("id",this.selectorName).attr("class","form-control empRiskReportsTableSelect").attr("width", "300px").val($(this.selectorValues)[0].valueLabel).attr("readonly", "true");
		} else {
			var selectorName = this.selectorName;
			var thisSelector = $("<select></select>").attr("id", this.selectorName).attr("class","form-control empRiskReportsTableSelect").attr("width", "300px").attr("defaultValue", this.defaultValue);

			var i = 0;
			$(this.selectorValues).each(function() {
				if (i == 0 && selectorName!="Tenure") {
					var thisValue = $("<option></option>").attr("value",this.valueName).text(selectorName+ ": "+ this.valueLabel);
					$(thisSelector).data('pre',this.valueName);
				} else if(selectorName=="Tenure" && this.valueName=="90"){
					var thisValue = $("<option></option>").attr("value",this.valueName).text(selectorName+ ": "+ this.valueLabel);
	    			$(thisValue).attr("selected","selected");
					$(thisSelector).data('pre',this.valueName);
				}
				else {
					var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
				}
				$(thisSelector).append(thisValue);
				i++;
			});
		}
		activeSelectorsList.push(thisSelector);
		if (this.selectorName === "EndDate") {
			var filterTitleDiv = $("<div></div>").attr("id","filterTitle	Div").css("background-color","#44494C").css("color", "#FFFFFF").css("margin-top", "10px").css("margin-bottom","10px");//.html('<b>Select Filters</b>');
			activeSelectorsList.push(filterTitleDiv);
		}
	});

	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var applicantReportButtonDetached = $("#applicantReportButton").detach();
	var employeeRiskButtonDetached = $("#employeeRiskButton").detach();
	var laborMarketChartButtonDetached = $("#laborMarketChartButton").detach();
	//var employeeRiskReportsButtonDetached = $("#empRiskReportsButton").detach();
	//var employeeScoreButtonDetached = $("#empScoreButton").detach();
	var downloadButtonDetached = $("#downloadButton").detach();

	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantReportButtonDetached);
	$(selectorButtonBox).append(employeeRiskButtonDetached);
	$(selectorButtonBox).append(laborMarketChartButtonDetached);	
	$(selectorButtonBox).append(downloadButtonDetached);

	$.each(activeSelectorsList, function() {
		$(selectorButtonBox).append(this);
	});
}

function queryEmpRiskReportsTableSelectorValues() {
	var selectionList = [];
	$(".empRiskReportsTableSelect").each(
			function() {
				var thisSelection = {selectorName : $(this).attr("id"),selectorValue : ($(this).attr("id") === "StartDate") ? $(this).val().toString().substring(12) : ($(this).attr("id") === "EndDate") ? $(this).val().toString().substring(10) : $(this).val()};
				selectionList.push(thisSelection);
			});
	return selectionList;
}

function createVisibleEmpRiskReportsTable(tableData) {
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectLEmpRiskReportsTable == "mobile") {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectLEmpRiskReportsTable == "mobile") ? $(window).width(): $(window).width() - 250;
	if (tableContainerWidth < 450 && windowAspectLEmpRiskReportsTable != "mobile") {
		tableContainerWidth = 450;
	}
	var tableWidth = 6 * Math.floor((tableContainerWidth - 60) / 6);
	var columnWidth = tableWidth < 680 ? Math.floor((tableWidth - 170) / 7) : Math.floor((tableWidth - 220) / 7);
	var firstColumnWidth = tableWidth < 680 ? 100 : 110;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max((columnWidth - 50) / 2, 5);

	var rowLabels = [ "Employees", "Eligible Employees","Predicted Turnover", "Actual Turnover" ];
	var narrowRowLabels = [ "Employees", "Elgbl Emps","Pdtcd Turnover", "Act Turnover" ];
	var superNarrowRowLabels = [ "Emps", "ElEmps","PTurnover", "ATurnover" ];
	var visibleTable = $("<table></table>").attr("id", "empRiskReportsTable").css("width", tableWidth).css("padding-left", "0px").css("padding-right", "0px");
	var visibleThead = $("<thead></thead>").attr("id", "empRiskReportsThead").css("width", tableWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id", "empRiskReportsTbody").css("width", tableWidth);

	var titleRow = $("<tr></tr>").attr("id", "titleRow").css("width",tableWidth);

	var headerRightPadding = 10;
	if (tableWidth < 680) {
		var headerRightPadding = 10;
		var riskTH = $("<th></th>").html("Risk").attr("data-sorter","false").attr("id", "riskTH").css("width", "1px").css("background-color", "#AAAAAA")
		.attr("class", "empRiskReportsContentTD").css("text-align","left"); 
		var quantileTH = $("<th></th>").html("TT Group").attr("class", "empRiskReportsContentTD").css("text-align","left").attr("data-sorter", "false").attr("id", "quantileTH").css("width", firstColumnWidth).css("background-color", "#AAAAAA");//.css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var employeesTH = $("<th></th>").html(superNarrowRowLabels[0]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "employeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var eligibleemployeesTH = $("<th></th>").html(superNarrowRowLabels[1]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "eligibleemployeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var pturnoverTH = $("<th></th>").html(superNarrowRowLabels[2]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "pturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var aturnoverTH = $("<th></th>").html(superNarrowRowLabels[3]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "aturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
	} else if (tableWidth < 850) {		
		var headerRightPadding = 10; // Math.max((columnWidth-150)/2,5);
		var riskTH = $("<th></th>").html("Risk").attr("data-sorter","false").attr("id", "riskTH").css("width", "1px").css("background-color", "#AAAAAA")
		.attr("class", "empRiskReportsContentTD").css("text-align","left"); 
		var quantileTH = $("<th></th>").html("TT Score Group").attr("class","empRiskReportsContentTD").css("text-align","left").attr("data-sorter", "false").attr("id", "quantileTH").css("width", firstColumnWidth).css("background-color", "#AAAAAA");//.css("padding-left", "10px").css("padding-right",headerRightPadding + "px");
		var employeesTH = $("<th></th>").html(narrowRowLabels[0]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "employeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var eligibleemployeesTH = $("<th></th>").html(narrowRowLabels[1]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "eligibleemployeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var pturnoverTH = $("<th></th>").html(narrowRowLabels[2]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "pturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var aturnoverTH = $("<th></th>").html(narrowRowLabels[3]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "aturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
	} else {
		var riskTH = $("<th></th>").html("Risk").attr("data-sorter","false").attr("id", "riskTH").css("width", "1px").css("background-color", "#AAAAAA")
		.attr("class", "empRiskReportsContentTD").css("text-align","left"); 
		var quantileTH = $("<th></th>").html("TT Score Group").attr("class","empRiskReportsContentTD").css("text-align","left").attr("data-sorter", "false").attr("id", "quantileTH").css("width", firstColumnWidth).css("background-color", "#AAAAAA");//.css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var employeesTH = $("<th></th>").html(rowLabels[0]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "employeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var eligibleemployeesTH = $("<th></th>").html(rowLabels[1]).attr("class", "empRiskReportsRowLabelTD").attr("data-sorter","false").attr("id", "eligibleemployeesTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var pturnoverTH = $("<th></th>").html(rowLabels[2]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "pturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
		var aturnoverTH = $("<th></th>").html(rowLabels[3]).attr("class","empRiskReportsRowLabelTD").attr("data-sorter", "false").attr("id", "aturnoverTH").css("width", columnWidth).css("background-color", "#AAAAAA").css("padding-left", "10px").css("padding-right", headerRightPadding + "px");
	}

	$(titleRow).append(riskTH).append(quantileTH).append(employeesTH).append(eligibleemployeesTH).append(pturnoverTH).append(aturnoverTH);
	$(visibleThead).append(titleRow);

	var maxEmployees = 0;
	var maxpredictedTurnover = 0;
	var maxactualTurnover = 0;
	var totalQuantiles = 0;

	$(tableData).each(
			function(index) {
				if (this.applied > maxEmployees) {
					maxEmployees = this.employees;
				}
				if (this.interviewed > maxpredictedTurnover) {
					maxpredictedTurnover = this.predictedTurnover;
				}
				if (this.offered > maxactualTurnover) {
					maxactualTurnover = this.actualTurnover;
				}
				if (!isNaN(parseFloat(this.quantileNumber))
						&& isFinite(this.quantileNumber)
						&& this.quantileNumber != 0) {
					totalQuantiles++;
				}
			});
	var employeesRightPadding = Math.max((columnWidth - (Math.floor(Math.log10(maxEmployees))) * 10) / 2, 5);
	var pturnoverRightPadding = Math.max((columnWidth- Math.floor(Math.log10(maxpredictedTurnover) + 2) * 10 + 15) / 2,5);
	var aturnoverRightPadding = Math.max((columnWidth - Math.floor(Math.log10(maxactualTurnover)) * 10) / 2, 5);

	var firstBlankDrawn = false;
	$(tableData).each(function(index) {
		if (this.quantileNumber != 0) {
			var quantileLabel = (this.quantileNumber == 1) ? "Lowest Turnover" : (!isNaN(parseFloat(this.quantileNumber)) && isFinite(this.quantileNumber) && this.quantileNumber > 1 && this.quantileNumber < totalQuantiles) ? "": (this.quantileNumber == totalQuantiles) ? "Highest Turnover": this.quantileNumber;
			var firstColumnBackgroundColor = "#ffffff";
			var dataBackgroundColor = "#ffffff";
			if (this.quantileNumber === "Total") {
				firstColumnBackgroundColor = "#f5f5f5";
				dataBackgroundColor = "#f5f5f5";
			}
			var turnover;
			if (this.turnover % 1 == 0) {
				turnover = this.turnover + ".0";
			} else {
				turnover = this.turnover;
			}

			var thisRow = $("<tr></tr>").css("height", "25px").css("width", tbodyWidth).css("background-color", "#ffffff").css("text-align","left").css("padding-top", "5px").css("padding-bottom", "5px");
			
			var riskTD = $("<td></td>").css("width","1px").css("background",this.quantileNumber === "Total"?"#f5f5f5":"#ffffff")
			.css("border-bottom",(this.quantileNumber=="1"||this.quantileNumber === "Total")?"#ccc 1px solid":"0px").css("border-top",this.quantileNumber=="4"?"#ccc 1px solid":"0px");
			
			var riskDiv =$("<div></div>").attr("class","circle").css("width","20px").css("height","20px");
			riskTD.append(riskDiv);
			$(riskDiv).css("background",this.quantileNumber=="1"?"#02955D":this.quantileNumber=="2"?"#f9f948":this.quantileNumber=="3"?"#E87506":this.quantileNumber=="4"?"#C00003":"#f5f5f5");
			
			//$(riskTD).css("border-bottom","#ccc 1px solid");
			$(thisRow).append(riskTD);

			
			if (quantileLabel == "Highest Turnover") {
				$(thisRow).css("border-bottom","5px #eeeeee solid").css("text-align","left");
			}
			var titleTD = $("<td></td>").text(quantileLabel).attr("class", "empRiskReportsContentTD").css("width", firstColumnWidth).css("background-color",firstColumnBackgroundColor).css("padding-top", "5px").css("padding-bottom", "5px").css("padding-left", "10px").css("padding-right", "10px");
			if (quantileLabel === "" && !firstBlankDrawn) {
				$(titleTD).attr("rowspan", (totalQuantiles - 2)).attr("id", "arrowBox").html(downwardArrow("31px")).css("vertical-align", "middle");
			}
			
			var employeesTD = $("<td></td>").text(addCommas(this.employees)).attr("class","empRiskReportsRowLabelTD").css("width",columnWidth).css("background-color",dataBackgroundColor).css("padding-top", "5px").css("padding-bottom", "5px").css("padding-left", rightPadding + "px").css("padding-right",employeesRightPadding + "px");
			var eligibleemployeesTD = $("<td></td>").text(addCommas(this.eligibleemployees)).attr("class","empRiskReportsRowLabelTD").css("width",columnWidth).css("background-color",dataBackgroundColor).css("padding-top", "5px").css("padding-bottom", "5px").css("padding-left", rightPadding + "px").css("padding-right",employeesRightPadding + "px");
			var predictedTurnoverTD = $("<td></td>").text(addCommas(this.predictedTurnover) + "%").attr("class", "empRiskReportsRowLabelTD").css("width", columnWidth).css("background-color",dataBackgroundColor).css("padding-top", "5px").css("padding-bottom", "5px").css("padding-left", rightPadding + "px").css("padding-right",pturnoverRightPadding + "px");
			var actualTurnoverTD = $("<td></td>").text(addCommas(this.actualTurnover) + "%").attr("class", "empRiskReportsRowLabelTD").css("width", columnWidth).css("background-color", dataBackgroundColor).css("padding-top", "5px").css("padding-bottom", "5px").css("padding-left", rightPadding + "px").css("padding-right",aturnoverRightPadding + "px");
			if (quantileLabel !== "" || !firstBlankDrawn) {
				$(thisRow).append(titleTD);
			}
			$(thisRow).append(employeesTD).append(eligibleemployeesTD).append(predictedTurnoverTD).append(actualTurnoverTD)
			$(visibleTbody).append(thisRow);

			if (quantileLabel === "" && !firstBlankDrawn) {
				firstBlankDrawn = true;
			}
			}
		});

	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	if (isSafari) {
		deliveryOption = "popup";
	} else {
		deliveryOption = "download";
	}
	
	$(visibleTable).tablesorter({
		widgets : [ 'output' ],
		widgetOptions : {
			output_saveFileName : "employeeriskreport.csv",
			output_delivery : deliveryOption,
			output_hiddenColumns : true
		}
	});

	return visibleTable;

}

function displayVisibleEmpRiskReportsTable(visibleTable) {
	windowAspectLEmpRiskReportsTable = ($(window).width() >= 768) ? "desktop": "mobile";

	var tableContainerWidth = (windowAspectLEmpRiskReportsTable == "mobile") ? $(window).width(): $(window).width() - 250;
	if (tableContainerWidth < 450 && windowAspectLEmpRiskReportsTable != "mobile") {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	if (displayAreaHeight < 730) {
		displayAreaHeight = 730;
	}
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;

	empRiskReportsTableDiv = $("<div></div>").attr("id","empRiskReportsTableDiv").css("height", tableContainerHeight).css("width", tableContainerWidth + "px").css("vertical-align", "middle").css("display", "inline-block").css("margin-top", "30px").css("margin-left", "25px").css("margin-right", "25px");

	var menuDiv = $("<div></div>").attr("id", "menuDiv").css("height", "30px").attr("class", "btn-group-justified");

	var menuItem1 = $('<a class="btn btn-default disabled">Report</a>').attr('id', 'empRiskReportsButton');
	var menuItem2 = $('<a class="btn btn-default ">Scores</a>').attr('id','empScoreButton');
	menuDiv.append(menuItem1).append(menuItem2);

	if (windowAspectLEmpRiskReportsTable == "desktop") {
		var displayWidth = $(window).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width", displayWidth);
		 $("#display-area").html(menuDiv);
		$("#display-area").append(empRiskReportsTableDiv).css("width",
				displayWidth).css("height", displayAreaHeight);
		$("#leftbar-div").css("height", displayAreaHeight);
	} else {
		var displayWidth = $(window).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width", displayWidth);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(empRiskReportsTableDiv).css("width",
				displayWidth);
		$("#display-area-xs").css("height", displayAreaMobileHeight);
		$("#empRiskReportsTableDiv").css("height", tableContainerMobileHeight);
	}

	$(empRiskReportsTableDiv).html(visibleTable);
	$("#arrowBox").html($("#arrowBox").html());
	// redrawEmpRiskReportsSelectorBoxes();
	addempRiskReportsTableResizeListener();
	enableempRiskReportsTableSelectors();
	activateempRiskReportsTableSelectors();

}

function objSelectionIsEqual(obj1, obj2) {
	var isEqual = true;
	$(selectorList).each(function() {
		if (obj1[this.selectorName] !== obj2[this.selectorName]) {
			isEqual = false;
		}
	});
	return isEqual;
}

function selectionIsEqual(selection1, selection2) {
	if (selection1.length != selection2.length) {
		return false;
	}
	$(selection1).each(function() {
		var foundSelector = false;
		var checkSelectorName = this.selectorName;
		var checkSelectorValue = this.selectorValue;
		$(selection2).each(function() {
			if (checkSelectorName === this.selectorName) {
				if (checkSelectorValue !== this.selectorValue) {
					return false;
				}
				foundSelector = true;
			}
		});
		if (foundSelector == false) {
			return false;
		}
	});
	return true;
}

function selectionHashCode(selection) {
	return JSON.stringify(selection);
}

function disableEmpRiskReportsTableSelectors() {
	deactivateTopbarLinks();
	$(".empRiskReportsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled", true);
	});

	$("#applicantReportButton").prop("disabled",true);
	$("#employeeScoreButton").prop("disabled",true);
	$("#laborMarketChartButton").prop("disabled",true);
	$("#downloadButton").prop("disabled",true);
	$("#empScoreButton").prop("disabled",true);

}

function enableempRiskReportsTableSelectors() {
	activateTopbarLinks();
	$(".empRiskReportsTableSelect").each(function() {
		$(this).prop("disabled", false);
	});
	
	if(appReportUser  == "true"){
		$("#applicantReportButton").prop("disabled",false);
	}

	if(laborMarketUser   == "true"){
		$("#laborMarketChartButton").prop("disabled",false);
	}
	
	if(empScoreUser   == "true"){
		$("#empScoreButton").prop("disabled",false);
	}

	//$("#downloadButton").prop("disabled",false);
}

function activateempRiskReportsTableSelectors() {
	$(".empRiskReportsTableSelect").each(function() {
		$(this).unbind("change");

		$(this).change(function() {
			if ($("#StartDate").val().substring(0, 5) !== "Start") {
				var oldStartDate = $("#StartDate").val();
				$("#StartDate").val("Start Date: "+ oldStartDate);
			}
			if ($("#EndDate").val().substring(0, 3) !== "End") {
				var oldEndDate = $("#EndDate").val();
				$("#EndDate").val("End Date: "+ oldEndDate);
			}
			if (this.id == 'Location'|| this.id == 'Tenure') {
				$('#'+ this.id+ ' option:selected').text(this.id+ ": "+ $("#"+ this.id).val());
				var before_change = $("#" + this.id).data('pre');// get the pre data
				$('#'+ this.id+ ' option[value='+ before_change+ ']').text(before_change);
				$('#' + this.id).data('pre',$("#" + this.id).val());
			}

			disableEmpRiskReportsTableSelectors()
			var selectionList = queryEmpRiskReportsTableSelectorValues();
			$("#empRiskReportsTableDiv").detach();
			displayTableSpinner(windowAspectLEmpRiskReportsTable);
			fetchEmpRiskReportsTable(selectionList);
		});
	});
	$("#EndDate").datepicker({
		changeMonth : true,
		changeYear : true,
		defaultDate : new Date(maxy, maxm - 1, maxd),
		minDate : new Date(miny, minm - 1, mind),
		maxDate : new Date(maxy, maxm - 1, maxd)
	});
	$("#StartDate").datepicker({
		changeMonth : true,
		changeYear : true,
		defaultDate : new Date(2016, 4, 1),
		//defaultDate : new Date(miny, minm - 1, mind),
		minDate : new Date(miny, minm - 1, mind),
		maxDate : new Date(maxy, maxm - 1, maxd)
	});
	
	$("#applicantReportButton").unbind("click");
	$("#applicantReportButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
	});
	$("#laborMarketChartButton").unbind("click");
	$("#laborMarketChartButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
	});
	$("#empScoreButton").unbind("click");
	$("#empScoreButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
	});	
	$("#downloadButton").unbind("click");
	$("#downloadButton").click(function() {
		$("#empRiskReportsTable").trigger('outputTable');
	});
}

function addempRiskReportsTableResizeListener() {
	$(window).off("resize");
	$(window)
			.resize(
					function() {
						var newWindowAspect = ($(window).width() >= 768) ? "desktop": "mobile";
						//console.log(windowAspectLEmpRiskReportsTable+ " and new is " + newWindowAspect + "</p>");

						if (windowAspectLEmpRiskReportsTable == "desktop" && newWindowAspect == "mobile") {
							//console.log("<p>Resizing to mobile</p>");
							var menuHolder = $("#menuDiv").detach();
							$("#display-area-xs").html(menuHolder);
							var empRiskReportsTableHolder = $("#empRiskReportsTableDiv").detach();
							$("#display-area-xs").append(empRiskReportsTableHolder);
							$("#leftbar-div-xs").html(selectorButtonBox);
							windowAspectLEmpRiskReportsTable = "mobile";
						}
						if (windowAspectLEmpRiskReportsTable != "desktop" && newWindowAspect == "desktop") {
							//console.log("<p>Resizing to desktop</p>");
							var menuHolder = $("#menuDiv").detach();
							$("#display-area-xs").html(menuHolder);
							var empRiskReportsTableHolder = $("#empRiskReportsTableDiv").detach();
							$("#display-area").append(empRiskReportsTableHolder);
							$("#leftbar-div").html(selectorButtonBox);
							windowAspectLEmpRiskReportsTable = "desktop";
						}

						var tableContainerWidth = (windowAspectLEmpRiskReportsTable == "mobile") ? $(window).width(): $(window).width() - 250;
						if (tableContainerWidth < 450 && windowAspectLEmpRiskReportsTable != "mobile") {
							tableContainerWidth = 450;
						}
						var tableContainerHeight = $(window).height() - 121;
						var displayAreaHeight = $(window).height() - 51;
						if (displayAreaHeight < 730) {
							displayAreaHeight = 730;
						}
						var displayAreaMobileHeight = 500;
						var tableContainerMobileHeight = 450;
						tableContainerHeight = tableContainerHeight + "px";
						tableContainerMobileHeight = tableContainerMobileHeight+ "px";
						displayAreaHeight = displayAreaHeight + "px";
						displayAreaMobileHeight = displayAreaMobileHeight+ "px";

						var displayWidth = (windowAspectLEmpRiskReportsTable == "mobile") ? $(window).width(): $(window).width() - 225;
						displayWidth = displayWidth + "px";
						$("#display-area").css("width", displayWidth);
						tableContainerWidth = tableContainerWidth + "px";
						$("#empRiskReportsTableDiv").css("width",tableContainerWidth);
						var selectionList = queryEmpRiskReportsTableSelectorValues();
						// var usedTable =
						// empriskReportTableHashtable.get(selectionList);
						//console.log("usedTable:");
						//console.log(usedTable);
						if (usedTable != null) {
							visibleTable = createVisibleEmpRiskReportsTable(usedTable);
						}
						$("#empRiskReportsTableDiv").html(visibleTable);

						if (windowAspectLEmpRiskReportsTable == "desktop") {
							var displayWidth = $(window).width() - 225;
							displayWidth = displayWidth + "px";
							$("#menuDiv").css("width", displayWidth);
							$("#display-area").css("width", displayWidth).css("height", displayAreaHeight);
							$("#leftbar-div").css("height", displayAreaHeight);
							$("#empRiskReportsTableDiv").css("height",tableContainerHeight);
						} else {
							var displayWidth = $(window).width();
							displayWidth = displayWidth + "px";
							$("#menuDiv").css("width", displayWidth);
							$("#display-area-xs").css("width", displayWidth);
							$("#display-area-xs").css("height",displayAreaMobileHeight);
							$("#empRiskReportsTableDiv").css("height",tableContainerMobileHeight);
						}
						$("#arrowBox").html($("#arrowBox").html());

						adjustTopbarPadding();

					});
}

function liveReportsCellColor(tstat) {
	if (tstat < -2.576) {
		return "#cccccc";
	}
	if (tstat < -1.96) {
		return "#dddddd";
	}
	if (tstat < -1.645) {
		return "eeeeee";
	}
	if (tstat > 2.576) {
		return "#ff9999";
	}
	if (tstat > 1.96) {
		return "#ffbbbb";
	}
	if (tstat > 1.645) {
		return "#ffdddd";
	}

	return "#ffffff";
}

function drawCalendar(start, end) {
	calendar.set("date");
}

function downwardArrow(arrowHeight) {
	var arrow = $("<svg></svg>").attr("version", "1.1").attr("x", "0").attr("y", "0").attr("height", arrowHeight).attr("viewBox", "0, 0, 100, 50").attr("preserveAspectRatio", "none").css("width", "20%").css('margin-left','50px');
	$(arrow).html('<g>'+ '<path d="M 25,0 L 75,0 L 75,30 L 100,30 L 50,50 L 0,30 L 25,30 L 25,0 Z" fill="#dddddd"/>'+ '</g>');
	return arrow;
}