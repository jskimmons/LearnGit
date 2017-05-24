/**
 * 
 */


//No reason for the background to leak past the bottom of the page, unless the page is really short

var windowAspectTurnoverGraph = "";
windowAspectTurnoverGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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


underlineOnlyThisLink("#turnoverLink");


// Show a "loading" animation

deactivateTopbarLinks();
displayGraphSpinner(windowAspectTurnoverGraph);

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Turnover</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Turnover rates of new hires and current employees, and tenure distribution of employees.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

if ( windowAspectTurnoverGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableTurnoverGraphSelectors();

var dataVaryingSelector = "";
var selectorList = [];
var formattedGraph = [];
var tenureHashtable = new Hashtable({ hashCode : selectionHashCode , equals: selectionIsEqual});
var separationHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var separationByTenureHashtable = new Hashtable({ hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var selectedGraph = [];
var selectedSummaryGraph = [];
var firstRendering = true;

refreshTurnoverGraph();

function refreshTurnoverGraph() {
	var selectorsUpToDate = false;
    var tenureGraphUpToDate = false;
    var separationGraphUpToDate = false;
    var separationByTenureGraphUpToDate = false;
    var separationRawGraph = {};
    var separationByTenureRawGraph = {};
    var tenureRawGraph = {};
	//var varyingSelectorValue = $("#turnoverShowBySelector option:selected").val();
    disableTurnoverGraphSelectors();
    displayGraphSpinner(windowAspectTurnoverGraph);
    $.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		//Use separationbytenure because it ends one year earlier
		data: { type : "getselectorsseparationbytenure" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			var defaultSelectorList = [];
	    	selectorList = data.selectorList;
	    	console.log(selectorList);
	    	//The last (first, chronologically) time period won't work for the separation chart so remove
	    	(selectorList[0]).selectorValues.splice((selectorList[0]).selectorValues.length-1,1);
	    	console.log(selectorList);

			selectorsUpToDate = true;
    		if (tenureGraphUpToDate && separationByTenureGraphUpToDate  &&separationGraphUpToDate ) {
    			redrawTurnoverSelectorBoxes();
    			selectedGraph = selectedTurnoverGraphs();
    			selectedSummaryGraph = selectedTurnoverSummaryGraphs();
    			redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
    		}
		}
});
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "tenuregraph" , 
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		tenureRawGraph = data;
    		$(tenureRawGraph.rows).each(function() {

    			//Discard:
    			//var thisRowKey = {};
    			//$(this.selectorValues).each(function() {
    			//	thisRowKey[this.selectorName] = this.selectorValue;
    			//});
    			var thisRowData = {
    					t0to30 : 	this.t0to30,
    					t31to60 : 	this.t31to60,
    					t61to90 : 	this.t61to90,
    					t91to180 : 	this.t91to180,
    					t181to365 : this.t181to365,
    					t366plus : 	this.t366plus
    			};
    			tenureHashtable.put(this.selectorValues , thisRowData);
    		});
    		//console.log("tenureHashtable" + JSON.stringify(tenureHashtable.entries()));
    		tenureGraphUpToDate = true;
    		if (separationGraphUpToDate && separationByTenureGraphUpToDate && selectorsUpToDate ) {
    			redrawTurnoverSelectorBoxes();
    			selectedGraph = selectedTurnoverGraphs();
    			selectedSummaryGraph = selectedTurnoverSummaryGraphs();
    			redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
    		}
    		
    	}
    });
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationgraph" , 
			  } ,
    	dataType: "json" ,
    	success: function(data) {
       		separationRawGraph = data;
    		$(separationRawGraph.rows).each(function() {
    			//Discard:
    			//var thisRowKey = {};
    			//$(this.selectorValues).each(function() {
    			//	thisRowKey[this.selectorName] = this.selectorValue;
    			//});
    			var thisRowData = {
    					t30 : 	this.t30,
    					t60 : 	this.t60,
    					t90 : 	this.t90,
    					t180 : 	this.t180,
    					t365 : this.t365
    			};
    			separationHashtable.put(this.selectorValues , thisRowData);
    		});
    		separationGraphUpToDate = true;
    		if (tenureGraphUpToDate && separationByTenureGraphUpToDate  && selectorsUpToDate ) {
    			redrawTurnoverSelectorBoxes();
    			selectedGraph = selectedTurnoverGraphs();
    			selectedSummaryGraph = selectedTurnoverSummaryGraphs();
    			redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
    		}
    	}
    		
    });
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationbytenuregraph" , 
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		separationByTenureRawGraph = data;
    		$(separationByTenureRawGraph.rows).each(function() {
    			//Discard:
    			//var thisRowKey = {};
    			//$(this.selectorValues).each(function() {
    			//	thisRowKey[this.selectorName] = this.selectorValue;
    			//});
    			var thisRowData = {
    					t30_all : 	this.t30_all,
    					t60_all : 	this.t60_all,
    					t90_all : 	this.t90_all,
    					t180_all : 	this.t180_all,
    					t365_all : 	this.t365_all,

    					t30_0to30 : 	this.t30_0to30,
    					t60_0to30 : 	this.t60_0to30,
    					t90_0to30 : 	this.t90_0to30,
    					t180_0to30 : 	this.t180_0to30,
    					t365_0to30 : 	this.t365_0to30,

    					t30_31to60 : 	this.t30_31to60,
    					t60_31to60 : 	this.t60_31to60,
    					t90_31to60 : 	this.t90_31to60,
    					t180_31to60 : 	this.t180_31to60,
    					t365_31to60 : this.t365_31to60,

    					t30_61to90 : 	this.t30_61to90,
    					t60_61to90 : 	this.t60_61to90,
    					t90_61to90 : 	this.t90_61to90,
    					t180_61to90 : 	this.t180_61to90,
    					t365_61to90 : this.t365_61to90,

    					t30_91to180 : 	this.t30_91to180,
    					t60_91to180 : 	this.t60_91to180,
    					t90_91to180 : 	this.t90_91to180,
    					t180_91to180 : 	this.t180_91to180,
    					t365_91to180 : this.t365_91to180,

    					t30_181to365 : 	this.t30_181to365,
    					t60_181to365 : 	this.t60_181to365,
    					t90_181to365 : 	this.t90_181to365,
    					t180_181to365 : 	this.t180_181to365,
    					t365_181to365 : this.t365_181to365,

    					t30_366plus : 	this.t30_366plus,
    					t60_366plus : 	this.t60_366plus,
    					t90_366plus : 	this.t90_366plus,
    					t180_366plus : 	this.t180_366plus,
    					t365_366plus : this.t365_366plus
    				};
    			separationByTenureHashtable.put(this.selectorValues , thisRowData);
    		});
    		separationByTenureGraphUpToDate = true;
    		if (tenureGraphUpToDate && separationGraphUpToDate  && selectorsUpToDate ) {
    			redrawTurnoverSelectorBoxes();
    			selectedGraph = selectedTurnoverGraphs();
    			selectedSummaryGraph = selectedTurnoverSummaryGraphs();
    			redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
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

function selectedTurnoverGraphs() {
	var returnGraph = [];
	var selectedValueKey = [];

	$(selectorList).each(function() {
		selectedValueKey.push({ selectorName : this.selectorName , 
								selectorValue :  $("#" + this.selectorName + " option:selected").val()});
	});
	var thisTenureRow = tenureHashtable.get(selectedValueKey);
	var thisSeparationRow = separationHashtable.get(selectedValueKey);
	var thisSeparationByTenureRow = separationByTenureHashtable.get(selectedValueKey);	
	returnGraph = [
	               { 	
	            	   category: "0-30 Days",
	            	   proportion : thisTenureRow.t0to30,
	            	   t30Height : thisSeparationByTenureRow.t30_0to30,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_0to30,thisSeparationByTenureRow.t30_0to30+1),
	            	   t30BaloonLabel : "Workers with 0-30 days of tenure (" + toPercent(thisTenureRow.t0to30,thisTenureRow.t0to30+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_0to30,thisSeparationByTenureRow.t30_0to30+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_0to30 - thisSeparationByTenureRow.t30_0to30),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_0to30,thisSeparationByTenureRow.t60_0to30+1),
	            	   t60BaloonLabel : "Workers with 0-30 days of tenure (" + toPercent(thisTenureRow.t0to30,thisTenureRow.t0to30+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_0to30,thisSeparationByTenureRow.t60_0to30+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_0to30 - thisSeparationByTenureRow.t60_0to30),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_0to30,thisSeparationByTenureRow.t90_0to30+1),
	            	   t90BaloonLabel : "Workers with 0-30 days of tenure (" + toPercent(thisTenureRow.t0to30,thisTenureRow.t0to30+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_0to30,thisSeparationByTenureRow.t90_0to30+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_0to30 - thisSeparationByTenureRow.t90_0to30),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_0to30,thisSeparationByTenureRow.t180_0to30+1),
	            	   t180BaloonLabel : "Workers with 0-30 days of tenure (" + toPercent(thisTenureRow.t0to30,thisTenureRow.t0to30+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_0to30,thisSeparationByTenureRow.t180_0to30+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_0to30 - thisSeparationByTenureRow.t180_0to30),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_0to30,thisSeparationByTenureRow.t365_0to30+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with 0-30 days of tenure (" + toPercent(thisTenureRow.t0to30,thisTenureRow.t0to30+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_0to30,thisSeparationByTenureRow.t365_0to30+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "31-60 Days",
	            	   proportion : thisTenureRow.t31to60,
	            	   t30Height : thisSeparationByTenureRow.t30_31to60,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_31to60,thisSeparationByTenureRow.t30_31to60+1),
	            	   t30BaloonLabel : "Workers with 31-60 days of tenure (" + toPercent(thisTenureRow.t31to60,thisTenureRow.t31to60+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_31to60,thisSeparationByTenureRow.t30_31to60+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_31to60 - thisSeparationByTenureRow.t30_31to60),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_31to60,thisSeparationByTenureRow.t60_31to60+1),
	            	   t60BaloonLabel : "Workers with 31-60 days of tenure (" + toPercent(thisTenureRow.t31to60,thisTenureRow.t31to60+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_31to60,thisSeparationByTenureRow.t60_31to60+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_31to60 - thisSeparationByTenureRow.t60_31to60),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_31to60,thisSeparationByTenureRow.t90_31to60+1),
	            	   t90BaloonLabel : "Workers with 31-60 days of tenure (" + toPercent(thisTenureRow.t31to60,thisTenureRow.t31to60+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_31to60,thisSeparationByTenureRow.t90_31to60+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_31to60 - thisSeparationByTenureRow.t90_31to60),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_31to60,thisSeparationByTenureRow.t180_31to60+1),
	            	   t180BaloonLabel : "Workers with 31-60 days of tenure (" + toPercent(thisTenureRow.t31to60,thisTenureRow.t31to60+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_31to60,thisSeparationByTenureRow.t180_31to60+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_31to60 - thisSeparationByTenureRow.t180_31to60),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_31to60,thisSeparationByTenureRow.t365_31to60+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with 31-60 days of tenure (" + toPercent(thisTenureRow.t31to60,thisTenureRow.t31to60+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_31to60,thisSeparationByTenureRow.t365_31to60+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "61-90 Days",
	            	   proportion : thisTenureRow.t61to90,
	            	   t30Height : thisSeparationByTenureRow.t30_61to90,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_61to90,thisSeparationByTenureRow.t30_61to90+1),
	            	   t30BaloonLabel : "Workers with 61-90 days of tenure (" + toPercent(thisTenureRow.t61to90,thisTenureRow.t61to90+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_61to90,thisSeparationByTenureRow.t30_61to90+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_61to90 - thisSeparationByTenureRow.t30_61to90),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_61to90,thisSeparationByTenureRow.t60_61to90+1),
	            	   t60BaloonLabel : "Workers with 61-90 days of tenure (" + toPercent(thisTenureRow.t61to90,thisTenureRow.t61to90+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_61to90,thisSeparationByTenureRow.t60_61to90+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_61to90 - thisSeparationByTenureRow.t60_61to90),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_61to90,thisSeparationByTenureRow.t90_61to90+1),
	            	   t90BaloonLabel : "Workers with 61-90 days of tenure (" + toPercent(thisTenureRow.t61to90,thisTenureRow.t61to90+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_61to90,thisSeparationByTenureRow.t90_61to90+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_61to90 - thisSeparationByTenureRow.t90_61to90),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_61to90,thisSeparationByTenureRow.t180_61to90+1),
	            	   t180BaloonLabel : "Workers with 61-90 days of tenure (" + toPercent(thisTenureRow.t61to90,thisTenureRow.t61to90+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_61to90,thisSeparationByTenureRow.t180_61to90+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_61to90 - thisSeparationByTenureRow.t180_61to90),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_61to90,thisSeparationByTenureRow.t365_61to90+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with 61-90 days of tenure (" + toPercent(thisTenureRow.t61to90,thisTenureRow.t61to90+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_61to90,thisSeparationByTenureRow.t365_61to90+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "91-180 Days",
	            	   proportion : thisTenureRow.t91to180,
	            	   t30Height : thisSeparationByTenureRow.t30_91to180,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_91to180,thisSeparationByTenureRow.t30_91to180+1),
	            	   t30BaloonLabel : "Workers with 91-180 days of tenure (" + toPercent(thisTenureRow.t91to180,thisTenureRow.t91to180+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_91to180,thisSeparationByTenureRow.t30_911to180+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_91to180 - thisSeparationByTenureRow.t30_91to180),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_91to180,thisSeparationByTenureRow.t60_91to180+1),
	            	   t60BaloonLabel : "Workers with 91-180 days of tenure (" + toPercent(thisTenureRow.t91to180,thisTenureRow.t91to180+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_91to180,thisSeparationByTenureRow.t60_911to180+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_91to180 - thisSeparationByTenureRow.t60_91to180),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_91to180,thisSeparationByTenureRow.t90_91to180+1),
	            	   t90BaloonLabel : "Workers with 91-180 days of tenure (" + toPercent(thisTenureRow.t91to180,thisTenureRow.t91to180+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_91to180,thisSeparationByTenureRow.t90_911to180+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_91to180 - thisSeparationByTenureRow.t90_91to180),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_91to180,thisSeparationByTenureRow.t180_91to180+1),
	            	   t180BaloonLabel : "Workers with 91-180 days of tenure (" + toPercent(thisTenureRow.t91to180,thisTenureRow.t91to180+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_91to180,thisSeparationByTenureRow.t180_911to180+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_91to180 - thisSeparationByTenureRow.t180_91to180),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_91to180,thisSeparationByTenureRow.t365_91to180+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with 91-180 days of tenure (" + toPercent(thisTenureRow.t91to180,thisTenureRow.t91to180+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_91to180,thisSeparationByTenureRow.t365_911to180+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "181-365 Days",
	            	   proportion : thisTenureRow.t181to365,
	            	   t30Height : thisSeparationByTenureRow.t30_181to365,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_181to365,thisSeparationByTenureRow.t30_181to365+1),
	            	   t30BaloonLabel : "Workers with 181-365 days of tenure (" + toPercent(thisTenureRow.t181to365,thisTenureRow.t181to365+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_181to365,thisSeparationByTenureRow.t30_181to365+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_181to365 - thisSeparationByTenureRow.t30_181to365),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_181to365,thisSeparationByTenureRow.t60_181to365+1),
	            	   t60BaloonLabel : "Workers with 181-365 days of tenure (" + toPercent(thisTenureRow.t181to365,thisTenureRow.t181to365+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_181to365,thisSeparationByTenureRow.t60_181to365+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_181to365 - thisSeparationByTenureRow.t60_181to365),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_181to365,thisSeparationByTenureRow.t90_181to365+1),
	            	   t90BaloonLabel : "Workers with 181-365 days of tenure (" + toPercent(thisTenureRow.t181to365,thisTenureRow.t181to365+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_181to365,thisSeparationByTenureRow.t90_181to365+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_181to365 - thisSeparationByTenureRow.t90_181to365),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_181to365,thisSeparationByTenureRow.t180_181to365+1),
	            	   t180BaloonLabel : "Workers with 181-365 days of tenure (" + toPercent(thisTenureRow.t181to365,thisTenureRow.t181to365+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_181to365,thisSeparationByTenureRow.t180_181to365+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_181to365 - thisSeparationByTenureRow.t180_181to365),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_181to365,thisSeparationByTenureRow.t365_181to365+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with 181-365 days of tenure (" + toPercent(thisTenureRow.t181to365,thisTenureRow.t181to365+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_181to365,thisSeparationByTenureRow.t365_181to365+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "Over 365 Days",
	            	   proportion : thisTenureRow.t366plus,
	            	   t30Height : thisSeparationByTenureRow.t30_366plus,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_366plus,thisSeparationByTenureRow.t30_366plus+1),
	            	   t30BaloonLabel : "Workers with over 365 days of tenure (" + toPercent(thisTenureRow.t366plus,thisTenureRow.t366plus+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t30_366plus,thisSeparationByTenureRow.t30_366plus+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_366plus - thisSeparationByTenureRow.t30_366plus),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_366plus,thisSeparationByTenureRow.t60_366plus+1),
	            	   t60BaloonLabel : "Workers with over 365 days of tenure (" + toPercent(thisTenureRow.t366plus,thisTenureRow.t366plus+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t60_366plus,thisSeparationByTenureRow.t60_366plus+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_366plus - thisSeparationByTenureRow.t60_366plus),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_366plus,thisSeparationByTenureRow.t90_366plus+1),
	            	   t90BaloonLabel : "Workers with over 365 days of tenure (" + toPercent(thisTenureRow.t366plus,thisTenureRow.t366plus+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t90_366plus,thisSeparationByTenureRow.t90_366plus+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_366plus - thisSeparationByTenureRow.t90_366plus),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_366plus,thisSeparationByTenureRow.t180_366plus+1),
	            	   t180BaloonLabel : "Workers with over 365 days of tenure (" + toPercent(thisTenureRow.t366plus,thisTenureRow.t366plus+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t180_366plus,thisSeparationByTenureRow.t180_366plus+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_366plus - thisSeparationByTenureRow.t180_366plus),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_366plus,thisSeparationByTenureRow.t365_366plus+1) + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "Workers with over 365 days of tenure (" + toPercent(thisTenureRow.t366plus,thisTenureRow.t366plus+1) + " percent of workforce) have a " + toPercent(thisSeparationByTenureRow.t365_366plus,thisSeparationByTenureRow.t365_366plus+1) + " probability of turning over within 365 days."
	               }
	               
	               ];
	//console.log("Main graph data:");
	//console.log(returnGraph);
	return returnGraph;
	
}

function selectedTurnoverSummaryGraphs() {
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
	//console.log("selectedValueKey before" + JSON.stringify(selectedValueKey));
	//console.log("separationHashtable" + JSON.stringify(separationHashtable.entries()));

	var thisTenureRow = tenureHashtable.get(selectedValueKey);
	var thisSeparationRow = separationHashtable.get(selectedValueKey);
	var thisSeparationByTenureRow = separationByTenureHashtable.get(selectedValueKey);	
	//console.log(JSON.stringify(separationHashtable.entries()));
	//[{"selectorName":"periodName","selectorValue":"2015-07"},{"selectorName":"Country","selectorValue":"All"},{"selectorName":"Location","selectorValue":"All"}]
	returnGraph = [
	               { 	
	            	   category: "New Hires",
	            	   proportion : -1,
	            	   t30Height : thisSeparationRow.t30,
	            	   t30Label : "30-day: " + toPercent(thisSeparationRow.t30,thisSeparationRow.t30+1),
	            	   t30BaloonLabel : "New hires in the previous six months had a " + toPercent(thisSeparationRow.t30,thisSeparationRow.t30+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationRow.t60 - thisSeparationRow.t30),
	            	   t60Label : "60-day: " + toPercent(thisSeparationRow.t60,thisSeparationRow.t60+1),
	            	   t60BaloonLabel : "New hires in the previous six months had a " + toPercent(thisSeparationRow.t60,thisSeparationRow.t60+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationRow.t90 - thisSeparationRow.t60),
	            	   t90Label : "90-day: " + toPercent(thisSeparationRow.t90,thisSeparationRow.t90+1),
	            	   t90BaloonLabel : "New hires in the previous six months had a " + toPercent(thisSeparationRow.t90,thisSeparationRow.t90+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationRow.t180 - thisSeparationRow.t90),
	            	   t180Label : "180-day: " + toPercent(thisSeparationRow.t180,thisSeparationRow.t180+1),
	            	   t180BaloonLabel : "New hires in the previous six months had a " + toPercent(thisSeparationRow.t180,thisSeparationRow.t180+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationRow.t365 - thisSeparationRow.t180),
	            	   t365Label : toPercent(thisSeparationRow.t365,thisSeparationRow.t365+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "New hires in the previous six months had a " + toPercent(thisSeparationRow.t365,thisSeparationRow.t365+1) + " probability of turning over within 365 days."
	               },
	               { 	
	            	   category: "Employees",
	            	   proportion : -1,
	            	   t30Height : thisSeparationByTenureRow.t30_all,
	            	   t30Label : "30-day: " + toPercent(thisSeparationByTenureRow.t30_all,thisSeparationByTenureRow.t30_all+1),
	            	   t30BaloonLabel : "The overall work force has a " + toPercent(thisSeparationByTenureRow.t30_all,thisSeparationByTenureRow.t30_all+1) + " probability of turning over within 30 days.",
	            	   t60Height : Math.abs(thisSeparationByTenureRow.t60_all - thisSeparationByTenureRow.t30_all),
	            	   t60Label : "60-day: " + toPercent(thisSeparationByTenureRow.t60_all,thisSeparationByTenureRow.t60_all+1),
	            	   t60BaloonLabel : "The overall work force has a " + toPercent(thisSeparationByTenureRow.t60_all,thisSeparationByTenureRow.t60_all+1) + " probability of turning over within 60 days.",
	            	   t90Height : Math.abs(thisSeparationByTenureRow.t90_all - thisSeparationByTenureRow.t60_all),
	            	   t90Label : "90-day: " + toPercent(thisSeparationByTenureRow.t90_all,thisSeparationByTenureRow.t90_all+1),
	            	   t90BaloonLabel : "The overall work force has a " + toPercent(thisSeparationByTenureRow.t90_all,thisSeparationByTenureRow.t90_all+1) + " probability of turning over within 90 days.",
	            	   t180Height : Math.abs(thisSeparationByTenureRow.t180_all - thisSeparationByTenureRow.t90_all),
	            	   t180Label : "180-day: " + toPercent(thisSeparationByTenureRow.t180_all,thisSeparationByTenureRow.t180_all+1),
	            	   t180BaloonLabel : "The overall work force has a " + toPercent(thisSeparationByTenureRow.t180_all,thisSeparationByTenureRow.t180_all+1) + " probability of turning over within 180 days.",
	            	   t365Height : Math.abs(thisSeparationByTenureRow.t365_all - thisSeparationByTenureRow.t180_all),
	            	   t365Label : toPercent(thisSeparationByTenureRow.t365_all,thisSeparationByTenureRow.t365_all+1)  + "<br> <br> <br> <br> ",
	            	   t365BaloonLabel : "The overall work force has a " + toPercent(thisSeparationByTenureRow.t365_all,thisSeparationByTenureRow.t365_all+1) + " probability of turning over within 365 days."
	               },

	               ];
	//console.log("Summary graph data:");
	//console.log(returnGraph);
	return returnGraph;
	
}



function disableTurnoverGraphSelectors() {
	deactivateTopbarLinks();
	$(".turnoverGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$(".turnoverGraphMultiSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#turnoverShowBySelector").unbind("change");
	$("#turnoverShowBySelector").prop("disabled",true);
	$("#turnoverTableButton").prop("disabled",true);

}

function enableTurnoverGraphSelectors() {
	activateTopbarLinks();
	$(".turnoverGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$(".turnoverGraphMultiSelect").each(function() {
		$(this).prop("disabled",false);
	});
	$("#turnoverShowBySelector").prop("disabled",false);
	$("#turnoverTableButton").prop("disabled",false);
}


function activateTurnoverGraphSelectors() {
	$(".turnoverGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableTurnoverGraphSelectors();
			selectedGraph = selectedTurnoverGraphs();
			selectedSummaryGraph = selectedTurnoverSummaryGraphs();
			redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
		});
	});
	resetTurnoverTableButtonListener();
}


function redrawTurnoverSelectorBoxes() {
	var activeSelectorsList = [];
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
		var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("class","form-control turnoverGraphSelect").attr("width","300px").attr("defaultValue",usedDefaultValue);
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		
    	$(this.selectorValues).each( function() {
    		var checkedSelectorValue = this.valueName;
    		if ( selectorsEverDrawn ) {
    			var thisSelection = [];
    			$(selectorList).each(function() {
    				if (this.selectorName != checkedSelectorName ) {
    					thisSelection.push({selectorName : this.selectorName ,selectorValue : $("#" + this.selectorName + " option:selected").val() });
    				}
    				else {
    					thisSelection.push({selectorName : checkedSelectorName , selectorValue : checkedSelectorValue });
    				}
    			});
				var checkedHashEntry = tenureHashtable.get(thisSelection);
				
				console.log("checkedHashEntry" + JSON.stringify(tenureHashtable.entries()));

				if ( checkedHashEntry != null ) {
					if (checkedHashEntry.t0to30 != -1 || checkedHashEntry.t31to60 != -1 || checkedHashEntry.t61to90 != -1 || checkedHashEntry.t91to180 != -1 ||checkedHashEntry.t181to365 != -1 ||checkedHashEntry.t366plus != -1 ) {
		        		var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
		        		if ( this.valueLabel.substring(0,6) === "Select") {
		        			$(thisValue).attr("disabled",true);
		        		}
		        		if ( defaultFound === false && checkedSelectorValue == usedDefaultValue && allSelected == false ) {
		        			$(thisValue).attr("selected","selected")
		        			defaultFound = true;
		        		}
		        		if (allSelected == true && this.valueLabel.substring(0,6) !== "Select" && checkedSelectorValue == defaultValueHolder ) {
		        			$(thisValue).attr("selected","selected")
		        			defaultFound = true;		        			
		        		}
		            	$(thisSelector).append(thisValue);    			
					}
					else {
						console.log(JSON.stringify(thisSelection) + " did not check out. :(");						
					}
				}
				else {
					console.log("Did not find " + JSON.stringify(thisSelection));
				}
    		}
    		else {
        		var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
        		if ( this.valueLabel.substring(0,6) === "Select") {
        			$(thisValue).attr("disabled",true);
        		}
        		if (this.valueName == usedDefaultValue) {
					$(thisValue).attr("selected","selected");
					$(thisValue).prop("selected",true);
					}
            	$(thisSelector).append(thisValue);    			
    		}

    	});
    	activeSelectorsList.push(thisSelector);
	});
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();

	/*var turnoverGraphButtonDetached = $("#turnoverGraphButton").detach();
	var turnoverTableButtonDetached = $("#turnoverTableButton").detach();*/
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);

	/*$(selectorButtonBox).append(turnoverGraphButtonDetached);
	$(selectorButtonBox).append(turnoverTableButtonDetached);*/
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	selectorsEverDrawn = true;

	//console.log(activeSelectorsList);
}


function redrawTenureTurnoverGraphs(graphData,summaryGraphData) {
	//var colors = ["#CDD5DF","#9FABBB","#718197","#435773","#152D4F"];
	var colors = ["#97cfdd","#7cc3d5","#5db5cb","#3ea7c1","#348CA2"];

	var lineColors = ["#3C7A3C","#8C3F3F","#000033"];

	windowAspectTurnoverGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	/*
	if ( !firstRendering  ) {
		if ( windowAspectTurnoverGraph == "desktop" && newWindowAspect == "mobile" ) {
	   		localTurnoverChartHolder = $("#turnoverChartDiv").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
	   		$("#display-area-xs").html(localTurnoverChartHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
			windowAspect = "mobile";
		}
		if ( windowAspectTurnoverGraph != "mobile" && newWindowAspect == "desktop" ) {
			localTurnoverChartHolder = $("#turnoverChartDiv").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area").html(localTurnoverChartHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			windowAspectTurnoverGraph = "desktop";
		}		
	}*/

	var chartContainerWidth = (windowAspectTurnoverGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
	if ( chartContainerWidth < 400 ) {
		chartContainerWidth = 400;
	}
	chartContainerWidth = chartContainerWidth + "px";
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = 1200;

	if ( lowerBoxesHeight < 500 ) {
		lowerBoxesHeight = 500;
	}
	if ( lowerBoxesMobileHeight < 500 ) {
		lowerBoxesMobileHeight = 500;
	}
	var chartContainerHeight = lowerBoxesHeight - 50;
	var chartDivHeight = chartContainerHeight-50;
	if ( windowAspectTurnoverGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
		charDivHeight = chartContainerHeight/2 - 100;
	}
	chartTableHeight = chartContainerHeight;
	chartTRHeight = chartDivHeight-100;

	$("#legendDiv").detach();
	$("#turnoverChartDiv").detach();
	var turnoverChartDiv = $("<div></div>").attr("id","turnoverChartDiv")
		.css("height",chartDivHeight+"px")
		.css("width",chartContainerWidth).css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px");

	var chartTable = $("<table></table>")
		.attr("id","chartTable")
		.css("height",chartContainerHeight+"px")
		.css("width","100%");
	var chartTbody = $("<tbody></tbody>").attr("id","chartTbody").css("height","100%").css("width","100%");
	$(chartTable).html(chartTbody);
	var summaryChartDiv = $("<div></div>")
		.attr("id","summaryChartDiv")
		.css("height",chartTRHeight+"px")
		.css("width","100%");
	var summaryChartTD = $("<td></td>").attr("id","summaryChartTD").html(summaryChartDiv).css("width","30%");
	var mainChartDiv = $("<div></div>")
		.attr("id","mainChartDiv")
		.css("height",chartTRHeight+"px")
		.css("width","100%");
	var mainChartTD = $("<td></td>").attr("id","mainChartTD").html(mainChartDiv).css("width","70%");
	var legendDiv = $("<div></div>").attr("id","legendDiv").css("height","100%");
	var legendTD = $("<td></td>").attr("id","legendTD").attr("colspan","2").html(legendDiv).css("width","100%");
	var legendTR = $("<tr></tr>").attr("id","legendTR").html(legendTD).css("height","100px").css("width","100%");
	$(turnoverChartDiv).html(chartTable);

	var menuDiv = $("<div></div>").attr("id","menuDiv")
			.css("height","30px").attr("class","btn-group-justified");
	
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','turnoverTableButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Graph</a>').attr('id','turnoverGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	if ( windowAspectTurnoverGraph == "desktop") {
		var chartsTR = $("<tr></tr>").attr("id","chartsTR").html(summaryChartTD).append(mainChartTD)
		//.css("height","100%")
		.css("width","100%");
		$(chartTbody).html(chartsTR).append(legendTR);
		$("#display-area").html(menuDiv);
		$("#display-area").append(turnoverChartDiv);
		$("#leftbar-div").html(selectorButtonBox);
	}
	else {
		$(summaryChartTD).css("width","100%");
		$(mainChartTD).css("width","100%");
		var summaryChartTR = $("<tr></tr>").attr("id","summaryChartTR").html(summaryChartTD).css("height","400px").css("width","100%");
		var mainChartTR = $("<tr></tr>").attr("id","mainChartTR").html(mainChartTD).append(mainChartTD).css("height","400px").css("width","100%");
		$(legendTR).css("height","150px")
		$(chartTbody).html(summaryChartTR).append(mainChartTR).append(legendTR);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(turnoverChartDiv);
		$("#leftbar-div-xs").html(selectorButtonBox);
	}
	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	$("#menuDiv").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

	if ( $(window).width() < 12000 ) {
		graphData[0].category = "0-30";
		graphData[1].category = "31-60";
		graphData[2].category = "61-90";
		graphData[3].category = "91-180";
		graphData[4].category = "181-365";
		graphData[5].category = "366+";
		//console.log("graphData:");
		//console.log(graphData);
	}
	else {
		graphData[0].category = "0-30 Days";
		graphData[1].category = "31-60 Days";
		graphData[2].category = "61-90 Days";
		graphData[3].category = "91-180 Days";
		graphData[4].category = "181-365 Days";
		graphData[5].category = "Over 365 Days";
		//console.log("graphData:");
		//console.log(graphData);
	}

	if ( $(window).width() < 1200 && windowAspectTurnoverGraph == "desktop" ) {
		summaryGraphData[0].category = "New";
		summaryGraphData[1].category = "Current";
	}
	else {
		summaryGraphData[0].category = "New Hires";
		summaryGraphData[1].category = "Employees";

	}
	
	redrawTurnoverSelectorBoxes();
	summaryChart = generateSummaryTurnoverChart("summaryChartDiv",summaryGraphData);
	turnoverChart = generateTenureTurnoverChart("mainChartDiv",graphData);
	if ( windowAspectTurnoverGraph == "mobile") {
		turnoverChart.marginLeft = 30;
		turnoverChart.valueAxes[0].labelsEnabled = true;
		turnoverChart.valueAxes[0].title = "Annual Turnover Rate";
		turnoverChart.valueAxes[0].labelFunction = function(number,label,axis) {
            return Math.floor(number*1000)/10 + "%";
            };
        //turnoverChart.legend.divId = null;
        //turnoverChart.legend.position = "bottom";
        //console.log("Legend:");
        //console.log(turnoverChart.legend);
	}
	summaryChart.validateData();
	summaryChart.animateAgain();
	turnoverChart.validateData();
	turnoverChart.animateAgain();
	addTurnoverResizeListener();
	enableTurnoverGraphSelectors();
	activateTurnoverGraphSelectors();
	//Fixing a bug(?) in AmCharts that makes the legend position absolute in mobile aspect
	/*if ( windowAspectTurnoverGraph == "mobile") {
		$("#legendDiv").children().css("position","bottom");
	}*/
	//Position the value label markers above the box (default is going through the top line)
	$(".amcharts-graph-label").each(function(){
		$(this).children().attr("y","0");
	})
	//Move the "Employees" and "New Hires" labels down so they match the title on the right graph 
	$("#summaryChartDiv .amcharts-category-axis text.amcharts-axis-label").each(function(){
		$(this).children().attr("y","38");
	})
	//Get rid of the transparent title that says "Overall" (we render it to keep the chart the correct height)
	$("#summaryChartDiv .amcharts-category-axis text.amcharts-axis-title").detach();
	
	var legendTable = $("<table></table>").attr("id","turnoverChartLegendTable").css("width","100%")
	.css("margin-top","0px").css("padding",0);
	var legendTbody = $("<tbody></tbody>").attr("id","turnoverChartLegendTbody")
		.css("height","100px").css("width","100%")
		.css("margin",0).css("padding",0);
	$(legendTable).append(legendTbody);

	var legendRow = $("<tr></tr>");
	var legendLeftMarginTD = $("<td></td>").text("").css("width","50px");
	var legendSecondRow = $("<tr></tr>");
	var legendSecondLeftMarginTD = $("<td></td>").text("").css("width","50px");
	if ( $(window).width() < 600 ) {
		var legendThirdRow = $("<tr></tr>");
		var legendThirdLeftMarginTD = $("<td></td>").text("").css("width","50px");
		var legendFourthRow = $("<tr></tr>");
		var legendFourthLeftMarginTD = $("<td></td>").text("").css("width","50px");
		$(legendThirdRow).append(legendThirdLeftMarginTD);
		$(legendFourthRow).append(legendFourthLeftMarginTD);
	}
	$(legendRow).append(legendLeftMarginTD);
	$(legendSecondRow).append(legendSecondLeftMarginTD);
	var legendLabels = [ "30-Day<br>Turnover", "60-Day<br>Turnover", "90-Day<br>Turnover" , "180-Day<br>Turnover","365-Day<br>Turnover"];
	for ( var i = 0 ; i <=4 ; i++ ) {
		var boxTD = $("<td></td>")
			//.css("width",Math.floor((chartContainerWidth-50)/5)+"px")
			.css("min-height","40px")
			.css("text-align","center")
			.css("overflow","hidden")
			.html(coloredBox(colors[i],20));
		var legendLabelTD = $("<td></td>")
			.css("width",((chartContainerWidth-50)/5)+"px")
			.css("text-align","center")
			//.css("padding-left","10px")
			.html(legendLabels[i]);
		if ( $(window).width() < 600 ) {
			$(boxTD).css("width",((chartContainerWidth-50)/3)+"px")
			$(legendLabelTD).css("width",((chartContainerWidth-50)/3)+"px")
		}
		if ( $(window).width() < 600 && i >= 3 ) {
			$(legendThirdRow).append(legendLabelTD);
			$(legendFourthRow).append(boxTD)
		}
		else {
			$(legendRow).append(legendLabelTD);
			$(legendSecondRow).append(boxTD)
		}
	}

	$(legendTbody).append(legendRow);
	$(legendTbody).append(legendSecondRow);		
	if ( $(window).width() < 600 ) {
		$(legendTbody).append(legendThirdRow);		
		$(legendTbody).append(legendFourthRow);		
	}
	$("#legendDiv").html(legendTable);
	//Re-render to make HTML show up
	$("#turnoverChartLegendTable").html($("#turnoverChartLegendTable").html());


	firstRendering = false;
}

function generateSummaryTurnoverChart(id,chartData) {
	//var colors = ["#CDD5DF","#9FABBB","#718197","#435773","#152D4F"];
	var colors = ["#97cfdd","#7cc3d5","#5db5cb","#3ea7c1","#348CA2"];

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
        marginRight: 0,
        //marginBottom : 100,
        height: "100%",
        fontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
        valueAxes: [ {
            id: "summarySeparationAxis",
            //            axisAlpha: 1,
            axisThickness: 1,
            "stackType": "regular",
            gridAlpha: 0,
            axisAlpha: 1,
            minimum: 0,
            maximum : 1,
            position: "left",
            title: "Annual Turnover Rate",
            fontSize: 14,
            titleFontSize: 16,
            labelFunction : function(number,label,axis) {
            	return Math.floor(number*1000)/10 + "%";
            }
        }],
        graphs:  [{
            id: "summaryT30Graph",
            valueAxis: "summarySeparationAxis",
            title: "30-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t30Height",
            alphaField: "alpha",
            //labelText : "[[t30Label]]",
            balloonText: "<span style='font-size:12px;'>[[t30BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[0]
		} ,{
            id: "summaryT60Graph",
            valueAxis: "summarySeparationAxis",
            title: "60-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t60Height",
            alphaField: "alpha",
            //labelText : "[[t60Label]]",
            balloonText: "<span style='font-size:12px;'>[[t60BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[1]
		} ,{
            id: "summaryT90Graph",
            valueAxis: "summarySeparationAxis",
            title: "90-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t90Height",
            alphaField: "alpha",
            //labelText : "[[t90Label]]",
            balloonText: "<span style='font-size:12px;'>[[t90BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[2]
		} ,{
            id: "summaryT180Graph",
            valueAxis: "summarySeparationAxis",
            title: "180-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t180Height",
            alphaField: "alpha",
            //labelText : "[[t180Label]]",
            balloonText: "<span style='font-size:12px;'>[[t180BaloonLabel]]</span>",
            balloonFillAlphas:1,
            fillAlphas: .7,
            lineColor: colors[3]
		} ,{
            id: "summaryT365Graph",
            valueAxis: "summarySeparationAxis",
            title: "365-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t365Height",
            alphaField: "alpha",
            labelText : "[[t365Label]]",
            labelPosition: top,
            fontSize : 16,
            balloonText: "<span style='font-size:12px;'>[[t365BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[4]
		} ],
        categoryField: "category",
        categoryAxis: {
            position: "bottom",
            title: "Overall" ,
            color : "#000000",
            fontSize: 14,
            offset: 0,
            axisAlpha: 1,
            gridAlpha: 0,
            axisThickness: 1,
            fontSize: 16,
            titleColor: "#eeeeee",
            titleFontSize: 14,
            boldLabels : true
            //categoryFunction : function(category, dataItem, categoryAxis) {
            //	return "<b>" + category + "</b>";
            //}
        },
    	"balloon": {
        fillAlpha: 1,
        "fillColor": "#fff"
    	}
    });

    return chart;
	
}


function generateTenureTurnoverChart(id , chartData) {
	//var colors = ["#CDD5DF","#9FABBB","#718197","#435773","#152D4F"];
	var colors = ["#97cfdd","#7cc3d5","#5db5cb","#3ea7c1","#348CA2"];


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
            id: "separationAxis",
            //            axisAlpha: 1,
            axisThickness: 1,
            "stackType": "regular",
            gridAlpha: 0,
            axisAlpha: 1,
            minimum: 0,
            maximum: 1,
            position: "left",
            title: null,
            tickLength : 0,
            axisTitleOffset : 0 ,
            fontSize: 14,
            titleFontSize: 16,
            labelsEnabled : false
            //labelFunction : function(number,label,axis) {
            //	return Math.floor(number*1000)/10 + "%";
            //}
        }],
        graphs:  [{
            id: "t30Graph",
            valueAxis: "separationAxis",
            title: "30-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t30Height",
            alphaField: "alpha",
            //labelText : "[[t30Label]]",
            balloonText: "<span style='font-size:12px;'>[[t30BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[0]
		} ,{
            id: "t60Graph",
            valueAxis: "separationAxis",
            title: "60-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t60Height",
            alphaField: "alpha",
            //labelText : "[[t60Label]]",
            balloonText: "<span style='font-size:12px;'>[[t60BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[1]
		} ,{
            id: "t90Graph",
            valueAxis: "separationAxis",
            title: "90-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t90Height",
            alphaField: "alpha",
            //labelText : "[[t90Label]]",
            balloonText: "<span style='font-size:12px;'>[[t90BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[2]
		} ,{
            id: "t180Graph",
            valueAxis: "separationAxis",
            title: "180-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t180Height",
            alphaField: "alpha",
            //labelText : "[[t180Label]]",
            balloonText: "<span style='font-size:12px;'>[[t180BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[3]
		} ,{
            id: "t365Graph",
            valueAxis: "separationAxis",
            title: "365-day turnover rate",
            type: "column",
            clustered: false, 
            valueField: "t365Height",
            alphaField: "alpha",
            labelText : "[[t365Label]]",
            labelPosition: top,
            labelOffset: 10,
            fontSize : 16,
            balloonText: "<span style='font-size:12px;'>[[t365BaloonLabel]]</span>",
            fillAlphas: 0.7,
            lineColor: colors[4]
		} ],
        categoryField: "category",
        categoryAxis: {
            position: "bottom",
            title: "Current Employee Tenure (Days)" ,
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
            maxColumns: 3,
            switchable: false,
            textClickEnabled : true
        }*/
    ,
	"balloon": {
    fillAlpha: 1,
    "fillColor": "#fff"
	}
    
    });

    return chart;
}

function addTurnoverResizeListener() {
	   $(window).off("resize");
	$(window).resize(function() {
		redrawTenureTurnoverGraphs(selectedGraph,selectedSummaryGraph);
	});
}


function oldTurnoverResizeListener() {
	   $(window).off("resize");
	$(window).resize(function() {
		var localTurnoverChartHolder , localSelectorButtonBox;
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

		if ( windowAspectTurnoverGraph == "desktop" && newWindowAspect == "mobile" ) {
	   		localTurnoverChartHolder = $("#turnoverChartDiv").detach();
	   		localmenuDiv = $("#menuDiv").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
	   		$("#display-area-xs").html(localmenuDiv);
	   		$("#display-area-xs").append(localTurnoverChartHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
			windowAspect = "mobile";
		}
		if ( windowAspectTurnoverGraph != "mobile" && newWindowAspect == "desktop" ) {
    		localTurnoverChartHolder = $("#turnoverChartDiv").detach();
	   		localmenuDiv = $("#menuDiv").detach();
	   		localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area").html(localmenuDiv);
			$("#display-area").append(localTurnoverChartHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			windowAspectTurnoverGraph = "desktop";
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
		if ( windowAspectTurnoverGraph == "mobile" ) {
			chartContainerHeight = lowerBoxesMobileHeight - 50;
		}
		
		$("#leftbar-div").css("height",lowerBoxesHeight + "px");
		$("#display-area").css("height",lowerBoxesHeight + "px");
		$("#display-area-xs").css("height",lowerBoxesMobileHeight + "px");
				
		var chartContainerWidth = (windowAspectTurnoverGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 300;
		if ( chartContainerWidth < 400 ) {
			chartContainerWidth = 400;
		}
		chartContainerWidth = chartContainerWidth + "px";
		$("#turnoverChartDiv").css("width",chartContainerWidth).css("height",chartContainerHeight+"px");
		var chartTable = $("#chartTable").detach();
		$("#turnoverChartDiv").html(chartTable);
		var displayWidth =  $( window ).width() - 250;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		$("#menuDiv").css("width",displayWidth);

		summaryChart.animateAgain();
		turnoverChart.animateAgain();
		adjustTopbarPadding();

	});
}





function resetTurnoverTableButtonListener() {
	$("#turnoverTableButton").unbind("click");
	$("#turnoverTableButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/turnovertable.js",dataType: "script"});
	});

}
