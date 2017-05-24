/**
 * 
 */


//No reason for the background to leak past the bottom of the page, unless the page is really short

var windowAspectApplicantGraph = "";
windowAspectApplicantGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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


underlineOnlyThisLink("#applicantLink");

// Show a "loading" animation


displayGraphSpinner(windowAspectApplicantGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Applicants</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Description of recruitment and selection process.</h4>');

if ( linksTable.containsKey("markets") &&  linksTable.get("markets") === true  ) {
	var laborMarketButton = $("<button></button>").attr('id','laborMarketButton').attr('class','btn btn-default btn-block')
	.text("Labor Markets").css("margin-bottom","10px").css("padding","10px");
}


var applicantButton = $("<button></button>").attr('id','applicantButton').attr('class','btn btn-default btn-block').prop("disabled",true)
.text("Applicants").css("margin-bottom","10px").css("padding","10px");

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);
$(selectorButtonBox).append(applicantButton);
$(selectorButtonBox).append(laborMarketButton);

if ( windowAspectApplicantGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}


var dataVaryingSelector = "";
var selectorList = [];
var applicantHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var selectedGraph = [];
var selectedSummaryGraph = [];
var firstRendering = true;
var defaultSelector = "periodName";

refreshApplicantGraph();

function refreshApplicantGraph() {
	var selectorsUpToDate = false;
    var applicantGraphUpToDate = false;
    var applicantRawGraph = {};
	//var varyingSelectorValue = $("#turnoverShowBySelector option:selected").val();
    disableApplicantGraphSelectors();
    displayGraphSpinner(windowAspectApplicantGraph);
    $.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		//Use applicantbytenure because it ends one year earlier
		data: { type : "getselectorsapplicant" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log("Raw selector data:");
			//console.log(data);
			var defaultSelectorList = [];
			defaultSelector = data.defaultSelector;
	    	selectorList = data.selectorList;
			selectorsUpToDate = true;
    		if ( applicantGraphUpToDate ) {
    			selectorsEverDrawn = false;
    			redrawApplicantSelectorBoxes();
    			selectedGraph = selectedApplicantGraph();
    			redrawApplicantGraph(selectedGraph);
    		}
		}
});
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "applicantgraph" , 
			  } ,
    	dataType: "json" ,
    	success: function(data) {
			//console.log("Raw graph data:");
    		//console.log(data);
    		applicantRawGraph = data;
    		$(applicantRawGraph.rows).each(function() {
    			var thisRowData = {
    					applied : this.applied,
    					offered : this.offered , 
    					accepted : this.accepted ,
    					hired : this.hired ,
    					offerRate : this.offerRate,
    					appliedAcceptRate : this.appliedAcceptRate,
    					offeredAcceptRate : this.offeredAcceptRate,
    					employRate : this.employRate
    			};
    			applicantHashtable.put(this.selectorValues , thisRowData);
    		});
    		//console.log("Hash table:");
    		//console.log(applicantHashtable.entries());
    		applicantGraphUpToDate = true;
    		if ( selectorsUpToDate ) {
    			selectorsEverDrawn = false;
    			redrawApplicantSelectorBoxes();
    			selectedGraph = selectedApplicantGraph();
    			redrawApplicantGraph(selectedGraph);
    		}
    	}
    		
    });
}

//Hash equality based on objects with selector names as properties.  Planning to discard....
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

function failedSelectionHashCode(selection) {
	$(selection).each(function() {
		if ( "periodName" === this.selectorName ) {
			return this.selectorValue;
		}
	});
}



function selectedApplicantGraph() {
	var returnGraph = [];
	var graphRowSelections;
	var selectedShowBy = $("#applicantShowBySelector option:selected").val();
	//console.log("selectedShowBy is " + selectedShowBy);
	$(selectorList).each(function() {
		if ( this.selectorName === selectedShowBy ) {
			graphRowSelections = this.selectorValues;
		}
	});
	
	$(graphRowSelections).each(function() {
		var selectedValueKey = [];
		var thisRowName = this.valueName;
		var thisRowLabel = this.valueLabel;
		$(selectorList).each(function() {
			if ( this.selectorName === selectedShowBy ) {
				selectedValueKey.push({ selectorName : this.selectorName , 
					selectorValue :  thisRowName});
			}
			else {
				selectedValueKey.push({ selectorName : this.selectorName , 
					selectorValue :  $("#" + this.selectorName + " option:selected").val()});

			}
		});
		//console.log("Selected value key:");
		//console.log(selectedValueKey);
		var thisApplicantRow = applicantHashtable.get(selectedValueKey);
		//console.log(thisApplicantRow);
		if ( thisApplicantRow != null && thisApplicantRow.applied > 0 ) {
			var thisGraphRow =  { 	
	            	   category: thisRowLabel,
	            	   applied : thisApplicantRow.applied,
	            	   offered : thisApplicantRow.offered , 
	            	   accepted : thisApplicantRow.accepted ,
	            	   hired : thisApplicantRow.hired ,
	            	   offerRate : thisApplicantRow.offerRate ,
	            	   appliedAcceptRate : thisApplicantRow.appliedAcceptRate ,
	            	   offeredAcceptRate : thisApplicantRow.offeredAcceptRate ,
	            	   employRate : thisApplicantRow.employRate
			};
			returnGraph.push(thisGraphRow);
			
		}

		
	});


	
	//console.log("Selected graph data:");
	//console.log(returnGraph);
	return returnGraph;
	
}

function redrawApplicantSelectorBoxes() {
	var activeSelectorsList = [];
	//console.log("selectorList:" + selectorList);
	if (selectorsEverDrawn ) {
		var usedShowBySelector = $("#applicantShowBySelector option:selected").val();
	}
	else {
		usedShowBySelector = defaultSelector;
	}
	var applicantShowBySelector = $("<select></select>").attr("id","applicantShowBySelector").attr("class","form-control").attr("width","200px");
	var showByDiv = $("<div></div>").attr("id","showByDiv")//.css("padding","15px")
						.css("background-color","#44494C").css("margin-top","10px")
						.css("margin-bttom","10px");
	$(showByDiv).append("<p>Display by:</p>").attr("class","h3").css("color","#dddddd	");
	$(showByDiv).append(applicantShowBySelector);
	$(selectorList).each(function() {
		var showByValue = $("<option></option>").attr("value",this.selectorName).text(this.selectorLabel);
		$(applicantShowBySelector).append(showByValue);
		var defaultFound = false;
		if ( this.selectorName === usedShowBySelector ) {
			$(showByValue).attr("selected","selected");
		}
		var allSelected = false;
		if (selectorsEverDrawn ) {
			if ( this.selectorName === usedShowBySelector ) {
				var usedDefaultValue = this.defaultValue;
			}
			else {
				var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();				
			}
			if ( $("#" + this.selectorName + " option:selected").text().substring(0,6) !== "Select" && $("#" + this.selectorName + " option:selected").val() == "All" ) {
				allSelected = true;
			}
		}
		else {
			var usedDefaultValue = this.defaultValue;
			allSelected = true;
		}
		//console.log("Selector is " + this.selectorName + " and allSelected is " + allSelected + " and selectorsEverDrawn is " + selectorsEverDrawn);
		  //$(selectorButtonBox).append(this.selectorName);
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
		.attr("class","form-control applicantGraphSelect").attr("width","300px")
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
    					if ( this.selectorName === usedShowBySelector ) {
        					thisSelection.push({selectorName : checkedSelectorName , 
								selectorValue : "All" });
    						
    					}
    					else {
        					thisSelection.push({selectorName : checkedSelectorName , 
								selectorValue : checkedSelectorValue });    						
    					}
    				}
    			});
				var checkedHashEntry = applicantHashtable.get(thisSelection);
				if ( checkedHashEntry != null ) {
					if (	checkedHashEntry.applied > 0 ) {
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
    	if ( this.selectorName === usedShowBySelector ) {
    		$(thisSelector.prop("disabled",true));
    	}
    	activeSelectorsList.push(thisSelector);
	});
	/*$(activeSelectorsList).each(function() {
		$(this).childen.eq(0).prop("disabled",true);
	});*/
	
	
	
	/*var titleDivDetached = $("#titleDiv").detach();
	var applicantGraphButtonDetached = $("#applicantGraphButton").detach();
	var applicantTableButtonDetached = $("#applicantTableButton").detach();
	var marketTableButtonDetached = $("#marketsTableButton").detach();
	var marketGraphButtonDetached = $("#marketsGraphButton").detach();

	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(applicantGraphButtonDetached);
	$(selectorButtonBox).append(applicantTableButtonDetached);
	$(selectorButtonBox).append(marketGraphButtonDetached);
	$(selectorButtonBox).append(marketTableButtonDetached);*/
	
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var laborMarketButtonDetached = $("#laborMarketButton").detach();
	var applicantButtonDetached = $("#applicantButton").detach();

	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantButtonDetached);
	$(selectorButtonBox).append(laborMarketButtonDetached);

	$(selectorButtonBox).append(showByDiv);	
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	selectorsEverDrawn = true;
	
	//console.log(activeSelectorsList);
}


function redrawApplicantGraph(graphData) {
	displayApplicantGraphSpinner();
	disableApplicantGraphSelectors();
	windowAspectApplicantGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var chartTable = applicantChartTable(graphData);


	var chartContainerWidth = (windowAspectApplicantGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	chartContainerWidth = chartContainerWidth + "px";
	var lowerBoxesHeight = $(window).height() - 50;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if ( windowAspectApplicantGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}

	$("#applicantChartDiv").detach();
	$("#menuDiv").detach();

	var menuDiv = $("<div></div>").attr("id","menuDiv")
			.css("height","30px").css("width",chartContainerWidth+20).attr("class","btn-group-justified");
	
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','applicantGraphButton');
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','applicantTableButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	var applicantChartDiv = $("<div></div>").attr("id","applicantChartDiv")
		.css("height",chartContainerHeight+"px").css("width",chartContainerWidth).css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px")
		.css("margin-left","30px").css("margin-right","30px");
	//Attach first, otherwise AmCharts won't work....
	if ( windowAspectApplicantGraph == "desktop") {
		$("#display-area").html(menuDiv);
		$("#display-area").append(applicantChartDiv);
		$("#leftbar-div").html(selectorButtonBox);
	}
	else {
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(applicantChartDiv);
		$("#leftbar-div-xs").html(selectorButtonBox);
	}
	var displayWidth =  $( window ).width() - 225;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");
	$(applicantChartDiv).html(chartTable);
	//We have to refresh the HTML to render the SVG (which is non-HTML)
	$("#applicantChartTable").html($("#applicantChartTable").html());
	$("#applicantChartLegendTable").html($("#applicantChartLegendTable").html());

	var totalHeight = 0;
	var tbodyCSSHeight = parseFloat($("#applicantChartTbody").css("height"),10);
	$("#applicantChartTbody").children().each(function(){
	    totalHeight = totalHeight + $(this).outerHeight(true);
	});
	//console.log("Total height is " + totalHeight + " and CSS height is " + tbodyCSSHeight);
	if ( tbodyCSSHeight > totalHeight + 50 ) {
		$("#applicantChartTbody").css("height",(totalHeight+50)+"px")
		var tbodyCSSHeight = parseFloat($("#applicantChartTbody").css("height"),10);
		//console.log("Total height is " + totalHeight + " and fixed CSS height is " + tbodyCSSHeight);
		$("#legendTR").css("top",(totalHeight+150)+"px")
	}
	

	
	redrawApplicantSelectorBoxes();
	enableApplicantGraphSelectors();
	activateApplicantGraphSelectors();
	addApplicantResizeListener();
}


function applicantChartTable(graphData) {

	var colors = ["#152D4F","#5A6C85","#B6C0CD","#AAAAAA"];
	var chartContainerWidth = (windowAspectApplicantGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	if ( windowAspectApplicantGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}

	var tableWidth = 300 + 28*Math.floor((chartContainerWidth-300)/28);
	var theadWidth = tableWidth;
	var tbodyWidth = tableWidth;
	var tbodyHeight = chartContainerHeight - 150;
	var characterWidth = Math.floor((tableWidth-300)/28);
	var halfCharacterWidth = characterWidth/2;
	var labelWidth = 2*characterWidth;
	var applicantsWidth = 100+halfCharacterWidth;
	var fiveHalvesCharacterWidth = 2.5*characterWidth;
	var threeCharacterWidths = 3*characterWidth;
	
	var indexWidth = characterWidth*5;
	var topBarWidth = characterWidth*25;
	
	//var lesserWidth = 250 + (lastPeriod-firstPeriod+1)*100;
	//var extraWidth = tbodyWidth - lesserWidth+100;
	//var lesserWidth = tableContainerWidth - 25;
	//var padding = extraWidth - 90;
	//padding = padding + "px";
	//var tbodyWidth = tbodyWidth + "px";
	//var lesserWidth = lesserWidth + "px";
	//var extraWidth = extraWidth + "px";

	var chartTable = $("<table></table>").attr("id","applicantChartTable").css("width",tableWidth + "px").css("table-layout","fixed");
	var chartThead = $("<thead></thead>").attr("id","applicantChartThead").css("width",theadWidth + "px");
	var chartTbody = $("<tbody></tbody>").attr("id","applicantChartTbody")
			.css("overflow-y","scroll").css("position","absolute")
			.css("height",tbodyHeight+"px").css("width",tbodyWidth+"px");

	var outerTable = $("<table></table>").attr("id","applicantChartOuterTable").css("width",tableWidth + "px")
						.css("margin",0).css("padding",0);
	var outerTbody = $("<tbody></tbody>").attr("id","applicantChartOuterTbody")
			.css("height","100px").css("width",tableWidth+"px")
			.css("margin",0).css("padding",0);
	$(outerTable).append(outerTbody);
	var mainTableTR = $("<tr></tr>").attr("id","mainTableTR").css("width","100%");
	var mainTableTD = $("<td></td>").attr("id","mainTableTD").css("width","100%");
	$(mainTableTR).append(mainTableTD);
	$(outerTbody).append(mainTableTR);
	var legendTR = $("<tr></tr>").attr("id","legendTR").css("width","100%").css("position","absolute").css("top",(tbodyHeight+140)+"px");
	var legendTD = $("<td></td>").attr("id","legendTD").css("width","100%");
	$(legendTR).append(legendTD);
	$(outerTbody).append(legendTR);
	
	var firstRow = $("<tr></tr>");
	var blankTH = $("<th></th>").css("width","200px");
	var noOfTH = $("<th></th>").css("width","100px").text("");
	var index0 = $("<th></th>").html("0%").css("width",indexWidth+"px").attr("colspan","10");
	var index20 = $("<th></th>").html("20%").css("width",indexWidth+"px").attr("colspan","10");
	var index40 = $("<th></th>").html("40%").css("width",indexWidth+"px").attr("colspan","10");
	var index60 = $("<th></th>").html("60%").css("width",indexWidth+"px").attr("colspan","10");
	var index80 = $("<th></th>").html("80%").css("width",indexWidth+"px").attr("colspan","10");
	var index100 = $("<th></th>").html("100%").css("width",threeCharacterWidths+"px").attr("colspan","6");
	$(firstRow).append(blankTH).append(noOfTH).append(index0).append(index20).append(index40).append(index60).append(index80).append(index100);

	var secondRow = $("<tr></tr>");
	var titleTH = $("<th></th>").text($("#applicantShowBySelector option:selected").text()).css("width","200px");
	var secondTH = $("<th></th>").html("Applicants").css("width","100px");
	var thirdTH = $("<th></th>").css("width",halfCharacterWidth+"px");
	var fourthTH = $("<th></th>").html(percentLine()).css("width",topBarWidth+"px").css("height","10px").attr("colspan","50");
	var fifthTH = $("<th></th>").css("width",fiveHalvesCharacterWidth+"px");
	$(secondRow).append(titleTH).append(secondTH).append(thirdTH).append(fourthTH).append(fifthTH);
	
	var evenRow = 0;
	var rates = [  "employRate" , "appliedAcceptRate" , "offerRate" ];
	$(graphData).each(function(){
		var thisTR = $("<tr></tr>").attr("class","applicantGraphTR");
		var rowLabelTD = $("<td></td>").attr("class","applicantRowLabelTD").text(this.category).css("min-width","200px");
		$(thisTR).append(rowLabelTD);
		var applicantsTD = $("<td></td>").attr("class","applicantRowLabelTD")
					.text(addCommas(this.applied)).css("min-width",applicantsWidth+"px").attr("colspan","2")
					.css("text-align","right").css("padding-right","50px");
		$(thisTR).append(applicantsTD);
		var useWoman = (evenRow == 1 ? 0 : 1 );
		var useColor = "#62C462";
		var figuresDrawn = 0;
		var currentColorNo = 0;
		var thisFigureColors = ["#000000","#000000","#000000","#000000"];
		for ( var i = 0 ; i <= 0.960001 ; i+= 0.04 ) {
			for ( var quarter = 1 ; quarter <= 4 ; quarter++ ) {
				while ( currentColorNo <= 2 && Math.round(100*this[rates[currentColorNo]]) < 100*i + quarter ) {
					currentColorNo++;
				}
				thisFigureColors[quarter-1] = colors[currentColorNo]; 
			}
			
			var thisTD = $("<td></td>").attr("class","applicantDataTD").attr("colspan","2")
					.css("width",characterWidth+"px").css("overflow","hidden");

			if (useWoman) {
				$(thisTD).append(quarteredWoman(thisFigureColors));

			}
			else {
				$(thisTD).append(quarteredMan(thisFigureColors));				
			}
			
			switch ( currentColorNo ) {
				case 0 : 
					$(thisTD).attr("title",this.category + ": " + addCommas(this.hired) + " out of " + addCommas(this.applied) + " applicants (" + toPercent(this.employRate,this.employRate+1) + " of applicants) were hired");
				break;
				case 1 : 
					$(thisTD).attr("title",this.category + ": " + addCommas(this.accepted) + " out of " + addCommas(this.applied) + " applicants (" + toPercent(this.appliedAcceptRate,this.appliedAcceptRate+1) + " of applicants or " + toPercent(this.offeredAcceptRate,this.offeredAcceptRate+1) + " of offers) accepted job offers");
				break;
				case 2 : 
					$(thisTD).attr("title",this.category + ": " + addCommas(this.offered) + " out of " + addCommas(this.applied) + " applicants (" + toPercent(this.offerRate,this.offerRate+1) + " of applicants) were offered jobs");
				break;
				case 3 : 
					$(thisTD).attr("title",this.category + ": " + addCommas(this.applied - this.offered) + " out of " + addCommas(this.applied) + " applicants (" + toPercent(1-this.offerRate,this.offerRate+1) + " of applicants) were rejected");
				break;
			}
			//$(thisTD).tooltip();
			$(thisTR).append(thisTD);
			figuresDrawn++;
			useWoman = 1 - useWoman;
			
		}		
		var thisTD = $("<td></td>").attr("class","applicantDataTD").attr("colspan","2")
		.css("width",characterWidth+"px").css("overflow","hidden");
		$(thisTR).append(thisTD);
		var thisTD = $("<td></td>").attr("class","applicantDataTD").attr("colspan","2")
		.css("width",characterWidth+"px").css("overflow","hidden");
		$(thisTR).append(thisTD);
		if ( this.category != ("Select " + $("#applicantShowBySelector option:selected").text()) && !($("#applicantShowBySelector option:selected").val() == "periodName" && this.category === "All")) {
			$(chartTbody).append(thisTR);
			evenRow = 1 - evenRow;			
		}
	});

	var legendTable = $("<table></table>").attr("id","applicantChartLegendTable").css("width",tableWidth + "px")
	.css("margin",0).css("padding",0);
	var legendTbody = $("<tbody></tbody>").attr("id","applicantChartLegendTbody")
		.css("height","100px").css("width",tableWidth+"px")
		.css("margin",0).css("padding",0);
	$(legendTable).append(legendTbody);

	var legendRow = $("<tr></tr>");
	var legendTitleTD = $("<td></td>").text("").css("width","200px");
	var legendSecondTD = $("<td></td>").html("").css("min-width",applicantsWidth+"px");
	if ( $(window).width() < 1200 ) {
		var legendSecondRow = $("<tr></tr>");
		var legendSecondTitleTD = $("<td></td>").text("").css("width","200px");
		var legendSecondSecondTD = $("<td></td>").html("").css("min-width",applicantsWidth+"px");		
		$(legendSecondRow).append(legendSecondTitleTD).append(legendSecondSecondTD);
	}
	$(legendRow).append(legendTitleTD).append(legendSecondTD);
	var legendLabels = [ "Hired", "Accepted Offer", "Offered Job" , "Rejected"];
	for ( var i = 0 ; i <=3 ; i++ ) {
		var boxTD = $("<td></td>").css("width",characterWidth+"px").css("overflow","hidden").attr("colspan","1").html(coloredBox(colors[i],20));
		var legendLabelTD = $("<td></td>").attr("colspan",5).css("width",(5*characterWidth)+"px").css("padding-left","10px").html(legendLabels[i]);
		if ( $(window).width() < 1200 ) {
			$(boxTD).css("width",(2*characterWidth)+"px")
			$(legendLabelTD).css("width",(10*characterWidth)+"px")
		}
		if ( $(window).width() < 1200 && i >= 2 ) {
			$(legendSecondRow).append(boxTD).append(legendLabelTD);
		}
		else {
			$(legendRow).append(boxTD).append(legendLabelTD);			
		}
	}
	//var legendEndTD = $("<td></td>").html("").attr("class","applicantDataTD").attr("colspan","2");
	//$(legendRow).append(legendEndTD);
	$(legendTbody).append(legendRow);
	if ( $(window).width() < 1200 ) {
		$(legendTbody).append(legendSecondRow);		
	}

	$(chartThead).append(firstRow);
	$(chartThead).append(secondRow);
	$(chartTable).append(chartThead);
	$(chartTable).append(chartTbody);
	
	
	$(mainTableTD).html(chartTable);
	$(legendTD).html(legendTable);
	//return chartTable;
	return outerTable;
}


function displayApplicantGraphSpinner() {
	var spinnerMargin = (windowAspectApplicantGraph == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
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

function disableApplicantGraphSelectors() {
	deactivateTopbarLinks();
	$(".applicantGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$(".turnoverGraphMultiSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#rateSelector").unbind("change");
	$("#applicantShowBySelector").unbind("change");
	$("#rateSelector").prop("disabled",true);
	$("#applicantShowBySelector").prop("disabled",true);
	
	$("#laborMarketButton").unbind("click");
	$("#laborMarketButton").prop("disabled",true);
	/*$("#applicantGraphButton").unbind("click");
	$("#applicantTableButton").unbind("click");
	$("#applicantTableButton").prop("disabled",true);	
	$("#marketsTableButton").unbind("click");
	$("#marketsGraphButton").unbind("click");*/

}

function enableApplicantGraphSelectors() {
	activateTopbarLinks();
	
	$("#applicantShowBySelector").prop("disabled",false);
	$("#rateSelector").prop("disabled",false);
	$("#laborMarketButton").prop("disabled",false);

	$("#applicantTableButton").prop("disabled",false);	
	/*$("#marketsTableButton").prop("disabled",false);
	$("#marketsGraphButton").prop("disabled",false);*/
	
}




function activateApplicantGraphSelectors() {
	$(".applicantGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableApplicantGraphSelectors();
			selectedGraph = selectedApplicantGraph();
			redrawApplicantGraph(selectedGraph);
		});
	});
	$("#applicantShowBySelector").unbind("change");
	$(".applicantGraphSelect").each(function() {
		$(this).prop( "disabled", false );
	});
	//$("#" + $("#applicantShowBySelector option:selected").val()).prop( "disabled", true );
	$("#" + $("#applicantShowBySelector option:selected").val()).css( "display", "none" );
	$("#applicantShowBySelector").change(function() {
		disableApplicantGraphSelectors();
		selectedGraph = selectedApplicantGraph();
		redrawApplicantGraph(selectedGraph);
	});
	
	$("#laborMarketButton").unbind("click");
	$("#laborMarketButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/marketsgraph.js",dataType: "script"});
	});
		
	$("#applicantGraphButton").unbind("click");
	
	$("#applicantTableButton").unbind("click");
	$("#applicantTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/applicanttable.js",dataType: "script"});
	});
	/*$("#marketsTableButton").unbind("click");
	$("#marketsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/marketstable.js",dataType: "script"});
	});
	$("#marketsGraphButton").unbind("click");
	$("#marketsGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/marketsgraph.js",dataType: "script"});
	});*/

}

function addApplicantResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		selectedGraph = selectedApplicantGraph();
		redrawApplicantGraph(selectedGraph);
	});
}


function oldApplicantGraphResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectApplicantGraph + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectApplicantGraph == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
	   		//var headcountTableHolder = $("#headcountTableDiv");
			var applicantChartHolder = $("#applicantChartDiv").detach();
			$("#display-area-xs").html(applicantChartHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectApplicantGraph = "mobile";
		}
		if ( windowAspectApplicantGraph != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			//var headcountTableHolder = $("#headcountTableDiv");
			var applicantChartHolder = $("#applicantChartDiv").detach();
			$("#display-area").html(applicantChartHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectApplicantGraph = "desktop";
		}
		
		var tableContainerWidth = (windowAspectApplicantGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -300;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		var displayAreaMobileHeight = $(window).height() - 331;
		var tableContainerMobileHeight = $(window).height() - 391;
		if ( tableContainerMobileHeight < 500 ) {
			tableContainerMobileHeight = 500;
			displayAreaMobileHeight = 550;
		}
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectApplicantGraph == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		var displayedColumns =  Math.max(Math.floor((tableContainerWidth-250)/100),2);
		tableContainerWidth = tableContainerWidth + "px";
		$("#applicantChartDiv").css("width",tableContainerWidth);
		
		if ( windowAspectApplicantGraph == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#applicantChartDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#applicantChartDiv").css("height",tableContainerMobileHeight);
		}
		var chartTable = applicantChartTable($("#rateSelector option:selected").val());
		$("#applicantChartDiv").html(chartTable);
		//We have to refresh the HTML to render the SVG (which is non-HTML)
		$("#applicantChartTable").html($("#applicantChartTable").html());
		resetApplicantTableButtonListener();
		activateApplicantGraphSelectors();
		adjustTopbarPadding();

	
	});
}

//For some reason this keeps coming unbound when one resets from mobile
//to desktop view. I think it's a bootstrap bug but anyway the solution
//is just to reset the binding when the view gets reset....
function resetApplicantTableButtonListener() {
	$("#applicantGraphButton").unbind("click");
	$("#applicantTableButton").unbind("click");
	$("#applicantTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/applicanttable.js",dataType: "script"});
	});
	/*$("#marketsTableButton").unbind("click");
	$("#marketsTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/marketstable.js",dataType: "script"});
	});
	$("#marketsGraphButton").unbind("click");
	$("#marketsGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/marketsgraph.js",dataType: "script"});
	});*/

}


function requeryAndRefreshApplicant() {
	var updatedSelectorList = [];
	$(".applicantGraphSelect").each(function() {
		var thisSelection = {
				selectorName : $(this).attr("id") ,
				selectorValue: $(this).find(":selected").val()		
		};
		updatedSelectorList.push(thisSelection);
	});
	//console.log(updatedSelectorList);
	var selectedVaryingSelector = $("#applicantShowBySelector option:selected").val();
	//console.log("On requery, varying selector is " + selectedVaryingSelector);
	displayApplicantGraphSpinner();
	disableApplicantGraphSelectors();
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { 
    		type : "applicantgraph" , 
    		varyingselector : selectedVaryingSelector, 
    		selectorlist : JSON.stringify(updatedSelectorList) 
			} ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		dataVaryingSelector = data.varyingSelectorLabel;
    		applicantGraphArray.length = 0;
    		$(data.applicantSelectionList).each( function(){
    			applicantGraphArray.push(this.graph);
    		});
    		//console.log(applicantGraphArray);
    		
    		
    		var chartTable = applicantChartTable($("#rateSelector option:selected").val());
    		//console.log(chartTable);
    		var chartContainerWidth = (windowAspectApplicantGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
    		if ( chartContainerWidth < 400 ) {
    			chartContainerWidth = 400;
    		}
    		chartContainerWidth = chartContainerWidth + "px";
    		var lowerBoxesHeight = $(window).height() - 111;
    		var lowerBoxesMobileHeight = $(window).height() - 311;

    		if ( lowerBoxesHeight < 500 ) {
    			lowerBoxesHeight = 500;
    		}
    		if ( lowerBoxesMobileHeight < 500 ) {
    			lowerBoxesMobileHeight = 500;
    		}
    		var chartContainerHeight = lowerBoxesHeight - 50;
    		if ( windowAspectApplicantGraph == "mobile" ) {
    			chartContainerHeight = lowerBoxesMobileHeight - 50;
    		}

    		var applicantChartDiv = $("<div></div>").attr("id","applicantChartDiv")
    			.css("height",chartContainerHeight+"px").css("width",chartContainerWidth).css("vertical-align","middle")
    			.css("display","inline-block").css("margin-top","30px")
    			.css("margin-left","30px").css("margin-right","30px");
    		//Attach first, otherwise AmCharts won't work....
			if ( windowAspectApplicantGraph == "desktop") {
	    		$("#display-area").html(applicantChartDiv);
			}
			else {
	    		$("#display-area-xs").html(applicantChartDiv);
			}
			var displayWidth =  $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#display-area").css("width",displayWidth);
			$("#leftbar-div").css("height",lowerBoxesHeight+"px");
			$("#display-area").css("height",lowerBoxesHeight+"px");
			$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");
    		$(applicantChartDiv).html(chartTable);
			//We have to refresh the HTML to render the SVG (which is non-HTML)
			$("#applicantChartTable").html($("#applicantChartTable").html());
			$("#applicantChartLegendTable").html($("#applicantChartLegendTable").html());
    		enableApplicantGraphSelectors();
       		activateApplicantGraphSelectors();
       		resetApplicantTableButtonListener();

    	}
	});

}


var characterHeight = "40";
function manFilled(fillColor) {
	var manFilled = $("<svg></svg>").attr("version","1.1")
						.attr("x","0").attr("y","0")
						//.attr("width","20")
						.attr("height",characterHeight+"px")
						.attr("viewBox","0, 0, 20, 50")
						.attr("preserveAspectRatio","none")
						.css("width","90%")
						//.css("height","100%");
	$(manFilled).html('<g>' +
			'<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 z" fill=" ' + fillColor +'"/>' +
			'<path d="M4,48 L4,15 L3,15 L3,27 C3,29 0,29 0,27 L0,14 C0,11 2,9 4,9 L16,9 C18,9 20,12 20,14 L20,27 C20,29 17,29 17,27 L17,15 L16,15 L16,48 C16,49 15,50 13,50 C12,50 11,49 11,48 L11,29 L9,29 L9,48 C9,49 8,50 7,50 C6,50 4,49 4,48 z" fill="' + fillColor + '"/>' +
		'</g>');
	return manFilled;
}

function manQuarterFilled(fillColor,backgroundColor) {
	var manQuarterFilled = $("<svg></svg>").attr("version","1.1")
						.attr("x","0").attr("y","0")
						//.attr("width","20")
						.attr("height",characterHeight+"px")
						.attr("viewBox","0, 0, 20, 50")
						.attr("preserveAspectRatio","none")
						.css("width","90%")
						//.css("height","100%");
 $(manQuarterFilled).html('<g>' +
    '<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 z" fill="' + backgroundColor + '"/>' +
    '<path d="M4,48 L4,9 L16,9 C18,9 20,12 20,14 L20,27 C20,29 17,29 17,27 L17,15 L16,15 L16,48 C16,49 15,50 13,50 C12,50 11,49 11,48 L11,29 L9,29 L9,48 C9,49 8,50 7,50 C6,50 4,49 4,48 z" fill="' + backgroundColor + '"/>' +
    '<path d="M4,15 L3,15 L3,27 C3,29 0,29 0,27 L0,14 C0,11 2,9 4,9 L5,9 L5,49.2 C4.5,49 4,48.5 4,48 L4,15 z" fill="' + fillColor + '"/>' +
    '</g>');
 	return manQuarterFilled;
}
 
function manHalfFilled(fillColor,backgroundColor) {
	var manHalfFilled = $("<svg></svg>").attr("version","1.1")
	.attr("x","0").attr("y","0")
	//.attr("width","20")
	.attr("height",characterHeight+"px")
	.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(manHalfFilled).html('<g>' +
	    '<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 L10,9 z" fill="' + fillColor + '"/>' +
	    '<path d="M10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 L10,0 z" fill="' + backgroundColor + '"/>' +
	    '<path d="M4,48 L4,15 L3,15 L3,27 C3,29 0,29 0,27 L0,14 C0,11 2,9 4,9 L10,9 L10,29 L9,29 L9,48 C9,49 8,50 7,50 C6,50 4,49 4,48 z" fill="' + fillColor + '"/>' +
	    '<path d="M10,9 L16,9 C18,9 20,12 20,14 L20,27 C20,29 17,29 17,27 L17,15 L16,15 L16,48 C16,49 15,50 13,50 C12,50 11,49 11,48 L11,29 L10,29 L10,9 z" fill="' + backgroundColor + '"/>' +
'</g>');
	return manHalfFilled;
}

function man3QuartersFilled(fillColor,backgroundColor) {
	var man3QuartersFilled = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight)
		.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(man3QuartersFilled).html('<g>' +
'<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 z" fill="' + fillColor + '"/>' +
'<path d="M16,48 L16,9 L4,9 C2,9 0,12 0,14 L0,27 C0,29 3,29 3,27 L3,15 L4,15 L4,48 C4,49 5,50 7,50 C8,50 9,49 9,48 L9,29 L11,29 L11,48 C11,49 12,50 13,50 C14,50 16,49 16,48 z" fill="' + fillColor + '"/>' +
'<path d="M16,15 L17,15 L17,27 C17,29 20,29 20,27 L20,14 C20,11 18,9 16,9 L15,9 L15,49.2 C15.5,49 16,48.5 16,48 L16,15 z" fill="' + backgroundColor + '"/>' +
'</g>');
	return man3QuartersFilled;
}

function womanFilled(fillColor) {
	var womanFilled = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight)
		.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(womanFilled).html('<g>' +
'<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 z" fill="' + fillColor + '"/>' +
'<path d="M15,9 C15.25,9 16.75,11.5 17.25,12.75 L20,24.25 C20.5,26.75 18,27.75 17.5,25.25 L15,14.75 L14.5,14.75 L17.75,33.5 L13.75,33.5 L13.75,48.25 C13.75,50.75 10.75,50.5 10.75,48.25 L10.75,33.5 L9.25,33.5 L9.25,48 C9.25,50.75 6.25,50.75 6.25,48 L6.25,33.5 L2.25,33.5 L5.5,14.75 L5,14.75 L2.5,25.25 C2,27.5 -0.5,26.75 0,24.25 L2.75,12.75 C3.25,11.25 4.5,9 5,9 L15,9 z" fill="' + fillColor + '"/>' +
'</g>');
	return womanFilled;
}
	
function womanQuarterFilled(fillColor,backgroundColor) {	
	var womanQuarterFilled = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight)
		.attr("viewBox","0, 0, 20, 50")
			.attr("preserveAspectRatio","none")
			.css("width","90%")
			//.css("height","100%");
	$(womanQuarterFilled).html('<g>' +
			'<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 z" fill="' + backgroundColor + '"/>' +
			'<path d="M15,9 C15.25,9 16.75,11.5 17.25,12.75 L20,24.25 C20.5,26.75 18,27.75 17.5,25.25 L15,14.75 L14.5,14.75 L17.75,33.5 L13.75,33.5 L13.75,48.25 C13.75,50.75 10.75,50.5 10.75,48.25 L10.75,33.5 L9.25,33.5 L9.25,48 C9.25,50.75 6.25,50.75 6.25,48 L6.25,33.5 L5,33.5 L5,17.635 L5.5,14.75 L5,14.75 L5,9 L15,9 z" fill="' + backgroundColor +'"/>' +
			'<path d="M5,14.75 L2.5,25.25 C2,27.5 -0.5,26.75 0,24.25 L2.75,12.75 C3.25,11.25 4.5,9 5,9 z" fill="' + fillColor + '"/>' +
			'<path d="M2.25,33.5 L5,17.635 L5,33.5 L2.25,33.5 z" fill="' + fillColor + '"/>' +
			'</g>');

	return womanQuarterFilled;
}

function womanHalfFilled(fillColor,backgroundColor) {
	var womanHalfFilled = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight)
		.attr("viewBox","0, 0, 20, 50")	
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(womanHalfFilled).html('<g>' +
			'<path d="M10,9 C8,9 6,7 6,5 C6,2 8,0 10,0 L10,9 z" fill="' + fillColor + '"/>' +
			'<path d="M10,0 C12,0 14,2 14,5 C14,7 12,9 10,9 L10,0 z" fill="' + backgroundColor + '"/>' +
			'<path d="M10,9 L15,9 C15.25,9 16.75,11.5 17.25,12.75 L20,24.25 C20.5,26.75 18,27.75 17.5,25.25 L15,14.75 L14.5,14.75 L17.75,33.5 L13.75,33.5 L13.75,48.25 C13.75,50.75 10.75,50.5 10.75,48.25 L10.75,33.5 L10,33.5 L10,9 z" fill="' + backgroundColor + '"/>' +
			'<path d="M10,33.5 L9.25,33.5 L9.25,48 C9.25,50.75 6.25,50.75 6.25,48 L6.25,33.5 L2.25,33.5 L5.5,14.75 L5,14.75 L2.5,25.25 C2,27.5 -0.5,26.75 0,24.25 L2.75,12.75 C3.25,11.25 4.5,9 5,9 L10,9 L10,33.5 z" fill="' + fillColor + '"/>' +
			'</g>');
	return womanHalfFilled;
}

function woman3QuartersFilled(fillColor,backgroundColor) {
	var woman3QuartersFilled = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight)
		.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(woman3QuartersFilled).html('<g>' +
			'<path d="M 10,9 C 8,9 6,7 6,5 6,2 8,0 10,0 c 2,0 4,2 4,5 0,2 -2,4 -4,4 z" fill="' + fillColor + '"/>' +
			'<path d="M5,9 C4.75,9 3.25,11.5 2.75,12.75 L0,24.25 C0.5,26.75 2,27.75 2.5,25.25 L5,14.75 L5.5,14.75 L2.25,33.5 L6.25,33.5 L6.25,48.25 C6.25,50.75 9.25,50.5 9.25,48.25 L9.25,33.5 L10.75,33.5 L10.75,48 C10.75,50.75 13.75,50.75 13.75,48 L13.75,33.5 L15,33.5 L15,17.635 L15.5,14.75 L15,14.75 L15,9 L5,9 z" fill="' + fillColor + '"/>' +
			'<path d="M15,14.75 L17.5,25.25 C18,27.5 20.5,26.75 20,24.25 L17.25,12.75 C16.75,11.25 15.5,9 15,9 z" fill="' + backgroundColor + '"/>' +
			'<path d="M17.75,33.5 L15,17.635 L15,33.5 L17.75,33.5 z" fill="' + backgroundColor + '"/>' +
			'</g>');
	return woman3QuartersFilled;
}


function quarteredWoman(colors) {
	var quarteredWoman = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight+"px")
		.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(quarteredWoman).html('<g>' +
			//Left quarter of body
			'<path d="M2.25,33.5 L5,17.635 L5,33.5 L2.25,33.5 z" fill="' + colors[0] + '"/>' +
			//Second quarter of body
			'<path d="M10,9 L10,33.5 L9.25,33.5 L9.25,48 C9.25,50.75 6.25,50.75 6.25,48 L6.25,33.5 L5,33.5 L5,17.635 L5.5,14.75 L5,14.75 L5,9 L10,9 z" fill="' + colors[1] +'"/>' +
			//Third quarter of body
			'<path d="M10,9 L10,33.5 L10.75,33.5 L10.75,48 C10.75,50.75 13.75,50.75 13.75,48 L13.75,33.5 L15,33.5 L15,17.635 L14.5,14.75 L15,14.75 L15,9 L10,9 z" fill="' + colors[2] +'"/>' +
			//Right quarter of body
			'<path d="M17.75,33.5 L15,17.635 L15,33.5 L17.75,33.5 z" fill="' + colors[3] + '"/>' +
			//Left half of head
			'<path d="M 10,9 C 8,9 6,7 6,5 6,2 8,0 10,0 L10,9 z" fill="' + colors[1] + '"/>' +
			//Right half of head
			'<path d="M 10,9 C 12,9 14,7 14,5 14,2 12,0 10,0 L10,9 z" fill="' + colors[2] + '"/>' +
			'</g>');
	return quarteredWoman;
}

function quarteredMan(colors) {
	var quarteredMan = $("<svg></svg>").attr("version","1.1")
		.attr("x","0").attr("y","0")
		//.attr("width","20")
		.attr("height",characterHeight+"px")
		.attr("viewBox","0, 0, 20, 50")
		.attr("preserveAspectRatio","none")
		.css("width","90%")
		//.css("height","100%");
	$(quarteredMan).html('<g>' +
			//Left quarter of body
		    '<path d="M4,15 L3,15 L3,27 C3,29 0,29 0,27 L0,14 C0,11 2,9 4,9 L5,9 L5,49.2 C4.5,49 4,48.5 4,48 L4,15 z" fill="' + colors[0] + '"/>' +
		    //Second quarter of body
		    '<path d="M4,48 L4,9 L10,9 L10,29 L9,29 L9,48 C9,49 8,50 7,50 C6,50 4,49 4,48 z" fill="' + colors[1] + '"/>' +
			//Third quarter of body
		    '<path d="M16,48 L16,9 L10,9 L10,29 L11,29 L11,48 C11,49 12,50 13,50 C14,50 16,49 16,48 z" fill="' + colors[2] + '"/>' +
			//Right quarter of body
		    '<path d="M16,15 L17,15 L17,27 C17,29 20,29 20,27 L20,14 C20,11 18,9 16,9 L15,9 L15,49.2 C15.5,49 16,48.5 16,48 L16,15 z" fill="' + colors[3] + '"/>' +
			//Left half of head
			'<path d="M 10,9 C 8,9 6,7 6,5 6,2 8,0 10,0 L10,9 z" fill="' + colors[1] + '"/>' +
			//Right half of head
			'<path d="M 10,9 C 12,9 14,7 14,5 14,2 12,0 10,0 L10,9 z" fill="' + colors[2] + '"/>' +
			'</g>');
	return quarteredMan;
}






function percentLine() {
	var percentLine = $("<svg></svg>").attr("version","1.1")
	//.attr("x","0").attr("y","0")
	.attr("width","100").attr("height","4").css("width","100%").css("height","100%")
	.attr("viewBox","0 0 100 3")
	.attr("preserveAspectRatio","none");
	$(percentLine).html('<g id="Layer_1">' +
			'<line x1="0" y1="3" x2="99" y2="3" style="stroke:rgb(0,0,0);stroke-width:1" />' +
			'<line x1="0" y1="0" x2="00" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
			'<line x1="20" y1="0" x2="20" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
			'<line x1="40" y1="0" x2="40" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
			'<line x1="60" y1="0" x2="60" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
			'<line x1="80" y1="0" x2="80" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
			'<line x1="99" y1="0" x2="99" y2="3.5" style="stroke:rgb(0,0,0);stroke-width:0.5" />' +
	'</g>');
	//return $("<div></div>").attr("id","percentLineDiv").css("width","100%").css("height","20px").html(percentLine);
	return percentLine;
}

