package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.google.gson.Gson;

public class ApplicantGraph {
	
	ArrayList<ApplicantGraphRow> rows;
	Messages messages;

	public void setRows(ArrayList<ApplicantGraphRow> rows) {
		this.rows = rows;
	}

	public ArrayList<ApplicantGraphRow> getRows() {
		return rows;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(ApplicantGraphRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<ApplicantGraphRow>();
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

		ApplicantGraphRow thisRow = null;
		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		
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

		
		String query = "SELECT    applied , offered , accepted , hired , offerrate , appliedacceptrate , offeredacceptrate , employrate ," +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname "  + 
			    " FROM applicant;";
		
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

					
				thisRow = new ApplicantGraphRow();
				thisRow.setSelectorValues(selectorValues);
				thisRow.setApplied(rs.getString("applied") == null ? -1 : rs.getInt("applied") );
				thisRow.setOffered(rs.getString("offered") == null ? -1 : rs.getInt("offered") );
				thisRow.setAccepted(rs.getString("accepted") == null ? -1 : rs.getInt("accepted") );
				thisRow.setHired(rs.getString("hired") == null ? -1 : rs.getInt("hired") );
				thisRow.setOfferRate(rs.getString("offerrate") == null ? -1 : rs.getDouble("offerrate") );
				thisRow.setAppliedAcceptRate(rs.getString("appliedacceptrate") == null ? -1 : rs.getDouble("appliedacceptrate") );
				thisRow.setOfferedAcceptRate(rs.getString("offeredacceptrate") == null ? -1 : rs.getDouble("offeredacceptrate") );
				thisRow.setEmployRate(rs.getString("employrate") == null ? -1 : rs.getDouble("employrate") );
				this.addRow(thisRow);

				
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
