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
import com.google.gson.reflect.TypeToken;

public class DriversTable {

	ArrayList<DriversTableRow> rows;
	Messages messages;

	public void setRows(ArrayList<DriversTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<DriversTableRow> getRows() {
		return rows;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(DriversTableRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<DriversTableRow>();
		}
		this.rows.add(row);
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
		Gson gson = new Gson();


		DriversTableRow thisRow = null;
		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		Hashtable<String,Hashtable<String,Driver>> selections = new Hashtable<String,Hashtable<String,Driver>>();
		Hashtable<String,Driver> thisSelectionTable = null;		
		Driver thisDriver = null;
		DriverCategory thisDriverCategory = null;
		DriversTableRow thisTableRow = null;
		Enumeration selectionEnumeration = null;
		ArrayList<Driver> thisSelectionDrivers = null;
		
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

		
		String query = "SELECT drivername , drivercategory , totalhires , proportion , pt30 , nt30 , tt30 ," +
				" pt60 , nt60 , tt60 , pt90 , nt90 , tt90 , pt180 , nt180 , tt180 , pt365 , nt365 , tt365 ," +
				" filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname , drivertype "  + 
			    " FROM driversummarystatistics;";
		
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
				thisSelection = new SelectorSelection();
				thisSelection.selectorName = "driverType";
				thisSelection.selectorValue = rs.getString("drivertype");
				selectorValues.add(thisSelection);
				
				thisSelectionTable = selections.get(gson.toJson(selectorValues));
				
				if ( thisSelectionTable == null ) {
					thisSelectionTable = new Hashtable<String,Driver>();
					selections.put(gson.toJson(selectorValues), thisSelectionTable);
				}
				
				String thisDriverName = rs.getString("drivername");
				thisDriver = thisSelectionTable.get(thisDriverName);
				if (  thisDriver == null ) {
					thisDriver = new Driver();
					thisDriver.setObservations(0);
					thisDriver.setDriverName(thisDriverName);
					thisSelectionTable.put(thisDriverName, thisDriver);
				}

				thisDriverCategory = new DriverCategory();
				
				thisDriverCategory.categoryValue = rs.getString("drivercategory");
				thisDriverCategory.nt30 = rs.getInt("nt30");
				thisDriverCategory.pt30 = rs.getDouble("pt30");
				thisDriverCategory.tt30 = rs.getDouble("tt30");
				thisDriverCategory.nt60 = rs.getInt("nt60");
				thisDriverCategory.pt60 = rs.getDouble("pt60");
				thisDriverCategory.tt60 = rs.getDouble("tt60");
				thisDriverCategory.nt90 = rs.getInt("nt90");
				thisDriverCategory.pt90 = rs.getDouble("pt90");
				thisDriverCategory.tt90 = rs.getDouble("tt90");
				thisDriverCategory.nt180 = rs.getInt("nt180");
				thisDriverCategory.pt180 = rs.getDouble("pt180");
				thisDriverCategory.tt180 = rs.getDouble("tt180");
				thisDriverCategory.nt365 = rs.getInt("nt365");
				thisDriverCategory.pt365 = rs.getDouble("pt365");
				thisDriverCategory.tt365 = rs.getDouble("tt365");
				thisDriverCategory.proportion = rs.getDouble("proportion");
				thisDriver.observations += rs.getInt("totalhires");
				thisDriver.addCategoryValue(thisDriverCategory);
				
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
			thisTableRow = new DriversTableRow();
			thisTableRow.hasObservations = false;
			thisTableRow.setSelectorValues(selectorValues);
			thisSelectionTable = selections.get(selectorValuesString);
			if (thisSelectionTable == null ) {
				throw new Exception("Failed to find entry:" + selectorValuesString);				
			}
			try {
				thisSelectionDrivers = new ArrayList<Driver>(thisSelectionTable.values());				
			} catch (Exception nullDriverException) {
				throw new Exception("Driver hash has no elements.");
			}
			for ( int thisDriverNo = 0 ; thisDriverNo < thisSelectionDrivers.size() ; thisDriverNo++ ) {
				if ( thisSelectionDrivers.get(thisDriverNo).observations > 0 ) {
					thisTableRow.hasObservations = true;
				}
			}
			thisTableRow.setDrivers(thisSelectionDrivers);
			this.addRow(thisTableRow);
						
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
