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

public class InterviewerQualitySelectorValues {
	
	ArrayList<ArrayList<SelectorSelection>> selections;
	Messages messages;

	public void setSelections(ArrayList<ArrayList<SelectorSelection>> selections) {
		this.selections = selections;
	}

	public ArrayList<ArrayList<SelectorSelection>> getSelections() {
		return selections;
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

	public void addSelection(ArrayList<SelectorSelection> selection) {
		if ( this.selections == null ){
			this.selections = new ArrayList<ArrayList<SelectorSelection>>();
		}
		this.selections.add(selection);
	}

	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();

		DriversTableRow thisRow = null;
		ArrayList<SelectorSelection> selectorValues;
		ArrayList<SelectorSelection> thisSelectionArray;
		SelectorSelection thisSelection = null;
		Hashtable<String,ArrayList<SelectorSelection>> selectionsHash = new Hashtable<String,ArrayList<SelectorSelection>>();
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

		
		String query = "SELECT nt30 , nt60 , nt90 , nt180 , nt365 ," +
				" filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname "  + 
			    " FROM interviewerquality;";
		
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
				
				if ( selectionsHash.get(gson.toJson(selectorValues)) == null ) {
					if ( rs.getString("nt30") != null && 
							(rs.getInt("nt30") > 0 || 
							rs.getInt("nt30") > 0 || 
							rs.getInt("nt30") > 0 || 
							rs.getInt("nt30") > 0 || 
							rs.getInt("nt30") > 0 )) {
						selectionsHash.put(gson.toJson(selectorValues),selectorValues);
					}
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

		this.setSelections(new ArrayList<ArrayList<SelectorSelection>>(selectionsHash.values()));			

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
