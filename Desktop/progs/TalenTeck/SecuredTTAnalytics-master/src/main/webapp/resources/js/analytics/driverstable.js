
var windowAspectDriversTable = "";
windowAspectDriversTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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
displayTableSpinner(windowAspectDriversTable);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding","15px")
.css("background-color","#bbbbbb").css("margin-top","0px")
.css("margin-bottom","10px").html('<h2 style="margin: 0px; padding: 0px; margin-bottom: 10px;">Drivers</h2><h4  style="font-weight: lighter;">Ranking variables by their influence in multiple turnover regression models and assessing potential impact of each turnover driver individually.</h4>');
$(selectorButtonBox).append(titleDiv);
var graphButton = $("<button></button>").attr('id','driversGraphButton')
					.attr('class','btn btn-default btn-block').text("Graph")
					.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(graphButton);

var tableButton = $("<button></button>").attr('id','driversTableButton')
.attr('class','btn btn-default btn-block disabled').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);
if ( windowAspectDriversTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableDriversTableSelectors();

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var driverTypeSelector = {};
var driversRawTable = {};
var formattedTable = [];
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
				var selectionList = queryDriversTableSelectorValues();
				//console.log(selectionList);
				refreshDriversTable(queryDriversTableSelectorValues());				
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
				var selectionList = queryDriversTableSelectorValues();
				//console.log("Selection is : ");
				//console.log(selectionList);
				refreshDriversTable(queryDriversTableSelectorValues());				
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
		.attr("class","form-control driversTableSelect").attr("width","200px")
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


function refreshDriversTable(selectorList) {
    disableDriversTableSelectors();
    displayTableSpinner(windowAspectDriversTable);
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "driversgraph" , 
    			selectorlist : selectorList,
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		driversRawTable = data;
    		formattedTable = convertResponseToTableArray(driversRawTable);
    		visibleTable = createVisibleDriversTable(formattedTable);
    		displayVisibleDriversTable(visibleTable);
    	}
    });
}

function queryDriversTableSelectorValues() {
	var selectionList = [];
	$(".driversTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: $(this).val() 		
	   		};
	   		selectionList.push(thisSelection);
	});
	return JSON.stringify(selectionList);
}

function convertResponseToTableArray(responseData) {
	
	var returnTable = [];
	
	$(responseData.drivers).each(function() {
		
		var blankRow = {
				rowType: "blank",
				categoryValue : "",
				proportion : "" ,
				nt30 : "",
				pt30 : "" ,
				tt30 : "",
				nt60 : "",
				pt60 : "" ,
				tt60 : "",
				nt90 : "",
				pt90 : "" ,
				tt90 : "",
				nt180 : "",
				pt180 : "" ,
				tt180 : "",
				nt365 : "",
				pt365 : "" ,
				tt365 : ""
		};
		if (returnTable.length != 0 ) {
			returnTable.push(blankRow);			
		}
		var driverTitleRow = {
				rowType: "driverTitle",
				categoryValue : this.driverLabel ,
				proportion : "" ,
				nt30 : "",
				pt30 : "" ,
				tt30 : "",
				nt60 : "",
				pt60 : "" ,
				tt60 : "",
				nt90 : "",
				pt90 : "" ,
				tt90 : "",
				nt180 : "",
				pt180 : "" ,
				tt180 : "",
				nt365 : "",
				pt365 : "" ,
				tt365 : ""
		};
		returnTable.push(driverTitleRow);
		
		$(this.categoryValues).each(function() {

			var thisRow = this;
			thisRow.rowType = "category";
			thisRow.proportionpct = toPercent(this.proportion , this.proportion + 1 );
			thisRow.pt30pct = toPercent(this.pt30 , this.nt30 );
			thisRow.pt60pct = toPercent(this.pt60 , this.nt60 );
			thisRow.pt90pct = toPercent(this.pt90 , this.nt90 );
			thisRow.pt180pct = toPercent(this.pt180 , this.nt180 );
			thisRow.pt365pct = toPercent(this.pt365 , this.nt365 );
			thisRow.bgt30 = (this.nt30 == 0 ) ? "#FFFFFF" : driverCellColor(this.tt30);
			thisRow.bgt60 = (this.nt30 == 0 ) ? "#FFFFFF" : driverCellColor(this.tt60);
			thisRow.bgt90 = (this.nt30 == 0 ) ? "#FFFFFF" : driverCellColor(this.tt90);
			thisRow.bgt180 = (this.nt30 == 0 ) ? "#FFFFFF" : driverCellColor(this.tt180);
			thisRow.bgt365 = (this.nt30 == 0 ) ? "#FFFFFF" : driverCellColor(this.tt365);
			returnTable.push(thisRow);
		});
		var driverInfluenceRow = {
				rowType: "driverInfluence",
				categoryValue : "Driver Influence" ,
				proportion : "" ,
				pt30  : this.influencet30 == -2 ? "N/A" : ( this.influencet30 == -1 || this.influencet30 == 0 ? "None" : toPercent(this.influencet30/100,this.influencet30+1)) ,
				pt60  : this.influencet60 == -2 ? "N/A" : ( this.influencet60 == -1 || this.influencet60 == 0 ? "None" : toPercent(this.influencet60/100,this.influencet60+1))  ,
				pt90  : this.influencet90 == -2 ? "N/A" : ( this.influencet90 == -1 || this.influencet90 == 0 ? "None" : toPercent(this.influencet90/100,this.influencet90+1))  ,
				pt180 : this.influencet180 == -2 ? "N/A" : ( this.influencet180 == -1 || this.influencet180 == 0 ? "None" : toPercent(this.influencet180/100,this.influencet180+1))  ,
				pt365 : this.influencet365 == -2 ? "N/A" : ( this.influencet365 == -1 || this.influencet365 == 0 ? "None" : toPercent(this.influencet365/100,this.influencet365+1))  ,
		};
		returnTable.push(driverInfluenceRow);

	});
	
	return returnTable;
}

function createVisibleDriversTable(tableData) {
	
	var tableContainerHeight = $(window).height() - 145;
	if (windowAspectDriversTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	var tbodyHeight = tableContainerHeight - 30;
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectDriversTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 410 + 7*Math.floor((tableContainerWidth - 475)/7);
	var firstColumnWidth = 125 + Math.floor((tableWidth-410)/7);
	var dataColumnWidth = 40 + Math.floor((tableWidth-410)/7);
	tbodyWidth = firstColumnWidth + 6*dataColumnWidth + 45;
		
	var visibleTable = $("<table></table>").attr("id","driversTable").attr("class","table")
						.css("width",tableWidth)
						.css("padding-left","0px").css("padding-right","0px");//.css("height",tableContainerHeight);<-Has bad effects on Firefox
	var visibleThead = $("<thead></thead>").attr("id","driversThead").css("width",tableWidth);//.css("width",lesserWidth);
	var visibleTbody = $("<tbody></tbody>").attr("id","driversTbody")
						.css("overflow-y","scroll").css("position","absolute")
						.css("height",tbodyHeight).css("width",tbodyWidth);

	var titleRow = $("<tr></tr>").attr("id","titleRow")
	.css("width",tableWidth);//.css("width","100%");//.css("display","inline-table");
	var blankTH = $("<th></th>").attr("class","rowLabelTD").css("width",firstColumnWidth).css("padding-right","0px");
	var proportionTH = $("<th></th>").text("Proportion").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var t30TH = $("<th></th>").html("30-Day<br>Turnover").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var t60TH = $("<th></th>").html("60-Day<br>Turnover").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var t90TH = $("<th></th>").html("90-Day<br>Turnover").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var t180TH = $("<th></th>").html("180-Day<br>Turnover").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var t365TH = $("<th></th>").html("365-Day<br>Turnover").attr("class","rowLabelTD").css("width",dataColumnWidth).css("text-align","right").css("padding-right","10px");
	var tailTH = $("<th></th>").attr("class","rowLabelTD").css("width",45).css("padding-right","0px");
	
	$(titleRow).append(blankTH).append(proportionTH).append(t30TH).append(t60TH)
		.append(t90TH).append(t180TH).append(t365TH).append(tailTH);
	$(visibleThead).append(titleRow);
	
	$(tableData).each( function(index) {
		switch ( this.rowType ) {
		case "blank":
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#DDDDDD")
							.css("padding-top","5px").css("padding-bottom","5px");
			var blankTD = $("<td></td>").attr("colspan",8).css("width","100%").html("&nbsp;");
			$(thisRow).html(blankTD);
			break;
		case "driverTitle":
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#FFFFFF")
			.css("padding-top","5px").css("padding-bottom","5px");
			var titleTD = $("<td></td>").attr("colspan",8).css("width","100%").html("<h4>" + this.categoryValue + "</h4>");
			$(thisRow).html(titleTD);
			break;
		case "category":
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#FFFFFF")
							.css("padding-top","5px").css("padding-bottom","5px");
			var titleTD = $("<td></td>").text(this.categoryValue).attr("class","rowLabelTD").css("width",firstColumnWidth)
							.css("background-color","#DDDDDD").css("padding-top","5px")
							.css("padding-bottom","5px").css("padding-left","10px")
							.css("padding-right","10px");
			var proportionTD = $("<td></td>").text(this.proportionpct).attr("class","contentTD").css("width",dataColumnWidth)
								.css("text-align","right").css("background-color","#DDDDDD").css("padding-top","5px")
								.css("padding-bottom","5px").css("padding-left","10px")
								.css("padding-right","10px");
			var t30TD = $("<td></td>").text(this.pt30pct).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color",this.bgt30).css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t60TD = $("<td></td>").text(this.pt60pct).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color",this.bgt60).css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t90TD = $("<td></td>").text(this.pt90pct).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color",this.bgt90).css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t180TD = $("<td></td>").text(this.pt180pct).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color",this.bgt180).css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t365TD = $("<td></td>").text(this.pt365pct).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color",this.bgt365).css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var tailTD = $("<td></td>").css("width","30px").attr("class","contentTD")
			.css("text-align","right").css("background-color","#FFFFFF").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			$(thisRow).append(titleTD).append(proportionTD).append(t30TD).append(t60TD)
			.append(t90TD).append(t180TD).append(t365TD).append(tailTD);
			break;
		case "driverInfluence":
			var thisRow = $("<tr></tr>").css("height","25px").css("width",tbodyWidth).css("background-color","#CCCCCC")
			.css("padding-top","5px").css("padding-bottom","5px");
			var titleTD = $("<td></td>").attr("colspan",2).css("width","100%").html("<h4>Model Influence</h4>");
			var t30TD = $("<td></td>").text(this.pt30).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color","#CCCCCC").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t60TD = $("<td></td>").text(this.pt60).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color","#CCCCCC").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t90TD = $("<td></td>").text(this.pt90).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color","#CCCCCC").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t180TD = $("<td></td>").text(this.pt180).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color","#CCCCCC").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var t365TD = $("<td></td>").text(this.pt365).attr("class","contentTD").css("width",dataColumnWidth)
			.css("text-align","right").css("background-color","#CCCCCC").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			var tailTD = $("<td></td>").css("width","30px").attr("class","contentTD")
			.css("text-align","right").css("background-color","#FFFFFF").css("padding-top","5px")
			.css("padding-bottom","5px").css("padding-left","10px")
			.css("padding-right","10px");
			$(thisRow).append(titleTD).append(t30TD).append(t60TD)
			.append(t90TD).append(t180TD).append(t365TD).append(tailTD);
			break;
			
		}
		$(visibleTbody).append(thisRow);
			
	});
	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}

function displayVisibleDriversTable(visibleTable) {
	windowAspectDriversTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectDriversTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	tableContainerHeight = tableContainerHeight + "px";
	displayAreaHeight = displayAreaHeight  + "px";
	displayAreaMobileHeight = displayAreaMobileHeight  + "px";
	
	driversTableDiv = $("<div></div>").attr("id","driversTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");
	//Attach first, otherwise AmCharts won't work....
	/*var outerTable = $('<table><tbody>' +
			'<tr id="overTableTR"></tr>' +
			'<tr id="tableTR"><td id="tableTD"></td></tr>' +
			'</tbody></table>').attr("id","outerTable");*/
	//$(headcountTableDiv).html(outerTable);
	if ( windowAspectDriversTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").html(driversTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#display-area-xs").html(driversTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#driversTableDiv").css("height",tableContainerMobileHeight);
	}

	$(driversTableDiv).html(visibleTable);
	redrawDriversTableSelectorBoxes();
	addDriversTableResizeListener();
	enableDriversTableSelectors();
	activateDriversTableSelectors();
	
	var totalHeight = 0;
	var tbodyCSSHeight = parseFloat($("#driversTbody").css("height"),10);
	$("#driversTbody").children().each(function(){
	    totalHeight = totalHeight + $(this).outerHeight(true);
	});
	//console.log("Total height is " + totalHeight + " and CSS height is " + tbodyCSSHeight);
	if ( tbodyCSSHeight > totalHeight ) {
		$("#driversTbody").css("height",(totalHeight)+"px").css("overflow-y","visible");
		//$("#tailTH").css("width","30px");
		//var tailTailTH = $("<th></th>").attr("class","rowLabelTD").css("width",15).css("padding-right","0px").css("background-color","#EEEEEE");
		$("#titleRow").append(tailTailTH);
		//var tbodyCSSHeight = parseFloat($("#applicantTbody").css("height"),10);
		//console.log("Total height is " + totalHeight + " and fixed CSS height is " + tbodyCSSHeight);
	}


}


function disableDriversTableSelectors() {
	deactivateTopbarLinks();
	$(".driversTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#driversTableButton").prop("disabled",true);

}

function enableDriversTableSelectors() {
	activateTopbarLinks();
	$(".driversTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#driversTableButton").prop("disabled",false);
}


function activateDriversTableSelectors() {
	$(".driversTableSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var selectorList = queryDriversTableSelectorValues();
			//console.log(selectorList);
			refreshDriversTable(selectorList);
		});
	});
	$("#driversGraphButton").unbind("click");
	$("#driversGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/driversgraph.js",dataType: "script"});
	});

}

function addDriversTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectDriversTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectDriversTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var driversTableHolder = $("#driversTableDiv").detach();
			$("#display-area-xs").html(driversTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectDriversTable = "mobile";
		}
		if ( windowAspectDriversTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var driversTableHolder = $("#driversTableDiv").detach();
			$("#display-area").html(driversTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectDriversTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectDriversTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 181;
		var displayAreaHeight = $(window).height() - 51;
		var displayAreaMobileHeight = 500;
		var tableContainerMobileHeight = 450;
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectDriversTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#driversTableDiv").css("width",tableContainerWidth);
		var visibleTable = createVisibleDriversTable(formattedTable);
		$("#driversTableDiv").html(visibleTable);
		
		if ( windowAspectDriversTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#driversTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#driversTableDiv").css("height",tableContainerMobileHeight);
		}
		
		adjustTopbarPadding();

	
	});
}




function driverCellColor(tstat){
	if ( tstat < -2.576 ) {
		return "#99ff99";
	}
	if ( tstat < -1.96 ) {
		return "#bbffbb";
	}
	if ( tstat < -1.645 ) {
		return "#ddffdd";
	}
	if ( tstat > 2.576 ) {
		return "#ff9999";
	}
	if ( tstat > 1.96 ) {
		return "#ffbbbb";
	}
	if ( tstat > 1.645 ) {
		return "#ffdddd";
	}
	
	return "#ffffff";
}



