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
public class SeparationByTenurePeriod {

	String periodName;
	String periodLabel;
	String turnoverRate;
	ArrayList<SeparationByTenurePeriodSelectionList> filterList;
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

	
	@XmlElement(name = "TurnoverRate")
	public void setTurnoverRate(String turnoverRate) {
		this.turnoverRate = turnoverRate;
	}
	
	String getTurnoverRate(){
		return this.turnoverRate;
	}

	@XmlElement(name = "Filter")
	public void setFilterList(ArrayList<SeparationByTenurePeriodSelectionList> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<SeparationByTenurePeriodSelectionList> getFilterList() {
		return this.filterList;
	}

	public void addFilter(SeparationByTenurePeriodSelectionList filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<SeparationByTenurePeriodSelectionList>();
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


	public void setTurnoverRateWithCheck(String turnoverRate) throws Exception {
		if ( turnoverRate == null ||
				  ( !("t30").equals(turnoverRate) &&
					!("t60").equals(turnoverRate) &&
					!("t90").equals(turnoverRate) &&
					!("t180").equals(turnoverRate) &&
					!("t365").equals(turnoverRate) )) {
			throw new Exception("Invalid turnover rate specified.");						
		}
		this.turnoverRate = turnoverRate;
	}

	
	
	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		StructuredDataParameters dataParameters = null;
		int queriedMonthNo;
		String queryDateString = "";

		SeparationByTenurePeriodSelection thisSelection = null;
		SeparationByTenurePeriodSelectionList thisSelectionList = null;
		String thisFilterName = null;
		FilterList activeFilters = new FilterList();
		Hashtable<String,String> periodLabels = null;
		Hashtable<String,SeparationByTenurePeriodSelectionList> selectionListTable = new Hashtable<String,SeparationByTenurePeriodSelectionList>(); 
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		if ( this.periodName == null  ) {
			throw new Exception("Time period must be specified.");			
		}

		try {
			periodLabels = PeriodListSeparationByTenure.periodLabels(database);
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

		
		String query = "SELECT    t30_0to30 , t30_31to60 ,  t30_61to90 ,  t30_91to180 ,  t30_181to365 ,  t30_366plus ,  t30_all ," +
			    " t60_0to30 ,  t60_31to60 ,  t60_61to90 ,  t60_91to180 ,  t60_181to365 ,  t60_366plus ,  t60_all ," +
			    " t90_0to30 ,  t90_31to60 ,  t90_61to90 ,  t90_91to180 ,  t90_181to365 ,  t90_366plus ,  t90_all ," +
			    " t180_0to30 ,  t180_31to60 ,  t180_61to90 ,  t180_91to180 ,  t180_181to365 ,  t180_366plus ,  t180_all ," +
			    " t365_0to30 ,  t365_31to60 ,  t365_61to90 ,  t365_91to180 ,  t365_181to365 ,  t365_366plus , t365_all ," +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
			    " FROM separationbytenure WHERE periodname = ?;";
		
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
						thisSelectionList = new SeparationByTenurePeriodSelectionList();
						thisSelectionList.setFilterName("All");
						thisSelection = new SeparationByTenurePeriodSelection();
						thisSelection.setFilterValue("All");
						thisSelection.setT30_0To30(rs.getString("t30_0to30") == null ? -1 : rs.getDouble("t30_0to30") );
						thisSelection.setT30_31To60(rs.getString("t30_31to60") == null ? -1 : rs.getDouble("t30_31to60") );
						thisSelection.setT30_61To90(rs.getString("t30_61to90") == null ? -1 : rs.getDouble("t30_61to90") );
						thisSelection.setT30_91To180(rs.getString("t30_91to180") == null ? -1 : rs.getDouble("t30_91to180") );
						thisSelection.setT30_181To365(rs.getString("t30_181to365") == null ? -1 : rs.getDouble("t30_181to365") );
						thisSelection.setT30_366Plus(rs.getString("t30_366plus") == null ? -1 : rs.getDouble("t30_366plus") );
						thisSelection.setT30_all(rs.getString("t30_all") == null ? -1 : rs.getDouble("t30_all") );

						thisSelection.setT60_0To30(rs.getString("t60_0to30") == null ? -1 : rs.getDouble("t60_0to30") );
						thisSelection.setT60_31To60(rs.getString("t60_31to60") == null ? -1 : rs.getDouble("t60_31to60") );
						thisSelection.setT60_61To90(rs.getString("t60_61to90") == null ? -1 : rs.getDouble("t60_61to90") );
						thisSelection.setT60_91To180(rs.getString("t60_91to180") == null ? -1 : rs.getDouble("t60_91to180") );
						thisSelection.setT60_181To365(rs.getString("t60_181to365") == null ? -1 : rs.getDouble("t60_181to365") );
						thisSelection.setT60_366Plus(rs.getString("t60_366plus") == null ? -1 : rs.getDouble("t60_366plus") );
						thisSelection.setT60_all(rs.getString("t60_all") == null ? -1 : rs.getDouble("t60_all") );

						thisSelection.setT90_0To30(rs.getString("t90_0to30") == null ? -1 : rs.getDouble("t90_0to30") );
						thisSelection.setT90_31To60(rs.getString("t90_31to60") == null ? -1 : rs.getDouble("t90_31to60") );
						thisSelection.setT90_61To90(rs.getString("t90_61to90") == null ? -1 : rs.getDouble("t90_61to90") );
						thisSelection.setT90_91To180(rs.getString("t90_91to180") == null ? -1 : rs.getDouble("t90_91to180") );
						thisSelection.setT90_181To365(rs.getString("t90_181to365") == null ? -1 : rs.getDouble("t90_181to365") );
						thisSelection.setT90_366Plus(rs.getString("t90_366plus") == null ? -1 : rs.getDouble("t90_366plus") );
						thisSelection.setT90_all(rs.getString("t90_all") == null ? -1 : rs.getDouble("t90_all") );

						thisSelection.setT180_0To30(rs.getString("t180_0to30") == null ? -1 : rs.getDouble("t180_0to30") );
						thisSelection.setT180_31To60(rs.getString("t180_31to60") == null ? -1 : rs.getDouble("t180_31to60") );
						thisSelection.setT180_61To90(rs.getString("t180_61to90") == null ? -1 : rs.getDouble("t180_61to90") );
						thisSelection.setT180_91To180(rs.getString("t180_91to180") == null ? -1 : rs.getDouble("t180_91to180") );
						thisSelection.setT180_181To365(rs.getString("t180_181to365") == null ? -1 : rs.getDouble("t180_181to365") );
						thisSelection.setT180_366Plus(rs.getString("t180_366plus") == null ? -1 : rs.getDouble("t180_366plus") );
						thisSelection.setT180_all(rs.getString("t180_all") == null ? -1 : rs.getDouble("t180_all") );

						thisSelection.setT365_0To30(rs.getString("t365_0to30") == null ? -1 : rs.getDouble("t365_0to30") );
						thisSelection.setT365_31To60(rs.getString("t365_31to60") == null ? -1 : rs.getDouble("t365_31to60") );
						thisSelection.setT365_61To90(rs.getString("t365_61to90") == null ? -1 : rs.getDouble("t365_61to90") );
						thisSelection.setT365_91To180(rs.getString("t365_91to180") == null ? -1 : rs.getDouble("t365_91to180") );
						thisSelection.setT365_181To365(rs.getString("t365_181to365") == null ? -1 : rs.getDouble("t365_181to365") );
						thisSelection.setT365_366Plus(rs.getString("t365_366plus") == null ? -1 : rs.getDouble("t365_366plus") );
						thisSelection.setT365_all(rs.getString("t365_all") == null ? -1 : rs.getDouble("t365_all") );
						
						thisSelectionList.addSelection(thisSelection);
						this.addFilter(thisSelectionList);
					}
					
				break;
				case 1:
					
					if ( totalNullFilters < 5 ) {
						//Create the hash table if it's not there;
						if ( selectionListTable.get(rs.getString("filtername" + activeFilterNo)) == null ) {
							SeparationByTenurePeriodSelectionList thisFilterSelectionList = new SeparationByTenurePeriodSelectionList();
							thisFilterSelectionList.setFilterName(rs.getString("filtername" + activeFilterNo));
							selectionListTable.put(rs.getString("filtername" + activeFilterNo), thisFilterSelectionList);
							this.addFilter(thisFilterSelectionList);
						}
						
						thisSelection = new SeparationByTenurePeriodSelection();
						thisSelection.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
						thisSelection.setT30_0To30(rs.getString("t30_0to30") == null ? -1 : rs.getDouble("t30_0to30") );
						thisSelection.setT30_31To60(rs.getString("t30_31to60") == null ? -1 : rs.getDouble("t30_31to60") );
						thisSelection.setT30_61To90(rs.getString("t30_61to90") == null ? -1 : rs.getDouble("t30_61to90") );
						thisSelection.setT30_91To180(rs.getString("t30_91to180") == null ? -1 : rs.getDouble("t30_91to180") );
						thisSelection.setT30_181To365(rs.getString("t30_181to365") == null ? -1 : rs.getDouble("t30_181to365") );
						thisSelection.setT30_366Plus(rs.getString("t30_366plus") == null ? -1 : rs.getDouble("t30_366plus") );
						thisSelection.setT30_all(rs.getString("t30_all") == null ? -1 : rs.getDouble("t30_all") );

						thisSelection.setT60_0To30(rs.getString("t60_0to30") == null ? -1 : rs.getDouble("t60_0to30") );
						thisSelection.setT60_31To60(rs.getString("t60_31to60") == null ? -1 : rs.getDouble("t60_31to60") );
						thisSelection.setT60_61To90(rs.getString("t60_61to90") == null ? -1 : rs.getDouble("t60_61to90") );
						thisSelection.setT60_91To180(rs.getString("t60_91to180") == null ? -1 : rs.getDouble("t60_91to180") );
						thisSelection.setT60_181To365(rs.getString("t60_181to365") == null ? -1 : rs.getDouble("t60_181to365") );
						thisSelection.setT60_366Plus(rs.getString("t60_366plus") == null ? -1 : rs.getDouble("t60_366plus") );
						thisSelection.setT60_all(rs.getString("t60_all") == null ? -1 : rs.getDouble("t60_all") );

						thisSelection.setT90_0To30(rs.getString("t90_0to30") == null ? -1 : rs.getDouble("t90_0to30") );
						thisSelection.setT90_31To60(rs.getString("t90_31to60") == null ? -1 : rs.getDouble("t90_31to60") );
						thisSelection.setT90_61To90(rs.getString("t90_61to90") == null ? -1 : rs.getDouble("t90_61to90") );
						thisSelection.setT90_91To180(rs.getString("t90_91to180") == null ? -1 : rs.getDouble("t90_91to180") );
						thisSelection.setT90_181To365(rs.getString("t90_181to365") == null ? -1 : rs.getDouble("t90_181to365") );
						thisSelection.setT90_366Plus(rs.getString("t90_366plus") == null ? -1 : rs.getDouble("t90_366plus") );
						thisSelection.setT90_all(rs.getString("t90_all") == null ? -1 : rs.getDouble("t90_all") );

						thisSelection.setT180_0To30(rs.getString("t180_0to30") == null ? -1 : rs.getDouble("t180_0to30") );
						thisSelection.setT180_31To60(rs.getString("t180_31to60") == null ? -1 : rs.getDouble("t180_31to60") );
						thisSelection.setT180_61To90(rs.getString("t180_61to90") == null ? -1 : rs.getDouble("t180_61to90") );
						thisSelection.setT180_91To180(rs.getString("t180_91to180") == null ? -1 : rs.getDouble("t180_91to180") );
						thisSelection.setT180_181To365(rs.getString("t180_181to365") == null ? -1 : rs.getDouble("t180_181to365") );
						thisSelection.setT180_366Plus(rs.getString("t180_366plus") == null ? -1 : rs.getDouble("t180_366plus") );
						thisSelection.setT180_all(rs.getString("t180_all") == null ? -1 : rs.getDouble("t180_all") );

						thisSelection.setT365_0To30(rs.getString("t365_0to30") == null ? -1 : rs.getDouble("t365_0to30") );
						thisSelection.setT365_31To60(rs.getString("t365_31to60") == null ? -1 : rs.getDouble("t365_31to60") );
						thisSelection.setT365_61To90(rs.getString("t365_61to90") == null ? -1 : rs.getDouble("t365_61to90") );
						thisSelection.setT365_91To180(rs.getString("t365_91to180") == null ? -1 : rs.getDouble("t365_91to180") );
						thisSelection.setT365_181To365(rs.getString("t365_181to365") == null ? -1 : rs.getDouble("t365_181to365") );
						thisSelection.setT365_366Plus(rs.getString("t365_366plus") == null ? -1 : rs.getDouble("t365_366plus") );
						thisSelection.setT365_all(rs.getString("t365_all") == null ? -1 : rs.getDouble("t365_all") );
						
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

			//Abandoned, to be removed 12/18/15
			//for (int thisFilterNo = 0 ; thisFilterNo < activeFilters.filters.size(); thisFilterNo++ ) {
			//	this.addFilter(selectionListTable.get(activeFilters.filters.get(thisFilterNo).filterName));
			//}
			
			this.addMessage("Rows returned: " + rowsReturned + " , periodname is " + this.periodName);
			
			

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
