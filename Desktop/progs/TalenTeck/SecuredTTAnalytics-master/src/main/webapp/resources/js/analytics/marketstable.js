
function ExportHTMLTableToExcel(){
   var thisTable = document.getElementById("marketsChartTable");
   alert(thisTable);
  /* window.clipboardData.setData("Text", thisTable);
   var objExcel = new ActiveXObject ("Excel.Application");
   objExcel.visible = true;
   var objWorkbook = objExcel.Workbooks.Add;
   var objWorksheet = objWorkbook.Worksheets(1);
   objWorksheet.Paste;*/
}
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

underlineOnlyThisLink("#applicantLink");

//console.log("Clicked");
// Show a "loading" animation

deactivateTopbarLinks();
displayTableSpinner(windowAspectMarketsTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Applicants</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Local labor market characteristics describe the recruitment pipeline and identify the markets for talent opportunity.</h4>');

if (linksTable.containsKey("markets") && linksTable.get("markets") === true) {
	var laborMarketButton = $("<button></button>").attr('id','laborMarketButton').attr('class', 'btn btn-default btn-block').prop("disabled", true).text("Labor Markets").css("margin-bottom", "10px").css("padding", "10px");
}
var applicantButton = $("<button></button>").attr('id', 'applicantButton').attr('class', 'btn btn-default btn-block').text("Applicants").css("margin-bottom", "10px").css("padding", "10px");

var downloadButton = $("<button></button>").attr('id', "downloadButton").attr('class', 'btn btn-default btn-block').text("Download CSV File").css("margin-top", "10px").css("padding", "10px").css("background","rgb(2, 149, 93)").css("text-shadow","none");		

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);
$(selectorButtonBox).append(applicantButton);
$(selectorButtonBox).append(laborMarketButton);
$(selectorButtonBox).append(downloadButton);

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
var marketsTableHashtable = new Hashtable({
	hashCode : selectionHashCode,
	equals : selectionIsEqual
});
var thisSelectionTable = [];
var selectorListReturned = false;
var tableReturned = false;
var top25 = true;
var thisLocation;
var cumSumOfPredictedVal;

var ua = navigator.userAgent.toLowerCase();
var isSafari = false;
if (ua.indexOf('safari') != -1) {
	if (ua.indexOf('chrome') > -1) {
		// Chrome
	} else {
		isSafari = true; // Safari
	}
}

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
			selectorList = data.selectorList;
			defaultSelectorName = data.defaultSelectorName;
			defaultSelectorValue = data.defaultSelectorValue;
			selectorListReturned = true;
			if (tableReturned) {
				redrawMarketsTableSelectorBoxes();
				var selectionList = queryMarketsSelectorValues();
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
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		var defaultFound = false;
		var allSelected = false;
		if (this.selectorName != "Map") {
			if (selectorsEverDrawn) {
				var usedDefaultValue = $("#" + this.selectorName+ " option:selected").val();
				} else {
					if (this.selectorName == defaultSelectorName) {
						var usedDefaultValue = defaultSelectorValue;
						} else {
							var usedDefaultValue = this.defaultValue;
							}
					}
			var thisSelector = $("<select></select>").attr("id", this.selectorName).attr("class","form-control marketsTableSelect")
			.attr("width", "200px").attr("defaultValue",usedDefaultValue);
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
				var checkedHashEntry = marketsTableHashtable.get(thisSelection);
				var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
				if (this.valueLabel.substring(0, 6) === "Select") {
					$(thisValue).attr("disabled",true);
				}
				if (defaultFound === false && checkedSelectorValue == usedDefaultValue && this.valueLabel.substring(0,6) !== "Select") {
					//console.log(usedDefaultValue + "usedDefaultValue");
					$(thisValue).attr("selected","selected");
					$(thisValue).prop("selected",true);
					defaultFound = true;
					}
				$(thisSelector).append(thisValue);
				} else {
						var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
						if (this.valueLabel.substring(0, 6) === "Select") {
							$(thisValue).attr("disabled",true);
							$(thisValue).prop("selected",false);
							}

						if (this.valueName == usedDefaultValue) {
							$(thisValue).attr("selected","selected");
							$(thisValue).prop("selected",true);
							}
						$(thisSelector).append(thisValue);
					}
			});
			activeSelectorsList.push(thisSelector);
		}
	});

	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var laborMarketButtonDetached = $("#laborMarketButton").detach();
	var applicantButtonDetached = $("#applicantButton").detach();
	var downloadButtonDetached = $("#downloadButton").detach();

	if (linksTable.containsKey("reports") && linksTable.get("reports") === true) {
		var reportsTableButtonDetached = $("#reportsTableButton").detach();
	}
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantButtonDetached);
	$(selectorButtonBox).append(laborMarketButtonDetached);


	$.each(activeSelectorsList, function() {
		$(selectorButtonBox).append(this);
	});
	$(selectorButtonBox).append(downloadButtonDetached);
	selectorsEverDrawn = true;
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
	thisLocation = selectorList[1]["selectorValue"];
	var model = selectorList[0];
	var location = selectorList.splice(1, 1);
	thisSelectionTable = marketsTableHashtable.get(location);
	redrawMarketsTable(model.selectorValue);

}

function queryMarketsSelectorValues() {
	// We've gotten rid of the time period selector, so we need to add it here. var selectionList = [ {selectorName : "periodName" , selectorValue :"All" } ];
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

	$("#applicantButton").prop("disabled", true);
	$("#marketsGraphButton").prop("disabled", true);
}

function enableMarketsTableSelectors() {
	activateTopbarLinks();
	$(".marketsTableSelect").each(function() {
		$(this).prop("disabled", false);
	});
	$("#applicantButton").prop("disabled", false);
	$("#marketsGraphButton").prop("disabled", false);
}

function activateMarketsTableSelectors() {
	$(".marketsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			if(this.id == "Zip") top25 = !top25;
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

	$("#downloadButton").unbind("click");
	$('#downloadButton').click(function() {
		// tell the output widget do it's thing
		$("#marketsChartTable").trigger('outputTable');
	});
}

function redrawMarketsTable(model) {
	$("#menuDiv").detach();
	var menuDiv = $("<div></div>").attr("id", "menuDiv").css("height", "30px").css("width", "100%").attr("class", "btn-group-justified");
	var menuItem2 = $('<a class="btn btn-default ">Map</a>').attr('id','marketsGraphButton');
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id', 'marketsTableButton');
	menuDiv.append(menuItem1).append(menuItem2);

	marketsTableDiv = $("<div></div>").attr("id", "marketsTableDiv").css("vertical-align", "middle").css("display", "inline-block").css("margin-top", "0px").css("margin-left", "25px").css("margin-right","25px").css("width", "100%").css("background-color", "#F2F5F8");
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
	var tableScrollWidth = tableWidth - dataColumnWidth < 1540 ? 1540 : tableWidth - dataColumnWidth > 2080 ? 2080 : tableWidth - dataColumnWidth;
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

	var tblHeaderDiv = $("<div></div>").css("vertical-align", "middle").css("display", "inline-block").css("margin-top", "20px").css("margin-left", "25px").css("margin-right", "25px").css("background-color", "#F2F5F8").css("width", tableContainerWidth);
	var tblHeader = $("<table></table>").attr("id", "tblHeader").css("width",tableContainerWidth).css("display", "block").css("border-collapse", "collapse").css("margin-top", "0").css("table-layout", "fixed");//.css("padding-left", "0px").css("padding-right", "0px")
	var applicantTH = $("<th></th>").html(model == "Applicant" ? "Applicants" : model == "Hires" ? "Hires": "Good Hires").css("width",2 * dataColumnWidth).css("min-width", minColumnWidth + "px").css("background-color", 'rgba(238, 238, 238, 0.41)').css("border-left", "1px solid white").css("border-right","1px solid #bbb").css("padding-right", "0px").css("text-align", "center");//.attr("class", "marketsLabel")
	var modelTH = $("<th></th>").html("Labor Market Characteristics").css("width",tableContainerWidth - (3 * dataColumnWidth)).css("min-width",minColumnWidth + "px").css("background-color",'rgba(238, 238, 238, 0.41)').css("border-left", "1px solid black").css("padding-right", "0px").css("text-align", "center");//.attr("class","marketsLabel")
	var titleRow = $("<tr></tr>").attr("id", "titleRow").attr("class","marketsLabel").css("background-color", "#AAAAAA").css("height","30px");
	tblHeader.append(titleRow.append($('<th></th>').css("width", dataColumnWidth).css("background-color", 'rgba(238, 238, 238, 0.407843)').css('border-right', '1px solid #bbb'))
			.append(applicantTH)
			.append(modelTH));
	tblHeaderDiv.html(tblHeader);

	var marketsChartTable = $("<table></table>").attr("id", "marketsChartTable").attr("class", "tablesorter").css("width", "100%");	
	var marketsTableThead = $("<thead style='width:100%'></thead>");
	var zipcodeTH = $("<th></th>").html("Zip Code").attr("class","marketsLabel").css("width", dataColumnWidth).css("min-width",minColumnWidth + "px").css("background-color", 'rgb(198, 198, 198)').css('text-align', 'right').css('padding-right', '8px');//.css("padding-right","0px");
	var subTitleRow = $("<tr></tr>").attr("id", "subTitleRow").attr("class","marketsLabel");
	var actualTH = $("<th></th>").html("Historical").attr("class", "marketsLabel").css("width", dataColumnWidth).css("background-color",'rgba(238, 238, 238, 0.41)').css("min-width", minColumnWidth + "px").css("border-left", "0px solid black");
	var opportunityTH = $('<th></th>').html('Predicted').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');//.css('text-align', 'center').css('padding-right', '8px');
	//var opportunityTH = $("<th></th>").html("Predicted").attr("class","marketsLabel").css("width", dataColumnWidth).css("background-color", 'rgba(238, 238, 238, 0.41)').css("min-width",minColumnWidth + "px").css("border-bottom-style", "none").css("border-right-style", "none");
	var laborforceTH = $('<th></th>').html('Labor Force').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');//.css('text-align', 'center').css('padding-right', '8px');
	var traveltimeTH = $('<th></th>').html('Commute Time').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var blackpeopleTH = $('<th></th>').html('African American Population').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var renteroccupiedTH = $('<th></th>').html('Renter Households').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var totalcompetitorsTH = $('<th></th>').html('Competitor Seats').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var medianlistingpriceTH = $('<th></th>').html('Median Property Value').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var saturationTH = $('<th></th>').html('Saturation Rate').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var t30rateTH = $('<th></th>').html('30-day Turnover').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var t90rateTH = $('<th></th>').html('90-day Turnover ').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var under25TH = $('<th></th>').html('Income under $25K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var between25and50TH = $('<th></th>').html('Income $25K-$50K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var appliedreferredTH = $('<th></th>').html('Referred Applicants').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var offeredreferredTH = $('<th></th>').html('Referred Offers').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var hiredreferredTH = $('<th></th>').html('Referred Hires').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var ghirereferredTH = $('<th></th>').html('Referred Good Hires').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var badhireTH = $('<th></th>').html('Bad Hire Count').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var totalapplicantsTH = $('<th></th>').html('Full Applicant Count').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var totalhiresTH = $('<th></th>').html('Full Hire Count').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var belowpovertylevelTH = $('<th></th>').html('Poverty Rate').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var populationTH = $('<th></th>').html('Population').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var unemploymentrateTH = $('<th></th>').html('Unemployment Rate').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var medianageTH = $('<th></th>').html('Median Age').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var femnohusbandchildrenTH = $('<th></th>').html('Single Mother Households').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var femaleover18populationTH = $('<th></th>').html('Female Adult Population').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var stateTH = $('<th></th>').html('State').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var population20to24TH = $('<th></th>').html('Population 20-24').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var population25to34TH = $('<th></th>').html('Population 25-34').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var sexratioTH = $('<th></th>').html('Sex Ratio').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var housingpercrenteroccupTH = $('<th></th>').html('Renter Households').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var householdmoved2010plusTH = $('<th></th>').html('Moved in last 5 years').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var propertyvalue0to50000TH = $('<th></th>').html('Property Value:$0-50K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var propertyvalue50000to100000TH = $('<th></th>').html('Property Value:$50K-100K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var propertyvalue100000to200000TH = $('<th></th>').html('Property Value:$100K-200K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var propertyvalue200000to500000TH = $('<th></th>').html('Property Value:$200K-500K').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var propertyvalue500000plusTH = $('<th></th>').html('Property Value:$500K+').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var medianrentTH = $('<th></th>').html('Rent Median').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var rentpercinc0to20TH = $('<th></th>').html('Rent Share of Income:0-20%').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var rentpercinc20to30TH = $('<th></th>').html('Rent Share of Income:20-30%').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var rentpercinc30plusTH = $('<th></th>').html('Rent Share of Income:30%+').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var lived1yragodiffhouseTH = $('<th></th>').html('Moved in last year').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var medianfamilyincomeTH = $('<th></th>').html('Median Family Income').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var medianworkerincomeTH = $('<th></th>').html('Median Worker Income').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var employedwohealthinsuranceTH = $('<th></th>').html('Employed w/o Health Insurance').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var unemployedwohealthinsuranceTH = $('<th></th>').html('Unemployed w/o Health Insurance').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var maritalhispanictotalTH = $('<th></th>').html('Hispanic Population').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var malepercnotenrolledincollegeTH = $('<th></th>').html('Males Not Enrolled in College').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var femalepercnotenrolledincollegeTH = $('<th></th>').html('Females Not Enrolled in College').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var commutecarTH = $('<th></th>').html('Commute by Car').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var commutenocarpoolTH = $('<th></th>').html('Commute Alone').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var traveltimemeanTH = $('<th></th>').html('Commute Time').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var novehicleTH = $('<th></th>').html('No Vehicle Access').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var workersperctvTH = $('<th></th>').html('Workers Per Vehicle').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var annualpayrollTH = $('<th></th>').html('Total Payroll').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var schoolnotenrolledTH = $('<th></th>').html('Not Enrolled in School').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var marriedTH = $('<th></th>').html('Married').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var singleTH = $('<th></th>').html('Single').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var blacksingleTH = $('<th></th>').html('African American Single').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var densityTH = $('<th></th>').html('Population Density').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	var locationTH = $('<th></th>').html('Location').attr('class','marketsLabel').css('width', dataColumnWidth).css('background-color', ' rgba(238, 238, 238, 0.41)').css('min-width', minColumnWidth + 'px');
	$(subTitleRow).append(zipcodeTH).append(opportunityTH).append(actualTH)
.append(laborforceTH)
.append(traveltimeTH)
.append(blackpeopleTH)
.append(renteroccupiedTH)
.append(totalcompetitorsTH)
.append(medianlistingpriceTH)
.append(saturationTH)
.append(t30rateTH)
.append(t90rateTH)
.append(under25TH)
.append(between25and50TH)
.append(appliedreferredTH)
.append(offeredreferredTH)
.append(hiredreferredTH)
.append(ghirereferredTH)
.append(badhireTH)
.append(totalapplicantsTH)
.append(totalhiresTH)
.append(belowpovertylevelTH)
.append(populationTH)
.append(unemploymentrateTH)
.append(medianageTH)
.append(femnohusbandchildrenTH)
.append(femaleover18populationTH)
.append(stateTH)
.append(population20to24TH)
.append(population25to34TH)
.append(sexratioTH)
.append(housingpercrenteroccupTH)
.append(householdmoved2010plusTH)
.append(propertyvalue0to50000TH)
.append(propertyvalue50000to100000TH)
.append(propertyvalue100000to200000TH)
.append(propertyvalue200000to500000TH)
.append(propertyvalue500000plusTH)
.append(medianrentTH)
.append(rentpercinc0to20TH)
.append(rentpercinc20to30TH)
.append(rentpercinc30plusTH)
.append(lived1yragodiffhouseTH)
.append(medianfamilyincomeTH)
.append(medianworkerincomeTH)
.append(employedwohealthinsuranceTH)
.append(unemployedwohealthinsuranceTH)
.append(maritalhispanictotalTH)
.append(malepercnotenrolledincollegeTH)
.append(femalepercnotenrolledincollegeTH)
.append(commutecarTH)
.append(commutenocarpoolTH)
.append(traveltimemeanTH)
.append(novehicleTH)
.append(workersperctvTH)
.append(annualpayrollTH)
.append(schoolnotenrolledTH)
.append(marriedTH)
.append(singleTH)
.append(blacksingleTH)
.append(densityTH)
.append(locationTH);

	$(marketsTableThead).append(subTitleRow);
	$(marketsChartTable).append(marketsTableThead);

	var marketsTbody = $("<tbody></tbody>").attr("id", "marketsTbody").css("width", "100%");

	var sortedSelectionTable = thisSelectionTable.slice(0);

	if (model == 'Good Hires') {
		var sorto = {
			predictedGoodHires : "desc"
		};
	} else if (model == 'Hires') {
		var sorto = {
			predictedHires : "desc"
		};
	} else {
		var sorto = {
			predictedApplicants : "desc"
		};
	}
	sortedSelectionTable.keySort(sorto);

	var i = 0;
	var numZips;
	if (top25) {
		numZips = 25;
	} else {
		numZips = thisSelectionTable.length;
	}
	
	var totalPredicted = 0;
	$(sortedSelectionTable).each(function(index) {
		if(model == "Applicant"){
			totalPredicted +=this.predictedApplicants;
		} 
		else if(model == "Hires"){
			totalPredicted +=this.predictedHires
			}
		else{
			totalPredicted +=this.predictedGoodHires;
			}
	});
	var eightyPercentOfPredicted=Math.round(totalPredicted*0.8);
	
	var ceiledEightyPercentOfPredicted = 0;
	totalPredicted=0;
	$(sortedSelectionTable).each(function(index) {
		if(model == "Applicant"){
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
				totalPredicted +=this.predictedApplicants;
				}
		} 
		else if(model == "Hires"){
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
			totalPredicted +=this.predictedHires;}
			}
		else{
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
			totalPredicted +=this.predictedGoodHires;
			}
			}
	});
	 ceiledEightyPercentOfPredicted=totalPredicted;		
	cumSumOfPredictedVal=0;
	$(sortedSelectionTable).each(
			function(index) {
				if (i++ < numZips) {
					var thisTR = $("<tr></tr>").attr("class", this.rowType).css("height", "25px").css("width",tableScrollWidth);
					var zipcodeTD = $("<td></td>").text(this.postalCode).attr("class", "marketsLabel").css("width",dataColumnWidth).css("background-color", "white").css("min-width",minColumnWidth + "px").css("font-weight","bold").css('text-align', 'right').css('padding-right', '8px');
					//$(zipcodeTD).css("background-color",opportunityColor(sortedSelectionTable.indexOf(this) + 1,thisSelectionTable.length));
					//var predictedVal=(model == "Applicant" ? this.predictedApplicants: model == "Hires" ? this.predictedHires: this.predictedGoodHires);
					$(zipcodeTD).css("background-color",opportunityColor(ceiledEightyPercentOfPredicted,model == "Applicant" ? this.predictedApplicants: model == "Hires" ? this.predictedHires: this.predictedGoodHires));
					var actualTD = $("<td></td>").text(addCommas(model == "Applicant" ? this.actualApplicants: model == "Hires" ? this.actualHires: this.actualGoodHires)).attr("class", "marketsLabel").css("width",dataColumnWidth).css("min-width",minColumnWidth + "px");
					var opportunityTD = $("<td></td>").text(addCommas(model == "Applicant" ? this.predictedApplicants: model == "Hires" ? this.predictedHires: this.predictedGoodHires)).attr("class","marketsLabel").css("width", dataColumnWidth).css("min-width", minColumnWidth + "px");
					var laborforceTD = $('<td></td>').text(addCommas(this.laborforce)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var traveltimeTD = $('<td></td>').text(this.traveltime.toFixed(0)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var blackpeopleTD = $('<td></td>').text(addCommas(this.blackpeople)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var renteroccupiedTD = $('<td></td>').text(addCommas(this.renteroccupied)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var totalcompetitorsTD = $('<td></td>').text(addCommas(this.totalcompetitors)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var medianlistingpriceTD = $('<td></td>').text("$"+ addCommas(this.medianlistingprice)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var saturationTD = $('<td></td>').text(this.saturation.toFixed(0) + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var t30rateTD = $('<td></td>').text(this.t30rate + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var t90rateTD = $('<td></td>').text(this.t90rate + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var under25TD = $('<td></td>').text((this.under25*100).toFixed(0) + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var between25and50TD = $('<td></td>').text(((this.between25and50)*100).toFixed(0)+ "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var appliedreferredTD = $('<td></td>').text((this.appliedreferred*100).toFixed(0)+ "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var offeredreferredTD = $('<td></td>').text((this.offeredreferred*100).toFixed(0)+ "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var hiredreferredTD = $('<td></td>').text((this.hiredreferred*100).toFixed(0)+ "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var ghirereferredTD = $('<td></td>').text((this.ghirereferred*100).toFixed(0)+ "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var badhireTD = $('<td></td>').text(this.badhire).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var totalapplicantsTD = $('<td></td>').text(addCommas(this.totalapplicants)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var totalhiresTD = $('<td></td>').text(addCommas(this.totalhires)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var belowpovertylevelTD = $('<td></td>').text(this.belowpovertylevel+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var populationTD = $('<td></td>').text(addCommas(this.population)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var unemploymentrateTD = $('<td></td>').text(this.unemploymentrate+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var medianageTD = $('<td></td>').text(this.medianage.toFixed(0)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var femnohusbandchildrenTD = $('<td></td>').text(addCommas(this.femnohusbandchildren.toFixed(0))).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var femaleover18populationTD = $('<td></td>').text(addCommas(this.femaleover18population)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var stateTD = $('<td></td>').text(this.state).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var population20to24TD = $('<td></td>').text(this.population20to24.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var population25to34TD = $('<td></td>').text(this.population25to34.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var sexratioTD = $('<td></td>').text(this.sexratio.toFixed(0)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var housingpercrenteroccupTD = $('<td></td>').text(this.housingpercrenteroccup.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var householdmoved2010plusTD = $('<td></td>').text(this.householdmoved2010plus.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var propertyvalue0to50000TD = $('<td></td>').text(this.propertyvalue0to50000.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var propertyvalue50000to100000TD = $('<td></td>').text(this.propertyvalue50000to100000.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var propertyvalue100000to200000TD = $('<td></td>').text(this.propertyvalue100000to200000.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var propertyvalue200000to500000TD = $('<td></td>').text(this.propertyvalue200000to500000.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var propertyvalue500000plusTD = $('<td></td>').text(this.propertyvalue500000plus.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var medianrentTD = $('<td></td>').text("$" + addCommas(this.medianrent.toFixed(0))).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var rentpercinc0to20TD = $('<td></td>').text(this.rentpercinc0to20.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var rentpercinc20to30TD = $('<td></td>').text(this.rentpercinc20to30.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var rentpercinc30plusTD = $('<td></td>').text(this.rentpercinc30plus.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var lived1yragodiffhouseTD = $('<td></td>').text(this.lived1yragodiffhouse.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var medianfamilyincomeTD = $('<td></td>').text("$"+addCommas(this.medianfamilyincome)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var medianworkerincomeTD = $('<td></td>').text("$" + addCommas(this.medianworkerincome)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var employedwohealthinsuranceTD = $('<td></td>').text(this.employedwohealthinsurance.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var unemployedwohealthinsuranceTD = $('<td></td>').text(this.unemployedwohealthinsurance.toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var maritalhispanictotalTD = $('<td></td>').text(addCommas(this.maritalhispanictotal)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var malepercnotenrolledincollegeTD = $('<td></td>').text((this.malepercnotenrolledincollege*100).toFixed(0) + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var femalepercnotenrolledincollegeTD = $('<td></td>').text((this.femalepercnotenrolledincollege*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var commutecarTD = $('<td></td>').text((this.commutecar*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var commutenocarpoolTD = $('<td></td>').text((this.commutenocarpool*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var traveltimemeanTD = $('<td></td>').text(this.traveltimemean.toFixed(0)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var novehicleTD = $('<td></td>').text((this.novehicle*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var workersperctvTD = $('<td></td>').text(this.workersperctv).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var annualpayrollTD = $('<td></td>').text("$" + addCommas(this.annualpayroll)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var schoolnotenrolledTD = $('<td></td>').text(addCommas(this.schoolnotenrolled)).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var marriedTD = $('<td></td>').text((this.married*100).toFixed(0) + "%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var singleTD = $('<td></td>').text((this.single*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var blacksingleTD = $('<td></td>').text((this.blacksingle*100).toFixed(0)+"%").attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var densityTD = $('<td></td>').text(addCommas(this.density.toFixed(0))).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');
					var locationTD = $('<td></td>').text(this.location).attr('class','marketsLabel').css('width', dataColumnWidth).css('min-width', minColumnWidth + 'px');//.css('text-align', 'right').css('padding-right', '45px')

					$(thisTR).append(zipcodeTD).append(opportunityTD).append(actualTD)
.append(laborforceTD)
.append(traveltimeTD)
.append(blackpeopleTD)
.append(renteroccupiedTD)
.append(totalcompetitorsTD)
.append(medianlistingpriceTD)
.append(saturationTD)
.append(t30rateTD)
.append(t90rateTD)
.append(under25TD)
.append(between25and50TD)
.append(appliedreferredTD)
.append(offeredreferredTD)
.append(hiredreferredTD)
.append(ghirereferredTD)
.append(badhireTD)
.append(totalapplicantsTD)
.append(totalhiresTD)
.append(belowpovertylevelTD)
.append(populationTD)
.append(unemploymentrateTD)
.append(medianageTD)
.append(femnohusbandchildrenTD)
.append(femaleover18populationTD)
.append(stateTD)
.append(population20to24TD)
.append(population25to34TD)
.append(sexratioTD)
.append(housingpercrenteroccupTD)
.append(householdmoved2010plusTD)
.append(propertyvalue0to50000TD)
.append(propertyvalue50000to100000TD)
.append(propertyvalue100000to200000TD)
.append(propertyvalue200000to500000TD)
.append(propertyvalue500000plusTD)
.append(medianrentTD)
.append(rentpercinc0to20TD)
.append(rentpercinc20to30TD)
.append(rentpercinc30plusTD)
.append(lived1yragodiffhouseTD)
.append(medianfamilyincomeTD)
.append(medianworkerincomeTD)
.append(employedwohealthinsuranceTD)
.append(unemployedwohealthinsuranceTD)
.append(maritalhispanictotalTD)
.append(malepercnotenrolledincollegeTD)
.append(femalepercnotenrolledincollegeTD)
.append(commutecarTD)
.append(commutenocarpoolTD)
.append(traveltimemeanTD)
.append(novehicleTD)
.append(workersperctvTD)
.append(annualpayrollTD)
.append(schoolnotenrolledTD)
.append(marriedTD)
.append(singleTD)
.append(blacksingleTD)
.append(densityTD)
.append(locationTD);
					$(marketsTbody).append(thisTR);
				}
			});

	$(marketsChartTable).append(marketsTbody);

	if (windowAspectMarketsTable == "desktop") {

		$(marketsTableDiv).html(marketsChartTable);
		$("#display-area").html(menuDiv);
		$("#display-area").append(tblHeaderDiv);
		$("#display-area").append(marketsTableDiv);
	} else {
		$(marketsTableDiv).html(marketsChartTable);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(tblHeaderDiv);
		$("#display-area-xs").append(marketsTableDiv);
	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");
	if (isSafari) {
		deliveryOption = "popup";
	} else {
		deliveryOption = "download";
	}
	$("#marketsChartTable").tablesorter(
			{
				// sort on the oppurtunity column, order desc(1)/asc(0)
				//sortList : [ [ 1, 1 ] ],
				showProcessing : true,
				headerTemplate : '{content} {icon}',
				widgets : [ 'scroller', 'output' ],
				widgetOptions : {
					scroller_height : tableContainerHeight - 100,
					// set number of columns to fix
					scroller_fixedColumns : 3,
					// scroll tbody to top after sorting
					scroller_upAfterSort : true,
					// pop table header into view while scrolling up the page
					scroller_jumpToHeader : true,
					// In tablesorter v2.19.0 the scroll bar width is
					// auto-detected
					// add a value here to override the auto-detected setting
					scroller_barWidth : null,
					// scroll_idPrefix was removed in v2.18.0
					// scroller_idPrefix : 's_'
					output_saveFileName : "Markets-" + thisLocation + "-"
							+ model + ".csv",
					output_delivery : deliveryOption,
					output_hiddenColumns : true
				}
			});

	//$("#marketsTbody").parent().find(".tablesorter-scroller-spacer remove-me tablesorter-scroller-added-height").remove();
	$('.tablesorter-scroller-spacer.remove-me.tablesorter-scroller-added-height').css("height","0px");

	redrawMarketsTableSelectorBoxes();
	addMarketsResizeListener();
	enableMarketsTableSelectors();
	activateMarketsTableSelectors();

}

function opportunityColor(ceiledEightyPercentOfPredicted, predictedVal) {
	cumSumOfPredictedVal+= predictedVal;
	if(cumSumOfPredictedVal<=ceiledEightyPercentOfPredicted){
		return "#1DC67D"; // darkgreen
	}else
		return "#84817f";// greys
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
						//console.log("Aspect was " + windowAspectMarketsTable
						//	+ ", now " + newWindowAspect);

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
	//console.log(keys);
	if(keys!=0){

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
	}
	return this;
};