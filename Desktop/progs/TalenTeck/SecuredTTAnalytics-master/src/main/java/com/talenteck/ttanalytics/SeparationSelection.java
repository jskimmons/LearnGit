package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class SeparationSelection {

	String periodName;
	String periodLabel;
	ArrayList<FilterSelection> filterSelectionList;
	SeparationPeriodSelection graph;
	Messages messages;

	public void setPeriodName(String name) {
		this.periodName = name;
	}
	
	String getPeriodName(){
		return this.periodName;
	}
		
	public void setPeriodLabel(String label) {
		this.periodLabel = label;
	}
	
	String getPeriodLabel(){
		return this.periodLabel;
	}
		
	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}

	public ArrayList<FilterSelection> getFilterSelectionList() {
		return this.filterSelectionList;
	}

	public void setGraph(SeparationPeriodSelection graph) {
		this.graph = graph;
	}

	public SeparationPeriodSelection getGraph() {
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
		int firstQueriedMonthNo, lastQueriedMonthNo;
		String whereStatement = "";
		
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
			dataParameters = new StructuredDataParameters(database);
			
		}catch(Exception parametersException) {
			throw new Exception("Error getting structured data parameters:" + parametersException.getMessage());
		}

		try {

			if ( ("All").equals(this.periodName) ) {
				firstQueriedMonthNo = 12*dataParameters.firstYear + dataParameters.firstMonth - 1; 
				lastQueriedMonthNo = 12*dataParameters.lastYear + dataParameters.lastMonth; 				
			}
			else {
				// Remember for the final month, we are querying about the first of the following month
				firstQueriedMonthNo = 12*Integer.parseInt(this.periodName.substring(0,4)) + Integer.parseInt(this.periodName.substring(5,7)) - 6; 
				lastQueriedMonthNo = 12*Integer.parseInt(this.periodName.substring(0,4)) + Integer.parseInt(this.periodName.substring(5,7)); 
				
			}
			if (firstQueriedMonthNo > lastQueriedMonthNo ) {
				throw new Exception();
			}
		} catch(Exception unusedException) {
			throw new Exception("Improperly formatted period label.");			
		}

		if (( firstQueriedMonthNo < 12*dataParameters.firstYear + dataParameters.firstMonth - 1) ||
				( lastQueriedMonthNo > 12*dataParameters.lastYear + dataParameters.lastMonth )) {
			throw new Exception("Requested time period out of range.");
		}
		
		//Assumedly these filter values have already been tested as legitimate so we don't need to escape
		

		if (("All").equals(this.periodName)) {
			whereStatement = " ";
		}
		else {
			whereStatement = " WHERE hiredate >= '" + (int)(firstQueriedMonthNo/12) + "-" +
					(firstQueriedMonthNo - (int)(firstQueriedMonthNo/12) +1) + 
					"-01' AND hiredate < '" + (int)(lastQueriedMonthNo/12) + "-" +
							(lastQueriedMonthNo - (int)(lastQueriedMonthNo/12) + 1) + "-01'"; 
		}

		try {
		String[] months = { "ZeroMonth" , "January" , "February" , "March" , "April" ,
				"May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"
				};

		// This should already be initialized by the routine that parses the JSON
		// (which inserts a category name in the graph) but if it's not then
		// the routine will bork, so let's initialize it here....
			if ( this.graph == null ) {
				this.graph = new SeparationPeriodSelection();
			}
		
			if ( varyingFilter != null &&  ("period").equals(varyingFilter) ) {
				this.graph.setFilterValue(months[firstQueriedMonthNo - 12*(int)(firstQueriedMonthNo/12) + 1]
						+ " 1, " + (int)(firstQueriedMonthNo/12) + " to " + 
						months[firstQueriedMonthNo - 12*(int)(firstQueriedMonthNo/12) + 1] + 
						" 1, " + (int)(firstQueriedMonthNo/12));			
			}

		
		//Assumedly these filter values have already been tested as legitimate so we don't need to escape
		//Remember that the WHERE statement will have been started by the time period filter above
		//so we're just adding to it here
			
			for (int i = 0 ; i < this.filterSelectionList.size(); i++ ) {
				if ( !("All").equals((filterSelectionList.get(i)).filterValue) ) {
					if (("").equals(whereStatement)) {
						whereStatement = "WHERE " + (filterSelectionList.get(i)).filterName 
								+ " = '" + (filterSelectionList.get(i)).filterValue + "'"; 
					}
					else {
						whereStatement = whereStatement + " AND "  + (filterSelectionList.get(i)).filterName + " = '" + (filterSelectionList.get(i)).filterValue + "'";
					}
				}
			}
					
		} catch(Exception parameterException) {throw new Exception("Error constructing query parameters: " + parameterException.getMessage());}
			
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
			queryString = "SELECT  AVG(t30) , AVG(t60) , AVG(t90) , AVG(t180) , AVG(t365) from structureddataset " + whereStatement + ";";
			st = con.prepareStatement("SELECT  AVG(t30) , AVG(t60) , AVG(t90) , AVG(t180) , AVG(t365) from structureddataset " + whereStatement + ";");
			rs = st.executeQuery();

			while (rs.next() ) {

				this.graph.setT30(rs.getFloat(1));
				this.graph.setT60(rs.getFloat(2));
				this.graph.setT90(rs.getFloat(3));
				this.graph.setT180(rs.getFloat(4));
				this.graph.setT365(rs.getFloat(5));
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

		//this.setGraph(returnGraph);
		
	}

	
}
