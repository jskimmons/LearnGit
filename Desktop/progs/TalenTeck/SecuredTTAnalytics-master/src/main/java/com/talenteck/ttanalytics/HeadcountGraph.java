package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.google.gson.Gson;

public class HeadcountGraph {
	
	ArrayList<HeadcountGraphRow> rows;
	Messages messages;

	public void setRows(ArrayList<HeadcountGraphRow> rows) {
		this.rows = rows;
	}

	public ArrayList<HeadcountGraphRow> getRows() {
		return rows;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(HeadcountGraphRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<HeadcountGraphRow>();
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

		HeadcountGraphRow thisRow = null;
		HeadcountGraphRow thisRowCopy = null;
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

		
		String query = "SELECT   startemployment , hires , terminations , seatturnover , " +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname , periodyear "  + 
			    " FROM employees WHERE periodyear != '0';";
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {

				selectorValues = new ArrayList<SelectorSelection>();
				thisSelection = new SelectorSelection();
				thisSelection.selectorName = "periodName";
				thisSelection.selectorValue = rs.getString("periodyear");
				selectorValues.add(thisSelection);
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null  ) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}

					
				thisRow = new HeadcountGraphRow();
				thisRow.setSelectorValues(selectorValues);
				thisRow.setYear(rs.getInt("periodyear"));
				thisRow.setMonth(Integer.parseInt(rs.getString("periodname").substring(5, 7)));
				thisRow.setStartEmployment(rs.getString("startemployment") == null ? -1 : rs.getInt("startemployment") );
				thisRow.setHires(rs.getString("hires") == null ? -1 : rs.getInt("hires") );
				thisRow.setTerminations(rs.getString("terminations") == null ? -1 : rs.getInt("terminations") );
				thisRow.setSeatTurnover(rs.getString("seatturnover") == null ? -1 : rs.getDouble("seatturnover") );
				this.addRow(thisRow);

				// Has to be entered twice, once for its year and again for the "All" period

				selectorValues = new ArrayList<SelectorSelection>();
				thisSelection = new SelectorSelection();
				thisSelection.selectorName = "periodName";
				thisSelection.selectorValue = "All";
				selectorValues.add(thisSelection);
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null  ) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}
					
				thisRowCopy = new HeadcountGraphRow(thisRow);
				thisRowCopy.setSelectorValues(selectorValues);
				this.addRow(thisRowCopy);

				
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
