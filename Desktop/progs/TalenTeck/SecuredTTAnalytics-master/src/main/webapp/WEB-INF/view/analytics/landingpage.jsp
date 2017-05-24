<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="true"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TalenTeck Client Page</title>
	<!--  Google Maps -->
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCM1lBI83htsMPReux9TeF8rzqpsGtH8LQ"></script>
	
    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>
    <!-- jQuery -->
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    <script src="//cdn.jsdelivr.net/jquery.ui.touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

    <!-- amCharts javascript sources -->
    <script type="text/javascript" src="../resources/js/analytics/amcharts/amcharts.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/amcharts/serial.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/amcharts/xy.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/amcharts/themes/black.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/amcharts/pie.js"></script>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="../resources/css/analytics/bootstrap.min.css">
    <link rel="stylesheet" href="../resources/css/analytics/bootstrap-theme.min.css">
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <!-- Bootstrap-table -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap.table/1.8.1/bootstrap-table.min.css">
    <script src="//cdn.jsdelivr.net/bootstrap.table/1.8.1/bootstrap-table.min.js"></script>
    <!-- Bootstrap-select -->
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.2/css/bootstrap-select.min.css"/>
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.2/js/bootstrap-select.min.js"></script>

    <!-- local scripts -->
    <script type="text/javascript" src="../resources/js/analytics/spin.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/sharedworksheetfunctions.js"></script>
    <script type="text/javascript" src="../resources/js/analytics/hashtable.js"></script>
    
    
    <!-- Stylesheets -->
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Roboto+Slab:300'>
    
    <link type="text/css" rel="stylesheet" href="../resources/css/analytics/dashboard.css">
    <link rel="stylesheet" href="../resources/css/sorter/theme.default.css" />
    <script src="../resources/js/sorter/jquery.tablesorter.js"></script>
    <script src="../resources/js/sorter/jquery.tablesorter.widgets.js"></script>
    <script src="../resources/js/sorter/widget-scroller.js"></script>
    <script src="../resources/js/sorter/widget-output.js"></script>
    <link type="text/css" rel="stylesheet" href="//cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css" />
     <script type="text/javascript" src="//cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js" ></script>
    <script type="text/javascript" src="https://cdn.datatables.net/fixedcolumns/3.2.1/js/dataTables.fixedColumns.min.js"></script>
    
<sec:authorize access="hasRole('P_APPLICANTS')" var="applicantsUser"></sec:authorize>
<sec:authorize access="hasRole('P_EMPLOYEES')" var="employeesUser"></sec:authorize>
<sec:authorize access="hasRole('P_TURNOVER')" var="turnoverUser"></sec:authorize>
<sec:authorize access="hasRole('P_IMPACT')" var="impactUser"></sec:authorize>
<sec:authorize access="hasRole('P_MODELS')" var="modelsUser"></sec:authorize>
<sec:authorize access="hasRole('P_VERIFICATION')" var="verificationUser"></sec:authorize>
<sec:authorize access="hasRole('P_REPORT')" var="reportUser"></sec:authorize>
<sec:authorize access="hasRole('P_LIVEREPORT')" var="liveReportUser"></sec:authorize>
<sec:authorize access="hasRole('P_EMPPLAYGROUND')" var="playgroundUser"></sec:authorize>
<sec:authorize access="hasRole('P_SURVEY')" var="surveyUser"></sec:authorize>
<sec:authorize access="hasRole('P_EMPREPORT')" var="empReportUser"></sec:authorize>
<sec:authorize access="hasRole('P_APPREPORT')" var="appReportUser"></sec:authorize>
<sec:authorize access="hasRole('P_LABORMARKETREPORT')" var="laborMarketUser"></sec:authorize>
<sec:authorize access="hasRole('ALL_CLIENT')" var="allUser"></sec:authorize>
<sec:authorize access="hasRole('R_NONSCORED')" var="removeNonscored"></sec:authorize>
<sec:authorize access="hasRole('P_EMPSCORE')" var="empScoreUser"></sec:authorize>

<sec:authentication property="principal.username" var="user" /> 

    <script>
    var laborMarketUser = '${laborMarketUser}';
    var empReportUser ='${empReportUser}';
    var empScoreUser ='${empScoreUser}';
    var appReportUser = '${appReportUser}';
    var removeNonscored='${removeNonscored}';
    
    function activateTopbarLinks() {
    	//alert("applicantsUser:" + '${applicantsUser}' + "employeesUser:" + '${employeesUser}' + "turnoverUser:"+'${turnoverUser}' + "impactUser:"+'${impactUser}'
    		//	+"modelsUser:"+'${modelsUser}' +"verificationUser:" +'${verificationUser}' + "reportUser:"+'${reportUser}' + "liveReportUser:"+'${liveReportUser}'
    			//+ "playgroundUser:" + '${playgroundUser}' + "surveyUser:" + '${surveyUser}' + "allUser:"+'${allUser}' + "user:"+'${user}' );
    	deactivateTopbarLinks();
    	//logoutLink
    	if('${allUser}'=="true"){
    		$("#backLink").click(function(){
    			deactivateTopbarLinks();
    			window.location.href="${pageContext.request.contextPath}/multiclienthome.html?user=" + '${user}';
    		});
    		$("#backLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			window.location.href="${pageContext.request.contextPath}/multiclienthome.html?user=" + '${user}';
	    	});
		}
    	
		if('${employeesUser}'=="true"){
	    	$("#headcountLink").click(function(){
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/headcounttable.js",dataType: "script"});
    		});
    		$("#headcountLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/headcounttable.js",dataType: "script"});
	    	});
		}
		else {
			$('#headcountLink').prop("disabled",true);
			$('#headcountLink').attr("class","sheetlink-disabled");
			$('#headcountLinkTall').prop("disabled",true);
			$('#headcountLinkTall').attr("class","sheetlinkTall-disabled");
		}
		if('${applicantsUser}' == "true"){
	    	$("#applicantLink").click(function(){
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/applicanttable.js",dataType: "script"});
    		});
    		$("#applicantLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/applicanttable.js",dataType: "script"});
    		});
		}
		else {
			$('#applicantLink').prop("disabled",true);
			$('#applicantLink').attr("class","sheetlink-disabled");
			$('#applicantLinkTall').prop("disabled",true);
			$('#applicantLinkTall').attr("class","sheetlinkTall-disabled");
		}
		
		if('${turnoverUser}' == "true"){
	    	$("#turnoverLink").click(function(){
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/turnovertable.js",dataType: "script"});
    		});
    		$("#turnoverLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/turnovertable.js",dataType: "script"});
    		});
		}
		else {
			$('#turnoverLink').prop("disabled",true);
			$('#turnoverLink').attr("class","sheetlink-disabled");
			$('#turnoverLinkTall').prop("disabled",true);
			$('#turnoverLinkTall').attr("class","sheetlinkTall-disabled");
		}
		if('${impactUser}'== "true"){
	    	$("#trimLink").click(function(){
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/trimgraph.js",dataType: "script"});
    		});
    		$("#trimLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/trimgraph.js",dataType: "script"});
	    	});
   		}
		else {
			$('#trimLink').prop("disabled",true);
			$('#trimLink').attr("class","sheetlink-disabled");
			$('#trimLinkTall').prop("disabled",true);
			$('#trimLinkTall').attr("class","sheetlinkTall-disabled");
		}
		if('${modelsUser}'== "true"){
	    	$("#driversLink").click(function(){
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/driversgraph.js",dataType: "script"});
    		});
    		$("#driversLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/driversgraph.js",dataType: "script"});
    		});
		}
		else {
			$('#driversLink').prop("disabled",true);
			$('#driversLink').attr("class","sheetlink-disabled");
			$('#driversLinkTall').prop("disabled",true);
			$('#driversLinkTall').attr("class","sheetlinkTall-disabled");
		}

		if('${playgroundUser}'== "true"){
	    	$("#employeePlaygroundLink").click(function(){
	    		//console.log("listened");
    			deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/applicantplayground.js",dataType: "script"});
    			/* ,error: function (request, status, error) { console.log("Error" + status);console.log(request.responseText);},success: function(data) {console.log("Success");console.log(data);} */
    		});
    		$("#employeePlaygroundLinkTall").click(function(){
	    		deactivateTopbarLinks();
    			$.ajax({type: "GET",url: "../resources/js/analytics/applicantplayground.js",dataType: "script"});
    		});
		}
		else {
			$('#employeePlaygroundLink').prop("disabled",true);
			$('#employeePlaygroundLink').attr("class","sheetlink-disabled");
			$('#employeeplaygroundLinkTall').prop("disabled",true);
			$('#employeeplaygroundLinkTall').attr("class","sheetlinkTall-disabled");
		}

		
		if('${verificationUser}'== "true"){
			if (linksTable.containsKey("reports") &&  linksTable.get("reports") === true) {
		    	$("#robustnessLink").click(function(){
	    			deactivateTopbarLinks();
	    			//console.log("listened");
	    			//$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	    			$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});

	    		});
	    		$("#robustnessLinkTall").click(function(){
		    		deactivateTopbarLinks();
		    		//console.log("listened");
	    			//$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
	    			$.ajax({type: "GET",url: "../resources/js/analytics/robustnesstable.js",dataType: "script"});

	    		});				
			}
			else {
		    	$("#robustnessLink").click(function(){
	    			deactivateTopbarLinks();
	    			//console.log("listened");
	    			$.ajax({type: "GET",url: "../resources/js/analytics/robustnessgraph.js",dataType: "script"});
	    		});
	    		$("#robustnessLinkTall").click(function(){
		    		deactivateTopbarLinks();
		    		//console.log("listened");
	    			$.ajax({type: "GET",url: "../resources/js/analytics/robustnessgraph.js",dataType: "script"});
	    		});

			}
		}
		else {
			$('#robustnessLink').prop("disabled",true);
			$('#robustnessLink').attr("class","sheetlink-disabled");
			$('#robustnessLinkTall').prop("disabled",true);
			$('#robustnessLinkTall').attr("class","sheetlinkTall-disabled");
		}
		/* This table has been moved to under robustness
		if( '${reportUser}'== "true"){
	    	$("#reportLink").click(function(){
    			deactivateTopbarLinks();
				console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
    		});
    		$("#reportLinkTall").click(function(){
	    		deactivateTopbarLinks();
				console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/reportstable.js",dataType: "script"});
    		});
		}
		else {
			$('#reportLink').prop("disabled",true);
			$('#reportLink').attr("class","sheetlink-disabled");
			$('#reportLinkTall').prop("disabled",true);
			$('#reportLinkTall').attr("class","sheetlinkTall-disabled");
		}
		*/
		
		if('${surveyUser}'== "true"){
			$("#surveysLink").click(function(){
    			deactivateTopbarLinks();
				//console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/surveytable.js",dataType: "script"});
    		});
    		$("#surveysLinkTall").click(function(){
	    		deactivateTopbarLinks();
				//console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/surveytable.js",dataType: "script"});
    		});
		}
		else {
			$('#surveysLink').prop("disabled",true);
			$('#surveysLink').attr("class","sheetlink-disabled");
			$('#surveysLinkTall').prop("disabled",true);
			$('#surveysLinkTall').attr("class","sheetlinkTall-disabled");
		}

		if( '${liveReportUser}'== "true"){
	    	$("#liveReportLink").click(function(){
    			deactivateTopbarLinks();
    			//console.log("listened");
    			//if(linksTable.containsKey("applicantreport") &&  linksTable.get("applicantreport") === true ) {
    			if('${appReportUser}'== "true"){
    			$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
    			}else{
        			$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
    			}
    		});
    		$("#liveReportLinkTall").click(function(){
	    		deactivateTopbarLinks();
	    		//console.log("listened");
				if(linksTable.containsKey("applicantreport") &&  linksTable.get("applicantreport") === true ) {
    			$.ajax({type: "GET",url: "../resources/js/analytics/livereportstable.js",dataType: "script"});
    			}else{
        			$.ajax({type: "GET",url: "../resources/js/analytics/elmreportgraph.js",dataType: "script"});
    			}    		
				});
		}
		else {
			$('#liveReportLink').prop("disabled",true);
			$('#liveReportLink').attr("class","sheetlink-disabled");
			$('#liveReportLinkTall').prop("disabled",true);
			$('#liveReportLinkTall').attr("class","sheetlinkTall-disabled");
		}

		// Need to change to '${interviewerUser}' once it's created
		/* Moved to historical reports sheet
		if( "true"== "true"){
	    	$("#interviewerLink").click(function(){
    			deactivateTopbarLinks();
				console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitytable.js",dataType: "script"});
    		});
    		$("#interviewerLinkTall").click(function(){
	    		deactivateTopbarLinks();
				console.log("listened");
    			$.ajax({type: "GET",url: "../resources/js/analytics/interviewerqualitytable.js",dataType: "script"});
    		});
		}
		else {
			$('#interviewerLink').prop("disabled",true);
			$('#interviewerLink').attr("class","sheetlink-disabled");
			$('#interviewerLinkTall').prop("disabled",true);
			$('#interviewerLinkTall').attr("class","sheetlinkTall-disabled");
		}
		*/

		
		
    }
    
    
    function deactivateTopbarLinks() {
    	$("#headcountLink").unbind("click");
    	$("#headcountLinkTall").unbind("click");
    	$("#applicantLink").unbind("click");
    	$("#applicantLinkTall").unbind("click");
    	$("#turnoverLink").unbind("click");
    	$("#turnoverLinkTall").unbind("click");
    	$("#trimLink").unbind("click");
    	$("#trimLinkTall").unbind("click");
    	$("#driversLink").unbind("click");
    	$("#driversLinkTall").unbind("click");
    	$("#employeePlaygroundLink").unbind("click");
    	$("#employeePlaygroundLinkTall").unbind("click");
    	$("#robustnessLink").unbind("click");
    	$("#robustnessLinkTall").unbind("click");
    	/*$("#reportLink").unbind("click");
    	$("#reportLinkTall").unbind("click");*/
    	$("#surveysLink").unbind("click");
    	$("#surveysLinkTall").unbind("click");
    	$("#liveReportLink").unbind("click");
    	$("#liveReportLinkTall").unbind("click");
    	$("#interviewerLink").unbind("click");
    	$("#interviewerLinkTall").unbind("click");
    }
    
	var linksTable = new Hashtable();	
	var parent = document.referrer;

	
    $(document).ready(function(){    	
        $.ajax({ type: "POST" ,
    		url: "../ReturnQuery" , 
    		//Use applicantbytenure because it ends one year earlier 
    		data: { 
    			type : "getpublishedstatuses" } ,
    		dataType: "json" ,
    		success: function(data) {
    			//console.log("Sheet status:");
    			//console.log(data);
    	    	$(data.sheetStatuses).each(function() {
    	    		//console.log("linksTable:" + JSON.stringify(linksTable));
    	    		linksTable.put(this.sheetName,this.published);
    	    	})
				var runningActiveLinks = 0;
    	    	//alert(linksTable.entries());
 	    	
    	    	if(parent.indexOf("homepage") > -1){
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="menuLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Menu" onclick="history.go(-1)">Main Menu</a></td>');
    	    		$("#linksTallTopTR").append('<td class="topbarTallTD"><a id="menuLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Menu" onclick="history.go(-1)">Main Menu</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("applicant") &&  linksTable.get("applicant") === true  ) {

    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="applicantLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Description of recruitment and selection process.">APPLICANTS</a></td>');
    	    		$("#linksTallTopTR").append('<td class="topbarTallTD"><a id="applicantLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Description of recruitment and selection process.">APPLICANTS</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("headcount") &&  linksTable.get("headcount") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="headcountLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Employee headcount, new hires and terminations, and annual seat turnover rates.">EMPLOYEES</a></td>');
    	    		$("#linksTallTopTR").append('<td class="topbarTallTD"><a id="headcountLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom"  title="Employee headcount, new hires and terminations, and annual seat turnover rates.">EMPLOYEES</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("turnover") &&  linksTable.get("turnover") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="turnoverLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Turnover rates of new hires and current employees, and tenure distribution of employees.">TURNOVER</a></td>');
    	    		$("#linksTallTopTR").append('<td class="topbarTallTD"><a id="turnoverLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Turnover rates of new hires and current employees, and tenure distribution of employees.">TURNOVER</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("trim") &&  linksTable.get("trim") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="trimLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Turnover Reduction Impact Calculator (TRIm) estimates bottom-line financial impact due to reductions in turnover.">IMPACT</a></td>');
    	    		$("#linksTallTopTR").append('<td class="topbarTallTD"><a id="trimLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom"  title="Turnover Reduction Impact Calculator (TRIm) estimates bottom-line financial impact due to reductions in turnover.">IMPACT</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("drivers") &&  linksTable.get("drivers") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="driversLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Ranking variables by their influence in multiple turnover regression models and assessing potential impact of each turnover driver individually.">DRIVERS</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="driversLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Table of percentage influence of each variable in the model and the significant drivers in turnover rate">DRIVERS</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( linksTable.containsKey("employeeplayground") &&  linksTable.get("employeeplayground") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="employeePlaygroundLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Applicant characteristics and employee events that drive turnover rates.">MODELS</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="employeePlaygroundLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Applicant characteristics and employee events that drive turnover rates.">MODELS</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if ( (linksTable.containsKey("robustness") &&  linksTable.get("robustness") === true)
    	    			|| (linksTable.containsKey("employeerobustness") &&  linksTable.get("employeerobustness") === true) ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="robustnessLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Models are verified by looking at predicted and actual turnover rates.">VERIFICATION</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="robustnessLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom"  title="Models are verified by looking at predicted and actual turnover rates.">VERIFICATION</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	/* Moved to under robustness table
    	    	if ( linksTable.containsKey("reports") &&  linksTable.get("reports") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="reportLink" class="sheetlink" data-toggle="tooltip" title="Hiring and Turnover Rates by TalenTeck Candidate Score Quartiles">Report</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="reportLinkTall" class="sheetlinkTall" data-toggle="tooltip" title="Hiring and Turnover Rates by TalenTeck Candidate Score Quartiles">Report</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	*/
    	    	
    	    	if ( linksTable.containsKey("livereports") &&  linksTable.get("livereports") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="liveReportLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Selection and turnover rates for a panel of applicants, broken down by TalenTeck turnover risk score categories.">REPORTS</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="liveReportLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Selection and turnover rates for a panel of applicants, broken down by TalenTeck turnover risk score categories.">REPORTS</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	
    	    	if ( linksTable.containsKey("surveys") &&  linksTable.get("surveys") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="surveysLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Survey instruments to improve predictive power of TalenTeck turnover risk scores.">SURVEYS</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="surveysLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Survey instruments to improve predictive power of TalenTeck turnover risk scores.">SURVEYS</a></td>');
    	    		runningActiveLinks++;
    	    	}
    	    	if('${allUser}'=="true"){
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="backLink" class="sheetlink" data-toggle="tooltip" data-placement="bottom" title="Back">BACK</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="backLinkTall" class="sheetlinkTall" data-toggle="tooltip" data-placement="bottom" title="Back">BACK</a></td>');
    	    		runningActiveLinks++;	
    	    	}

				/* Moved to historical reports sheet
    	    	if ( linksTable.containsKey("interviewerquality") &&  linksTable.get("interviewerquality") === true  ) {
    	    		$("#linksTR").append('<td class="topbarWideTD"><a id="interviewerLink" class="sheetlink" data-toggle="tooltip" title="">Interviewers</a></td>');
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"><a id="interviewerLinkTall" class="sheetlinkTall" data-toggle="tooltip" title="">Interviewers</a></td>');
    	    		runningActiveLinks++;
    	    	}
				*/
				//this is bad practice! a wraps div
				//var logoffTD = '<td class="topbarWideTD" id="logoutTD"><a id="logoutLink" class="sheetlink" href="<c:url value="/j_spring_security_logout" />"><div id="logoutDiv">LOGOUT</div></a></td>'
				
				var logoffTD = '<td class="topbarWideTD" id="logoutTD">'+
									'<a id="logoutLink" class="sheetlink" href="<c:url value="/j_spring_security_logout" />">'+
									'<div id="logoutDiv">LOGOUT</div></a></td>';
										    		
				$("#linksTR").append(logoffTD);
				
				while ( runningActiveLinks < 8 ) {
					var usedTR = runningActiveLinks < 4 ? "#linksTallTopTR" : "#linksTallSecondTR";
    	    		$(usedTR).append('<td class="topbarTallTD"></td>');
    	    		runningActiveLinks++;
				}
	    		activateTopbarLinks();
	    		
	    		$('[data-toggle="tooltip"]').attr("data-placement","bottom");
	    		$('[data-toggle="tooltip"]').tooltip(); 
	    		
	    		if ('${applicantsUser}' == "true" && linksTable.containsKey("applicant") &&  linksTable.get("applicant") === true ) {
	    			$.ajax({type: "GET",url: "../resources/js/analytics/applicanttable.js",dataType: "script"});
	    			//$.ajax({type: "GET",url: "../resources/js/analytics/employeescoretable.js",dataType: "script"});			
	    		} else if ('${employeesUser}'=="true" && linksTable.containsKey("headcount") &&  linksTable.get("headcount") === true) {
	    			$.ajax({type: "GET",url: "../resources/js/analytics/headcounttable.js",dataType: "script"});			
	    		} else if('${turnoverUser}' == "true" && linksTable.containsKey("turnover") &&  linksTable.get("turnover") === true ){
	    			$.ajax({type: "GET",url: "../resources/js/analytics/turnovertable.js",dataType: "script"});						
	    		}
    		}
	    });
    });
    </script>   
</head>
<body>
<%request.getSession(true).setAttribute("client",request.getParameter("client")); %>
<div id="wrap" class="container">
	<div class="row" id="toplinerow">
		<div id="toplinebox" class="col-xs-12 col-md-12">
		</div>
	</div>		
	<div class="row" id="topbar">
		<div id="topbarWide" class="hidden-xs col-sm-12 col-md-12 col-lg-12 col-xl-12">	
			<table id="topbarTableWide" class="topbarTableWide">
			<tbody>			
				<tr id="linksTR">
					<td id="imageTDWide"><div id="imageDiv"><img id="ttlogo" src="../resources/img/analytics/TT-circlelarge.png"></div></td>
                    <td id="topbarBlankTD"></td>
                </tr>
            </tbody>
            </table>
		</div>
		<div id="topbarTall" class="hidden-sm hidden-md hidden-lg hidden-xl col-xs-12">
			<table id="topbarTableTall" class="topbarTableTall">
			<tbody>
				<tr>
					<td>${param.client}</td>				
					<td colspan="3"><div id="imageDivTall"><img id="ttlogo" src="../resources/img/analytics/TT-circlelarge.png"></div></td>
                    <td id="logoutTDTall"><a id="logoutLinkTall" class="sheetlink" href="<c:url value="/j_spring_security_logout" />">Log&nbsp;out</a></td>
                    
                </tr>
				<tr id="linksTallTopTR">
                </tr>
                <tr id="linksTallSecondTR">
                </tr>
            </tbody>
            </table>
		</div>
	</div>
	<div class="row" id="lowerlinerow">
		<div id="lowerlinebox" class="col-xs-12 col-md-12">
		</div>
	</div>		
	<div class="row" id="secondrow">
		<div id="leftbar-div" class="hidden-xs col-sm-3 col-md-3" >
		</div>
		<div id="leftbar-div-xs" class="hidden-sm hidden-md hidden-lg hidden-xl col-xs-12 widebar" >
		</div>
		<div id="display-area" class="col-sm-9 col-md-9 hidden-xs">
		</div>
	</div>
	<div class="row" id="thirdrow">
		<div id="display-area-xs" class="hidden-sm hidden-md hidden-lg hidden-xl col-xs-12">
		</div>
</div>
</div>
</body>
</html>