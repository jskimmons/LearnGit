package com.talenteck.ttanalytics;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.request.RequestContextHolder;


/**
 * Servlet implementation class ReturnQuery
 */
@WebServlet("/ReturnQuery")
public class ReturnQuery extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReturnQuery() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter responseWriter = response.getWriter();
		
		String client = (String)request.getSession(true).getAttribute("client");
		String database;
		String rawdatabase;

		if(client!=null)
		 database =new DatabaseReference().getDB(client);
		else
		 database = (String) RequestContextHolder.currentRequestAttributes().getAttribute("database", 1);	

		rawdatabase = new DatabaseReference().getRawDB(database);

	
		String clientUserID = (String) RequestContextHolder.currentRequestAttributes().getAttribute("email", 1);
		String selectorMultiListData;
		String selectorListData;
		String varyingSelector;
		ClientTRImTable returnClientTRImTable = null;		
		String selectorType = request.getParameter("type");

		if (selectorType == null ) {
			FilterList returnListFilter = new FilterList();
			returnListFilter.insertErrorAndWrite("Selector type must be specified.",responseWriter);
			return;
			
		}

		switch (selectorType) {
		case "applicantgraph":

			ApplicantGraph returnApplicantGraph = new ApplicantGraph();
			try {
				returnApplicantGraph.fetchData(database);
			} catch(Exception populateListException) {
				returnApplicantGraph.insertErrorAndWrite("Error fetching applicant data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnApplicantGraph.writeSuccess(responseWriter);
		break;
		
		case "applicantplayground":


			ApplicantPlaygroundTable returnApplicantPlaygroundTable = new ApplicantPlaygroundTable();
							
			try {
				returnApplicantPlaygroundTable.fetchData(database);
			} catch(Exception populateListException) {
				returnApplicantPlaygroundTable.insertErrorAndWrite("Error fetching playground data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnApplicantPlaygroundTable.writeSuccess(responseWriter);

			
			break;
			
		case "applicantplaygroundselectors":


			ApplicantPlaygroundSelectorList returnSelectors = new ApplicantPlaygroundSelectorList();
							
			try {
				returnSelectors.populate(database);
			} catch(Exception populateListException) {
				returnSelectors.insertErrorAndWrite("Error fetching playground data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnSelectors.writeSuccess(responseWriter);

			
			break;

		case "applicanttable":

			//String filterName = request.getParameter("filtername");
			//String rateName = request.getParameter("ratename");
			/*if (filterName == null ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("Filter name must be specified.",responseWriter);
				return;
				
			}
			if (rateName == null ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("You must specify which rate to use.",responseWriter);
				return;
				
			}
							if ( !("OfferRate").equals(rateName) && !("AcceptRate").equals(rateName) &&
					!("EmployRate").equals(rateName) && !("TotalApplicants").equals(rateName) ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("ratename must be OfferRate, AcceptRate, EmployRate, or TotalApplicants.",responseWriter);
				return;
				
			}
				
			ArrayList<String> filterNames = null;
			try {
				filterNames = FilterList.getNames(database);
			} catch(Exception resolveFiltersException) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("Error when populating filter names:" + resolveFiltersException.getMessage(),responseWriter);
				return;
			}

			Boolean isFilter = false;
			for (int i = 0 ; i < filterNames.size() && isFilter == false ; i++ ) {
				if ( filterNames.get(i).equals(filterName) ) {
					isFilter = true;
				}
			}

			if ( !isFilter ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("Invalid filter name given.",responseWriter);
				return;
				
			}

*/

			String periodLabel = request.getParameter("period");
			if (periodLabel == null ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("Period label must be specified.",responseWriter);
				return;
				
			}


			if ( !periodLabel.matches("\\d\\d\\d\\d\\-\\d\\d") && !("All").equals(periodLabel) ) {
				ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
				returnApplicantPeriod.insertErrorAndWrite("Period label is improperly formatted.",responseWriter);
				return;
				
			}

			
			ApplicantPeriod returnApplicantPeriod = new ApplicantPeriod();
			returnApplicantPeriod.setPeriodLabel(periodLabel);
							
			try {
				returnApplicantPeriod.fetchData(database);
			} catch(Exception populateListException) {
				returnApplicantPeriod.insertErrorAndWrite("Error fetching applicant data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnApplicantPeriod.writeSuccess(responseWriter);

		break;

		case "driversgraph":

			selectorListData = request.getParameter("selectorlist");


			if ( selectorListData == null ) {
				DriversTypePeriodSelection returnDriversTypePeriodSelection = new DriversTypePeriodSelection();
				returnDriversTypePeriodSelection.insertErrorAndWrite("Selector list must be specified.",responseWriter);
				return;
				
			}

			DriversTypePeriodSelection returnDriversTypePeriodSelection = new DriversTypePeriodSelection();
			try {
				returnDriversTypePeriodSelection.populateSelectorsFromJSON(selectorListData, database);
			} catch(Exception resolveFiltersException) {
				returnDriversTypePeriodSelection.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
				return;
			}
							
			try {
				returnDriversTypePeriodSelection.fetchData(database);
			} catch(Exception populateListException) {
				returnDriversTypePeriodSelection.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnDriversTypePeriodSelection.writeSuccess(responseWriter);
		break;

		case "driverstable":


			DriversTable returnDriversTable = new DriversTable();
							
			try {
				returnDriversTable.fetchData(database);
			} catch(Exception populateListException) {
				returnDriversTable.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnDriversTable.writeSuccess(responseWriter);
		break;	
		
		
		case "elmgraphselectors":

			ELMReportSelectorList returnELMGraphSelectorList = new ELMReportSelectorList();
							
			try {
				returnELMGraphSelectorList.populate(rawdatabase);
			} catch(Exception populateListException) {
				returnELMGraphSelectorList.insertErrorAndWrite("Error fetching ELMGraphSelectorList data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnELMGraphSelectorList.writeSuccess(responseWriter);
			
			break;
			
		case "elmgraph":
			ELMReportGraph returnELMGraph = new ELMReportGraph();
							
			try {
				returnELMGraph.fetchData(rawdatabase);
			} catch(Exception populateListException) {
				returnELMGraph.insertErrorAndWrite("Error fetching ELMGraph data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnELMGraph.writeSuccess(responseWriter);			
			break;
					
		case "employeeplayground":


			EmployeePlaygroundTable returnPlaygroundTable = new EmployeePlaygroundTable();
							
			try {
				returnPlaygroundTable.fetchData(database);
			} catch(Exception populateListException) {
				returnPlaygroundTable.insertErrorAndWrite("Error fetching playground data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnPlaygroundTable.writeSuccess(responseWriter);

			
			break;
			
		case "employeeplaygroundSelectors":


			EmployeePlaygroundSelectorList returnASelectors = new EmployeePlaygroundSelectorList();
							
			try {
				returnASelectors.populate(database);
			} catch(Exception populateListException) {
				returnASelectors.insertErrorAndWrite("Error fetching playground data:" + populateListException.getMessage(),responseWriter);
				return;

			}
			returnASelectors.writeSuccess(responseWriter);

			
			break;
//		case "employeerisk":
//			
//			EmployeeRiskTable returnRiskTable = new EmployeeRiskTable();
//			
//			try {
//				returnRiskTable.fetchData(database);
//			} catch(Exception populateListException) {
//				returnRiskTable.insertErrorAndWrite("Error fetching risk data:" + populateListException.getMessage(),responseWriter);
//				return;
//
//			}
//			returnRiskTable.writeSuccess(responseWriter);
//
//			
//			break;

		case "employeerobustnessgraph":

			selectorListData = request.getParameter("selectorlist");


			if ( selectorListData == null ) {
				EmployeeRobustnessGraph returnRobustnessGraph = new EmployeeRobustnessGraph();
				returnRobustnessGraph.insertErrorAndWrite("Selector list must be specified.",responseWriter);
				return;
				
			}

			EmployeeRobustnessGraph returnEmployeeRobustnessGraph = new EmployeeRobustnessGraph();
			try {
				returnEmployeeRobustnessGraph.populateSelectorsFromJSON(selectorListData, database);
			} catch(Exception resolveFiltersException) {
				returnEmployeeRobustnessGraph.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
				return;
			}
							
			try {
				returnEmployeeRobustnessGraph.fetchData(database);
			} catch(Exception populateListException) {
				returnEmployeeRobustnessGraph.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnEmployeeRobustnessGraph.writeSuccess(responseWriter);
		break;

		case "employeerobustnesstable":


			EmployeeRobustnessTable returnEmployeeRobustnessTable = new EmployeeRobustnessTable();
			try {
				returnEmployeeRobustnessTable.fetchData(database);
			} catch(Exception populateListException) {
				returnEmployeeRobustnessTable.insertErrorAndWrite("Error fetching employee robustness data:" + populateListException.getMessage(),responseWriter);
				return;

			}
				
			returnEmployeeRobustnessTable.writeSuccess(responseWriter);
		break;

			case "getfilters": 
				FilterList returnListFilter = new FilterList();

				try {
					returnListFilter.populate(database);
				} catch(Exception populateListException) {
					returnListFilter.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
				
				returnListFilter.writeSuccess(responseWriter);

			break;
			case "getperiodlistapplicant":
		
				PeriodListApplicant returnListApplicant = new PeriodListApplicant();

				try {
					returnListApplicant.populate(database);
				} catch(Exception populateListException) {
					returnListApplicant.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
				
				returnListApplicant.writeSuccess(responseWriter);

			break;
			case "getperiodlistheadcount":
			
				PeriodListHeadcount returnListHeadcount = new PeriodListHeadcount();

				try {
					returnListHeadcount.populate(database);
				} catch(Exception populateListException) {
					returnListHeadcount.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnListHeadcount.writeSuccess(responseWriter);
			break;
			case "getperiodlistmarkets":
				
				PeriodListMarkets returnListMarkets = new PeriodListMarkets();

				try {
					returnListMarkets.populate(database);
				} catch(Exception populateListException) {
					returnListMarkets.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
				
				returnListMarkets.writeSuccess(responseWriter);

			break;
			case "getperiodlistseparation":
				
				PeriodListSeparation returnListSeparation = new PeriodListSeparation();

				try {
					returnListSeparation.populate(database);
				} catch(Exception populateListException) {
					returnListSeparation.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnListSeparation.writeSuccess(responseWriter);
			break;
			case "getperiodlistseparationbytenure":
				
				PeriodListSeparationByTenure returnListSeparationByTenure = new PeriodListSeparationByTenure();

				try {
					returnListSeparationByTenure.populate(database);
				} catch(Exception populateListException) {
					returnListSeparationByTenure.insertErrorAndWrite("Error populating period list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnListSeparationByTenure.writeSuccess(responseWriter);
			break;
			case "getperiodlisttenure":
				
				PeriodListTenure returnListTenure = new PeriodListTenure();

				try {
					returnListTenure.populate(database);
				} catch(Exception populateListException) {
					returnListTenure.insertErrorAndWrite("Error populating period list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnListTenure.writeSuccess(responseWriter);
			break;
			case "getpublishedstatuses":
				
				PublishedSheetsList returnSheetsList = new PublishedSheetsList();

				try {
					returnSheetsList.fetchData(database);
				} catch(Exception populateListException) {
					returnSheetsList.insertErrorAndWrite("Error populating sheets list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnSheetsList.writeSuccess(responseWriter);
			break;
			
			
			case "getselectorsapplicant":
				
				ApplicantSelectorList applicantSelectorList = new ApplicantSelectorList();

				try {
					applicantSelectorList.populate(database);
				} catch(Exception populateListException) {
					applicantSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				applicantSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsdriver":
				
				DriverSelectorList driverSelectorList = new DriverSelectorList();

				try {
					driverSelectorList.populate(database);
				} catch(Exception populateListException) {
					driverSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				driverSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsemployeerobustness":
				
				EmployeeRobustnessSelectorList employeeRobustnessSelectorList = new EmployeeRobustnessSelectorList();

				try {
					employeeRobustnessSelectorList.populate(database);
				} catch(Exception populateListException) {
					employeeRobustnessSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				employeeRobustnessSelectorList.writeSuccess(responseWriter);
			break;

			case "getselectorsinterviewerquality":
				
				InterviewerQualitySelectorList interviewerQualitySelectorList = new InterviewerQualitySelectorList();

				try {
					interviewerQualitySelectorList.populate(database);
				} catch(Exception populateListException) {
					interviewerQualitySelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				interviewerQualitySelectorList.writeSuccess(responseWriter);
			break;

			case "getselectorsinterviewerqualitygraph":
				
				InterviewerQualityGraphSelectorList interviewerQualityGraphSelectorList = new InterviewerQualityGraphSelectorList();

				try {
					interviewerQualityGraphSelectorList.populate(database);
				} catch(Exception populateListException) {
					interviewerQualityGraphSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				interviewerQualityGraphSelectorList.writeSuccess(responseWriter);
			break;


			
			case "getselectorsheadcount":
				
				HeadcountSelectorList headcountSelectorList = new HeadcountSelectorList();

				try {
					headcountSelectorList.populate(database);
				} catch(Exception populateListException) {
					headcountSelectorList.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				headcountSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsmarkets":
				//System.out.println("success");

				MarketsSelectorList marketsSelectorList = new MarketsSelectorList();

				try {
					marketsSelectorList.populate(database);
				} catch(Exception populateListException) {
					marketsSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				marketsSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsreports":
				
				ReportsSelectorList reportsSelectorList = new ReportsSelectorList();

				try {
					reportsSelectorList.populate(database);
				} catch(Exception populateListException) {
					reportsSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				reportsSelectorList.writeSuccess(responseWriter);
			break;
			
			
			case "getselectorsrobustness":
				
				RobustnessSelectorList robustnessSelectorList = new RobustnessSelectorList();

				try {
					robustnessSelectorList.populate(database);
				} catch(Exception populateListException) {
					robustnessSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				robustnessSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsseparation":
				
				SeparationSelectorList separationSelectorList = new SeparationSelectorList();

				try {
					separationSelectorList.populate(database);
				} catch(Exception populateListException) {
					separationSelectorList.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				separationSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorsseparationbytenure":
				
				SeparationByTenureSelectorList separationByTenureSelectorList = new SeparationByTenureSelectorList();

				try {
					separationByTenureSelectorList.populate(database);
				} catch(Exception populateListException) {
					separationByTenureSelectorList.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				separationByTenureSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorstenure":
				
				TenureSelectorList tenureSelectorList = new TenureSelectorList();

				try {
					tenureSelectorList.populate(database);
				} catch(Exception populateListException) {
					tenureSelectorList.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				tenureSelectorList.writeSuccess(responseWriter);
			break;
			case "getselectorstrim":
				
				TRImSelector trimSelector = new TRImSelector();

				try {
					trimSelector.fetchData(database);
				} catch(Exception populateListException) {
					trimSelector.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				trimSelector.writeSuccess(responseWriter);
				
			break;
			case "getselectorvaluesdriver":
				
				DriversSelectorValues driversSelectorValues = new DriversSelectorValues();

				try {
					driversSelectorValues.fetchData(database);
				} catch(Exception populateListException) {
					driversSelectorValues.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				driversSelectorValues.writeSuccess(responseWriter);
			break;
			case "getselectorvaluesemployeerobustness":
				
				EmployeeRobustnessSelectorValues employeeRobustnessSelectorValues = new EmployeeRobustnessSelectorValues();

				try {
					employeeRobustnessSelectorValues.fetchData(database);
				} catch(Exception populateListException) {
					employeeRobustnessSelectorValues.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				employeeRobustnessSelectorValues.writeSuccess(responseWriter);
			break;

			case "getselectorvaluesinterviewerquality":
				
				InterviewerQualitySelectorValues interviewerQualitySelectorValues = new InterviewerQualitySelectorValues();

				try {
					interviewerQualitySelectorValues.fetchData(database);
				} catch(Exception populateListException) {
					interviewerQualitySelectorValues.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				interviewerQualitySelectorValues.writeSuccess(responseWriter);
			break;



			case "getselectorvaluesrobustness":
				
				RobustnessSelectorValues robustnessSelectorValues = new RobustnessSelectorValues();

				try {
					robustnessSelectorValues.fetchData(database);
				} catch(Exception populateListException) {
					robustnessSelectorValues.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				robustnessSelectorValues.writeSuccess(responseWriter);
			break;

			case "gettrimschemelabels":

				TRImReductionSchemeLabels schemeLabels = new TRImReductionSchemeLabels();

				try {
					schemeLabels.fetchData(database);
				} catch(Exception populateListException) {
					schemeLabels.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				schemeLabels.writeSuccess(responseWriter);
				
			break;

			case "headcount":

				selectorListData = request.getParameter("selectorlist");


				if ( selectorListData == null ) {
					HeadcountSelection returnHeadcountSelection = new HeadcountSelection();
					returnHeadcountSelection.insertErrorAndWrite("Selector list must be specified.",responseWriter);
					return;
					
				}

				HeadcountSelection returnSelection = new HeadcountSelection();
				try {
					returnSelection.populateSelectorsFromJSON(selectorListData, database);
				} catch(Exception resolveFiltersException) {
					HeadcountSelection returnHeadcountSelection = new HeadcountSelection();
					returnHeadcountSelection.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
								
				try {
					returnSelection.fetchData(database);
				} catch(Exception populateListException) {
					returnSelection.insertErrorAndWrite("Error fetching headcount data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnSelection.writeSuccess(responseWriter);
			break;
			case "headcountgraph":


				HeadcountGraph returnGraph = new HeadcountGraph();
				try {
					returnGraph.fetchData(database);
				} catch(Exception populateListException) {
					returnGraph.insertErrorAndWrite("Error fetching headcount data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnGraph.writeSuccess(responseWriter);
			break;
			case "headcounttable":


				HeadcountTable returnTable = new HeadcountTable();
				try {
					returnTable.fetchData(database);
				} catch(Exception populateListException) {
					returnTable.insertErrorAndWrite("Error fetching headcount data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnTable.writeSuccess(responseWriter);
			break;

			case "interviewerqualitygraph":


				InterviewerQualityGraph returnInterviewerQualityGraph = new InterviewerQualityGraph();
				try {
					returnInterviewerQualityGraph.fetchData(database);
				} catch(Exception populateListException) {
					returnInterviewerQualityGraph.insertErrorAndWrite("Error fetching interviewer quality data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnInterviewerQualityGraph.writeSuccess(responseWriter);
			break;



			
			case "interviewerqualitytable":


				InterviewerQualityTable returnInterviewerQualityTable = new InterviewerQualityTable();
				try {
					returnInterviewerQualityTable.fetchData(database);
				} catch(Exception populateListException) {
					returnInterviewerQualityTable.insertErrorAndWrite("Error fetching interviewer quality data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnInterviewerQualityTable.writeSuccess(responseWriter);
			break;

			case "marketsgraph":
				MarketsGraph returnMarketsGraph = new MarketsGraph();
				try {
					returnMarketsGraph.fetchData(database);
				} catch(Exception populateListException) {
					returnMarketsGraph.insertErrorAndWrite("Error fetching marketstable data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnMarketsGraph.writeSuccess(responseWriter);
			break;

			case "marketstable":
				MarketsTable returnMarketsTable = new MarketsTable();
				try {
					returnMarketsTable.fetchData(database);
				} catch(Exception populateListException) {
					returnMarketsTable.insertErrorAndWrite("Error fetching maketstable data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnMarketsTable.writeSuccess(responseWriter);
			break;



			
			case "robustnessgraph":

				selectorListData = request.getParameter("selectorlist");


				if ( selectorListData == null ) {
					RobustnessGraph returnRobustnessGraph = new RobustnessGraph();
					returnRobustnessGraph.insertErrorAndWrite("Selector list must be specified.",responseWriter);
					return;
					
				}

				RobustnessGraph returnRobustnessGraph = new RobustnessGraph();
				try {
					returnRobustnessGraph.populateSelectorsFromJSON(selectorListData, database);
				} catch(Exception resolveFiltersException) {
					returnRobustnessGraph.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
								
				try {
					returnRobustnessGraph.fetchData(database);
				} catch(Exception populateListException) {
					returnRobustnessGraph.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnRobustnessGraph.writeSuccess(responseWriter);
			break;


			case "reportstable":
				ReportsTable returnReportsTable = new ReportsTable();
				try {
					returnReportsTable.fetchData(database);
				} catch(Exception populateListException) {
					returnReportsTable.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnReportsTable.writeSuccess(responseWriter);
			break;

			case "livereporttable":

				selectorListData = request.getParameter("selectorlist");

				LiveReportTable returnLiveReportsTable = new LiveReportTable();

				try {
					returnLiveReportsTable.populateSelectorsFromJSON(selectorListData, rawdatabase);
				} catch(Exception resolveFiltersException) {
					returnLiveReportsTable.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
				
				
				try {
					returnLiveReportsTable.fetchData(rawdatabase);
				} catch(Exception populateListException) {
					returnLiveReportsTable.insertErrorAndWrite("Error fetching livereports data:" + populateListException.getMessage(),responseWriter);
					return;
				}
					
				returnLiveReportsTable.writeSuccess(responseWriter);
			break;
			
			
			case "getliveselectorsreports":
				
				LiveReportSelectorList liveReportsSelectorList = new LiveReportSelectorList();

				try {
					liveReportsSelectorList.populate(rawdatabase);
				} catch(Exception populateListException) {
					liveReportsSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				liveReportsSelectorList.writeSuccess(responseWriter);
			break;
			
			
			case "employeeriskreporttable":

				selectorListData = request.getParameter("selectorlist");

				EmployeeRiskReportTable returnEmployeeRiskReportTable = new EmployeeRiskReportTable();

				try {
					//System.out.println("returnEmployeeRiskReportTable" + rawdatabase);
					returnEmployeeRiskReportTable.populateSelectorsFromJSON(selectorListData, rawdatabase);
				} catch(Exception resolveFiltersException) {
					returnEmployeeRiskReportTable.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
				
				
				try {
					returnEmployeeRiskReportTable.fetchData(rawdatabase);
				} catch(Exception populateListException) {
					returnEmployeeRiskReportTable.insertErrorAndWrite("Error fetching livereports data:" + populateListException.getMessage(),responseWriter);
					return;
				}
					
				returnEmployeeRiskReportTable.writeSuccess(responseWriter);
			break;
			
			
			case "getemployeeriskselectors":
				
				EmployeeRiskReportSelectorList employeeRiskReportSelectorList = new EmployeeRiskReportSelectorList();

				try {
					employeeRiskReportSelectorList.populate(rawdatabase);
				} catch(Exception populateListException) {
					employeeRiskReportSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				employeeRiskReportSelectorList.writeSuccess(responseWriter);
			break;
			
			
			case "employeescoretable":

				selectorListData = request.getParameter("selectorlist");

				EmployeeScoreTable returnEmployeeScoreTable = new EmployeeScoreTable();

				try {
					returnEmployeeScoreTable.populateSelectorsFromJSON(selectorListData, rawdatabase);
				} catch(Exception resolveFiltersException) {
					returnEmployeeScoreTable.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
				
				
				try {
					returnEmployeeScoreTable.fetchData(rawdatabase);
				} catch(Exception populateListException) {
					returnEmployeeScoreTable.insertErrorAndWrite("Error fetching livereports data:" + populateListException.getMessage(),responseWriter);
					return;
				}
					
				returnEmployeeScoreTable.writeSuccess(responseWriter);
			break;
			
			case "getemployeescoreselectors":
				
				EmployeeScoreSelectorList employeeScoreSelectorList = new EmployeeScoreSelectorList();

				try {
					employeeScoreSelectorList.populate(rawdatabase);
				} catch(Exception populateListException) {
					employeeScoreSelectorList.insertErrorAndWrite("Error populating selector list:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				employeeScoreSelectorList.writeSuccess(responseWriter);
			break;
			
			
			case "robustnesstable":


				RobustnessTable returnRobustnessTable = new RobustnessTable();
				try {
					returnRobustnessTable.fetchData(database);
				} catch(Exception populateListException) {
					returnRobustnessTable.insertErrorAndWrite("Error fetching driver data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnRobustnessTable.writeSuccess(responseWriter);
			break;


			
			case "separationgraph":

				SeparationTable returnSeparationTable = new SeparationTable();
				try {
					returnSeparationTable.fetchData(database);
				} catch(Exception populateListException) {
					returnSeparationTable.insertErrorAndWrite("Error fetching separation data:" + populateListException.getMessage(),responseWriter);
					return;
					
				}
									
				returnSeparationTable.writeSuccess(responseWriter);
			break;
			case "separationtable":

				String periodLabelSeparation = request.getParameter("period");
				if (periodLabelSeparation == null ) {
					SeparationPeriod returnSeparationPeriod = new SeparationPeriod();
					returnSeparationPeriod.insertErrorAndWrite("Period label must be specified.",responseWriter);
					return;
					
				}

				if ( !("All").equals(periodLabelSeparation) && !periodLabelSeparation.matches("\\d\\d\\d\\d\\-\\d\\d") ) {
					SeparationPeriod returnSeparationPeriod = new SeparationPeriod();
					returnSeparationPeriod.insertErrorAndWrite("Period label is improperly formatted.",responseWriter);
					return;
					
				}

				
				SeparationPeriod returnSeparationPeriod = new SeparationPeriod();
				returnSeparationPeriod.setPeriodName(periodLabelSeparation);
								
				try {
					returnSeparationPeriod.fetchData(database);
				} catch(Exception populateListException) {
					returnSeparationPeriod.insertErrorAndWrite("Error fetching separation data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnSeparationPeriod.writeSuccess(responseWriter);

			break;
			case "separationbytenuretable":

				String periodLabelSeparationByTenure = request.getParameter("period");
				if (periodLabelSeparationByTenure == null ) {
					SeparationByTenurePeriod returnSeparationByTenurePeriod = new SeparationByTenurePeriod();
					returnSeparationByTenurePeriod.insertErrorAndWrite("Period label must be specified.",responseWriter);
					return;
					
				}

				
				//Note that because this is a snapshot, there is no "All" period
				if ( !periodLabelSeparationByTenure.matches("\\d\\d\\d\\d\\-\\d\\d") ) {
					SeparationByTenurePeriod returnSeparationByTenurePeriod = new SeparationByTenurePeriod();
					returnSeparationByTenurePeriod.insertErrorAndWrite("Period label is improperly formatted.",responseWriter);
					return;
					
				}

				
				SeparationByTenurePeriod returnSeparationByTenurePeriod = new SeparationByTenurePeriod();
				returnSeparationByTenurePeriod.setPeriodName(periodLabelSeparationByTenure);
				
				try {
					returnSeparationByTenurePeriod.fetchData(database);
				} catch(Exception populateListException) {
					returnSeparationByTenurePeriod.insertErrorAndWrite("Error fetching separation by tenure data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnSeparationByTenurePeriod.writeSuccess(responseWriter);

			break;
			case "separationbytenuregraph":

				
				SeparationByTenureTable returnSeparationByTenureTable = new SeparationByTenureTable();								
				try {
					returnSeparationByTenureTable.fetchData(database);
				} catch(Exception populateListException) {
					returnSeparationByTenureTable.insertErrorAndWrite("Error fetching separation by tenure data:" + populateListException.getMessage(),responseWriter);
					return;
					
				}				
				returnSeparationByTenureTable.writeSuccess(responseWriter);
			break;

			case "surveytable":

				SurveyTable returnSurveyTable = new SurveyTable();
				try {
					returnSurveyTable.fetchData(database);
				} catch(Exception populateListException) {
					returnSurveyTable.insertErrorAndWrite("Error fetching separation data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnSurveyTable.writeSuccess(responseWriter);

			break;

			case "tenuregraph":

				TenureTable returnTenureTable = new TenureTable();
				try {
					returnTenureTable.fetchData(database);
				} catch(Exception populateListException) {
					returnTenureTable.insertErrorAndWrite("Error fetching tenure data:" + populateListException.getMessage(),responseWriter);
					return;
					
				}
				returnTenureTable.writeSuccess(responseWriter);
			break;

			case "tenuretable":

				String periodLabelTenure = request.getParameter("period");
				if (periodLabelTenure == null ) {
					TenurePeriod returnTenurePeriod = new TenurePeriod();
					returnTenurePeriod.insertErrorAndWrite("Period label must be specified.",responseWriter);
					return;
					
				}

				//Note that because this is a snapshot, there is no "All" period
				if ( !periodLabelTenure.matches("\\d\\d\\d\\d\\-\\d\\d") ) {
					TenurePeriod returnTenurePeriod = new TenurePeriod();
					returnTenurePeriod.insertErrorAndWrite("Period label is improperly formatted.",responseWriter);
					return;
					
				}

				
				TenurePeriod returnTenurePeriod = new TenurePeriod();
				returnTenurePeriod.setPeriodName(periodLabelTenure);
								
				try {
					returnTenurePeriod.fetchData(database);
				} catch(Exception populateListException) {
					returnTenurePeriod.insertErrorAndWrite("Error fetching tenure data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnTenurePeriod.writeSuccess(responseWriter);

			break;
			case "trimgraph":

				/*String filterValue = request.getParameter("filtervalue");


				if ( filterValue == null ) {
					TRImGraph returnTRImGraph = new TRImGraph();
					returnTRImGraph.insertErrorAndWrite("Filter value must be specified.",responseWriter);
					return;
					
				
				}*/

				TRImGraph returnTRImGraph = new TRImGraph();
								
				try {
					returnTRImGraph.fetchData(database);
				} catch(Exception populateListException) {
					returnTRImGraph.insertErrorAndWrite("Error fetching TRIm data:" + populateListException.getMessage(),responseWriter);
					return;

				}
					
				returnTRImGraph.writeSuccess(responseWriter);
			break;

			case "trimtable":


				String schemeLabel = request.getParameter("schemelabel");
				ClientTRImTable returnTRImTable = new ClientTRImTable();
				
				if ( schemeLabel != null ) {
					boolean labelMatches = false;
					TRImReductionSchemeLabels labelList = new TRImReductionSchemeLabels();
					try {
						labelList.fetchData(database);
					} catch(Exception fetchSchemeLabelsException) {
						returnTRImTable.insertErrorAndWrite("Error fetching valid scheme labels:" + 
								fetchSchemeLabelsException.getMessage(), responseWriter);
						return;
					}
					for (int thisLabelNo = 0 ; thisLabelNo < labelList.schemeNames.size() ; thisLabelNo++ ) {
						if ( labelList.schemeNames.get(thisLabelNo) != null &&
								labelList.schemeNames.get(thisLabelNo).equals(schemeLabel)) {
							labelMatches = true;
						}
					}
					if (labelMatches == false ) {
						returnTRImTable.insertErrorAndWrite("Invalid scheme name " + schemeLabel, responseWriter);
						return;
					}
					returnTRImTable.schemeLabel = schemeLabel;
				}
				try {
					returnTRImTable.fetchData(database);
				} catch(Exception populateTRImException) {
					returnTRImTable.insertErrorAndWrite("Error fetching TRIm data:" + populateTRImException.getMessage(),responseWriter);
					return;

				}
					
				returnTRImTable.writeSuccess(responseWriter);
			break;
			/* This has been supplanted with location-specific productivity but could be resurrected....
			case "trimupdateproductivity":

				String productivityValues = request.getParameter("productivityvalues");

				if ( productivityValues == null ) {
					Enumeration<String> parameterNames = request.getParameterNames();
					String parameterList = "";
					while (parameterNames.hasMoreElements()) {
						parameterList = parameterList + "," + parameterNames.nextElement();
					}
					returnClientTRImTable = new ClientTRImTable();
					returnClientTRImTable.insertErrorAndWrite("Productivity values must be specified.  Request: " + parameterList ,responseWriter);
					return;
					
				}

				returnClientTRImTable = new ClientTRImTable();
				try {
					returnClientTRImTable.populateProductivityValues(productivityValues);
				} catch(Exception resolveFiltersException) {
					returnClientTRImTable.insertErrorAndWrite("Error when populating selector list:" + resolveFiltersException.getMessage(),responseWriter);
					return;
				}
				
				boolean updateProductivityResult = false;
				try {
					updateProductivityResult = returnClientTRImTable.updateProductivity(database,clientUserID);
				} catch(Exception populateListException) {
					returnClientTRImTable.insertErrorAndWrite("Error updating table:" + populateListException.getMessage(),responseWriter);
					return;

				}
				
				if ( updateProductivityResult ) {
					returnClientTRImTable.insertErrorAndWrite("Productivity values successfully updated.",responseWriter);
				}
				else {
					returnClientTRImTable.insertErrorAndWrite("Query was properly formed, but no productivity values were changed in the table.",responseWriter);
				}
			break;*/
			case "trimupdatetable":
				String newTRImValues = request.getParameter("newtrimvalues");
				String schemeLabel1 = request.getParameter("schemelabel");

				if ( newTRImValues == null ) {
					Enumeration<String> parameterNames = request.getParameterNames();
					String parameterList = "";
					while (parameterNames.hasMoreElements()) {
						parameterList = parameterList + "," + parameterNames.nextElement();
					}
					returnClientTRImTable = new ClientTRImTable();
					returnClientTRImTable.insertErrorAndWrite("Productivity values must be specified.  Request: " + parameterList ,responseWriter);
					return;
					
				}

				returnClientTRImTable = new ClientTRImTable();
				boolean updateTRImResult = false;
				try {
					returnClientTRImTable.schemeLabel = schemeLabel1;
					returnClientTRImTable.updateTable(database,clientUserID,newTRImValues);
				} catch(Exception populateListException) {
					returnClientTRImTable.insertErrorAndWrite("Error updating table:" + populateListException.getMessage(),responseWriter);
					return;

				}
				
				if ( updateTRImResult ) {
					returnClientTRImTable.insertErrorAndWrite("Productivity values successfully updated.",responseWriter);
				}
				else {
					returnClientTRImTable.insertErrorAndWrite("Query was properly formed, but no productivity values were changed in the table.",responseWriter);
				}
			break;

			

			default:
				FilterList returnListError = new FilterList();
				returnListError.insertErrorAndWrite("Invalid request parameter.  Valid types are: filters, periodlistapplicant, periodlistheadcount, periodlistseparation, periodlistseparationbytenure, periodlisttenure. ",responseWriter);
				return;
				

		
		}


	}

}
