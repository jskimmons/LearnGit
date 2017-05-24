//$("script").remove();//Array.prototype.keySort()
var windowAspectELMReportGraph = "";
windowAspectELMReportGraph = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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


underlineOnlyThisLink("#liveReportLink");


// Show a "loading" animation


displayELMGraphSpinner();
disableELMGraphSelectors();

// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Reports</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Time series of applicants, hires and good hires from relevant zip codes.</h4>');

var applicantReportButton = $("<button></button>").attr('id','applicantReportButton').attr('class','btn btn-default btn-block').text("Applicants").css("margin-bottom","10px").css("padding","10px");

var employeeRiskButton = $("<button></button>").attr('id','employeeRiskButton').attr('class','btn btn-default btn-block').text("Employees").css("margin-bottom","10px").css("padding","10px");

var laborMarketChartButton = $("<button></button>").attr('id','laborMarketChartButton').attr('class','btn btn-default btn-block').prop("disabled",true)
.text("Labor Markets").css("margin-bottom","10px").css("padding","10px").prop("disabled", true);

/*var employeeScoreButton = $("<button></button>").attr('id','employeeScoreButton')
.attr('class','btn btn-default btn-block').text("Employee Scores")
.css("margin-bottom","10px").css("padding","10px");*/

$(selectorButtonBox).append(titleDiv).append(titleDescDiv).append(applicantReportButton).append(employeeRiskButton).append(laborMarketChartButton);//.append(employeeScoreButton);

if ( windowAspectELMReportGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}
	
var ELMHashtable = new Hashtable({ hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var chartData = [];
var ELMChart = {};
var selectorList = [];
var activeChartData = [];
var selectedValueKey = [];
var locationToZip=[];

refreshELMGraph();

function refreshELMGraph() {
	var selectorsUpToDate = false;
    var elmGraphUpToDate = false;
    var ELMRawGraph = {};

    disableELMGraphSelectors();
    displayGraphSpinner(windowAspectELMReportGraph);
    
    $.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "elmgraphselectors" } ,
		dataType: "json" ,
		success: function(data) {
			var defaultSelectorList = [];
	    	selectorList = data.selectorList;
	    	locationToZip= data.locationToZip;
	    	//console.log(locationToZip);
			selectorsUpToDate = true;
    		if (elmGraphUpToDate ) {
    			redrawELMGraphSelectorBoxes();
    			redrawELMGraph();
    		}
		}
    });
    
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "elmgraph"} ,
    	dataType: "json" ,
    	success: function(data) {
    		ELMRawGraph = data;
    		var today = new Date();
    		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    		var removeGoodHiresMonths=[];
    		for(var i=0;i<=3;i++){
        		removeGoodHiresMonths.push((months[today.getMonth()])+ " " + today.getFullYear());
    			// removeGoodHiresMonths.push(today.getFullYear() + "m" +
				// (today.getMonth()+1));
    			today.setMonth(today.getMonth() - 1);
    		}
    		$(ELMRawGraph.rows).each(function() {
    			var thisSelectionData = [];
    			if(removeGoodHiresMonths.indexOf(this.testMonth) > -1){
    			var thisRowData = {
    				testMonth 	: 	this.testMonth,
    				applicants	: 	this.applicants,
    				hires		: 	this.hires
    			};
    		}else{
    				var thisRowData = {
        				testMonth 	: 	this.testMonth,
        				applicants	: 	this.applicants,
        				hires		: 	this.hires,
        				goodHires 	: 	this.goodhires
        			};
    			}
    			
    			if ( ELMHashtable.get(this.selectorValues) != null ) {
    				thisSelectionData = ELMHashtable.get(this.selectorValues);
    			}
    			thisSelectionData.push(thisRowData);
    			ELMHashtable.put(this.selectorValues , thisSelectionData);
    		});
    		elmGraphUpToDate = true;
    		if (elmGraphUpToDate ) {
    			redrawELMGraphSelectorBoxes();
    			redrawELMGraph();
    		}   		
    	}
    });   
}
function selectedELMGraph() {
	var returnGraph = [];
	selectedValueKey = [];
	$(selectorList).each(function() {
		selectedValueKey.push({ selectorName : this.selectorName , selectorValue :  $("#" + this.selectorName + " option:selected").val()});
	});
	return ELMHashtable.get(selectedValueKey);	
}


function redrawELMGraph() {
	var chartContainerWidth = (windowAspectELMReportGraph == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() - 400;
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
	var chartContainerHeight = lowerBoxesHeight - 150;
	if ( windowAspectELMReportGraph == "mobile" ) {
		chartContainerHeight = lowerBoxesMobileHeight - 50;
	}

	var mainDiv = $("<div></div>").attr("id","mainDiv").css("margin-top","50px");
	var locationDiv = $("<div></div>").attr("id","locationDiv").css("display","table").css("margin","auto");

	var ELMChartDiv = $("<div></div>").attr("id","ELMChartDiv")
		.css("height",chartContainerHeight+"px").css("width",chartContainerWidth).css("vertical-align","middle").css("margin-left","60px")
		.css("display","inline-block");
	
	mainDiv.html(locationDiv).append(ELMChartDiv);

	var displayWidth =  $( window ).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width",displayWidth);
	$("#leftbar-div").css("height",lowerBoxesHeight+"px");
	$("#display-area").css("height",lowerBoxesHeight+"px");
	$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");
	
	if ( windowAspectELMReportGraph == "desktop") {
		$("#display-area").html(mainDiv);
	}
	else {
		$("#display-area-xs").html(mainDiv);
	}
	
	
	redrawELMGraphSelectorBoxes();
	activeChartData = selectedELMGraph();
	generateELMChart("ELMChartDiv",activeChartData);
	$("#locationDiv").append("<p style='font-size:20px'><b>"+ selectedValueKey[0].selectorValue+ " : " + selectedValueKey[1].selectorValue + "</b></p>");
	addELMResizeListener();
	enableELMGraphSelectors();
	activateelmGraphSelectors();
}		


/*function redrawELMGraphSelectorBoxes() {
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		if (selectorsEverDrawn ) {
			var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
		}
		else {
			var usedDefaultValue = this.defaultValue;
		}		
		var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("class","form-control elmGraphSelect").attr("width","300px").attr("defaultValue",usedDefaultValue);		
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;
		var i=0;
		
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
       			if(checkedSelectorName ==="ZipCode"){
    				if ( ELMHashtable.get(thisSelection) != null && i++<25) {
		        		var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
				}
    		}else{
    			var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);

						}
    			
        		if ( checkedSelectorValue == usedDefaultValue) {
    				$(thisValue).attr("selected","selected");
    				$(thisValue).text(checkedSelectorName +": " + this.valueLabel);
        		}
    		}
    		else {
    			if(checkedSelectorName!="ZipCode" || i++<25){
        		var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
        		if ( this.valueName == defaultValueHolder){
        			$(thisValue).attr("selected","selected");
        			$(thisValue).text(checkedSelectorName +": " + this.valueLabel)
        		}
    			}
    		}

        	$(thisSelector).append(thisValue); 
    	});
    	activeSelectorsList.push(thisSelector);
	});
	
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	
	var applicantReportButtonDetached = $("#applicantReportButton").detach();
	var employeeRiskButtonDetached = $("#employeeRiskButton").detach();
	var laborMarketChartButtonDetached = $("#laborMarketChartButton").detach();

	$(selectorButtonBox).html(titleDivDetached);

	$(selectorButtonBox).append(applicantReportButtonDetached);
	$(selectorButtonBox).append(employeeRiskButtonDetached);
	$(selectorButtonBox).append(laborMarketChartButtonDetached);	
	
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);
	});
	$('#ZipCode option:selected').text("ZipCode: " +  $("#ZipCode").val());			

	selectorsEverDrawn = true;
	$(selectorButtonBox).append(titleDescDivDetached);
}*/



function redrawELMGraphSelectorBoxes() {
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		if (selectorsEverDrawn ) {
			var usedDefaultValue = $("#" + this.selectorName + " option:selected").val();
		}
		else {
			var usedDefaultValue = this.defaultValue;
		}
		var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("class","form-control elmGraphSelect").attr("width","300px").attr("defaultValue",usedDefaultValue);		
		var defaultValueHolder = this.defaultValue;
		var checkedSelectorName = this.selectorName;
		var defaultFound = false;
		var i=0;
		
		if(this.selectorName ==="ZipCode"){
			var selectedLocation = $("#Location option:selected").val();
			var zips = locationToZip[selectedLocation];	
			for(var i in zips){
	    		var checkedSelectorValue = zips[i];   		
				var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(checkedSelectorValue);
	    		if ( checkedSelectorValue == usedDefaultValue) {
	    			$(thisValue).attr("selected","selected");
	    			$(thisValue).text(this.selectorName +": " + checkedSelectorValue);
	        	}
	    		if(i<25)$(thisSelector).append(thisValue); 
			}
		}
		else{
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
	    			var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
	        		if ( checkedSelectorValue == usedDefaultValue) {
	    				$(thisValue).attr("selected","selected");
	    				$(thisValue).text(checkedSelectorName +": " + this.valueLabel);
	        		}
	    		}
	    		else {
	        		var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
	        		if ( this.valueName == defaultValueHolder){
	        			$(thisValue).attr("selected","selected");
	        			$(thisValue).text(checkedSelectorName +": " + this.valueLabel)
	        		}
	    		}
	        	$(thisSelector).append(thisValue); 
	    	});
		}
	activeSelectorsList.push(thisSelector);
});

var titleDivDetached = $("#titleDiv").detach();
var titleDescDivDetached = $("#titleDescDiv").detach();

var applicantReportButtonDetached = $("#applicantReportButton").detach();
var employeeRiskButtonDetached = $("#employeeRiskButton").detach();
var laborMarketChartButtonDetached = $("#laborMarketChartButton").detach();
//var employeeScoreButtonDetached = $("#employeeScoreButton").detach();



$(selectorButtonBox).html(titleDivDetached);
$(selectorButtonBox).append(titleDescDivDetached);
$(selectorButtonBox).append(applicantReportButtonDetached);
$(selectorButtonBox).append(employeeRiskButtonDetached);
$(selectorButtonBox).append(laborMarketChartButtonDetached);	
//$(selectorButtonBox).append(employeeScoreButtonDetached);	


$.each(activeSelectorsList,function() {
	$(selectorButtonBox).append(this);
});
$('#ZipCode option:selected').text("Zip Code: " +  $("#ZipCode").val());			

selectorsEverDrawn = true;	
}






function activateelmGraphSelectors() {
	$(".elmGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			disableELMGraphSelectors();
			redrawELMGraph();
		});
		
	});
	
	$("#employeeRiskButton").unbind("click");
	$("#employeeRiskButton").click(function(){
		if(empReportUser  == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeerisktable.js",dataType: "script"});
		}else if(empScoreUser   == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
		}
	});
	$("#applicantReportButton").unbind("click");
	$("#applicantReportButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
	});
	$("#laborMarketChartButton").unbind("click");
	$("#laborMarketChartButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
	});
	/*$("#employeeScoreButton").unbind("click");
	$("#employeeScoreButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
	});*/
	
}

function addELMResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		redrawELMGraph(activeChartData);
	});
}

function generateELMChart(id , chartData) {
	var chart = AmCharts.makeChart(id, {
		type : "serial",
		theme : "light",
		dataProvider : chartData,
		categoryField : "tenure",
		height : "100%",
		fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
		valueAxes : [{
			id : "countAxis",
			// maximum : 100,
			// minimum : 0,
            autoGridCount:true,
			// gridCount:10,
			tickLength: 0
		}],
		categoryField: "testMonth",
		categoryAxis: {
		    gridPosition: "start",
		    labelRotation: 45,
			tickLength: 0,
			gridAlpha:0,
			axisAlpha:0,
			autoWrap:false, 
			minHorizontalGap:0
		  },
		legend : {
			markerType:"line",
			markerSize:25,
			markerBorderThickness:3,
			align:"center"

			/*
			 * //equalWidths:true, //autoMargins: true, markerType : "line",
			 * align:'center', data : [ { title : "Applicantsss", color :
			 * "#269900" }, { title : "Hires", color : "#BBBBBB" }, { title :
			 * "Good Hires", color : "#A00000" } ]
			 */
		},
		graphs : [ 
		    {id : "applicants",
			valueField : "applicants",
			bullet: "round",
			bulletSize : 5,
			hideBulletsCount : 50,
			bulletBorderAlpha: 1,
		    bulletColor: "#FFFFFF",
	        useLineColorForBulletBorder: true,
			title : "Applicants",			
			balloonText : "<span style='font-size:12px;'>Applicants: [[applicants]]</span>",
			lineThickness : "3px",
			lineColor : "#348ca2",		
			balloon:{
		          drop:true,
		          adjustBorderColor:false,
		          color:"black"
		        }
		    }, 
		    	{id : "hires",
				valueField : "hires",
				bullet: "round",
				bulletSize : 5,
				hideBulletsCount : 50,
				bulletBorderAlpha: 1,
			    bulletColor: "#FFFFFF",
		        useLineColorForBulletBorder: true,
				title : "Hires",			
				balloonText : "<span style='font-size:12px;'>Hires: [[hires]]</span>",
				lineThickness : "3px",
				lineColor : "#E87506",
				balloon:{
			          drop:true,
			          adjustBorderColor:false,
			          color:"black"
			        }
		}, 
		{
			id : "goodHires",
			valueField : "goodHires",
			bullet: "round",
			bulletSize : 5,
			hideBulletsCount : 50,
			bulletBorderAlpha: 1,
		    bulletColor: "#FFFFFF",
	        useLineColorForBulletBorder: true,
			title : "Good Hires",			
			balloonText : "<span style='font-size:12px;'>Good Hires: [[goodHires]]</span>",
			lineThickness : "3px",
			lineColor : "#02955D",
			balloon:{
		          drop:true,
		          adjustBorderColor:false,
		          color:"black"
		        }
		} ]
	});
	return chart;	
}


function disableELMGraphSelectors() {
	deactivateTopbarLinks();
	$(".elmGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});

	$("#applicantReportButton").prop("disabled",true);
	$("#employeeRiskButton").prop("disabled",true);
	//$("#employeeScoreButton").prop("disabled",true);

	
}

function enableELMGraphSelectors() {
	activateTopbarLinks();
	$(".elmGraphSelect").each(function() {
		$(this).prop("disabled",false);
	});
	
	if(empReportUser == "true"){
	$("#employeeRiskButton").prop("disabled",false);
	}
		
	if(appReportUser  == "true"){
		$("#applicantReportButton").prop("disabled",false);
	}
	
	/*if(empScoreUser  == "true"){
		$("#employeeScoreButton").prop("disabled",false);
	}*/
	
	
	//$("#applicantReportButton").prop("disabled",false);
	//$("#employeeRiskButton").prop("disabled",false);
	// $("#laborMarketChartButton").prop("disabled",false);
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


function displayELMGraphSpinner() {
	var spinnerMargin = (windowAspectELMReportGraph == "mobile" ) ?  ($( window ).width())/2 -80 : ($( window ).width())/2 - 240;
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
			, fps: 20 // Frames per second when using setTimeout() as a
						// fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '120px' // Top position relative to parent
			, left: '80px' // spinnerMargin // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
	};
	var target = document.getElementById('spinnerDiv');
	var spinner = new Spinner(opts).spin(target);
	$("#spinnerDiv").append("<h2>Loading chart....</h2>");
}
