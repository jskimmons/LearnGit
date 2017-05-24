/**
 * 
 */


//No reason for the background to leak past the bottom of the page, unless the page is really short


var windowAspectTRImTable = "";
windowAspectTRImTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

//These quantities are pretty much fixed in this table
var lowerBoxesHeight = $(window).height - 241;

$("#leftbar-div").css("height",lowerBoxesHeight+"px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height","300px");

underlineOnlyThisLink("#trimLink");


// Show a "loading" animation


displayTableSpinner(windowAspectTRImTable);



// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Impact</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Turnover Reduction Impact Calculator (TRIm) estimates bottom-line financial impact due to reductions in turnover.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

if ( windowAspectTRImTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableTRImTableSelectors();

//Initialize global variables to hold the data

var trimTableFilterSelector;
var trimTableData= [];
var filterName = "";
var modelVariableID = "";
var schemesExist = false;

var trimVariables = [
           	    { variableName : "employeeHeadcount" , variableLabel : "Employee Headcount" , percent : false , mutable : false },
           	    { variableName : "individualTurnoverRate" , variableLabel : "New Hire Turnover Rate" , percent : true , mutable : false },
           	    { variableName : "valueAdded" , variableLabel : "EBITDA" , percent : false , mutable : true },
           	    { variableName : "totalCompensation" , variableLabel : "Average Compensation" , percent : false , mutable : true },
           	    { variableName : "hiringCost" , variableLabel : "Hiring Cost" , percent : false , mutable : true },
           	    { variableName : "trainingCost" , variableLabel : "Training Cost" , percent : false , mutable : true },
           	    { variableName : "vacancyPeriod" , variableLabel : "Vacancy Period" , percent : false , mutable : true },
         	    { variableName : "productivity0To30" , variableLabel : "Productivity, 0-30 days" , percent : true , mutable : true },
          	    { variableName : "productivity31To60" , variableLabel : "Productivity, 31-60 days" , percent : true , mutable : true },
          	    { variableName : "productivity61To90" , variableLabel : "Productivity, 61-90 days" , percent : true , mutable : true },
          	    { variableName : "productivity91To180" , variableLabel : "Productivity, 91-180 days" , percent : true , mutable : true },
          	    { variableName : "productivity181To365" , variableLabel : "Productivity, 181-365 days" , percent : true , mutable : true },
           	    { variableName : "reductionFraction" , variableLabel : "Turnover Reduction " , percent : true , mutable : false },
           	    { variableName : "seatTurnoverRateCurrent" , variableLabel : "Current Seat Turnover" , percent : true , mutable : false },
           	    { variableName : "seatTurnoverRateNew" , variableLabel : "New Seat Turnover" , percent : true , mutable : false },
           	    { variableName : "currentNewHires" , variableLabel : "Current Annual Hires" , percent : false , mutable : false },
           	    { variableName : "impliedNewHires" , variableLabel : "New Annual Hires" , percent : false , mutable : false },
           	    { variableName : "costSavings" , variableLabel : "Cost Savings" , percent : false , mutable : false },
           	    { variableName : "topLineGain" , variableLabel : "Top Line Gains" , percent : false , mutable : false },
           	    { variableName : "bottomLineImpact" , variableLabel : "Total EBITDA Improvement" , percent : false , mutable : false }
           	];
//Used in arrow key functions

$.ajax({ type: "POST" ,
	url: "../ReturnQuery" , 
	data: { type : "gettrimschemelabels" } ,
	dataType: "json" ,
	success: function(data) {
		//console.log(data);
		if ( data.schemeLabels[0] != 'undefined' ) {
			schemesExist = true;
			var trimSchemeSelector = $("<select></select>").attr("id","trimSchemeSelector").attr("class","form-control").attr("width","200px");
			var defaultChosen = false;
			for (i=0 ; i < data.schemeLabels.length ; i++ ) {
		    	var showByValue = $("<option></option>").attr("value",data.schemeNames[i]).text(data.schemeLabels[i]);
		    	
		    	/*if(data.schemeNames[i] === "Reduction Plan 1"){
		    		showByValue.attr("selected","selected");
		    		showByValue.prop("selected",true);
		    	}*/
		    	
	    		if ( defaultChosen == false && data.schemeNames[i] == "-5pct" ) {
		    			showByValue.attr("selected","selected");
		    			defaultChosen=true;
		    		}
		    		$(trimSchemeSelector).append(showByValue);
			}
			
			
	    	var showSchemeDiv = $("<div></div>").attr("id","showSchemeDiv")
			.css("background-color","#44494C").css("margin-top","10px")
			.css("margin-bttom","10px");
	    	$(showSchemeDiv).append("<p>Reduction plan:</p>").attr("class","h3").css("color","#dddddd");
	    	$(showSchemeDiv).append(trimSchemeSelector);

	    	var refreshTRImButton = $("<button></button>").attr('id','refreshTRImButton')
			.attr('class','btn btn-default btn-block').html("Refresh Values<br>from Database");
			//.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
	    	var updateTRImButton = $("<button></button>").attr('id','updateTRImButton')
			.attr('class','btn btn-default btn-block').html("Update Values");
			//.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
	    	
	    	var titleDivDetached = $("#titleDiv").detach();
	    	var titleDescDivDetached = $("#titleDescDiv").detach();
	    	$(selectorButtonBox).html(titleDivDetached);
	    	$(selectorButtonBox).append(titleDescDivDetached);
	    	$(selectorButtonBox).append(refreshTRImButton);
	    	$(selectorButtonBox).append(updateTRImButton);
	    	$(selectorButtonBox).append(showSchemeDiv);


	    	
	    	trimVariables = [
	    	              	    { variableName : "employeeHeadcount" , variableLabel : "Employee Headcount" , percent : false , mutable : false },
	    	              	    { variableName : "individualTurnoverRate" , variableLabel : "New Hire Turnover Rate" , percent : true , mutable : false },
	    	              	    { variableName : "valueAdded" , variableLabel : "EBITDA" , percent : false , mutable : true },
	    	              	    { variableName : "totalCompensation" , variableLabel : "Average Compensation" , percent : false , mutable : true },
	    	              	    { variableName : "hiringCost" , variableLabel : "Hiring Cost" , percent : false , mutable : true },
	    	              	    { variableName : "trainingCost" , variableLabel : "Training Cost" , percent : false , mutable : true },
	    	              	    { variableName : "vacancyPeriod" , variableLabel : "Vacancy Period" , percent : false , mutable : true },
	    	            	    { variableName : "productivity0To30" , variableLabel : "Productivity, 0-30 days" , percent : true , mutable : true },
	    	             	    { variableName : "productivity31To60" , variableLabel : "Productivity, 31-60 days" , percent : true , mutable : true },
	    	             	    { variableName : "productivity61To90" , variableLabel : "Productivity, 61-90 days" , percent : true , mutable : true },
	    	             	    { variableName : "productivity91To180" , variableLabel : "Productivity, 91-180 days" , percent : true , mutable : true },
	    	             	    { variableName : "productivity181To365" , variableLabel : "Productivity, 181-365 days" , percent : true , mutable : true },
	    	              	    { variableName : "reductionFraction" , variableLabel : "Turnover Reduction " , percent : true , mutable : false },
	    	              	    { variableName : "seatTurnoverRateCurrent" , variableLabel : "Current Seat Turnover" , percent : true , mutable : false },
	    	              	    { variableName : "seatTurnoverRateNew" , variableLabel : "New Seat Turnover" , percent : true , mutable : false },
	    	              	    { variableName : "currentNewHires" , variableLabel : "Current Annual Hires" , percent : false , mutable : false },
	    	              	    { variableName : "impliedNewHires" , variableLabel : "New Annual Hires" , percent : false , mutable : false },
	    	              	    { variableName : "costSavings" , variableLabel : "Cost Savings" , percent : false , mutable : false },
	    	              	    { variableName : "topLineGain" , variableLabel : "Top Line Gains" , percent : false , mutable : false },
	    	              	    { variableName : "bottomLineImpact" , variableLabel : "Total EBITDA Improvement" , percent : false , mutable : false }
	    	              	];
		}
		refreshTRImTableData();
	}
});



function refreshTRImTableData() {
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "trimtable" , schemelabel : $("#trimSchemeSelector option:selected").val() } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			filterName = data.filterName;
			modelVariableID = data.modelVariableID;
			trimTableData = data.filterValues;
			redrawTRImTable();
		}
	});	
}


function redrawTRImTable() {
	windowAspectTRImTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
	var tableContainerWidth = (windowAspectTRImTable == "mobile" ) ?  $( window ).width() - 40 : $( window ).width() -315;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}

	
	tableContainerHeight = Math.max($(window).height() - 91,500);
	tableContainerMobileHeight = Math.max($(window).height() - 261,541);
	displayAreaHeight = Math.max($(window).height() - 51,560);
	displayAreaMobileHeight = Math.max($(window).height() - 221,601);
	var movingWidth = tableContainerWidth - 200;
		
	var trimTable = $("<table></table>").attr("class","table").css("width",tableContainerWidth +"px").attr("id","trimTable");
	var trimTbody = $("<tbody></tbody>").attr("id","turnoverTbody").css("width",tableContainerWidth +"px");
	$(trimTable).append(trimTbody);

	var trimFixedTable = $("<table></table>").attr("class","table").css("width","200px").attr("id","trimFixedTable");
	var trimFixedTbody = $("<tbody></tbody>").attr("id","trimFixedTbody");
	$(trimFixedTable).append(trimFixedTbody);

	var trimMovingTable = $("<table></table>").attr("class","table").css("width",movingWidth+"px").attr("id","trimMovingTable");
	var trimMovingTbody = $("<tbody></tbody>").attr("id","trimMovingTbody").css("overflow-y","visible").css("overflow-x","scroll")
						.css("width",movingWidth+"px").css("position","absolute");
	$(trimMovingTable).append(trimMovingTbody);


	var trimTitleFixedTR = $("<tr></tr>");
	var trimCategoryTitleTD = $("<td></td>").html("<b>" + filterName + "</b>").css("width","200px")
									.css("background-color","#AAAAA");//.css("position","absolute").css("left","0px");;
	$(trimTitleFixedTR).html(trimCategoryTitleTD);
	$(trimFixedTbody).append(trimTitleFixedTR);

	var trimTitleMovingTR = $("<tr></tr>");
	for ( var i= 0 ; i < trimTableData.length ; i++ ) {
		var thisColumnTitleTD = $("<td></td>").attr("id",(trimTableData[i]).filterValue+"TitleTD").html("<b>" + (trimTableData[i]).filterValue + "</b>")
		.css("width","100px").css("background-color","#AAAAAA").css("text-align","center");
		$(trimTitleMovingTR).append(thisColumnTitleTD);
	}
	$(trimMovingTbody).append(trimTitleMovingTR);


	for (var varNo = 0 ; varNo < trimVariables.length ; varNo++ ) {
		var thisVarFixedTR = $("<tr></tr>").attr("id",trimVariables[varNo].variableName+"FixedTR");
		var thisVarTitleTD = $("<td></td>").html("<b>" + trimVariables[varNo].variableLabel + "</b>")
		.css("width","200px").css("background-color","#FFFFFF");
		if(trimVariables[varNo].variableName=="costSavings" || trimVariables[varNo].variableName=="topLineGain" || trimVariables[varNo].variableName=="bottomLineImpact"){
			$(thisVarTitleTD).css("background-color","rgb(245, 245, 245)");
		}
		$(thisVarFixedTR).html(thisVarTitleTD);
		$(trimFixedTbody).append(thisVarFixedTR);
		var thisVarMovingTR = $("<tr></tr>").attr("id",trimVariables[varNo].variableName+"MovingTR");
		for ( var filterValueNo = 0 ; filterValueNo < trimTableData.length ; filterValueNo++ ) {
			var thisFilterValueTD = $("<td></td>").attr("class","separationDataTD")
									.attr("id","value" + filterValueNo+trimVariables[varNo]["variableName"]+"TD")
									.css("background-color","#FFFFFF")
									.css("width","100px").css("text-align","right").css("padding-right","30px");
			if(trimVariables[varNo].variableName=="costSavings" || trimVariables[varNo].variableName=="topLineGain" || trimVariables[varNo].variableName=="bottomLineImpact"){
				$(thisFilterValueTD).css("background-color","rgb(245, 245, 245)");
			}
			if ( schemesExist ) {
				$(thisFilterValueTD).css("padding-top","4px").css("padding-bottom","4px");
				$(thisVarTitleTD).css("padding-top","4px").css("padding-bottom","4px");
			}
			//A kludge: The productivity values are stored on the back end in their actual number form, e.g., 50=50%.  So no toPercent here.
			if ( trimVariables[varNo].mutable && trimTableData[filterValueNo]["filterValue"] !== "All" ) {
				thisFilterValueTD.css("padding-top","2px").css("padding-bottom","2px");
				if ( trimVariables[varNo].percent ) {
					var thisInputBox = $('<input type="text"></input>').attr("id","value" + filterValueNo+trimVariables[varNo]["variableName"]+"Textbox")
					.val(trimTableData[filterValueNo][trimVariables[varNo]["variableName"]]+"%")
					.attr("colNo",filterValueNo).attr("rowNo",varNo)
					.css("text-align","right").css("width","80px")
					.css("padding-top","0px").css("padding-bottom","0px");
				}
				else {
					var thisInputBox = $('<input type="text"></input>').attr("id","value" + filterValueNo+trimVariables[varNo]["variableName"]+"Textbox")
					.val(addCommas(trimTableData[filterValueNo][trimVariables[varNo]["variableName"]]))
					.attr("colNo",filterValueNo).attr("rowNo",varNo)
					.css("padding-top","0px").css("padding-bottom","0px")
					.css("text-align","right").css("width","80px");					
				}
				$(thisFilterValueTD).html(thisInputBox);
				$(thisInputBox).keydown(function(e) {
				    switch(e.which) {
				        case 37: // left
				        	if ( $(this).attr("colNo") > 0 ) {
				        		$("#" + "value" + ($(this).attr("colNo")-1) + trimVariables[($(this).attr("rowNo"))]["variableName"]+"Textbox").focus();
				        	} 
				        break;
				        case 38: // up
				        	if ( $(this).attr("rowNo") > 0 ) {
				        		$("#" + "value" + ($(this).attr("colNo")) + trimVariables[($(this).attr("rowNo")-1)]["variableName"]+"Textbox").focus();
				        	} 
				        break;
				        case 39: // right
				        	if ( $(this).attr("colNo") < trimTableData.length - 1 ) {
				        		$("#" + "value" + ($(this).attr("colNo")-(-1)) + trimVariables[($(this).attr("rowNo"))]["variableName"]+"Textbox").focus();
				        	} 
				        break;
				        case 40: // down
				        	if ( $(this).attr("rowNo") < trimVariables.length - 1 ) {
				        		$("#" + "value" + ($(this).attr("colNo")) + trimVariables[($(this).attr("rowNo")-(-1))]["variableName"]+"Textbox").focus();
				        	} 
				        break;

				        default: return; // exit this handler for other keys
				    }
				    e.preventDefault(); // prevent the default action (scroll / move caret)
				});
			}
			else {
				if ( trimVariables[varNo].percent ) {
					if ( trimVariables[varNo].mutable ) {
						$(thisFilterValueTD).html(addCommas(trimTableData[filterValueNo][trimVariables[varNo]["variableName"]],-1)+"%").css("text-align","right");																				
					}
					else {
						$(thisFilterValueTD).html(toPercent(trimTableData[filterValueNo][trimVariables[varNo]["variableName"]],-1)).css("text-align","right");																				
					}
				}
				else {
					$(thisFilterValueTD).html(addCommas(trimTableData[filterValueNo][trimVariables[varNo]["variableName"]])).css("text-align","right");									
				}
			}
			$(thisVarMovingTR).append(thisFilterValueTD);
		}
		$(trimMovingTbody).append(thisVarMovingTR);
		
	}
	

	var trimSplitTR = $("<tr></tr>").css("background-color","#AAAAAA");
	var trimFixedTableTD = $("<td></td>").html(trimFixedTable).css("padding","0px").css("border","none");
	var trimMovingTableTD = $("<td></td>").html(trimMovingTable).css("padding","0px").css("border","none");
	$(trimSplitTR).append(trimFixedTableTD).append(trimMovingTableTD);
	$(trimTbody).append(trimSplitTR);
	
	/*
	var trimButtonTR = $("<tr></tr>");
	var trimButtonTD = $("<td></td>").attr("id","trimButtonTD").attr("colspan","2")
			.css("width","100%").css("padding","0px").css("border","none");
	var trimButtonTable = $("<table></table>").css("width","100%");
	var trimButtonTableTbody = $("<tbody></tbody>");
	if ( tableContainerWidth > 800 ) {
		var trimButtonTableTR = $("<tr></tr>");
		var refreshTRImButtonTD = $("<td></td>").attr("id","refreshTRImButtonTD")
			.css("width","50%").css("padding","40px").css("background-color","#aaaaaa");
		var refreshTRImButton = $("<button></button>").attr('id','refreshTRImButton')
			.attr('class','btn btn-default btn-block').text("Refresh Values from Database")
			.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
		$(refreshTRImButtonTD).append(refreshTRImButton);
		var updateTRImButtonTD = $("<td></td>").attr("id","updateTRImButtonTD")
		.css("width","50%").css("padding","40px").css("background-color","#aaaaaa");
		var updateTRImButton = $("<button></button>").attr('id','updateTRImButton')
			.attr('class','btn btn-default btn-block').text("Update Database with Current Values")
			.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
		$(updateTRImButtonTD).append(updateTRImButton);
		$(trimButtonTableTR).html(refreshTRImButtonTD).append(updateTRImButtonTD);
		$(trimButtonTableTbody).append(trimButtonTableTR);
		if ( schemesExist ) {
			$(refreshTRImButtonTD).css("padding-top","15px").css("padding-bottom","15px");
			$(updateTRImButtonTD).css("padding-top","15px").css("padding-bottom","15px");
		}
	}
	else {
		var trimButtonTableTopTR = $("<tr></tr>");
		var trimButtonTableBottomTR = $("<tr></tr>");
		var refreshTRImButtonTD = $("<td></td>").attr("id","refreshTRImButtonTD")
			.css("width","50%").css("padding","20px").css("background-color","#aaaaaa")
			.attr("align","center");
		var refreshTRImButton = $("<button></button>").attr('id','refreshTRImButton')
			.attr('class','btn btn-default btn-block').text("Refresh Values from Database")
			.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
		$(refreshTRImButtonTD).html(refreshTRImButton);
		var updateTRImButtonTD = $("<td></td>").attr("id","updateTRImButtonTD").attr("align","center")
		.css("width","50%").css("padding","20px").css("background-color","#aaaaaa");
		var updateTRImButton = $("<button></button>").attr('id','updateTRImButton')
			.attr('class','btn btn-default btn-block').text("Update Database with Current Values")
			.css("padding","10px").css("width","300px");//.css("background-color","#A1CEA1");
		$(updateTRImButtonTD).append(updateTRImButton);
		$(trimButtonTableTopTR).html(refreshTRImButtonTD);
		$(trimButtonTableBottomTR).html(updateTRImButtonTD);
		$(trimButtonTableTbody).append(trimButtonTableTopTR).append(trimButtonTableBottomTR);		
		tableContainerHeight = Math.max($(window).height() - 91,541);
		displayAreaHeight = Math.max($(window).height() - 51,601);
		
	}
	$(trimButtonTable).append(trimButtonTableTbody);
	$(trimButtonTD).html(trimButtonTable);
	$(trimButtonTR).html(trimButtonTD);
	$(trimTbody).append(trimButtonTR);
	*/
	
	$("#trimTableDiv").remove();
	trimTableDiv = $("<div></div>").attr("id","trimTableDiv")
	.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
	.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");
	$(trimTableDiv).html(trimTable);
	
	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");	
	var menuItem1 = $('<a class="btn btn-default disabled">TRIm Inputs</a>').attr('id','trimTableButton');
	var menuItem2 = $('<a class="btn btn-default ">TRIm</a>').attr('id','trimGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
		
	if ( windowAspectTRImTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area").append(trimTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
		for (var varNo = 0 ; varNo < trimVariables.length ; varNo++ ) {
			$("#" + trimVariables[varNo].variableName+"FixedTR").css("height",$("#" + trimVariables[varNo].variableName+"MovingTR").css("height"));
			//console.log("#" + trimVariables[varNo].variableName+"FixedTR"+","+$("#value" + 0+trimVariables[varNo]["variableName"]+"TD").outerHeight(true));
		}

	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(trimTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#trimTableDiv").css("height",tableContainerMobileHeight);
		for (var varNo = 0 ; varNo < trimVariables.length ; varNo++ ) {
			$("#" + trimVariables[varNo].variableName+"FixedTR").css("height",$("#" + trimVariables[varNo].variableName+"MovingTR").css("height"));
			//$("#" + trimVariables[varNo].variableName+"FixedTR").css("height",40);
			//$("#" + trimVariables[varNo].variableName+"MovingTR").css("height",40);
			//console.log("#" + trimVariables[varNo].variableName+"FixedTR"+","+$("#value" + 0+trimVariables[varNo]["variableName"]+"TD").outerHeight(true));
		}
	}

	//The text input boxes are taller, so the other rows need to be adjusted in height 

	var localSelectorButtonBox = $("#selectorButtonBox").detach();
	
	if ( windowAspectTRImTable == "mobile" ) {
		$("#leftbar-div-xs").html(localSelectorButtonBox);
	}
	else {
		$("#leftbar-div").html(localSelectorButtonBox);
		
	}

	$("#refreshTRImButtonTD").css("align","center");
	$("#updateTRImButtonTD").css("align","center");
	
	addTRImTableResizeListener();
	enableTRImTableSelectors();
	activateTRImTableSelectors();

	
}

function updateTRImTable() {
	
	var newTableValues = [];
	
	for ( filterValueNo = 0 ; filterValueNo < trimTableData.length ; filterValueNo++ ) {
		if ( trimTableData[filterValueNo]["filterValue"] !== "All") {
			var thisRow = {
				    filterValue: trimTableData[filterValueNo]["filterValue"],
				    employeeHeadcount: removeCommas($("#" + "value"+filterValueNo+"employeeHeadcountTD").html()),
              	    individualTurnoverRate: removeCommas($("#" + "value"+filterValueNo+"individualTurnoverRateTD").html()),             	  
					valueAdded : removeCommas($("#" + "value"+filterValueNo+"valueAddedTextbox").val()),
				    totalCompensation : removeCommas($("#" + "value"+filterValueNo+"totalCompensationTextbox").val()),
				    hiringCost : removeCommas($("#" + "value"+filterValueNo+"hiringCostTextbox").val()),
				    trainingCost : removeCommas($("#" + "value"+filterValueNo+"trainingCostTextbox").val()),
				    //trainingPeriod : removeCommas($("#" + "value"+filterValueNo+"trainingPeriodTextbox").val()),
				    vacancyPeriod : removeCommas($("#" + "value"+filterValueNo+"vacancyPeriodTextbox").val()),
				    productivity0To30 : removeCommas($("#" + "value"+filterValueNo+"productivity0To30Textbox").val()),
				    productivity31To60 : removeCommas($("#" + "value"+filterValueNo+"productivity31To60Textbox").val()),
				    productivity61To90 : removeCommas($("#" + "value"+filterValueNo+"productivity61To90Textbox").val()),
				    productivity91To180 : removeCommas($("#" + "value"+filterValueNo+"productivity91To180Textbox").val()),
				    productivity181To365 : removeCommas($("#" + "value"+filterValueNo+"productivity181To365Textbox").val()),
			};
			newTableValues.push(thisRow);			
		}
		
	}
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "trimupdatetable" , newtrimvalues : JSON.stringify(newTableValues),schemelabel : $("#trimSchemeSelector option:selected").val() } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			//refreshTRImTableData();
			filterName = data.filterName;
			modelVariableID = data.modelVariableID;
			trimTableData = data.filterValues;
			redrawTRImTable();
		}
	});

	//console.log(newTableValues);
}



function disableTRImTableSelectors(){
	deactivateTopbarLinks();
	$("#trimGraphButton").unbind("click");
	$("#trimGraphButton").prop("disabled",true);
	$("#refreshTRImButton").unbind("click");
	$("#refreshTRImButton").prop("disabled",true);
	$("#updateTRImButton").unbind("click");
	$("#updateTRImButton").prop("disabled",true);
	$("#trimSchemeSelector").unbind("change");
	$("#trimSchemeSelector").prop("disabled",true);
}

function enableTRImTableSelectors() {
	activateTopbarLinks();
	$("#trimSchemeSelector").prop("disabled",false);
	$("#trimGraphButton").prop("disabled",false);
	$("#refreshTRImButton").prop("disabled",false);
	$("#updateTRImButton").prop("disabled",false);
}

function activateTRImTableSelectors() {
	$("#trimGraphButton").unbind("click");
	$("#refreshTRImButton").unbind("click");
	$("#updateTRImButton").unbind("click");
	$("#trimGraphButton").click(function() {
		$.ajax({type: "GET",url: "../resources/js/analytics/trimgraph.js",dataType: "script"});
	});
	$("#refreshTRImButton").click(function() {
		disableTRImTableSelectors();
		refreshTRImTableData();
	});
	$("#updateTRImButton").click(function() {
		disableTRImTableSelectors();
		updateTRImTable();
	});
	$("#trimSchemeSelector").change(function() {
		disableTRImTableSelectors();
		refreshTRImTableData();
	});
}

function addTRImTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		redrawTRImTable();
		adjustTopbarPadding();
	});
}
