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

public class RobustnessTable {

	ArrayList<RobustnessTableRow> rows;
	Messages messages;
	
	public void setRows(ArrayList<RobustnessTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<RobustnessTableRow> getRows() {
		return rows;
	}
	

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(RobustnessTableRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<RobustnessTableRow>();
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
			periodTable = PeriodListRobustness.periodTable(database);
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
						this.period = new PeriodRobustness();
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
		Hashtable<String,ArrayList<RobustnessQuantile>> selections = new Hashtable<String,ArrayList<RobustnessQuantile>>();
		ArrayList<RobustnessQuantile> thisSelectionQuantiles;
		RobustnessQuantile thisQuantile = null;
		RobustnessTableRow thisTableRow = null;
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

		String query = "SELECT quantile , mpt30 , mt30 , nt30 , tt30 , mpt60 , mt60 , nt60 , tt60 , " +
				"mpt90 , mt90 , nt90 , tt90 , mpt180 , mt180 , nt180 , tt180 , mpt365 , mt365 , nt365 , tt365 ," +
				" filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname "  + 
			    " FROM robustness;";
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {

				selectorValues = new ArrayList<SelectorSelection>();
				thisSelection = new SelectorSelection();
				thisSelection.selectorName = "periodName";
				thisSelection.selectorValue = rs.getString("periodname");
				selectorValues.add(thisSelection);
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
					thisSelectionQuantiles = new ArrayList<RobustnessQuantile>();
					selections.put(gson.toJson(selectorValues), thisSelectionQuantiles);
				}

				thisQuantile = new RobustnessQuantile();
				thisQuantile.quantileNumber = rs.getInt("quantile");
				thisQuantile.nt30 = rs.getInt("nt30");
				thisQuantile.mpt30 = rs.getDouble("mpt30");
				thisQuantile.mt30 = rs.getDouble("mt30");
				thisQuantile.tt30 = rs.getDouble("tt30");
				thisQuantile.nt60 = rs.getInt("nt60");
				thisQuantile.mpt60 = rs.getDouble("mpt60");
				thisQuantile.mt60 = rs.getDouble("mt60");
				thisQuantile.tt60 = rs.getDouble("tt60");
				thisQuantile.nt90 = rs.getInt("nt90");
				thisQuantile.mpt90 = rs.getDouble("mpt90");
				thisQuantile.mt90 = rs.getDouble("mt90");
				thisQuantile.tt90 = rs.getDouble("tt90");
				thisQuantile.nt180 = rs.getInt("nt180");
				thisQuantile.mpt180 = rs.getDouble("mpt180");
				thisQuantile.mt180 = rs.getDouble("mt180");
				thisQuantile.tt180 = rs.getDouble("tt180");
				thisQuantile.nt365 = rs.getInt("nt365");
				thisQuantile.mpt365 = rs.getDouble("mpt365");
				thisQuantile.mt365 = rs.getDouble("mt365");
				thisQuantile.tt365 = rs.getDouble("tt365");
				
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
			thisTableRow = new RobustnessTableRow();
			thisTableRow.hasObservations = false;
			thisTableRow.setSelectorValues(selectorValues);
			thisSelectionQuantiles = selections.get(selectorValuesString);
			if (thisSelectionQuantiles == null ) {
				throw new Exception("Failed to find entry:" + selectorValuesString);				
			}
			for ( int thisQuantileNo = 0 ; thisQuantileNo < thisSelectionQuantiles.size() ; thisQuantileNo++ ) {
				if ( thisSelectionQuantiles.get(thisQuantileNo).nt30 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).nt60 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).nt90 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).nt180 > 0 ||
						thisSelectionQuantiles.get(thisQuantileNo).nt365 > 0 ) {
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
