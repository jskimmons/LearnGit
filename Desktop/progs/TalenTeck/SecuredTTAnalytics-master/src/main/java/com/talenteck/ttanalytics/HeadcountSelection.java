package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class HeadcountSelection {

	String periodName;
	ArrayList<FilterSelection> filterSelectionList;
	ArrayList<HeadcountSelectionPeriod> periodList;
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

	public void setPeriodList(ArrayList<HeadcountSelectionPeriod> periodList) {
		this.periodList = periodList;
	}

	public ArrayList<HeadcountSelectionPeriod> getPeriodList() {
		return this.periodList;
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

	public void addPeriod(HeadcountSelectionPeriod period) {
		if (this.periodList == null ) {
			this.periodList = new ArrayList<HeadcountSelectionPeriod>();
		}
		this.periodList.add(period);
	}
	
	
	public void populateSelectorsFromJSON(String json, String database) throws Exception {
		
		Gson gson = new Gson();
		FilterSelection validFilterSelection = null;
		Hashtable<String,String> periodTable = null;
		Hashtable<String,Hashtable<String,String>> compareHash = null;
		Hashtable<String,String> thisFilterHash = null;
		
		FilterList compareList = new FilterList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		compareHash = compareList.toHashtable();
		
		try {
			periodTable = PeriodListHeadcount.periodLabels(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		
		ArrayList<SelectorSelection> selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());
		
		for (int i = 0 ; i < selectionList.size() ; i++ ) {
			if ( selectionList.get(i) != null && ("period").equals(selectionList.get(i).selectorName ) ) {
				if ( periodTable.containsKey(selectionList.get(i).selectorValue) ) {
					this.periodName = selectionList.get(i).selectorValue;
				}
				else {
					throw new Exception("Invalid period specified.");
				}
			}
			else {
				if ( compareHash.containsKey(selectionList.get(i).selectorName) ) {
					thisFilterHash = compareHash.get(selectionList.get(i).selectorName);
					if ( thisFilterHash.containsKey(selectionList.get(i).selectorValue)) {
						validFilterSelection = new FilterSelection();
						validFilterSelection.setFilterName(selectionList.get(i).selectorName);
						validFilterSelection.setFilterValue(selectionList.get(i).selectorValue);
						this.addFilterSelection(validFilterSelection);
						
					}
					else {
						throw new Exception("Invalid filter value " + selectionList.get(i).selectorValue
								+ " for filter " + selectionList.get(i).selectorName );
					}
				}
				else {
					throw new Exception("Invalid selector name " + selectionList.get(i).selectorName);
				}
			}
		}		
	}


	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		StructuredDataParameters dataParameters = null;
		int firstQueriedMonthNo, lastQueriedMonthNo;
		String whereStatement = "";
		int[][] hireTerminationHolders; 
		int monthIndex;
		int periodInt;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		if (this.filterSelectionList == null) {
			throw new Exception("Filter selection list is empty.");
		}
		if ( this.periodName == null ) {
			throw new Exception("Period name must be specified.");			
		}

		if ( !this.periodName.matches("\\d\\d\\d\\d") && !("All").equals(this.periodName) ) {
			throw new Exception("Invalid period name.");			
		}

		
		try {
			dataParameters = new StructuredDataParameters(database);
			
		}catch(Exception parametersException) {
			throw new Exception("Error getting structured data parameters:" + parametersException.getMessage());
		}

		if ( ("All").equals(this.periodName) ) {
			firstQueriedMonthNo = 12*dataParameters.firstYear + dataParameters.firstMonth - 1;
			lastQueriedMonthNo = 12*dataParameters.lastYear + dataParameters.lastMonth - 1;
			
		}
		else {
			try {
				periodInt = Integer.parseInt(periodName);
			} catch(Exception unusedException) {
				throw new Exception("Improperly formatted period label.");			
			}

			if ( periodInt == dataParameters.firstYear ) {
				firstQueriedMonthNo = 12*periodInt + dataParameters.firstMonth - 1;
			}
			else {
				firstQueriedMonthNo = 12*periodInt;
			}
			if ( periodInt == dataParameters.lastYear ) {
				lastQueriedMonthNo = 12*periodInt + dataParameters.lastMonth - 1;
			}
			else {
				lastQueriedMonthNo = 12*periodInt + 11;
			}

			
		}
		
		int monthCount = lastQueriedMonthNo - firstQueriedMonthNo + 1;
		hireTerminationHolders = new int[monthCount][3];
		for ( int thisMonthNo = firstQueriedMonthNo; thisMonthNo <= lastQueriedMonthNo ; thisMonthNo++ ) {
			hireTerminationHolders[thisMonthNo-firstQueriedMonthNo][0] = thisMonthNo;
		}
		
		//Assumedly these filter values have already been tested as legitimate so we don't need to escape
		
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

		// First query employment on the beginning of the first month

		//Notice this hasn't been fully checked for insertion, only the relevant components have been checked
		int firstMonthYear = (int)(firstQueriedMonthNo/12);
		int firstMonthMonth = firstQueriedMonthNo + 1 - 12*firstMonthYear;
		String firstMonthFirstDay = firstMonthYear + "-" + firstMonthMonth + "-01";		
		int employmentHolder = 0;
		
		try {

			
			con = DriverManager.getConnection(url, user, password);
			st = con.prepareStatement("SELECT COUNT(employeeid) from structureddataset " + whereStatement + " hiredate < '" + firstMonthFirstDay + "' AND (terminationdate >= '" + firstMonthFirstDay + "' OR terminationdate is NULL);");
			rs = st.executeQuery();

			while(rs.next()) {
				if (rs.getString(1) != null ) {
					employmentHolder = rs.getInt(1);
				}
			}
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
		} catch(Exception employmentQueryException) {
			throw new Exception("SQL error querying starting employment: " + employmentQueryException.getMessage());
		}
		
		// Now query the hires and terminations for every month

		String followingMonthFirstDay = null;
		try {
		int followingMonthYear = (int)(lastQueriedMonthNo + 1)/12;
		int followingMonthMonth = lastQueriedMonthNo + 2 - 12*followingMonthYear;
		followingMonthFirstDay = followingMonthYear + "-" + followingMonthMonth + "-01";		
		} catch(Exception monthException) {
			throw new Exception("The issue is in the month formats");
		}
		
		try {

			st = con.prepareStatement("SELECT (12*YEAR(hiredate) + MONTH(hiredate) - 1) AS hiremonth , COUNT(hiredate) from structureddataset " + whereStatement + " hiredate >= '" + firstMonthFirstDay + "' AND hiredate < '" + followingMonthFirstDay + "' GROUP BY hiremonth;");
			rs = st.executeQuery();

			monthIndex = 0;
			while(rs.next()) {
					if (hireTerminationHolders[monthIndex][0] > rs.getInt(1) ) {
						throw new Exception("Missing value in hire/termination holder: Month no. is " 
								+ hireTerminationHolders[monthIndex][0] + " index " + monthIndex +
									"but query result has " + rs.getInt(1));
					}
					while (hireTerminationHolders[monthIndex][0] < rs.getInt(1) && monthIndex < monthCount ) {
						monthIndex++;
					}
					hireTerminationHolders[monthIndex][1] =rs.getInt(2);
					monthIndex++;
			}
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
		} catch(Exception employmentQueryException) {
			throw new Exception("SQL error querying hires: " + employmentQueryException.getMessage().replaceAll("'","`"));
		}

		try {

			st = con.prepareStatement("SELECT (12*YEAR(terminationdate) + MONTH(terminationdate) - 1) AS terminationmonth , COUNT(terminationdate) from structureddataset " + whereStatement + " terminationdate >= '" + firstMonthFirstDay + "' AND terminationdate < '" + followingMonthFirstDay + "' GROUP BY terminationmonth;");
			rs = st.executeQuery();

			monthIndex = 0;
			while(rs.next()) {
				if (hireTerminationHolders[monthIndex][0] > rs.getInt(1) ) {
					throw new Exception("Missing value in hire/termination holder: Month no. is " 
							+ hireTerminationHolders[monthIndex][0] + " index " + monthIndex +
								"but query result has " + rs.getInt(1));
				}
				while (hireTerminationHolders[monthIndex][0] < rs.getInt(1) && monthIndex < monthCount ) {
					monthIndex++;
				}
				hireTerminationHolders[monthIndex][2] =rs.getInt(2);
				monthIndex++;
			}
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
		} catch(Exception employmentQueryException) {
			throw new Exception("SQL error querying terminations: " + employmentQueryException.getMessage().replaceAll("'","`"));
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
		
			
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage());
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

		
		HeadcountSelectionPeriod thisSelectionPeriod = new HeadcountSelectionPeriod();
		thisSelectionPeriod.setStartEmployment(employmentHolder);
		thisSelectionPeriod.setHires(hireTerminationHolders[0][1]);
		thisSelectionPeriod.setTerminations(hireTerminationHolders[0][2]);
		int thisMonthYear = (int)(firstQueriedMonthNo/12);
		int thisMonthMonth = firstQueriedMonthNo + 1 - 12*thisMonthYear;
		thisSelectionPeriod.setMonth(thisMonthMonth);
		thisSelectionPeriod.setYear(thisMonthYear);		
		this.periodList = new ArrayList<HeadcountSelectionPeriod>();
		this.periodList.add(thisSelectionPeriod);
		try {
		for ( int thisMonthNo = firstQueriedMonthNo + 1 ; thisMonthNo <= lastQueriedMonthNo ; thisMonthNo ++ ) {
			monthIndex = thisMonthNo - firstQueriedMonthNo;
			employmentHolder += hireTerminationHolders[monthIndex - 1][1] - hireTerminationHolders[monthIndex - 1][2];
			thisSelectionPeriod = new HeadcountSelectionPeriod();
			thisSelectionPeriod.setStartEmployment(employmentHolder);
			thisSelectionPeriod.setHires(hireTerminationHolders[monthIndex][1]);
			thisSelectionPeriod.setTerminations(hireTerminationHolders[monthIndex][2]);
			thisMonthYear = (int)(thisMonthNo/12);
			thisMonthMonth = thisMonthNo + 1 - 12*thisMonthYear;
			thisSelectionPeriod.setMonth(thisMonthMonth);
			thisSelectionPeriod.setYear(thisMonthYear);		
			this.periodList.add(thisSelectionPeriod);
			
		}
		} catch(Exception arrayException) {
			throw new Exception("The issue is in the array.");
		}

		
	}

	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		Messages messageList = new Messages();
		messageList.addMessage(errorMessage);
		this.setMessages(messageList);
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	
	
}
