package com.talenteck.ttanalytics;


import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;
 
@XmlRootElement(name="Period")
public class ApplicantPeriod {

	String periodName;
	String periodLabel;
	ArrayList<ApplicantPeriodSelectionList> filterList;
	Messages messages;
	

	@XmlElement(name = "PeriodName")
	public void setPeriodLabel(String periodLabel) {
		this.periodName = periodLabel;
	}
	
	String getPeriodLabel(){
		return this.periodName;
	}

	
	@XmlElement(name = "Selection")
	public void setFilterList(ArrayList<ApplicantPeriodSelectionList> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<ApplicantPeriodSelectionList> getFilterList() {
		return this.filterList;
	}

	public void addFilter(ApplicantPeriodSelectionList filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<ApplicantPeriodSelectionList>();
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

		ApplicantPeriodSelection thisSelection = null;
		ApplicantPeriodSelectionList thisSelectionList = null;
		String thisFilterName = null;
		Hashtable<String,String> periodLabels = null;
		Hashtable<String,ApplicantPeriodSelectionList> selectionListTable = new Hashtable<String,ApplicantPeriodSelectionList>(); 
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		try {
			periodLabels = PeriodListApplicant.periodLabels(database);
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

		
		String query = "SELECT    applied , offered , accepted , hired , offerrate , appliedacceptrate , offeredacceptrate , employrate ," +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
			    " FROM applicant WHERE periodname = ?;";
		
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
						thisSelectionList = new ApplicantPeriodSelectionList();
						thisSelectionList.setFilterName("All");
						thisSelection = new ApplicantPeriodSelection();
						thisSelection.setFilterValue("All");
						thisSelection.setApplied(rs.getString("applied") == null ? -1 : rs.getInt("applied") );
						thisSelection.setOffered(rs.getString("offered") == null ? -1 : rs.getInt("offered") );
						thisSelection.setAccepted(rs.getString("accepted") == null ? -1 : rs.getInt("accepted") );
						thisSelection.setHired(rs.getString("hired") == null ? -1 : rs.getInt("hired") );
						thisSelection.setOfferRate(rs.getString("offerrate") == null ? -1 : rs.getDouble("offerrate") );
						thisSelection.setAppliedAcceptRate(rs.getString("appliedacceptrate") == null ? -1 : rs.getDouble("appliedacceptrate") );
						thisSelection.setOfferedAcceptRate(rs.getString("offeredacceptrate") == null ? -1 : rs.getDouble("offeredacceptrate") );
						thisSelection.setEmployRate(rs.getString("employrate") == null ? -1 : rs.getDouble("employrate") );

						
						thisSelectionList.addSelection(thisSelection);
						this.addFilter(thisSelectionList);
					}
					
				break;
				case 1:
					
					if ( totalNullFilters < 5 ) {
						
						if ( selectionListTable.get(rs.getString("filtername" + activeFilterNo)) == null ) {
							ApplicantPeriodSelectionList thisFilterSelectionList = new ApplicantPeriodSelectionList();
							thisFilterSelectionList.setFilterName(rs.getString("filtername" + activeFilterNo));
							selectionListTable.put(rs.getString("filtername" + activeFilterNo), thisFilterSelectionList);
							this.addFilter(thisFilterSelectionList);
	
						}
						
	
						
						thisSelection = new ApplicantPeriodSelection();
						thisSelection.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
						thisSelection.setApplied(rs.getString("applied") == null ? -1 : rs.getInt("applied") );
						thisSelection.setOffered(rs.getString("offered") == null ? -1 : rs.getInt("offered") );
						thisSelection.setAccepted(rs.getString("accepted") == null ? -1 : rs.getInt("accepted") );
						thisSelection.setHired(rs.getString("hired") == null ? -1 : rs.getInt("hired") );
						thisSelection.setOfferRate(rs.getString("offerrate") == null ? -1 : rs.getDouble("offerrate") );
						thisSelection.setAppliedAcceptRate(rs.getString("appliedacceptrate") == null ? -1 : rs.getDouble("appliedacceptrate") );
						thisSelection.setOfferedAcceptRate(rs.getString("offeredacceptrate") == null ? -1 : rs.getDouble("offeredacceptrate") );
						thisSelection.setEmployRate(rs.getString("employrate") == null ? -1 : rs.getDouble("employrate") );
						
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
