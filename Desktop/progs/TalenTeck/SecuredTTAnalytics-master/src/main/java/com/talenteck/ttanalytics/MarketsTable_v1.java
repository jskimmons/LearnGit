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

public class MarketsTable_v1 {
	
	String periodName;
	String periodLabel;
	ArrayList<PostalCodeSelectionList> filterNames;
	Messages messages;

	public String getPeriodName() {
		return periodName;
	}
	public void setPeriodName(String periodName) {
		this.periodName = periodName;
	}
	public String getPeriodLabel() {
		return periodLabel;
	}
	public void setPeriodLabel(String periodLabel) {
		this.periodLabel = periodLabel;
	}
	public ArrayList<PostalCodeSelectionList> getFilterNames() {
		return filterNames;
	}
	public void setFilterNames(ArrayList<PostalCodeSelectionList> filterNames) {
		this.filterNames = filterNames;
	}
	public Messages getMessages() {
		return messages;
	}
	public void setMessages(Messages messages) {
		this.messages = messages;
	}
	
	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	public void addFilter(PostalCodeSelectionList thisSelectionList) {
		if ( this.filterNames == null ){
			this.filterNames = new ArrayList<PostalCodeSelectionList>();
		}
		this.filterNames.add(thisSelectionList);
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

		PostalCodeSelection thisSelection = null;
		PostalCodeSelectionList thisSelectionList = null;
		PostalCodeAttributes thisPostalCode = null;
		String thisFilterName = null;
		Hashtable<String,String> periodLabels = null;
		Hashtable<String,PostalCodeSelectionList> selectionListTable = new Hashtable<>(); 
		Hashtable<String,Hashtable<String,PostalCodeSelection>> selectionTableTable = new Hashtable<>(); 
		Hashtable<String,PostalCodeSelection> thisFilterTable = null;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		try {
			periodLabels = PeriodListMarkets.periodLabels(database);
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

		

		String query = "SELECT postalcode, latitude, longitude, predictedapplicants, actualapplicants, "
				+ " predictedhires, actualhires, predictedgoodhires, actualgoodhires, traveltime, "
				+ "actualjoboffers, laborforce, unemployment, blackpeople, renteroccupied, density, totalcompetitors, " +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
			    " FROM markets WHERE periodname = ?;";
		
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

				/* We'll skip the "All" from the table, because it's just going to 
				 * return every ZIP code in the country
				case 0:
					
					if ( totalNullFilters < 5 ) {
						thisPostalCode = new PostalCodeAttributes();

						thisPostalCode.setPostalCode(rs.getString("postalcode") == null ? null : rs.getString("postalcode"));
						thisPostalCode.setLatitude(rs.getString("latitude") == null ? -1 : rs.getDouble("latitude"));
						thisPostalCode.setLongitude(rs.getString("longitude") == null ? -1 : rs.getDouble("longitude"));
						thisPostalCode.setPredictedApplicants(rs.getString("predictedapplicants") == null ? -1 : rs.getDouble("predictedapplicants"));
						thisPostalCode.setActualApplicants(rs.getString("actualapplicants") == null ? -1 : rs.getInt("actualapplicants"));
						thisPostalCode.setPredictedHires(rs.getString("predictedhires") == null ? -1 : rs.getDouble("predictedhires"));
						thisPostalCode.setActualHires(rs.getString("actualhires") == null ? -1 : rs.getInt("actualhires"));
						thisPostalCode.setPredictedGoodHires(rs.getString("predictedgoodhires") == null ? -1 : rs.getDouble("predictedgoodhires"));
						thisPostalCode.setActualGoodHires(rs.getString("actualgoodhires") == null ? -1 : rs.getInt("actualgoodhires"));
						thisPostalCode.setTravelTime(rs.getString("traveltime") == null ? -1 : rs.getDouble("traveltime"));

						
						thisSelectionList.setFilterName("All");
						thisSelection = new ApplicantPeriodSelection();
						
						thisSelectionList.addSelection(thisSelection);
						this.addFilter(thisSelectionList);
					}
					
				break;*/
				case 1:
					
					if ( totalNullFilters < 5 ) {
						
						thisFilterTable = selectionTableTable.get(rs.getString("filtername" + activeFilterNo));
						if ( thisSelectionList == null ) {
							thisSelectionList = new PostalCodeSelectionList();
							thisSelectionList.setFilterName(rs.getString("filtername" + activeFilterNo));
							thisFilterTable = new Hashtable<>();
							selectionListTable.put(rs.getString("filtername" + activeFilterNo), thisSelectionList);
							selectionTableTable.put(rs.getString("filtername" + activeFilterNo), thisFilterTable);
							this.addFilter(thisSelectionList);
	
						}
						

						thisSelection = thisFilterTable.get(rs.getString("filtervalue" + activeFilterNo));
						if ( thisSelection == null ) {
							thisSelection = new PostalCodeSelection();
							thisSelection.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
							thisFilterTable.put(rs.getString("filtervalue" + activeFilterNo), thisSelection);
							thisSelectionList.addFilterValue(thisSelection);	
						}

						thisPostalCode = new PostalCodeAttributes();

						thisPostalCode.setPostalCode(rs.getString("postalcode") == null ? null : rs.getString("postalcode"));
						thisPostalCode.setLatitude(rs.getString("latitude") == null ? -1 : rs.getDouble("latitude"));
						thisPostalCode.setLongitude(rs.getString("longitude") == null ? -1 : rs.getDouble("longitude"));
						thisPostalCode.setPredictedApplicants(rs.getString("predictedapplicants") == null ? -1 : rs.getDouble("predictedapplicants"));
						thisPostalCode.setActualApplicants(rs.getString("actualapplicants") == null ? -1 : rs.getInt("actualapplicants"));
						thisPostalCode.setPredictedHires(rs.getString("predictedhires") == null ? -1 : rs.getDouble("predictedhires"));
						thisPostalCode.setActualHires(rs.getString("actualhires") == null ? -1 : rs.getInt("actualhires"));
						thisPostalCode.setPredictedGoodHires(rs.getString("predictedgoodhires") == null ? -1 : rs.getDouble("predictedgoodhires"));
						thisPostalCode.setActualGoodHires(rs.getString("actualgoodhires") == null ? -1 : rs.getInt("actualgoodhires"));
						thisPostalCode.setTravelTime(rs.getString("traveltime") == null ? -1 : rs.getDouble("traveltime"));
						
						thisSelection.addPostalCode(thisPostalCode);
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
