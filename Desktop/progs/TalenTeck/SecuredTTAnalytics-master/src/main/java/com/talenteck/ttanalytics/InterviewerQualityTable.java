package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class InterviewerQualityTable {

	ArrayList<InterviewerQualityTableRow> rows;
	Messages messages;
	
	public void setRows(ArrayList<InterviewerQualityTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<InterviewerQualityTableRow> getRows() {
		return rows;
	}
	

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(InterviewerQualityTableRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<InterviewerQualityTableRow>();
		}
		this.rows.add(row);
	}


	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}
	
	//No longer used, could be discarded
	/*public void populateSelectorsFromJSON(String json, String database ) throws Exception {
		
		Gson gson = new Gson();
		Hashtable<String,String> periodTable = null;
		Hashtable<String,Hashtable<String,String>> compareHash = null;
		Hashtable<String,String> thisFilterHash = null;
		FilterSelection thisFilterSelection = null;
		ArrayList<SelectorSelection> selectionList = null;
		String thisSelectorName = "";
		
		FilterList compareList = new FilterList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		compareHash = compareList.toHashtable();
		
		try {
			periodTable = PeriodListInterviewerQuality.periodTable(database);
		} catch(Exception fetchPeriodsException) {
			throw new Exception("Error fetching list of valid periods.");			
		}
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());
		} catch(Exception jsonException) { throw new Exception("Error parsing JSON: " + jsonException.getMessage()); }


		for (int j = 0 ; j < selectionList.size() ; j++ ) {
			thisSelectorName =  selectionList.get(j).selectorName;
			switch (selectionList.get(j).selectorName) {
				case "period":
					if ( periodTable.containsKey(selectionList.get(j).selectorValue) ) {
						this.period = new PeriodInterviewerQuality();
						this.period.periodName = selectionList.get(j).selectorValue;
						if ( periodTable.get(selectionList.get(j).selectorValue) != null ) {
							this.period.periodLabel = periodTable.get(selectionList.get(j).selectorValue);
						}
					}
					else {
						throw new Exception("Invalid period specified: " + selectionList.get(j).selectorValue);
					}
					break;
				default:
					if ( compareHash.containsKey(selectionList.get(j).selectorName) ) {
						thisFilterHash = compareHash.get(selectionList.get(j).selectorName);
						try {
						if ( thisFilterHash.containsKey(selectionList.get(j).selectorValue)) {
							thisFilterSelection = new FilterSelection();
							thisFilterSelection.setFilterName(selectionList.get(j).selectorName);
							thisFilterSelection.setFilterValue(selectionList.get(j).selectorValue);					
							this.addFilterSelection(thisFilterSelection);							
						}
						else {
							throw new Exception("Invalid filter value " + selectionList.get(j).selectorValue
									+ " for filter " + selectionList.get(j).selectorName );
						}
						} catch(Exception thisException) { throw new Exception("Selector was " + thisSelectorName + ", error was " + thisException.getMessage());}
					}
					else {
						throw new Exception("Invalid selector name " + selectionList.get(j).selectorName);
					}
				break;
					
			}
		}		
	}*/

	
	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();


		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		Hashtable<String,ArrayList<InterviewerQualityQuantile>> selections = new Hashtable<String,ArrayList<InterviewerQualityQuantile>>();
		ArrayList<InterviewerQualityQuantile> thisSelectionQuantiles;
		InterviewerQualityQuantile thisQuantile = null;
		InterviewerQualityTableRow thisTableRow = null;
		Enumeration selectionEnumeration = null;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		
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

		String query = 	"SELECT quantile , meant30 , expectedt30 , t30premium ,meant60 , expectedt60 , t60premium , " + 
						"meant90 , expectedt90 , t90premium , meant180 , expectedt180 , t180premium , meant365 , expectedt365 , t365premium , " +
						" filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
						" filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
						" FROM interviewerquality;";
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {

				selectorValues = new ArrayList<SelectorSelection>();
				/*No period selector for this table
				 * 
				 * thisSelection = new SelectorSelection();
				 * thisSelection.selectorName = "periodName";
				 * thisSelection.selectorValue = rs.getString("periodname");
				 * selectorValues.add(thisSelection); */
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null  ) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}
				
				thisSelectionQuantiles = selections.get(gson.toJson(selectorValues));
				
				if ( thisSelectionQuantiles == null ) {
					thisSelectionQuantiles = new ArrayList<InterviewerQualityQuantile>();
					selections.put(gson.toJson(selectorValues), thisSelectionQuantiles);
				}

				thisQuantile = new InterviewerQualityQuantile();
				thisQuantile.quantileNumber = rs.getInt("quantile");
				thisQuantile.meant30 = rs.getDouble("meant30");
				thisQuantile.expectedt30 = rs.getDouble("expectedt30");
				thisQuantile.t30premium = rs.getDouble("t30premium");

				thisQuantile.meant60 = rs.getDouble("meant60");
				thisQuantile.expectedt60 = rs.getDouble("expectedt60");
				thisQuantile.t60premium = rs.getDouble("t60premium");

				thisQuantile.meant90 = rs.getDouble("meant90");
				thisQuantile.expectedt90 = rs.getDouble("expectedt90");
				thisQuantile.t90premium = rs.getDouble("t90premium");

				thisQuantile.meant180 = rs.getDouble("meant180");
				thisQuantile.expectedt180 = rs.getDouble("expectedt180");
				thisQuantile.t180premium = rs.getDouble("t180premium");

				thisQuantile.meant365 = rs.getDouble("meant365");
				thisQuantile.expectedt365 = rs.getDouble("expectedt365");
				thisQuantile.t365premium = rs.getDouble("t365premium");

				thisSelectionQuantiles.add(thisQuantile);
				
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

	
		selectionEnumeration = selections.keys();
		while ( selectionEnumeration.hasMoreElements()) {
			

			String selectorValuesString = (String) selectionEnumeration.nextElement();
			try {
				selectorValues = gson.fromJson(selectorValuesString, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());				
			} catch (Exception jsonException ) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);
			}
			if (selectorValues == null ) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);				
			}
			thisTableRow = new InterviewerQualityTableRow();
			thisTableRow.hasObservations = false;
			thisTableRow.setSelectorValues(selectorValues);
			thisSelectionQuantiles = selections.get(selectorValuesString);
			if (thisSelectionQuantiles == null ) {
				throw new Exception("Failed to find entry:" + selectorValuesString);				
			}
			for ( int thisQuantileNo = 0 ; thisQuantileNo < thisSelectionQuantiles.size() ; thisQuantileNo++ ) {
				if ( thisSelectionQuantiles.get(thisQuantileNo).meant30 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).meant60 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).meant90 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).meant180 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).meant365 > 0 ) {
					thisTableRow.hasObservations = true;
				}
			}
			thisTableRow.setQuantiles(thisSelectionQuantiles);
			this.addRow(thisTableRow);
						
		}
			

	}
	
	
	
	
	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		this.addMessage(errorMessage);
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	
}
