package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;

public class TenureSelection {

	String periodName;
	ArrayList<FilterSelection> filterSelectionList;
	TenurePeriodSelection graph;
	Messages messages;

	public void setPeriodName(String name) {
		this.periodName = name;
	}
	
	String getPeriodName(){
		return this.periodName;
	}
		
	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}

	public ArrayList<FilterSelection> getFilterSelectionList() {
		return this.filterSelectionList;
	}

	public void setGraph(TenurePeriodSelection graph) {
		this.graph = graph;
	}

	public TenurePeriodSelection getGraph() {
		return this.graph;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}


	public void addFilterSelection(FilterSelection selection) {
		if (this.filterSelectionList == null ) {
			this.filterSelectionList = new ArrayList<FilterSelection>();
		}
		this.filterSelectionList.add(selection);
	}
	
	
	public void fetchData(String database , String varyingFilter ) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		StructuredDataParameters dataParameters = null;
		int firstQueriedMonthNo;
		String queryDateString = "";
		String lastHireDateT30 = "";
		String lastHireDateT60 = "";
		String lastHireDateT90 = "";
		String lastHireDateT180 = "";
		String lastHireDateT365 = "";
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		if (this.filterSelectionList == null) {
			throw new Exception("Filter selection list is empty.");
		}
		if ( this.periodName == null ) {
			throw new Exception("Period name must be specified.");			
		}

		try {
			dataParameters = new StructuredDataParameters(database);
			
		}catch(Exception parametersException) {
			throw new Exception("Error getting structured data parameters:" + parametersException.getMessage());
		}

		
		try {


			// Remember for the final month, we are querying about the first of the following month
			firstQueriedMonthNo = 12*Integer.parseInt(this.periodName.substring(0,4)) + Integer.parseInt(this.periodName.substring(5,7)) - 1; 
			// Unused, this is a snapshot: lastQueriedMonthNo = 12*Integer.parseInt(this.periodName.substring(0,4)) + Integer.parseInt(this.periodName.substring(5,7)); 
				
			/* if (firstQueriedMonthNo > lastQueriedMonthNo ) {
				throw new Exception();
			}*/
		} catch(Exception unusedException) {
			throw new Exception("Improperly formatted period label.");			
		}

		if (( firstQueriedMonthNo < 12*dataParameters.firstYear + dataParameters.firstMonth - 1) ||
				( firstQueriedMonthNo >= 12*dataParameters.lastYear + dataParameters.lastMonth )) {
			throw new Exception("Requested time period out of range.");
		}

		try {
		String[] months = { "ZeroMonth" , "January" , "February" , "March" , "April" ,
				"May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"
};

		if ( this.graph == null ) {
			this.graph = new TenurePeriodSelection();
		}
		
		if ( varyingFilter != null &&  ("period").equals(varyingFilter) ) {
			this.graph.setFilterValue(months[firstQueriedMonthNo - 12*(int)(firstQueriedMonthNo/12) + 1] + " 1, " + (int)(firstQueriedMonthNo/12));			
		}

		//Assumedly these filter values have already been tested as legitimate so we don't need to escape
		
		queryDateString = (int)(firstQueriedMonthNo/12) + "-" +
				(firstQueriedMonthNo - 12*(int)(firstQueriedMonthNo/12) + 1) + 
				"-01"; 
		} catch(Exception dateException) { throw new Exception("Date parsing issue: " + dateException.getMessage()); }
		try {
			Calendar comparisonCalendar = new GregorianCalendar();
			comparisonCalendar.set(Calendar.YEAR, (int)(firstQueriedMonthNo/12));
			comparisonCalendar.set(Calendar.MONTH, firstQueriedMonthNo - 12*(int)(firstQueriedMonthNo/12)); // 11 = december
		comparisonCalendar.set(Calendar.DAY_OF_MONTH, 1);
		
		// Here, we are calculating tenure distribution as of midnight on the first of the month.
		// So people hired yesterday will have zero days of tenure, and people hired 31 days ago
		// will have 30 days of tenure.
			comparisonCalendar.add(Calendar.DAY_OF_MONTH, -31);
			lastHireDateT30 = comparisonCalendar.get(Calendar.YEAR) + "-" + (comparisonCalendar.get(Calendar.MONTH)+1) + "-" + comparisonCalendar.get(Calendar.DAY_OF_MONTH);   
			comparisonCalendar.add(Calendar.DAY_OF_MONTH, -30);
			lastHireDateT60 = comparisonCalendar.get(Calendar.YEAR) + "-" + (comparisonCalendar.get(Calendar.MONTH)+1) + "-" + comparisonCalendar.get(Calendar.DAY_OF_MONTH);   
			comparisonCalendar.add(Calendar.DAY_OF_MONTH, -30);
			lastHireDateT90 = comparisonCalendar.get(Calendar.YEAR) + "-" + (comparisonCalendar.get(Calendar.MONTH)+1) + "-" + comparisonCalendar.get(Calendar.DAY_OF_MONTH);   
			comparisonCalendar.add(Calendar.DAY_OF_MONTH, -90);
			lastHireDateT180 = comparisonCalendar.get(Calendar.YEAR) + "-" + (comparisonCalendar.get(Calendar.MONTH)+1) + "-" + comparisonCalendar.get(Calendar.DAY_OF_MONTH);   
			comparisonCalendar.add(Calendar.DAY_OF_MONTH, -185);
			lastHireDateT365 = comparisonCalendar.get(Calendar.YEAR) + "-" + (comparisonCalendar.get(Calendar.MONTH)+1) + "-" + comparisonCalendar.get(Calendar.DAY_OF_MONTH);   
		} catch(Exception calendarException) {throw new Exception("Calendar issue: " + calendarException.getMessage());}
		
		//Assumedly these filter values have already been tested as legitimate so we don't need to escape

		String whereStatement = "";
		for (int i = 0 ; i < this.filterSelectionList.size(); i++ ) {
			if ( !("All").equals((filterSelectionList.get(i)).filterValue) ) {
				if (("").equals(whereStatement)) {
					whereStatement = "WHERE " + (filterSelectionList.get(i)).filterName + " = '" + (filterSelectionList.get(i)).filterValue + "'"; 
				}
				else {
					whereStatement = whereStatement + " AND "  + (filterSelectionList.get(i)).filterName + " = '" + (filterSelectionList.get(i)).filterValue + "'";
				}
			}
		}
		
		if ( ("").equals(whereStatement)) {
			whereStatement = " WHERE ";
		}
		else {
			whereStatement = whereStatement + " AND ";
		}
				
		try {

			// The newInstance() call is a work around for some
			// broken Java implementations

			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception openException) {
			Exception driverInitException = new Exception("Failed to open SQL driver instance:" + openException.getMessage());
			throw driverInitException;
		}

		try {

			con = DriverManager.getConnection(url, user, password);

		} catch (Exception connectException) {
			Exception driverInitException = new Exception("Failed to connect to database:" + connectException.getMessage());
			throw driverInitException;
		}
		// First query employment on the beginning of the first month

		String queryString = "";
		try {
			queryString = "SELECT SUM(IF(terminationdate IS NOT NULL, hiredate < \'" + queryDateString + "\' AND hiredate >= \'" + lastHireDateT30 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + queryDateString + "\' AND hiredate >= \'" + lastHireDateT30 + "\')) as c0to30 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT30 + "\' AND hiredate >= \'" + lastHireDateT60 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT30 + "\' AND hiredate >= \'" + lastHireDateT60 + "\')) as c31to60 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT60 + "\' AND hiredate >= \'" + lastHireDateT90 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT60 + "\' AND hiredate >= \'" + lastHireDateT90 + "\')) as c61to90 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT90 + "\' AND hiredate >= \'" + lastHireDateT180 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT90 + "\' AND hiredate >= \'" + lastHireDateT180 + "\')) as c91to180 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT180 + "\' AND hiredate >= \'" + lastHireDateT365 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT180 + "\' AND hiredate >= \'" + lastHireDateT365 + "\')) as c181to365 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT365 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT365 + "\')) as c366p , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + queryDateString + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + queryDateString + "\')) as cfull from structureddataset " + whereStatement + " hiredate IS NOT NULL;";
			st = con.prepareStatement("SELECT SUM(IF(terminationdate IS NOT NULL, hiredate < \'" + queryDateString + "\' AND hiredate >= \'" + lastHireDateT30 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + queryDateString + "\' AND hiredate >= \'" + lastHireDateT30 + "\')) as c0to30 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT30 + "\' AND hiredate >= \'" + lastHireDateT60 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT30 + "\' AND hiredate >= \'" + lastHireDateT60 + "\')) as c31to60 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT60 + "\' AND hiredate >= \'" + lastHireDateT90 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT60 + "\' AND hiredate >= \'" + lastHireDateT90 + "\')) as c61to90 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT90 + "\' AND hiredate >= \'" + lastHireDateT180 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT90 + "\' AND hiredate >= \'" + lastHireDateT180 + "\')) as c91to180 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT180 + "\' AND hiredate >= \'" + lastHireDateT365 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT180 + "\' AND hiredate >= \'" + lastHireDateT365 + "\')) as c181to365 , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + lastHireDateT365 + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + lastHireDateT365 + "\')) as c366p , SUM(IF(terminationdate IS NOT NULL,hiredate < \'" + queryDateString + "\' AND terminationdate >= \'" + queryDateString +"\',hiredate < \'" + queryDateString + "\')) as cfull from structureddataset " + whereStatement + " hiredate IS NOT NULL;");
			rs = st.executeQuery();

			if (rs.next() ) {

				if (rs.getInt(7) != 0 ) {
					this.graph.setT0To30((float)(rs.getFloat(1)/rs.getFloat(7)));
					this.graph.setT31To60((float)(rs.getFloat(2)/rs.getFloat(7)));
					this.graph.setT61To90((float)(rs.getFloat(3)/rs.getFloat(7)));
					this.graph.setT91To180((float)(rs.getFloat(4)/rs.getFloat(7)));
					this.graph.setT181To365((float)(rs.getFloat(5)/rs.getFloat(7)));
					this.graph.setT366Plus((float)(rs.getFloat(6)/rs.getFloat(7)));
					}
				else {
					this.graph.setT0To30(-1);
					this.graph.setT31To60(-1);
					this.graph.setT61To90(-1);
					this.graph.setT91To180(-1);
					this.graph.setT181To365(-1);
					this.graph.setT366Plus(-1);
				}
			}

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}

		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage() + ".  Query was: " + queryString);
			try {
				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
				}
				if (con != null) {
					con.close();
				}

			} catch (SQLException closeSQLException) {
				Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}
			throw rethrownQueryException;
		}
		
		try {
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			if (con != null) {
				con.close();
			}

		} catch (SQLException closeSQLException) {
			throw new Exception("ClosingSQL query failed:" + closeSQLException.getMessage());
		}

		
	}

	
}
