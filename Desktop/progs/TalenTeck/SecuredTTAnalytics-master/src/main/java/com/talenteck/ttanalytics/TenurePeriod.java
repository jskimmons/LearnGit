package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;

@XmlRootElement(name="Period")
public class TenurePeriod {

	String periodName;
	String periodLabel;
	ArrayList<TenurePeriodSelectionList> filterList;
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
	public void setFilterList(ArrayList<TenurePeriodSelectionList> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<TenurePeriodSelectionList> getFilterList() {
		return this.filterList;
	}

	public void addFilter(TenurePeriodSelectionList filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<TenurePeriodSelectionList>();
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
		int firstQueriedMonthNo;
		String queryDateString = "";

		TenurePeriodSelection thisSelection = null;
		TenurePeriodSelectionList thisSelectionList = null;
		String thisFilterName = null;
		FilterList activeFilters = new FilterList();
		Hashtable<String,TenurePeriodSelectionList> selectionListTable = new Hashtable<String,TenurePeriodSelectionList>(); 
		Hashtable<String,String> periodLabels = new Hashtable<String,String>();

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		if ( this.periodName == null  ) {
			throw new Exception("Time period must be specified.");			
		}

		try {
			periodLabels = PeriodListTenure.periodLabels(database);
		} catch(Exception unusedException) {
			throw new Exception("Error fetching period list.");			
		}

		if ( periodLabels.get(this.periodName) == null ) {
			throw new Exception("Period name not in list.");
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
		
		String query = "SELECT    t0to30 , t31to60 , t61to90 , t91to180 , t181to365 , t366plus , n ," +
	    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
	    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
	    " FROM tenure WHERE periodname = ?;";
		
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
						thisSelectionList = new TenurePeriodSelectionList();
						thisSelectionList.setFilterName("All");
						thisSelection = new TenurePeriodSelection();
						thisSelection.setFilterValue("All");
						thisSelection.setT0To30(rs.getString("t0to30") == null ? -1 : rs.getDouble("t0to30") );
						thisSelection.setT31To60(rs.getString("t31to60") == null ? -1 : rs.getDouble("t31to60") );
						thisSelection.setT61To90(rs.getString("t61to90") == null ? -1 : rs.getDouble("t61to90") );
						thisSelection.setT91To180(rs.getString("t91to180") == null ? -1 : rs.getDouble("t91to180") );
						thisSelection.setT181To365(rs.getString("t181to365") == null ? -1 : rs.getDouble("t181to365") );
						thisSelection.setT366Plus(rs.getString("t366plus") == null ? -1 : rs.getDouble("t366plus") );
						thisSelection.setN( rs.getInt("n") );

						
						thisSelectionList.addSelection(thisSelection);
						this.addFilter(thisSelectionList);
					}
					
				break;
				case 1:
					
					if ( totalNullFilters < 5 ) {
						
						if ( selectionListTable.get(rs.getString("filtername" + activeFilterNo)) == null ) {
							TenurePeriodSelectionList thisFilterSelectionList = new TenurePeriodSelectionList();
							thisFilterSelectionList.setFilterName(rs.getString("filtername" + activeFilterNo));
							selectionListTable.put(rs.getString("filtername" + activeFilterNo), thisFilterSelectionList);
							this.addFilter(thisFilterSelectionList);
	
						}
						
						thisSelection = new TenurePeriodSelection();
						thisSelection.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
						thisSelection.setT0To30(rs.getString("t0to30") == null ? -1 : rs.getDouble("t0to30") );
						thisSelection.setT31To60(rs.getString("t31to60") == null ? -1 : rs.getDouble("t31to60") );
						thisSelection.setT61To90(rs.getString("t61to90") == null ? -1 : rs.getDouble("t61to90") );
						thisSelection.setT91To180(rs.getString("t91to180") == null ? -1 : rs.getDouble("t91to180") );
						thisSelection.setT181To365(rs.getString("t181to365") == null ? -1 : rs.getDouble("t181to365") );
						thisSelection.setT366Plus(rs.getString("t366plus") == null ? -1 : rs.getDouble("t366plus") );
						thisSelection.setN( rs.getInt("n") );
						
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



