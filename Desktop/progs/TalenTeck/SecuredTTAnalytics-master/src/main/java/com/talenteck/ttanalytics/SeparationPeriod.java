package com.talenteck.ttanalytics;


//This class is mainly for JAXB to describe the XML structure for the separation sheet for a
//single period.  There are (as of now) no other functionalities associated with the class.

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
//import java.util.Calendar;
//import java.util.GregorianCalendar;
import java.util.Hashtable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;

@XmlRootElement(name="PeriodSeparation")
public class SeparationPeriod {

	String periodName;
	String periodLabel;
	ArrayList<SeparationPeriodSelectionList> filterList;
	Messages messages;
	
	@XmlElement(name = "PeriodName")
	public void setPeriodName(String periodName) {
		this.periodName = periodName;
	}
	
	String getPeriodName(){
		return this.periodName;
	}

	@XmlElement(name = "PeriodLabel")
	public void setPeriodLabel(String periodLabel) {
		this.periodLabel = periodLabel;
	}
	
	String getPeriodLabel(){
		return this.periodLabel;
	}

	
	@XmlElement(name = "Filter")
	public void setFilterList(ArrayList<SeparationPeriodSelectionList> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<SeparationPeriodSelectionList> getFilterList() {
		return this.filterList;
	}

	public void addFilter(SeparationPeriodSelectionList filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<SeparationPeriodSelectionList>();
		}
		this.filterList.add(filter);
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	
	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		StructuredDataParameters dataParameters = null;
		int firstQueriedMonthNo, lastQueriedMonthNo;
		int firstSampleMonthNo , lastSampleMonthNo;
		String fullSampleWhereStatement = "";
		String timePeriodCondition = "";

		SeparationPeriodSelection thisSelection = null;
		SeparationPeriodSelectionList thisSelectionList = null;
		String thisFilterName = null;
		FilterList activeFilters = new FilterList();
		Hashtable<String,String> periodLabels = null;
		Hashtable<String,SeparationPeriodSelectionList> selectionListTable = new Hashtable<String,SeparationPeriodSelectionList>(); 
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		try {
			periodLabels = PeriodListSeparation.periodLabels(database);
		} catch(Exception FetchPeriodsException) {
			throw new Exception("Error fetching list of valid periods.");
		}
		
		if ( this.periodName == null  ) {
			throw new Exception("Time period must be specified.");			
		}
		
		if ( !periodLabels.containsKey(this.periodName) ) {
			throw new Exception("Specified time period is not in list.");
		}
		this.periodLabel = periodLabels.get(this.periodName);


	
		try {
			activeFilters.populate(database);
		} catch(Exception filterException) {
			throw new Exception("Error fetching filter list.");
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

		try {

			con = DriverManager.getConnection(url, user, password);

		} catch (Exception connectException) {
			Exception driverInitException = new Exception("Failed to connect to database:" + connectException.getMessage());
			throw driverInitException;
		}

		
		String query = "SELECT    t30 , t60 , t90 , t180 , t365 ," +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
			    " FROM separation WHERE periodname = ?;";
		
		try {
			
			st = con.prepareStatement(query);
			st.setString(1, this.periodName);
			rs = st.executeQuery();

			int rowsReturned = 0;
			while (rs.next() ) {
				rowsReturned++;

				int activeFilterNo = -1;
				int totalActiveFilters = 0;
				int totalNullFilters = 0;
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null &&
							!("All").equals(rs.getString("filtervalue" + i)) ) {
						activeFilterNo = i;
						totalActiveFilters++;
					}
					if ( rs.getString("filtername" + i) == null ) {
						totalNullFilters++;
					}
				}

				switch ( totalActiveFilters ) {
				case 0:
					
					if ( totalNullFilters < 5 ) {
						thisSelectionList = new SeparationPeriodSelectionList();
						thisSelectionList.setFilterName("All");
						thisSelection = new SeparationPeriodSelection();
						thisSelection.setFilterValue("All");
						thisSelection.setT30(rs.getString("t30") == null ? -1 : rs.getDouble("t30") );
						thisSelection.setT60(rs.getString("t60") == null ? -1 : rs.getDouble("t60") );
						thisSelection.setT90(rs.getString("t90") == null ? -1 : rs.getDouble("t90") );
						thisSelection.setT180(rs.getString("t180") == null ? -1 : rs.getDouble("t180") );
						thisSelection.setT365(rs.getString("t365") == null ? -1 : rs.getDouble("t365") );

						
						thisSelectionList.addSelection(thisSelection);
						this.addFilter(thisSelectionList);
					}
					
				break;
				case 1:
					
					if ( totalNullFilters < 5 ) {
						
						if ( selectionListTable.get(rs.getString("filtername" + activeFilterNo)) == null ) {
							SeparationPeriodSelectionList thisFilterSelectionList = new SeparationPeriodSelectionList();
							thisFilterSelectionList.setFilterName(rs.getString("filtername" + activeFilterNo));
							selectionListTable.put(rs.getString("filtername" + activeFilterNo), thisFilterSelectionList);
							this.addFilter(thisFilterSelectionList);
	
						}
						
	
						
						thisSelection = new SeparationPeriodSelection();
						thisSelection.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
						thisSelection.setT30(rs.getString("t30") == null ? -1 : rs.getDouble("t30") );
						thisSelection.setT60(rs.getString("t60") == null ? -1 : rs.getDouble("t60") );
						thisSelection.setT90(rs.getString("t90") == null ? -1 : rs.getDouble("t90") );
						thisSelection.setT180(rs.getString("t180") == null ? -1 : rs.getDouble("t180") );
						thisSelection.setT365(rs.getString("t365") == null ? -1 : rs.getDouble("t365") );
						
						thisSelectionList = selectionListTable.get(rs.getString("filtername" + activeFilterNo));
						thisSelectionList.addSelection(thisSelection);
					}
					
				break;
					
				default:
				break;
						
				}	

				
			}
			
			
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			
			
			

		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage());
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
		
	}


	
	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		this.addMessage(errorMessage);
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
