var windowAspectMarketsTable = "";
windowAspectMarketsTable = ($(window).width() >= 768) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if (lowerBoxesHeight < 676) {
	lowerBoxesHeight = 676;
}
if (lowerBoxesMobileHeight < 500) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height", lowerBoxesHeight + "px");
$("#display-area").css("height", lowerBoxesHeight + "px");
$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

underlineOnlyThisLink("#marketsLink");

console.log("Clicked");
// Show a "loading" animation

deactivateTopbarLinks();
displayTableSpinner(windowAspectMarketsTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');

var titleDiv = $("<div></div>")
		.attr("id", "titleDiv")
		.css("padding", "15px")
		.css("background-color", "#44494C")
		.css("margin-top", "0px")
		.css("color", "#FFFFFF")
		.css("margin-bottom", "10px")
		.html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Labor Markets</h2>');
//$(selectorButtonBox).append(titleDiv);
var titleDescDiv = $("<div></div>")
.attr("id", "titleDescDiv")
.css("padding-top", "15px")
.css("background-color", "#44494C")
.css("margin-top", "0px")
.css("color", "#FFFFFF")
.css("margin-bottom", "10px")
.html('<h4  style="font-weight: lighter;">Local labor market characteristics that drive the number of applicants and good and bad hires. Identifying the markets for talent opportunity and a springboard for potential recruitment strategy</h4>');

if ( linksTable.containsKey("markets") &&  linksTable.get("markets") === true  ) {
	var laborMarketButton = $("<button></button>").attr('id','laborMarketButton').attr('class','btn btn-default btn-block').prop("disabled",true)
	.text("Local Labor Market").css("margin-bottom","10px").css("padding","10px");
}

var applicantButton = $("<button></button>").attr('id','applicantButton').attr('class','btn btn-default btn-block')
.text("Applicants And Hires").css("margin-bottom","10px").css("padding","10px");

var top25Button = $("<button></button>").attr('id', 'top25Button').attr(
		'class', 'btn btn-default').text("Top 25 Zips/All Zips").css(
		"margin-bottom", "10px").css("padding","10px 38px 10px 38px");

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(laborMarketButton);
$(selectorButtonBox).append(applicantButton);


$(selectorButtonBox).append(top25Button);
$(selectorButtonBox).append(titleDescDiv);

if (windowAspectMarketsTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
} else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableMarketsTableSelectors();

var selectorList = [];
var marketsRawTable = {};
var formattedTable = [];
var defaultSelectorName = "";
var defaultSelectorValue = "";
var selectorsEverDrawn = false;
var marketsTableHashtable = new Hashtable({hashCode : selectionHashCode,equals : selectionIsEqual});
var modelVariablesHashtable = new Hashtable();
var thisSelectionTable = [];
var selectorListReturned = false;
var tableReturned = false;
var top25 = true;

queryMarketsTableSelectors();

function queryMarketsTableSelectors() {
	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "getselectorsmarkets"
		},
		dataType : "json",
		success : function(data) {
			console.log("check point1");
			selectorList = data.selectorList;
			defaultSelectorName = data.defaultSelectorName;
			defaultSelectorValue = data.defaultSelectorValue;
			selectorListReturned = true;
			if (tableReturned) {
				redrawMarketsTableSelectorBoxes();
				console.log("Selection LIST:");
				var selectionList = queryMarketsSelectorValues();
				console.log(JSON.stringify(selectionList));
				refreshMarketsTable(queryMarketsSelectorValues());
			}
		}
	});

	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "marketstable",
			selectorlist : selectorList,
		},
		dataType : "json",
		success : function(data) {
			marketsRawTable = data.rows;
			console.log("marketstable data::" + JSON.stringify(data));
			$.each(marketsRawTable, function() {
				marketsTableHashtable.put(this.selectorValues, this.postalCodes);
			});
			tableReturned = true;
			if (selectorListReturned) {
				redrawMarketsTableSelectorBoxes();
				var selectionList = queryMarketsSelectorValues();
				refreshMarketsTable(queryMarketsSelectorValues());
			}
		}
	});

}

function redrawMarketsTableSelectorBoxes() {
	//console.log(linksTable.entries());
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		var defaultFound = false;
			var allSelected = false;
			if (this.selectorName != "Map") {
				if (selectorsEverDrawn) {
					var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
				} else {
					if (this.selectorName == defaultSelectorName) {
						var usedDefaultValue = defaultSelectorValue;
					} else {
						var usedDefaultValue = this.defaultValue;
						}
					}
				var thisSelector = $("<select></select>").attr("id", this.selectorName).attr("class","form-control marketsTableSelect").attr("width", "200px").attr("defaultValue",usedDefaultValue);
				if (this.selectorName == defaultSelectorName) {
					var defaultValueHolder = defaultSelectorValue;
				} else {
					var defaultValueHolder = this.defaultValue;
					}
				var checkedSelectorName = this.selectorName;
				$(this.selectorValues).each(function() {
					var checkedSelectorValue = this.valueName;
					if (selectorsEverDrawn) {	
						thisSelection = [];
						$(selectorList).each(function() {
							if (this.selectorName != checkedSelectorName) {
								thisSelection.push({selectorName : this.selectorName,selectorValue : $("#"+ this.selectorName+ " option:selected").val()});
							} else {
								thisSelection.push({selectorName : checkedSelectorName,selectorValue : checkedSelectorValue});
							}
						});
					//console.log("checkedHashEntry:"+ JSON.stringify(thisSelection));
					var checkedHashEntry = marketsTableHashtable.get(thisSelection);
					//console.log("checkedHashEntry:"+ checkedHashEntry);
					// if ( checkedHashEntry !=null ) {
						//console.log("Found "+ JSON.stringify(thisSelection))
					var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
					if (this.valueLabel.substring(0, 6) === "Select") {
						$(thisValue).attr("disabled",true);
					}
					if (defaultFound === false && checkedSelectorValue == usedDefaultValue && this.valueLabel.substring(0,6) !== "Select") {
						$(thisValue).attr("selected","selected");
						$(thisValue).prop("selected",true);
						defaultFound = true;
						//console.log("Checked off "+ this.valueLabel+ "with no allSelected");
					}
					$(thisSelector).append(thisValue);
				} else {
					var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
					if (this.valueLabel.substring(0, 6) === "Select") {
						$(thisValue).attr("disabled",true);
						$(thisValue).prop("selected",false);
					}
					//console.log("this.valueName == usedDefaultValue"+ this.valueName+ usedDefaultValue);
					if (this.valueName == usedDefaultValue) {
						$(thisValue).attr("selected","selected");
						$(thisValue).prop("selected",true);
					}
					$(thisSelector).append(thisValue);
				}
			});
			//console.log("Pushing " + this.selectorName);
			activeSelectorsList.push(thisSelector);
		}
});

	
var titleDivDetached = $("#titleDiv").detach();
var titleDescDivDetached = $("#titleDescDiv").detach();
var laborMarketButtonDetached = $("#laborMarketButton").detach();
var applicantButtonDetached = $("#applicantButton").detach();
var top25ButtonDetached = $("#top25Button").detach();

if (linksTable.containsKey("reports") && linksTable.get("reports") === true) {
	var reportsTableButtonDetached = $("#reportsTableButton").detach();
}
$(selectorButtonBox).html(titleDivDetached);
$(selectorButtonBox).append(laborMarketButtonDetached);
$(selectorButtonBox).append(applicantButtonDetached);
$(selectorButtonBox).append(top25ButtonDetached);

$.each(activeSelectorsList, function() {
	$(selectorButtonBox).append(this);
});

selectorsEverDrawn = true;
$(selectorButtonBox).append(titleDescDivDetached);

console.log(JSON.stringify(activeSelectorsList));
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

function refreshMarketsTable(selectorList) {
	console.log("Pulling " + selectorList);
	var model = selectorList[0];
	var location = selectorList.splice(0, 1);
	thisSelectionTable = marketsTableHashtable.get(selectorList);
	console.log("Got  " + thisSelectionTable);
	redrawMarketsTable(model.selectorValue);

}

function queryMarketsSelectorValues() {
	// We've gotten rid of the time period selector, so we need to add it here.
	// var selectionList = [ {selectorName : "periodName" , selectorValue :
	// "All" } ];
	var selectionList = [];
	$(".marketsTableSelect").each(function() {
		var selector = "#" + $(this).attr("id") + " option:selected";
		var thisSelection = {
			selectorName : $(this).attr("id"),
			selectorValue : $(selector).val()
		};
		selectionList.push(thisSelection);
	});

	return selectionList;
}

function disableMarketsTableSelectors() {
	deactivateTopbarLinks();
	$(".marketsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled", true);
	});

	$("#applicantButton").unbind();
	$("#marketsTableButton").unbind();
	$("#marketsGraphButton").unbind();
	
	$("#top25Button").unbind();


	$("#applicantButton").prop("disabled", true);
	$("#marketsGraphButton").prop("disabled", true);	
	$("#top25Button").prop("disabled", true);
}

function enableMarketsTableSelectors() {
	activateTopbarLinks();
	$(".marketsTableSelect").each(function() {
		$(this).prop("disabled", false);
	});

	$("#applicantButton").prop("disabled", false);
	$("#marketsGraphButton").prop("disabled", false);
	$("#top25Button").prop("disabled", false);
}

function activateMarketsTableSelectors() {
	$(".marketsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var selectorList = queryMarketsSelectorValues();
			refreshMarketsTable(selectorList);
		});
	});

	
	$("#applicantButton").unbind("click");
	$("#applicantButton").click(function() {
		$.ajax({
			type : "GET",
			url : "../resources/js/analytics/applicanttable.js",
			dataType : "script"
		});
	});
	
	$("#marketsTableButton").unbind("click");

	$("#marketsGraphButton").unbind("click");
	$("#marketsGraphButton").click(function() {
		$.ajax({
			type : "GET",
			url : "../resources/js/analytics/marketsgraph.js",
			dataType : "script"
		});
	});
	
	$("#top25Button").unbind("click");
	$("#top25Button").click(function() {
		top25 = !top25;
		//console.log("Changed top 25 to " + top25);
		var selectorList = queryMarketsSelectorValues();
		refreshMarketsTable(selectorList);
	});
}

function redrawMarketsTable(model) {
	$("#menuDiv").detach();

	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").css("width","100%").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default ">Map</a>').attr('id','marketsGraphButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Table</a>').attr('id','marketsTableButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	var downloadDiv=$("<div></div>").attr("id","downloadDiv");
	var download = $('<a class="btn btn-default ">download</a>').attr('href',ExportHTMLTableToExcel());
	downloadDiv.html(download);
			
	marketsTableDiv = $("<div></div>").attr("id", "marketsTableDiv").css("vertical-align", "middle").css("display", "inline-block")
			.css("margin-left", "25px").css("margin-right", "25px").css("width", "100%").css("background-color", "#F2F5F8");

	var tableContainerHeight = $(window).height() - 65;
	if (windowAspectMarketsTable == "mobile") {
		tableContainerHeight = 500;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectMarketsTable == "mobile") ? $(window).width(): $(window).width() - 300;
	if (tableContainerWidth < 515) {
		tableContainerWidth = 515;
	}

	tableWidth = tableContainerWidth;

	if (tableWidth < 1650) {
		tableWidth = 1650;
	}
	var dataColumnWidth = tableWidth <= 1650 ? 110 : 110 + Math.floor((tableWidth - 1650) / 15);
	var tableScrollWidth = tableWidth - dataColumnWidth < 1540 ? 1540: tableWidth - dataColumnWidth > 2080 ? 2080 : tableWidth- dataColumnWidth;
	var minColumnWidth = 110;

	marketsTableDiv.css("width", tableContainerWidth);

	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if (lowerBoxesHeight < 676) {
		lowerBoxesHeight = 676;
	}
	if (lowerBoxesMobileHeight < 1000) {
		lowerBoxesMobileHeight = 1000;
	}

	var tableContainerHeight = (windowAspectMarketsTable == "mobile") ? (lowerBoxesMobileHeight - 250) / 2: lowerBoxesHeight - 65;
	
	var tblHeaderDiv = $("<div></div>").css("vertical-align", "middle").css("display", "inline-block").css("margin-top", "20px").css("margin-left", "25px")
						.css("margin-right", "25px").css("background-color", "#F2F5F8").css("width", tableContainerWidth);
	var tblHeader = $("<table></table>").attr("id", "tblHeader").css("width", tableContainerWidth).css("padding-left", "0px").css("padding-right", "0px")
					.css("display", "block").css("border-collapse", "collapse").css("margin-top", "0").css("table-layout","fixed");
	
	var applicantTH = $("<th></th>").html(model == "Applicant" ? "Applicants" : model == "Hires" ? "Hires": "Good Hires").attr("class", "marketsLabel")
					.css("width",2*dataColumnWidth).css("min-width", minColumnWidth + "px").css("background-color", 'rgba(238, 238, 238, 0.41)')
					.css("padding-right", "0px").css("text-align", "center").css("border-left", "1px solid white").css("border-right", "1px solid white");
	var modelTH = $("<th></th>").html("Model Variables").attr("class", "marketsLabel").css("width",tableContainerWidth-(3*dataColumnWidth) )
				.css("min-width",minColumnWidth + "px").css("background-color",'rgba(238, 238, 238, 0.41)').css("padding-right", "0px")
				.css("text-align", "center").css("border-left", "1px solid black");

	var titleRow = $("<tr></tr>").attr("id", "titleRow").attr("class","marketsLabel").css("background-color", "#AAAAAA").css("height","30px");
	tblHeader.append(titleRow.append($('<th></th>').css("width", dataColumnWidth).css("background-color",'rgba(238, 238, 238, 0.407843)').css('border-right','1px solid white')).append(applicantTH).append(modelTH));
	tblHeaderDiv.html(tblHeader);
	
	
	var marketsChartTable = $("<table></table>").attr("id", "marketsChartTable").attr("class", "tablesorter").css("width", "692px").css("padding-left", "0px")
		.css("padding-right", "0px").css("display", "block").css("border-collapse", "collapse").css("margin-top", "0").css("table-layout","auto");

	var marketsTableThead = $("<thead></thead>");

	var zipcodeTH = $("<th></th>").html("Zip Code").attr("rowspan", "2").attr("class", "marketsLabel").css("width", dataColumnWidth).css("min-width", minColumnWidth + "px")
	.css("background-color",'rgb(198, 198, 198)').css("padding-right", "0px").css("text-align", "center").css('border-right','1px solid white');

	var subTitleRow = $("<tr></tr>").attr("id", "subTitleRow").attr("class","marketsLabel");

	var actualTH = $("<th></th>").html("Actual").attr("class", "marketsLabel").css("width", dataColumnWidth).css("background-color",'rgba(238, 238, 238, 0.41)')
					.css("padding-right", "8px").css("min-width", minColumnWidth + "px").css("text-align", "center").css("border-left", "0px solid black");

	var opportunityTH = $("<th></th>").html("Opportunity").attr("class","marketsLabel").css("width", dataColumnWidth).css("background-color", 'rgba(238, 238, 238, 0.41)')
			.css("min-width",minColumnWidth + "px").css("border-bottom-style", "none").css("border-right-style", "none").css("padding-right", "8px").css("text-align", "center");	

	$(subTitleRow).append(zipcodeTH).append(opportunityTH).append(actualTH);

		$.each(thisSelectionTable[0].modelVariables, function(key, value){
			var modelVariablesTH = $("<th></th>").html(key).attr("class","marketsLabel").css("background-color", ' rgba(238, 238, 238, 0.41)')
			.css("border-left", "1px solid white").css("text-align", "center").css("padding-right", "8px");//.css("width", dataColumnWidth).css("min-width", minColumnWidth + "px");
			$(subTitleRow).append(modelVariablesTH);
		});
	
	$(marketsTableThead).append(subTitleRow);
	$(marketsChartTable).append(marketsTableThead);

	var marketsTbody = $("<tbody></tbody>").attr("id", "marketsTbody").css("width", "100%");

	var sortedSelectionTable = thisSelectionTable.slice(0);

	if (model == 'Good Hires') {
		var sorto = {oppGoodHires : "desc"};
	} else if (model == 'Hires') {
		var sorto = {oppHires : "desc"};
	} else {
		var sorto = {oppApplicants : "desc"};
	// var sorto={oppApplicants:"desc",actualApplicants:"desc"};

	}
	sortedSelectionTable.keySort(sorto);
	
	var i = 0;
	var numZips;
	if (top25) {
		numZips = 25;
	} else {
		numZips = thisSelectionTable.length;
	}

	$(thisSelectionTable).each(function(index) {
				if (i++ < numZips) {
					var thisTR = $("<tr></tr>").attr("class", this.rowType).css("height", "25px").css("width",tableScrollWidth);

					var zipcodeTD = $("<td></td>").text(this.postalCode).attr("class", "marketsLabel").css("width",dataColumnWidth)
					.css("background-color", "white").css("text-align", "center").css("min-width",minColumnWidth + "px").css("font-weight","bold");

					var actualTD = $("<td></td>").text(model == "Applicant" ? this.actualApplicants: model == "Hires" ? this.actualHires: this.actualGoodHires)
					.attr("class", "marketsLabel").css("width",dataColumnWidth).css("text-align", "right").css("padding-right", "40px").css("min-width",minColumnWidth + "px");

					var opportunityTD = $("<td></td>").text(model == "Applicant" ? this.oppApplicants: model == "Hires" ? this.oppHires: this.oppGoodHires)
					.attr("class","marketsLabel").css("width", dataColumnWidth).css("text-align", "right").css("padding-right", "40px").css("min-width", minColumnWidth + "px");
					$(opportunityTD).css("background-color",opportunityColor(sortedSelectionTable.indexOf(this) + 1,thisSelectionTable.length));
					
					$(thisTR).append(zipcodeTD).append(opportunityTD).append(actualTD)

					$.each(this.modelVariables, function(key, value){
						var modelVariableTD = $("<td></td>").text(value.toFixed(0)).attr("class","marketsLabel")//.css("width", dataColumnWidth)
						.css("text-align", "right").css("padding-right", "45px").css("min-width", minColumnWidth + "px");
						$(thisTR).append(modelVariableTD);
					});
					$(marketsTbody).append(thisTR);
				}
			});

	$(marketsChartTable).append(marketsTbody);

	if (windowAspectMarketsTable == "desktop") {		
		$(marketsTableDiv).html(marketsChartTable);
		$("#display-area").html(menuDiv);
		//$("#display-area").html(downloadDiv);
		$("#display-area").append(tblHeaderDiv);
		$("#display-area").append(marketsTableDiv);
	} else {
		$(marketsTableDiv).html(marketsChartTable);
		$("#display-area-xs").html(menuDiv);
		//$("#display-area").html(downloadDiv);
		$("#display-area-xs").append(tblHeaderDiv);
		$("#display-area-xs").append(marketsTableDiv);
	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");
	$("#marketsChartTable").tablesorter({
		// sort on the oppurtunity column, order desc(1)/asc(0)
		sortList : [ [ 1, 1 ] ],
		showProcessing: true,
		headerTemplate : '{content} {icon}',
		widgets: [ 'scroller' ],
		widgetOptions : {
			scroller_height : tableContainerHeight-100,
			// set number of columns to fix
			scroller_fixedColumns : 3,
			// scroll tbody to top after sorting
			scroller_upAfterSort: true,
			// pop table header into view while scrolling up the page
			scroller_jumpToHeader: true,
			// In tablesorter v2.19.0 the scroll bar width is auto-detected
			// add a value here to override the auto-detected setting
			scroller_barWidth : null
			// scroll_idPrefix was removed in v2.18.0
			// scroller_idPrefix : 's_'
		}
	});

	redrawMarketsTableSelectorBoxes();
	addMarketsResizeListener();
	enableMarketsTableSelectors();
	activateMarketsTableSelectors();

}

function opportunityColor(index, length) {
	var pos = index / length;
	if (pos < .2) {
		// console.log(index + "/" + length + "=" + index / length + "=" +
		// "#1DC67D");
		return "#1DC67D"; // darkgreen
	}
	if (pos < .4) {
		// console.log(index + "/" + length + "=" + index / length + "=" +
		// "#B8E17F");
		return "#B8E17F"; // lightgreen
	}
	if (pos < .6) {
		// console.log(index + "/" + length + "=" + index / length + "=" +
		// "#FFF07D");
		return "#FFF07D"; // yellow
	}
	if (pos < .8) {
		// console.log(index + "/" + length + "=" + index / length + "=" +
		// "#FFA76D");
		return "#FFA76D"; // lightred
	}
	// console.log(index + "/" + length + "=" + index / length + "=" +
	// "#C34048");
	return "#C34048";// darkred
}

function addMarketsResizeListener() {
	$(window).off("resize");
	$(window)
			.resize(
					function() {
						var localMarketsChartHolder, localSelectorButtonBox;
						var newWindowAspect = ($(window).width() >= 768) ? "desktop"
								: "mobile";

						if (windowAspectMarketsTable == "desktop"
								&& newWindowAspect == "mobile") {
							localMarketsChartHolder = $("#marketsChartTable")
									.detach();
							localSelectorButtonBox = $("#selectorButtonBox")
									.detach();
							$("#display-area-xs").append(
									localMarketsChartHolder);
							$("#leftbar-div-xs").html(localSelectorButtonBox);
							windowAspectMarketsTable = "mobile";
						}
						if (windowAspectMarketsTable != "desktop"
								&& newWindowAspect == "desktop") {
							localMarketsChartHolder = $("#marketsChartTable")
									.detach();
							localSelectorButtonBox = $("#selectorButtonBox")
									.detach();
							$("#display-area").append(localMarketsChartHolder);
							$("#leftbar-div").html(localSelectorButtonBox);
							windowAspectMarketsTable = "desktop";
						}
						//console.log("Aspect was " + windowAspectMarketsTable + ", now " + newWindowAspect);

						var chartContainerWidth = (windowAspectMarketsTable == "mobile") ? $(
								window).width() - 50
								: $(window).width() - 300;
						if (chartContainerWidth < 400) {
							chartContainerWidth = 400;
						}
						var chartWidth = (windowAspectMarketsTable == "mobile") ? chartContainerWidth - 100
								: chartContainerWidth / 2 - 100;
						var lowerBoxesHeight = $(window).height() - 51;
						var lowerBoxesMobileHeight = $(window).height() - 311;

						if (lowerBoxesHeight < 676) {
							lowerBoxesHeight = 676;
						}
						if (lowerBoxesMobileHeight < 1000) {
							lowerBoxesMobileHeight = 1000;
						}
						var chartContainerHeight = (windowAspectMarketsTable == "mobile") ? (lowerBoxesMobileHeight - 250) / 2
								: lowerBoxesHeight - 175;

						$("#leftbar-div")
								.css("height", lowerBoxesHeight + "px");
						$("#display-area").css("height",
								lowerBoxesHeight + "px");
						$("#display-area-xs").css("height",
								lowerBoxesMobileHeight + "px");

						$("#marketsChartTable").css("width",
								chartContainerWidth);
						$("#marketsChartDiv").css("width", chartWidth + "px");
						$("#marketsChartTR").css("height",
								chartContainerHeight + "px");
						$("#rocChartTR").css("height",
								chartContainerHeight + "px");
						$("#marketsChartTD").css("height",
								chartContainerHeight + "px");
						$("#rocChartTD").css("height",
								chartContainerHeight + "px");
						$("#marketsChartDiv").css("height",
								chartContainerHeight + "px");
						$("#rocChartDiv").css("height",
								chartContainerHeight + "px");
						var displayWidth = $(window).width() - 250;
						displayWidth = displayWidth + "px";
						$("#display-area").css("width", displayWidth);

						redrawMarketsTable();

					});
}

Array.prototype.keySort = function(keys) {

	keys = keys || {};

	var obLen = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	};

	// var obIx = fucntion(obj, ix){ return Object.keys(obj)[ix]; } or
	var obIx = function(obj, ix) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (size == ix)
					return key;
				size++;
			}
		}
		return false;
	};

	var keySort = function(a, b, d) {
		d = d !== null ? d : 1;
		// a = a.toLowerCase(); // this breaks numbers
		// b = b.toLowerCase();
		if (a == b)
			return 0;
		return a > b ? 1 * d : -1 * d;
	};

	var KL = obLen(keys);

	if (!KL)
		return this.sort(keySort);

	for ( var k in keys) {
		// asc unless desc or skip
		keys[k] = keys[k] == 'desc' || keys[k] == -1 ? -1 : (keys[k] == 'skip'
				|| keys[k] === 0 ? 0 : 1);
	}

	this.sort(function(a, b) {
		var sorted = 0, ix = 0;

		while (sorted === 0 && ix < KL) {
			var k = obIx(keys, ix);
			if (k) {
				var dir = keys[k];
				sorted = keySort(a[k], b[k], dir);
				ix++;
			}
		}
		return sorted;
	});
	return this;
};


function ExportHTMLTableToExcel(){
   var thisTable = document.getElementById("marketsChartTable");
   //alert(thisTable);
  /* window.clipboardData.setData("Text", thisTable);
   var objExcel = new ActiveXObject ("Excel.Application");
   objExcel.visible = true;

   var objWorkbook = objExcel.Workbooks.Add;
   var objWorksheet = objWorkbook.Worksheets(1);
   objWorksheet.Paste;*/
}
