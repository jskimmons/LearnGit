var windowAspectLiveReportsTable = "";
windowAspectLiveReportsTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

if ( lowerBoxesHeight < 730 ) {
	lowerBoxesHeight = 730;
}
if ( lowerBoxesMobileHeight < 500 ) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height",lowerBoxesHeight+"px").css("padding","25px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height",lowerBoxesMobileHeight+"px");

underlineOnlyThisLink("#liveReportLink");


// Show a "loading" animation

deactivateTopbarLinks();
//displayTableSpinner(windowAspectLiveReportsTable);

// First develop the selector box
/*$('head').append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">');
$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />');
$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" />');

$('head').append('<script>$(function() {$("#StartDate").datepicker();});</script>');
$('head').append('<script>$(function() {$("#EndDate").datepicker();});</script>');
*/

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Reports</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Selection and turnover rates for a panel of applicants, broken down by TalenTeck turnover risk score categories.</h4>');

var applicantReportButton = $("<button></button>").attr('id','applicantReportButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px").prop("disabled", true);


var employeeRiskButton = $("<button></button>").attr('id','employeeRiskButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px");


var laborMarketChartButton = $("<button></button>").attr('id','laborMarketChartButton').attr('class','btn btn-default btn-block')//.prop("disabled",true)
.text("Labor Markets").css("margin-bottom","10px").css("padding","10px");

/*var employeeScoreButton = $("<button></button>").attr('id','employeeScoreButton')
.attr('class','btn btn-default btn-block').text("Employee Scores")
.css("margin-bottom","10px").css("padding","10px");*/


$(selectorButtonBox).append(titleDiv).append(titleDescDiv).append(applicantReportButton).append(employeeRiskButton).append(laborMarketChartButton);//.append(employeeScoreButton);

/*var tableButton = $("<button></button>").attr('id','liveReportsTableButton')
.attr('class','btn btn-default btn-block disabled').text("Table")
.css("margin-bottom","10px").css("padding","10px");
$(selectorButtonBox).append(tableButton);*/

if ( windowAspectLiveReportsTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

//disableLiveReportsTableSelectors();




var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var usedTable = {};
var liveReportsRawTable = {};
var formattedTable = [];
var liveReportsTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var liveReportsSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var splitDate,miny,minm,mind,maxy,maxm,maxd;


refreshLiveReportsTable();


function fetchLiveReportsTable(selectionList) {
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "livereporttable" ,
    			selectorlist : JSON.stringify(selectionList)
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		//console.log("Table returned:");
    		//console.log(data);
    		usedTable = data.rows;
			visibleTable = createVisibleLiveReportsTable(usedTable);
			displayVisibleLiveReportsTable(visibleTable);
    	}
    });
}

function refreshLiveReportsTable() {

	var liveReportsSelectorsReturned = false;
	var liveReportsDataReturned = false;
	disableLiveReportsTableSelectors();
    displayTableSpinner(windowAspectLiveReportsTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getliveselectorsreports" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			selectorList = data.selectorList;
			//console.log("Initially, selectorList:")
			//console.log(selectorList);			
			//console.log("Hash table:");
    		/*console.log(reportSelectionHashtable.entries());*/
			redrawLiveReportsSelectorBoxes();
			var selectionList = queryLiveReportsTableSelectorValues();
			//console.log(selectionList);
			fetchLiveReportsTable(selectionList);
		}
	});
	
}


function redrawLiveReportsSelectorBoxes() {

	var activeSelectorsList = [];
	//console.log("selectorList:")
	//console.log(selectorList);
	
	$(selectorList).each(function() {
		if(this.selectorName === "StartDate"){
			 splitDate = $(this.selectorValues)[0].valueName.split("/"); 
			 miny = parseInt(splitDate[2]);
			 minm = parseInt(splitDate[0]);
			 mind = parseInt(splitDate[1]);
		}
		if(this.selectorName === "EndDate"){
			 splitDate = $(this.selectorValues)[0].valueName.split("/"); 
			 maxy = parseInt(splitDate[2]);
			 maxm = parseInt(splitDate[0]);
			 maxd = parseInt(splitDate[1]);
		}
	});

	var dateTitleDiv = $("<div></div>")
		.attr("id","dateTitleDiv")
		.css("background-color","#44494C")
		.css("color","#FFFFFF")
		.css("margin-bottom","10px");
		//.html('<b>Select Dates</b>');
 	activeSelectorsList.push(dateTitleDiv);

	
	$(selectorList).each(function() {
		//console.log()
		if(this.selectorName === "StartDate"){
			 var thisSelector = $("<input></input>").attr("id",this.selectorName)
			.attr("class","form-control liveReportsTableSelect").attr("width","300px")
			.val($(this.selectorValues)[0].valueLabel)
			//.text($(this.selectorValues)[0].valueLabel)
			.attr("readonly","true");
			//.click(function());
					//$("#StartDate").datepicker({minDate:new Date(2016,3-1,4),maxDate:new Date(2016,5-1,18),});
					//$("#EndDate").datepicker({minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd),});
		

		}
		else if(this.selectorName === "EndDate" ){
			 var thisSelector = $("<input></input>").attr("id",this.selectorName)
			.attr("class","form-control liveReportsTableSelect").attr("width","300px")
			.val('End Date: 08/05/2016')
			.attr("readonly","true");
		}
		else{	
		
		var thisSelector = $("<select></select>").attr("id",this.selectorName)
			.attr("class","form-control liveReportsTableSelect").attr("width","300px")
			.attr("defaultValue",this.defaultValue);
		$(this.selectorValues).each( function() {
    		var thisValue = $("<option></option>").attr("value",this.valueName)
			.text(this.valueLabel);
    		
    		if ( this.valueName === "Tribeca" || this.valueName ==="Philippines" || this.valueName === "90-Day") {
    			$(thisValue).attr("selected","selected");
				$(thisValue).prop("selected",true);
    		}
    		/* if ( this.valueLabel.substring(0,6) === "Select") {
    			$(thisValue).attr("disabled",true);
    		}*/
        	$(thisSelector).append(thisValue);    			
		});
		}
    	//activeSelectorsList.push(thisSelectorLabel);
    	activeSelectorsList.push(thisSelector);
      	if(this.selectorName==="EndDate"){
      		var filterTitleDiv = $("<div></div>")
      			.attr("id","filterTitleDiv")
      			.css("background-color","#44494C")
      			.css("color","#FFFFFF")
      			.css("margin-top","10px")
      			.css("margin-bottom","10px");
      			//.html('<b>Select Filters</b>');
      		 activeSelectorsList.push(filterTitleDiv);
      	}
	});
	
	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();

	//Not used for this sheet:
	var applicantReportButtonDetached = $("#applicantReportButton").detach();
	var employeeRiskButtonDetached = $("#employeeRiskButton").detach();
	//var employeeScoreButtonDetached = $("#employeeScoreButton").detach();
	var laborMarketChartButtonDetached = $("#laborMarketChartButton").detach();
	/*var liveReportsTableButtonDetached = $("#liveReportsTableButton").detach();*/
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);

	$(selectorButtonBox).append(applicantReportButtonDetached);
	$(selectorButtonBox).append(employeeRiskButtonDetached);
	$(selectorButtonBox).append(laborMarketChartButtonDetached);
	//$(selectorButtonBox).append(employeeScoreButtonDetached);



	/*$(selectorButtonBox).append(liveReportsGraphButtonDetached);
	$(selectorButtonBox).append(liveReportsTableButtonDetached);*/
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);		
	});

	
}

function queryLiveReportsTableSelectorValues() {
	var selectionList = [];
	$(".liveReportsTableSelect").each(function() {
			var thisSelection = {
	   				selectorName : $(this).attr("id") ,
	   				selectorValue: ($(this).attr("id") === "StartDate") ?
	   								$(this).val().toString().substring(12) :
	   								($(this).attr("id") === "EndDate") ?
	   			   					$(this).val().toString().substring(10) :
	   			   					$(this).val(), 		
	   		};
	   		selectionList.push(thisSelection);
	});
//	console.log(selectionList);
	return selectionList;
}

function createVisibleLiveReportsTable(tableData) {
	
	//console.log("tableData:");
	//console.log(removeNonscored +" removeNonscored");

	
	var tableContainerHeight = $(window).height() - 121;
	if (windowAspectLiveReportsTable == "mobile" ) {
		tableContainerHeight = 400;
	}
	tableContainerHeight = tableContainerHeight + "px";
	var tableContainerWidth = (windowAspectLiveReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectLiveReportsTable != "mobile" ) {
		tableContainerWidth = 450;
	}
	var tableWidth = 6*Math.floor((tableContainerWidth-60)/6);
	//var columnWidth = tableWidth < 680 ?Math.floor((tableWidth-150)/7) :Math.floor((tableWidth-200)/7);
	var columnWidth = 103;

	var firstColumnWidth = tableWidth < 680 ? 100 : 120;
	//tbodyWidth = 11*columnWidth + 45;
	var tbodyWidth = tableWidth;
	var rightPadding = Math.max((columnWidth-50)/2,5);
	
	var statistic = $("#Statistics option:selected").val();

	var rate = $("#Rate option:selected").val();

	var rowLabels = ["Applicants","Interviewed","Offered","Accepted","Hired","Eligibility","Terminated","Turnover"];
	var narrowRowLabels = ["Applicants","Interviewed","Offered","Accepted","Hired","Eligibility","Terminated","Turnover"];
	var superNarrowRowLabels = ["Appld","Intd","Offd","Acctd","Hired","Elg","Term","TO"];
	
	var visibleTable = $("<table></table>").attr("id","liveReportsTable").attr("class","table")
						.css("width",tableWidth)
						.css("padding-left","0px")
						.css("padding-right","0px");
	var visibleThead = $("<thead></thead>")
						.attr("id","liveReportsThead")
						.css("width",tableWidth);
	var visibleTbody = $("<tbody></tbody>")
						.attr("id","liveReportsTbody")
						.css("width",tableWidth);

	var titleRow = $("<tr></tr>").attr("id","titleRow")
						.css("width",tableWidth);
	//var rightPadding = Math.max(( columnWidth - (Math.floor(Math.log10(maxApplied)))*10)/2 , 5); 

	//var headerRightPadding = 10;
	
	
	var maxApplied = 0;
	var maxInterviewed = 0;
	var maxOffered = 0;
	var maxAccepted = 0;
	var maxHired = 0;
	var maxEligibility = 0;
	var totalQuantiles = 0;
	var showOffered=0;
	
	$(tableData).each( function(index) {
		if ( this.offered !=0) {
				showOffered=1;
			}		
		if ( this.applied > maxApplied ) {
			maxApplied = this.applied;
		}
		if ( this.interviewed > maxInterviewed ) {
			maxInterviewed = this.interviewed;
		}
		if ( this.offered > maxOffered ) {
			maxOffered = this.offered;
		}
		if ( this.accepted > maxAccepted ) {
			maxAccepted = this.accepted;
		}
		if ( this.hired > maxHired ) {
			maxHired = this.hired;
		}
		if ( this.eligibility > maxEligibility ) {
			maxEligibility = this.eligibility;
		}
		if (!isNaN(parseFloat(this.quantileNumber)) && isFinite(this.quantileNumber) && this.quantileNumber != 0 ) {
			totalQuantiles++;			
		}
	});
	var riskTH = $("<th></th>").html("Risk").css("width", "1px").css("background-color", "#AAAAAA")
	.css("text-align","right")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left","7px")
			.css("padding-right","0px"); 

	
	if ( tableWidth < 680 ) {
		//var headerRightPadding = 10; //Math.max((columnWidth-75)/2,5);
		var quantileTH = $("<th></th>")
			.html("TT Group")
			.attr("class","liveReportsRowLabelTD")
			.css("text-align","left")
			.css("width",firstColumnWidth)
			.css("text-align","right")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left","7px")
			.css("padding-right","0px");
		var appliedTH = $("<th></th>")
			.html(superNarrowRowLabels[0])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");
		var interviewedTH = $("<th></th>")
			.html(superNarrowRowLabels[1])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var offeredTH = $("<th></th>")
			.html(superNarrowRowLabels[2])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var acceptedTH = $("<th></th>")
			.html(superNarrowRowLabels[3])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var hiredTH = $("<th></th>")
			.html(superNarrowRowLabels[4])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var eligibilityTH = $("<th></th>")
			.html(rate.substring(0,rate.length-4)+"D<br>"+superNarrowRowLabels[5])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var terminatedTH = $("<th></th>")
			.html(superNarrowRowLabels[6])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var turnoverTH = $("<th></th>")
			.html(rate.substring(0,rate.length-4)+"<br>"+superNarrowRowLabels[7])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
	}
	else if ( tableWidth < 850 ) {
		var headerRightPadding = 10; // Math.max((columnWidth-150)/2,5);
		var quantileTH = $("<th></th>")
			.html("TT Score Group")
			.attr("class","liveReportsRowLabelTD")
			.css("width",firstColumnWidth)
			.css("text-align","right")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left","7px")
			.css("padding-right","0px");
		var appliedTH = $("<th></th>")
			.html(narrowRowLabels[0])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var interviewedTH = $("<th></th>")
			.html(narrowRowLabels[1])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var offeredTH = $("<th></th>")
			.html(narrowRowLabels[2])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var acceptedTH = $("<th></th>")
			.html(narrowRowLabels[3])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var hiredTH = $("<th></th>")
			.html(narrowRowLabels[4])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var eligibilityTH = $("<th></th>")
			.html(narrowRowLabels[5])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var terminatedTH = $("<th></th>")
			.html(narrowRowLabels[6])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var turnoverTH = $("<th></th>")
			.html(narrowRowLabels[7])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
	}
	else {
		var quantileTH = $("<th></th>")
			.html("TT Score Group")
			.attr("class","liveReportsRowLabelTD")
			.css("width",firstColumnWidth)
			.css("text-align","right")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left","7px")
			.css("padding-right","0px");
		var appliedTH = $("<th></th>")
			.html(rowLabels[0])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var interviewedTH = $("<th></th>")
			.html(rowLabels[1])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var offeredTH = $("<th></th>")
			.html(rowLabels[2])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var acceptedTH = $("<th></th>")
			.html(rowLabels[3])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var hiredTH = $("<th></th>")
			.html(rowLabels[4])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var eligibilityTH = $("<th></th>")
			.html(rowLabels[5])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var terminatedTH = $("<th></th>")
			.html(rowLabels[6])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
		var turnoverTH = $("<th></th>")
			.html(rowLabels[7])
			.attr("class","liveReportsRowLabelTD")
			.css("width",columnWidth)
			.css("text-align","center")
			.css("padding-top","5px")
			.css("padding-bottom","5px")
			.css("padding-left",rightPadding+"px")
			.css("padding-right",rightPadding+"px");		
	}
	//var tailTH = $("<th></th>").attr("class","liveReportsRowLabelTD").css("width",45).css("padding-right","0px");
	
	$(titleRow).append(riskTH).append(quantileTH).append(appliedTH).append(interviewedTH);
	if(showOffered==1){
		$(titleRow).append(offeredTH);
	}
	$(titleRow).append(acceptedTH).append(hiredTH).append(eligibilityTH).append(turnoverTH);  /*.append(terminatedTH)*/
	$(visibleThead).append(titleRow);

	/*var largestQuantile  = 0;
	$(tableData).each( function(index) {
		if (this.quantileNumber > largestQuantile ) {
			largestQuantile = this.quantileNumber;
		}
	});*/

	

	//console.log("Maxes are " + maxApplied + ", "
	// + maxInterviewed + ", "
	// + maxOffered + ", "
	// + maxAccepted + ", "
	// + maxHired  + ", "
	//+ maxEligibility );
	var rightPadding = Math.max(( columnWidth - (Math.floor(Math.log10(maxApplied)))*10)/2 , 5); 

	var appliedRightPadding = Math.max(( columnWidth - (Math.floor(Math.log10(maxApplied)))*10)/2 , 5); 
	var interviewedRightPadding = Math.max((  columnWidth - Math.floor(Math.log10(maxInterviewed)+2)*10 + 15)/2 , 5); 
	var offeredRightPadding = Math.max((  columnWidth - Math.floor(Math.log10(maxOffered))*10)/2 , 5); 
	var acceptedRightPadding = Math.max((  columnWidth - Math.floor(Math.log10(maxAccepted))*10)/2 , 5); 
	var hiredRightPadding = Math.max((  columnWidth - Math.floor(Math.log10(maxHired))*10)/2 , 5); 
	var eligibilityRightPadding = Math.max((  columnWidth - Math.floor(Math.log10(maxEligibility))*10)/2 , 5); 
	var percentileRightPadding = Math.max((  columnWidth - 25)/2 , 5); 
	var percentileWithDecimalRightPadding = Math.max((  columnWidth - 40)/2 , 5); 
	//console.log("Paddings are " + appliedRightPadding + ", "
	// + interviewedRightPadding + ", "
	// + offeredRightPadding + ", "
	// + acceptedRightPadding + ", "
	// + hiredRightPadding + ", "
	//+ eligibilityRightPadding);
	
	
	var firstBlankDrawn = false;
	$(tableData).each( function(index) {
		if ( this.quantileNumber != 0 ) {
			var quantileLabel = 
					(this.quantileNumber == 1) ? "Lowest Turnover" :
					(!isNaN(parseFloat(this.quantileNumber)) && isFinite(this.quantileNumber) &&   this.quantileNumber > 1 && this.quantileNumber < totalQuantiles ) ? "" :
					(this.quantileNumber ==  totalQuantiles) ? "Highest Turnover" :
					this.quantileNumber;
			//console.log("quantileNumber is " + this.quantileNumber + ", total is " + totalQuantiles + " label is " + quantileLabel );

			var firstColumnBackgroundColor = "#ffffff";
			var dataBackgroundColor = "#ffffff";
			if ( this.quantileNumber === "Total Scored"
				||this.quantileNumber === "Non-Scored"
			 	|| this.quantileNumber === "Grand Total" ) {
				firstColumnBackgroundColor = "#f5f5f5";
				dataBackgroundColor = "#f5f5f5";
			}
			var turnover;
			if(this.turnover%1==0){
				turnover = this.turnover+".0";
			}else{
				turnover = this.turnover;
			}
			
			
 			var thisRow = $("<tr></tr>")
				.css("height","25px")
				.css("width",tbodyWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px");
 			
 			var riskTD = $("<td></td>").css("width","1px")
 			.css("background",(this.quantileNumber === "Total Scored"||this.quantileNumber === "Non-Scored"|| this.quantileNumber === "Grand Total")?"#f5f5f5":"#ffffff")
 			.css("border-top",(this.quantileNumber === "6"||this.quantileNumber === "Non-Scored"|| this.quantileNumber === "Grand Total")?"#ddd 1px solid":"0px")
 			.css("border-bottom",(this.quantileNumber === "1")?"#ddd 1px solid":"0px")
 			.css("padding","0px");
			if(this.quantileNumber=="1" || this.quantileNumber=="6"){
				var riskDiv =$("<div></div>").attr("class","circle").css("width","20px").css("height","20px").css("margin-left","10px").css("margin-top","4px");
				riskTD.append(riskDiv);
				$(riskDiv).css("background",this.quantileNumber=="1"?"#02955D":this.quantileNumber=="6"?"#C00003":"#f5f5f5");
			}
			$(thisRow).append(riskTD);
 			
 			
 			if ( quantileLabel == "Highest Turnover") {
 				$(thisRow).css("border-bottom","5px #eeeeee solid");
 			}
			var titleTD = $("<td></td>")
				.text(quantileLabel)			
				.attr("class","liveReportsRowLabelTD")
				.css("width",firstColumnWidth)
				.css("background-color",firstColumnBackgroundColor)
				.css("text-align","right")
				.css("padding-top","5px")
				.css("padding-bottom","5px")
				.css("padding-left","2px")
				.css("padding-right","0px");
			if ( quantileLabel === "" && !firstBlankDrawn ) {
				$(titleTD)
					.attr("rowspan", (totalQuantiles-2)  )
					.attr("id","arrowBox")
					.html(downwardArrow("80px"))
					.css("vertical-align","middle")
					.css("text-align","center");
				//console.log("Setting multicolumn");
			}
			if ( statistic === "Count") {
				var appliedTD = $("<td></td>")
					.text(addCommas(this.applied))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var interviewedTD = $("<td></td>")
					.text(addCommas(this.interviewed))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(addCommas(this.offered))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(addCommas(this.accepted))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(addCommas(this.hired))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var eligibilityTD = $("<td></td>")
					.text(addCommas(this.eligibility))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var terminatedTD = $("<td></td>")
					.text(addCommas(this.terminated))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}
			else if(statistic === "Conditional Percent" || statistic === "Absolute Percent"){
				var appliedTD = $("<td></td>")
					.text(addCommas(this.applied,this.applied+1))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(this.offered+"%",this.offered+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var interviewedTD = $("<td></td>")
					.text(this.interviewed+"%",this.interviewed+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(this.accepted+"%",this.accepted+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(this.hired+"%",this.hired+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var eligibilityTD = $("<td></td>")
					.text(this.eligibility,this.eligibility+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var terminatedTD = $("<td></td>")
					.text(this.terminated,this.terminated+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1 +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}
			else if(statistic === "Percent" ){
				if(statistic === "Average Score" && (this.quantileNumber ==="Non-Scored" || this.quantileNumber ==="Grand Total")){
					var appliedTD = $("<td></td>")
					.text(this.applied,this.applied+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var offeredTD = $("<td></td>")
					.text(this.offered,this.offered+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var interviewedTD = $("<td></td>")
					.text(this.interviewed,this.interviewed+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var acceptedTD = $("<td></td>")
					.text(this.accepted,this.accepted+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var hiredTD = $("<td></td>")
					.text(this.hired,this.hired+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var eligibilityTD = $("<td></td>")
					.text(this.eligibility,this.eligibility+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var terminatedTD = $("<td></td>")
					.text(this.terminated,this.terminated+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1 +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				}
				else{
					var appliedTD = $("<td></td>")
						.text(this.applied+"%",this.applied+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var offeredTD = $("<td></td>")
					.text(this.offered+"%",this.offered+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var interviewedTD = $("<td></td>")
					.text(this.interviewed+"%",this.interviewed+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var acceptedTD = $("<td></td>")
					.text(this.accepted+"%",this.accepted+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var hiredTD = $("<td></td>")
					.text(this.hired+"%",this.hired+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var eligibilityTD = $("<td></td>")
					.text(this.eligibility+"%",this.eligibility+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var terminatedTD = $("<td></td>")
					.text(this.terminated+"%",this.terminated+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1 +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				}
				
			}
			else if( statistic === "Average Score"){
				if(statistic === "Average Score" && (this.quantileNumber ==="Non-Scored" || this.quantileNumber ==="Grand Total")){
					var appliedTD = $("<td></td>")
					.text(this.applied,this.applied+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var offeredTD = $("<td></td>")
					.text(this.offered,this.offered+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var interviewedTD = $("<td></td>")
					.text(this.interviewed,this.interviewed+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var acceptedTD = $("<td></td>")
					.text(this.accepted,this.accepted+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var hiredTD = $("<td></td>")
					.text(this.hired,this.hired+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var eligibilityTD = $("<td></td>")
					.text(this.eligibility,this.eligibility+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var terminatedTD = $("<td></td>")
					.text(this.terminated,this.terminated+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1 +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				}
				else{
					var appliedTD = $("<td></td>")
						.text(this.applied+"%",this.applied+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var offeredTD = $("<td></td>")
					.text(this.offered+"%",this.offered+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var interviewedTD = $("<td></td>")
					.text(this.interviewed+"%",this.interviewed+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var acceptedTD = $("<td></td>")
					.text(this.accepted+"%",this.accepted+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var hiredTD = $("<td></td>")
					.text(this.hired+"%",this.hired+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var eligibilityTD = $("<td></td>")
					.text(this.eligibility+"%",this.eligibility+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var terminatedTD = $("<td></td>")
					.text(this.terminated+"%",this.terminated+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
					var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1 +"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("background-color",dataBackgroundColor)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				}
				
			}
			//console.log("quantileLabel is " + quantileLabel + " and firstBlankDrawn is " + firstBlankDrawn);
			if ( quantileLabel !== "" || !firstBlankDrawn ) {
				$(thisRow).append(titleTD);
			}
			
			$(thisRow).append(appliedTD).append(interviewedTD)
			if(showOffered==1){
				$(thisRow).append(offeredTD);
			}
			$(thisRow).append(acceptedTD).append(hiredTD).append(eligibilityTD).append(turnoverTD);  /* .append(terminatedTD) */
			if(this.quantileNumber != "Non-Scored"){
			$(visibleTbody).append(thisRow);
			}
			else if(this.quantileNumber === "Non-Scored" && !removeNonscored){
				$(visibleTbody).append(thisRow);	
			}
			
			if ( quantileLabel === "" && !firstBlankDrawn ) {
				firstBlankDrawn = true;
			}
		}
			
	});
	
	/*$(tableData).each( function(index) {
		if ( this.quantileNumber == 0 ) {
			var thisRow = $("<tr></tr>")
				.css("height","25px")
				.css("width",tbodyWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px");
			var titleTD = $("<td></td>")
				.text("Overall")
				.attr("class","liveReportsRowLabelTD")
				.css("width",columnWidth)
				.css("background-color","#ffffff")
				.css("padding-top","5px")
				.css("padding-bottom","5px")
				.css("padding-left","10px")
				.css("padding-right",rightPadding+"px");

			if ( statistic === "count" ) {
				var appliedTD = $("<td></td>")
					.text(addCommas(this.applied))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(addCommas(this.offered))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var interviewedTD = $("<td></td>")
					.text(addCommas(this.interviewed))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(addCommas(this.accepted))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(addCommas(this.hired))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var eligibilityTD = $("<td></td>")
					.text(addCommas(this.eligibility))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var terminatedTD = $("<td></td>")
					.text(addCommas(this.terminated))
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}
			else {
				var appliedTD = $("<td></td>")
					.text(this.applied,this.applied+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var offeredTD = $("<td></td>")
					.text(this.offered,this.offered+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var interviewedTD = $("<td></td>")
					.text(this.interviewed,this.interviewed+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var acceptedTD = $("<td></td>")
					.text(this.accepted,this.accepted+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var hiredTD = $("<td></td>")
					.text(this.hired,this.hired+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var eligibilityTD = $("<td></td>")
					.text(this.eligibility,this.eligibility+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var termiantedTD = $("<td></td>")
					.text(this.termianted,this.termianted+1)
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				var turnoverTD = $("<td></td>")
					.text(turnover+"%",turnover+1+"%")
					.attr("class","liveReportsContentTD")
					.css("width",columnWidth)
					.css("text-align","right")
					.css("padding-top","5px")
					.css("padding-bottom","5px")
					.css("padding-left",rightPadding+"px")
					.css("padding-right",rightPadding+"px");
				
			}

			$(thisRow).append(titleTD).append(appliedTD).append(interviewedTD).append(offeredTD).append(acceptedTD).append(hiredTD)
				.append(eligibilityTD).append(terminatedTD).append(turnoverTD);
			$(visibleTbody).append(thisRow);
		}
	});*/
	
	
	$(visibleTable).html(visibleThead);
	$(visibleTable).append(visibleTbody);
	
	return visibleTable;
	
}

function displayVisibleLiveReportsTable(visibleTable) {
	windowAspectLiveReportsTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectLiveReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
	if ( tableContainerWidth < 450 && windowAspectLiveReportsTable != "mobile" ) {
		tableContainerWidth = 450;
	}

	var tableContainerHeight = $(window).height() - 121;
	var displayAreaHeight = $(window).height() - 51;
	if ( displayAreaHeight < 730) {
		displayAreaHeight = 730;
	}
	var displayAreaMobileHeight = 500;
	var tableContainerMobileHeight = 450;
	
	liveReportsTableDiv = $("<div></div>").attr("id","liveReportsTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");


	var menuDiv = $("<div></div>").attr("id","menuDiv").css("height","30px").attr("class","btn-group-justified");
	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','liveReportsTableButton');
	var menuItem2 = $('<a class="btn btn-default ">Graph</a>').attr('id','liveReportsGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	if ( windowAspectLiveReportsTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area").append(liveReportsTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
		$("#display-area-xs").append(liveReportsTableDiv).css("width",displayWidth);
		$("#display-area-xs").css("height",displayAreaMobileHeight);
		$("#liveReportsTableDiv").css("height",tableContainerMobileHeight);
	}

	$(liveReportsTableDiv).html(visibleTable);
	$("#arrowBox").html($("#arrowBox").html());
	//redrawLiveReportsSelectorBoxes();
	addLiveReportsTableResizeListener();
	enableLiveReportsTableSelectors();
	activateLiveReportsTableSelectors();

}

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


function disableLiveReportsTableSelectors() {
	deactivateTopbarLinks();
	$(".liveReportsTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#liveReportsGraphButton").prop("disabled",true);
	//$("#applicantReportButton").prop("disabled",true);
	$("#employeeRiskButton").prop("disabled",true);
	//$("#employeeScoreButton").prop("disabled",true);
	$("#laborMarketChartButton").prop("disabled",true);



}

function enableLiveReportsTableSelectors() {
	activateTopbarLinks();
	$(".liveReportsTableSelect").each(function() {
		$(this).prop("disabled",false);
	});
	//console.log("linksTable.containsKey('employeerisk')" + linksTable.containsKey("employeerisk"));
	
	//if(linksTable.containsKey("employeerisk") &&  linksTable.get("employeerisk") === true ) {

	if(empReportUser  == "true"){
		$("#employeeRiskButton").prop("disabled",false);
	}

	//if(linksTable.containsKey("elmreport") &&  linksTable.get("elmreport") === true ) {
	if(laborMarketUser  == "true"){
		$("#laborMarketChartButton").prop("disabled",false);
	}
	/*if(empScoreUser  == "true"){
	$("#employeeScoreButton").prop("disabled",false);
	}*/
	
	$("#liveReportsGraphButton").prop("disabled",false);
	//$("#applicantReportButton").prop("disabled",false);
	//$("#employeeRiskButton").prop("disabled",false);
	//$("#laborMarketChartButton").prop("disabled",false);

}


function activateLiveReportsTableSelectors() {
	$(".liveReportsTableSelect").each(function() {
		$(this).unbind("change");
		
		$(this).change(function() {
			if ( $("#StartDate").val().substring(0,5) !== "Start" ) {
				var oldStartDate = $("#StartDate").val();
				$("#StartDate").val("Start Date: " + oldStartDate);
			}
			if ( $("#EndDate").val().substring(0,3) !== "End" ) {
				var oldEndDate = $("#EndDate").val();
				$("#EndDate").val("End Date: " + oldEndDate);
			}

			
			disableLiveReportsTableSelectors()
			var selectionList = queryLiveReportsTableSelectorValues();
			//console.log("Selectors:");
			//console.log(selectionList);
			$("#liveReportsTableDiv").detach();
		    displayTableSpinner(windowAspectLiveReportsTable);
			fetchLiveReportsTable(selectionList);

		});
	});
	//$("#EndDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(maxy, maxm-1, maxd),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd)});
	$("#EndDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date('2016','07', '05'),minDate:new Date(miny,minm-1,mind),maxDate:new Date('2016', '07', '05')});
	//$("#StartDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(miny, minm-1, mind),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy,maxm-1,maxd)});
	$("#StartDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(miny, minm-1, mind),minDate:new Date(miny,minm-1,mind),maxDate:new Date('2016', '07', '05')});

	$("#liveReportsGraphButton").unbind("click");
	$("#liveReportsGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportsgraph.js",dataType: "script"});
	});
	$("#employeeRiskButton").unbind("click");
	$("#employeeRiskButton").click(function(){
		if(empReportUser  == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeerisktable.js",dataType: "script"});
		}else if(empScoreUser   == "true"){
			$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
		}
	});
	
	/*$("#employeeScoreButton").unbind("click");
	$("#employeeScoreButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});
	});*/

	$("#laborMarketChartButton").unbind("click");
	$("#laborMarketChartButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
	});

}

function addLiveReportsTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectLiveReportsTable + " and new is " + newWindowAspect + "</p>");

		if ( windowAspectLiveReportsTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var liveReportsTableHolder = $("#liveReportsTableDiv").detach();
			$("#display-area-xs").append(liveReportsTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectLiveReportsTable = "mobile";
		}
		if ( windowAspectLiveReportsTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var liveReportsTableHolder = $("#liveReportsTableDiv").detach();
			$("#display-area").append(liveReportsTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectLiveReportsTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectLiveReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() -250;
		if ( tableContainerWidth < 450 && windowAspectLiveReportsTable != "mobile" ) {
			tableContainerWidth = 450;
		}
		var tableContainerHeight = $(window).height() - 121;
		var displayAreaHeight = $(window).height() - 51;
		if(displayAreaHeight < 730) {
			displayAreaHeight = 730;
		}
		var displayAreaMobileHeight = 500;
		var tableContainerMobileHeight = 450;
		tableContainerHeight = tableContainerHeight + "px";
		tableContainerMobileHeight = tableContainerMobileHeight + "px";
		displayAreaHeight = displayAreaHeight  + "px";
		displayAreaMobileHeight = displayAreaMobileHeight  + "px";
		
		var displayWidth = (windowAspectLiveReportsTable == "mobile" ) ?  $( window ).width() : $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width",displayWidth);
		tableContainerWidth = tableContainerWidth + "px";
		$("#liveReportsTableDiv").css("width",tableContainerWidth);
		var selectionList = queryLiveReportsTableSelectorValues();
		//var usedTable = liveReportsTableHashtable.get(selectionList);
		//console.log("usedTable:");
		//console.log(usedTable);
		if (usedTable != null ) {
			visibleTable = createVisibleLiveReportsTable(usedTable);
		}
		$("#liveReportsTableDiv").html(visibleTable);
		
		if ( windowAspectLiveReportsTable == "desktop") {
			var displayWidth = $( window ).width() - 225;
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
    		$("#leftbar-div").css("height",displayAreaHeight);
    		$("#liveReportsTableDiv").css("height",tableContainerHeight);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#menuDiv").css("width",displayWidth);
    		$("#display-area-xs").css("width",displayWidth);
    		$("#display-area-xs").css("height",displayAreaMobileHeight);
    		$("#liveReportsTableDiv").css("height",tableContainerMobileHeight);
		}
		$("#arrowBox").html($("#arrowBox").html());

		adjustTopbarPadding();

	
	});
}




function liveReportsCellColor(tstat){
	if ( tstat < -2.576 ) {
		return "#cccccc";
	}
	if ( tstat < -1.96 ) {
		return "#dddddd";
	}
	if ( tstat < -1.645 ) {
		return "eeeeee";
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


function drawCalendar(start,end){
	calendar.set("date");
}

function downwardArrow(arrowHeight) {
	var arrow = $("<svg></svg>").attr("version","1.1")
						.attr("x","0").attr("y","0")
						//.attr("width","20")
						.attr("height",arrowHeight)
						.attr("viewBox","0, 0, 100, 50")
						.attr("preserveAspectRatio","none")
						.css("width","30%");
						//.css("height","100%");
	$(arrow).html('<g>' +
			'<path d="M 25,0 L 75,0 L 75,30 L 100,30 L 50,50 L 0,30 L 25,30 L 25,0 Z" fill="#dddddd"/>' +
		'</g>');
	return arrow;
}
