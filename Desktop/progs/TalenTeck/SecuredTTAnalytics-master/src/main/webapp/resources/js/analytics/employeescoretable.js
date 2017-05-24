var windowAspectEmpScoreTable = "";
windowAspectEmpScoreTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

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

underlineOnlyThisLink("#liveReportLink");

deactivateTopbarLinks();

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Reports</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Selection and turnover rates for a panel of applicants, broken down by TalenTeck turnover risk score categories.</h4>');

var applicantReportButton = $("<button></button>").attr('id','applicantReportButton')
.attr('class','btn btn-default btn-block').text("Applicants")
.css("margin-bottom","10px").css("padding","10px");


var employeeRiskButton = $("<button></button>").attr('id','employeeRiskButton')
.attr('class','btn btn-default btn-block').text("Employees")
.css("margin-bottom","10px").css("padding","10px");


var laborMarketChartButton = $("<button></button>").attr('id','laborMarketChartButton').attr('class','btn btn-default btn-block')//.prop("disabled",true)
.text("Labor Markets").css("margin-bottom","10px").css("padding","10px");

/*var employeeScoreButton = $("<button></button>").attr('id','employeeScoreButton')
.attr('class','btn btn-default btn-block').text("Employee Scores")
.css("margin-bottom","10px").css("padding","10px").prop("disabled",true);*/


$(selectorButtonBox).append(titleDiv).append(titleDescDiv).append(applicantReportButton).append(employeeRiskButton).append(laborMarketChartButton);//.append(employeeScoreButton);


if ( windowAspectEmpScoreTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

var driverIndex = 0;
var dataVaryingSelector = "";
var selectorList = [];
var tableData = {};
var liveReportsRawTable = {};
var formattedTable = [];
var employeeScoreTableHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var employeeScoreSelectionsHashtable = new Hashtable({hashCode : selectionHashCode , equals: selectionIsEqual});
var selectorsEverDrawn = false;
var splitDate,miny,minm,mind,maxy,maxm,maxd,dminy,dminm,dmind;


refreshEmployeeScoreTable();


function fetchEmployeeScoreTable(selectionList) {
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "employeescoretable" ,
    			selectorlist : JSON.stringify(selectionList)
			  } ,
    	dataType: "json" ,
    	success: function(data) {
    		tableData = data.rows;
    		createVisibleEmployeeScoreTable(tableData);
    	}
    });
}

function refreshEmployeeScoreTable() {
	var employeeScoreSelectorsReturned = false;
	var employeeScoreDataReturned = false;
	disableEmployeeScoreTableSelectors();
    displayTableSpinner(windowAspectEmpScoreTable);
	$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getemployeescoreselectors" } ,
		dataType: "json" ,
		success: function(data) {
			selectorList = data.selectorList;
			redrawEmployeeScoreSelectorBoxes();
			
			var selectionList = queryEmployeeScoreTableSelectorValues();
			fetchEmployeeScoreTable(selectionList);
		}
	});
	
}


function redrawEmployeeScoreSelectorBoxes() {
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		if(this.selectorName === "StartDate"){
			var defaultStartDate  = $(this.selectorValues)[0].valueLabel.replace("Start Date: ","")
			 splitDate = defaultStartDate.split("/"); 
			 dminy = parseInt(splitDate[2]);
			 dminm = parseInt(splitDate[0]);
			 dmind = parseInt(splitDate[1]);
			 
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
 	activeSelectorsList.push(dateTitleDiv);

	
	$(selectorList).each(function() {
		var selectorLabel = this.selectorLabel;
		if(this.selectorName === "StartDate"){
			 var thisSelector = $("<input></input>").attr("id",this.selectorName)
			.attr("class","form-control employeeScoreTableSelect").attr("width","300px")
			.val($(this.selectorValues)[0].valueLabel)
			.attr("readonly","true").attr('disabled', true);
		}
		else if(this.selectorName === "EndDate" ){
			 var thisSelector = $("<input></input>").attr("id",this.selectorName).attr("name",selectorLabel)
			.attr("class","form-control employeeScoreTableSelect").attr("width","300px")
			.val($(this.selectorValues)[0].valueLabel)
			.attr("readonly","true");
		}
		else{			
			var thisSelector = $("<select></select>").attr("id",this.selectorName).attr("name",selectorLabel)
			.attr("class","form-control employeeScoreTableSelect").attr("width","300px")
			.attr("defaultValue",this.defaultValue);
			
			var i=0;
			$(this.selectorValues).each( function() {
				if(i==0){
				var thisValue = $("<option></option>").attr("value",this.valueName).text(selectorLabel + ": " +  this.valueLabel);
				$(thisSelector).data('pre',this.valueName);
				}else{
					var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
				}
							
    		if ( this.valueName === "Tribeca" || this.valueName ==="Philippines" || this.valueName === "90-Day") {
    			$(thisValue).attr("selected","selected");
				$(thisValue).prop("selected",true);
    		}
        	$(thisSelector).append(thisValue); 
        	i++;
		});
	}
		
    	activeSelectorsList.push(thisSelector);
      	if(this.selectorName==="EndDate"){
      		var filterTitleDiv = $("<div></div>")
      			.attr("id","filterTitleDiv")
      			.css("background-color","#44494C")
      			.css("color","#FFFFFF")
      			.css("margin-top","10px")
      			.css("margin-bottom","10px");
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
	
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);

	$(selectorButtonBox).append(applicantReportButtonDetached);
	$(selectorButtonBox).append(employeeRiskButtonDetached);
	$(selectorButtonBox).append(laborMarketChartButtonDetached);
	//$(selectorButtonBox).append(employeeScoreButtonDetached);
	$.each(activeSelectorsList,function() {
		$(selectorButtonBox).append(this);		
	});

	
}

function queryEmployeeScoreTableSelectorValues() {
	var selectionList = [];
	$(".employeeScoreTableSelect").each(function() {
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
	return selectionList;
}

function createVisibleEmployeeScoreTable() {

	var tableContainerHeight = $(window).height() - 65;
	if (windowAspectEmpScoreTable == "mobile") {
		tableContainerHeight = 500;
	}
	tableContainerHeight = tableContainerHeight + "px";
	
	var tableContainerWidth = (windowAspectEmpScoreTable == "mobile") ? $(window).width(): $(window).width() - 300;
	if (tableContainerWidth < 515) {
		tableContainerWidth = 515;
	}
	tableWidth = tableContainerWidth;

	if (tableWidth < 1650) {
		tableWidth = 1650;
	}
	var dataColumnWidth = tableWidth <= 1650 ? 110 : 110 + Math.floor((tableWidth - 1650) / 15);
	var tableScrollWidth = tableWidth - dataColumnWidth < 1540 ? 1540 : tableWidth - dataColumnWidth > 2080 ? 2080 : tableWidth - dataColumnWidth;
	var minColumnWidth = 85;


	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if (lowerBoxesHeight < 676) {
		lowerBoxesHeight = 676;
	}
	if (lowerBoxesMobileHeight < 1000) {
		lowerBoxesMobileHeight = 1000;
	}

	var tableContainerHeight = (windowAspectEmpScoreTable == "mobile") ? (lowerBoxesMobileHeight - 250) / 2: lowerBoxesHeight - 65;
	
	var rowLabels = [ "Employee ID","Tenure","Date","Title","Weekly Hours","Effective Wage","Bonus","Rating","Number of Ratings","Days Since Rated","Team","Supervisor","Referred","Commute Time","Number of Referrals","Number of Interviews" ];

	var employeeScoreTableDiv = $("<div></div>").attr("id", "employeeScoreTableDiv").css("vertical-align", "middle").css("display", "inline-block")
	.css("margin-left", "25px").css("margin-right","25px").css("background-color", "#F2F5F8").css("margin-top","25px").css("width", tableContainerWidth);
	
	var empScoreTable = $("<table></table>").attr("id", "empScoreTable").css("width","100%").attr("class","display");
	var empScoreTableThead = $("<thead></thead>");
	var titleRow = $("<tr></tr>").attr("id", "titleRow");

	
	var riskTH = $("<th></th>").html("Risk").attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Score category relative to other employees with same tenure.").css("min-width","2px").css("background-color","#AAAAAA");//.css("text-align","right").css("padding-right","22px");
	var employeeidTH = $("<th></th>").html(rowLabels[0]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Unique identifier.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var tenureTH = $("<th></th>").html(rowLabels[1]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Days elapsed since hired.").css("min-width",minColumnWidth-20).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var dateTH = $("<th></th>").html(rowLabels[2]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Date the score was generated.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var titleTH = $("<th></th>").html(rowLabels[3]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Title as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var weeklyHoursTH = $("<th></th>").html(rowLabels[4]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Average weekly hours, based on paychecks in the last 30 days.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var effectiveWageTH = $("<th></th>").html(rowLabels[5]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Total take home pay, in dollars per hour, based on paychecks in the last 30 days.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var bonusTH = $("<th></th>").html(rowLabels[6]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Total bonus dollars paid on paychecks received in last 30 days.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var ratingTH = $("<th></th>").html(rowLabels[7]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Most recent rating as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var numberOfRatingsTH = $("<th></th>").html(rowLabels[8]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Number of ratings received as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var daysSinceRatedTH = $("<th></th>").html(rowLabels[9]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Days elapsed since employee was last rated.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var teamTH = $("<th></th>").html(rowLabels[10]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Team as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var supervisorTH = $("<th></th>").html(rowLabels[11]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Supervisor as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var referredTH = $("<th></th>").html(rowLabels[12]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Indicates if the employee was referred.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var commuteTimeTH = $("<th></th>").html(rowLabels[13]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Estimate of commute time, based on home address zip code.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var NumberOfReferralsTH = $("<th></th>").html(rowLabels[14]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Number of applicants who were referred by employee as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");
	var NumberOfInterviewsTH = $("<th></th>").html(rowLabels[15]).attr("data-toggle","tooltip").attr("data-placement","top").attr("data-container","body").attr("title","Number of interviews conducted by employee as of date.").css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px").css("background-color","##AAAAAA");

	
	$(titleRow).append(riskTH).append(employeeidTH).append(tenureTH).append(dateTH).append(titleTH).append(weeklyHoursTH)
	.append(effectiveWageTH).append(bonusTH).append(ratingTH).append(numberOfRatingsTH).append(daysSinceRatedTH).append(teamTH)
	.append(supervisorTH).append(referredTH).append(commuteTimeTH).append(NumberOfReferralsTH).append(NumberOfInterviewsTH);
	$(empScoreTableThead).append(titleRow);
	$(empScoreTable).append(empScoreTableThead);

	
	var employeeScoreTbody = $("<tbody></tbody>").attr("id", "employeeScoreTbody");
	$(tableData).each(function(index) {
			var thisRow = $("<tr></tr>");
			var riskTD = $("<td></td>").css("min-width","2px").css("text-align","right").text(this.ptd).css("font-size","0");//.css("padding-right","22px");
			var riskDiv =$("<div></div>").attr("class","circle").css("width","20px").css("height","20px");
			riskTD.append(riskDiv);
			$(riskDiv).css("background",this.ptd==1?"#02955D":this.ptd==2?"#f9f948":this.ptd==3?"#E87506":"#C00003");
			var employeeidTD = $("<td></td>").text(this.employeeID).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var tenureTD = $("<td></td>").text(this.tenure).css("min-width",minColumnWidth-20).css("text-align","right").css("padding-right","22px");
			var dateTD = $("<td></td>").text(this.date).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var titleTD = $("<td></td>").text(this.title).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var weeklyHoursTD = $("<td></td>").text(this.weeklyHours).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var effectiveWageTD = $("<td></td>").text("$" + (this.effectiveWage).toFixed(2)).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var bonusTD = $("<td></td>").text("$" + (this.bonus).toFixed(2)).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var ratingTD = $("<td></td>").text(this.rating).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var numberOfRatingsTD = $("<td></td>").text(this.noOfRatings).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var daysSinceRatedTD = $("<td></td>").text(this.daysSinceRated).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var teamTD = $("<td></td>").text(this.team).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var supervisorTD = $("<td></td>").text(this.supervisor!=null?this.supervisor:"Missing").css("min-width",minColumnWidth-10).css("text-align","right").css("padding-right","22px");
			var referredTD = $("<td></td>").text(this.referred).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var commuteTimeTD = $("<td></td>").text(this.commuteTime).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var NumberOfReferralsTD = $("<td></td>").text(this.noOfReferrals).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");
			var NumberOfInterviewsTD = $("<td></td>").text(this.noOfInterviews).css("min-width",minColumnWidth).css("text-align","right").css("padding-right","22px");

			$(thisRow).append(riskTD).append(employeeidTD).append(tenureTD).append(dateTD).append(titleTD).append(weeklyHoursTD)
			.append(effectiveWageTD).append(bonusTD).append(ratingTD).append(numberOfRatingsTD).append(daysSinceRatedTD).append(teamTD)
			.append(supervisorTD).append(referredTD).append(commuteTimeTD).append(NumberOfReferralsTD).append(NumberOfInterviewsTD);
			$(employeeScoreTbody).append(thisRow); 

		});
	$(empScoreTable).append(employeeScoreTbody);
	
	
	
	var menuDiv = $("<div></div>").attr("id", "menuDiv").css("height", "30px").attr("class", "btn-group-justified");

	var menuItem1 = $('<a class="btn btn-default ">Report</a>').attr('id', 'empRiskReportsButton');
	var menuItem2 = $('<a class="btn btn-default disabled">Scores</a>').attr('id','empScoreButton');
	menuDiv.append(menuItem1).append(menuItem2);

	if (windowAspectEmpScoreTable == "desktop") {
		var displayWidth = $(window).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width", displayWidth);
		 $("#display-area").html(menuDiv);
		$(employeeScoreTableDiv).html(empScoreTable);
		$("#display-area").append(employeeScoreTableDiv);
	} else {
		var displayWidth = $(window).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width", displayWidth);
		$("#display-area-xs").html(menuDiv);
		$(employeeScoreTableDiv).html(empScoreTable);
		$("#display-area-xs").append(employeeScoreTableDiv);
	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");
		
	$("#empScoreTable").DataTable({
		scrollY:'75vh',
		scrollX: true,
        scrollCollapse: true,
        paging: true,
        fixedColumns:{leftColumns:4},	
        pageLength: 15,	
        autoWidth: true,
        order: [],
        lengthMenu: [ 15, 25, 50, 100],
        //lengthChange: false
		//columnDefs: [ {targets: 0,orderable: false} ],
	});

 $('[data-toggle="tooltip"]').tooltip({
	    container : 'body'    	
	  });
	//redrawEmployeeScoreSelectorBoxes();
	addEmployeeScoreTableResizeListener();
	enableEmployeeScoreTableSelectors();
	activateEmployeeScoreTableSelectors();
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


function disableEmployeeScoreTableSelectors() {
	deactivateTopbarLinks();
	$(".employeeScoreTableSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled",true);
	});
	$("#liveReportsGraphButton").prop("disabled",true);
	//$("#applicantReportButton").prop("disabled",true);
	$("#employeeRiskButton").prop("disabled",true);
	$("#applicantReportButton").prop("disabled",true);
	$("#laborMarketChartButton").prop("disabled",true);
	$("#empRiskReportsButton").prop("disabled",true);
}

function enableEmployeeScoreTableSelectors() {
	activateTopbarLinks();
	$(".employeeScoreTableSelect").each(function() {
		$(this).prop("disabled",false);

		if(this.id == 'DateRange' && $(this).val()!='Range'){
			$("#StartDate").prop("disabled",true);
			$("#EndDate").prop("disabled",true);
		}	
	});
	
	if(empReportUser  == "true"){
		$("#empRiskReportsButton").prop("disabled",false);
	}
	if(laborMarketUser  == "true"){
		$("#laborMarketChartButton").prop("disabled",false);
	}
	if(appReportUser == "true"){
	$("#applicantReportButton").prop("disabled",false);
	}
	
	$("#liveReportsGraphButton").prop("disabled",false);

}


function activateEmployeeScoreTableSelectors() {
	$(".employeeScoreTableSelect").each(function() {
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
			
			if(this.id == 'DateRange'&& $("#" + this.id).val() == 'Range'){
				console.log("Rangeeeeee");
				$("#StartDate").prop("disabled",false);
				$("#EndDate").prop("disabled",false);
			}

			if (this.id == 'Location'|| this.id == 'DateRange') {
				$('#'+ this.id+ ' option:selected').text(this.name+ ": "+ $("#"+ this.id).val());
				var before_change = $("#" + this.id).data('pre');// get the pre data
				$('#'+ this.id+ " option[value='"+ before_change +"']").text(before_change);
				$('#' + this.id).data('pre',$("#" + this.id).val());
			}
			
			disableEmployeeScoreTableSelectors()
			var selectionList = queryEmployeeScoreTableSelectorValues();
			$("#employeeScoreTableDiv").detach();
		    displayTableSpinner(windowAspectEmpScoreTable);
			fetchEmployeeScoreTable(selectionList);

		});
	});
	$("#EndDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(maxy, maxm-1, maxd),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy, maxm-1, maxd)});
	$("#StartDate").datepicker({changeMonth: true,changeYear: true,defaultDate:new Date(dminy, dminm-1, dmind),minDate:new Date(miny,minm-1,mind),maxDate:new Date(maxy, maxm-1, maxd)});

	$("#liveReportsGraphButton").unbind("click");
	$("#liveReportsGraphButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportsgraph.js",dataType: "script"});
	});
	$("#empRiskReportsButton").unbind("click");
	$("#empRiskReportsButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/employeerisktable.js",dataType: "script"});
	});
	
	$("#applicantReportButton").unbind("click");
	$("#applicantReportButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
	});

	$("#laborMarketChartButton").unbind("click");
	$("#laborMarketChartButton").click(function(){
		$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
	});

}

function addEmployeeScoreTableResizeListener() {
	$(window).off("resize");
	$(window).resize(function() {
		var localEmpScoreHolder, localSelectorButtonBox;
		//console.log("In Resize: $(window).width()" + $(window).width());
		var newWindowAspect = ($(window).width() >= 768) ? "desktop": "mobile";

		if (windowAspectEmpScoreTable == "desktop" && newWindowAspect == "mobile") {
			localEmpScoreHolder = $("#empScoreTable").detach();
			localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area-xs").html(localEmpScoreHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
			windowAspectEmpScoreTable = "mobile";
		}
		if (windowAspectEmpScoreTable != "desktop" && newWindowAspect == "desktop") {
			localEmpScoreHolder = $("#empScoreTable").detach();
			localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area").html(localEmpScoreHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			windowAspectEmpScoreTable = "desktop";
		}

		var chartContainerWidth = (windowAspectEmpScoreTable == "mobile") ? $(window).width() - 50 : $(window).width() - 350;
		if (chartContainerWidth < 400) {
			chartContainerWidth = 400;
		}
		var chartWidth = (windowAspectEmpScoreTable == "mobile") ? chartContainerWidth - 100 : chartContainerWidth / 2 - 100;

		var lowerBoxesHeight = $(window).height() - 51;
		var lowerBoxesMobileHeight = $(window).height() - 311;
		if (lowerBoxesHeight < 676) {
			lowerBoxesHeight = 676;
		}
		if (lowerBoxesMobileHeight < 1000) {
			lowerBoxesMobileHeight = 1000;
		}
		//var chartContainerHeight = (windowAspectEmpScoreTable == "mobile") ? (lowerBoxesMobileHeight - 250) / 2 : lowerBoxesHeight - 175;
		var chartContainerHeight = (windowAspectEmpScoreTable == "mobile") ? (lowerBoxesMobileHeight - 250) / 2 : lowerBoxesHeight - 250;

		$("#leftbar-div").css("height", lowerBoxesHeight + "px");
		$("#display-area").css("height",lowerBoxesHeight + "px");
		$("#display-area-xs").css("height",lowerBoxesMobileHeight + "px");

		$("#employeeScoreTableDiv").css("width",chartContainerWidth);
		$("#employeeScoreTableDiv").css("height",chartContainerHeight + "px");
		$("#empScoreTable").css("width", chartWidth + "px");

		var displayWidth = $(window).width() - 250;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width", displayWidth);

		createVisibleEmployeeScoreTable();
	});
}


function drawCircle(bgColor){
	var svgElement = $("<svg></svg>").attr("version","1.1")
				 .attr("xmlns","http://www.w3.org/2000/svg")
				 .attr("width","15")
				 .attr("height","15")
				 var gg = $("<g></g>")
	var circle = $("<circle></circle>")	
				 .attr("cx","8")
				 .attr("cy","8")
				 .attr("r","5")
				 .attr("fill",bgColor)
				 .attr("stroke","#333")
				 .attr("stroke-width","1");
	$(svgElement).append($(gg).html($(circle)));
	return svgElement;	
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
						.attr("height",arrowHeight)
						.attr("viewBox","0, 0, 100, 50")
						.attr("preserveAspectRatio","none")
						.css("width","30%");
	$(arrow).html('<g>' + '<path d="M 25,0 L 75,0 L 75,30 L 100,30 L 50,50 L 0,30 L 25,30 L 25,0 Z" fill="#dddddd"/>' +'</g>');
	return arrow;
}
