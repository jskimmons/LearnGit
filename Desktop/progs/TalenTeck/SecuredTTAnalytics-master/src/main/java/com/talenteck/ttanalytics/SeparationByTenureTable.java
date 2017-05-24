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

public class SeparationByTenureTable {

	ArrayList<SeparationByTenureTableRow> rows;
	Messages messages;

	public void setRows(ArrayList<SeparationByTenureTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<SeparationByTenureTableRow> getRows() {
		return rows;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(SeparationByTenureTableRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<SeparationByTenureTableRow>();
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

		SeparationByTenureTableRow thisRow = null;
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

		
		String query = "SELECT    t30_0to30 , t30_31to60 ,  t30_61to90 ,  t30_91to180 ,  t30_181to365 ,  t30_366plus ,  t30_all ," +
			    " t60_0to30 ,  t60_31to60 ,  t60_61to90 ,  t60_91to180 ,  t60_181to365 ,  t60_366plus ,  t60_all ," +
			    " t90_0to30 ,  t90_31to60 ,  t90_61to90 ,  t90_91to180 ,  t90_181to365 ,  t90_366plus ,  t90_all ," +
			    " t180_0to30 ,  t180_31to60 ,  t180_61to90 ,  t180_91to180 ,  t180_181to365 ,  t180_366plus ,  t180_all ," +
			    " t365_0to30 ,  t365_31to60 ,  t365_61to90 ,  t365_91to180 ,  t365_181to365 ,  t365_366plus , t365_all ," +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 , periodname "  + 
			    " FROM separationbytenure;";
		
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

					
				thisRow = new SeparationByTenureTableRow();
				thisRow.setSelectorValues(selectorValues);
				thisRow .setT30_0To30(rs.getString("t30_0to30") == null ? -1 : rs.getDouble("t30_0to30") );
				thisRow .setT30_31To60(rs.getString("t30_31to60") == null ? -1 : rs.getDouble("t30_31to60") );
				thisRow.setT30_61To90(rs.getString("t30_61to90") == null ? -1 : rs.getDouble("t30_61to90") );
				thisRow.setT30_91To180(rs.getString("t30_91to180") == null ? -1 : rs.getDouble("t30_91to180") );
				thisRow.setT30_181To365(rs.getString("t30_181to365") == null ? -1 : rs.getDouble("t30_181to365") );
				thisRow.setT30_366Plus(rs.getString("t30_366plus") == null ? -1 : rs.getDouble("t30_366plus") );
				thisRow.setT30_all(rs.getString("t30_all") == null ? -1 : rs.getDouble("t30_all") );

				thisRow.setT60_0To30(rs.getString("t60_0to30") == null ? -1 : rs.getDouble("t60_0to30") );
				thisRow.setT60_31To60(rs.getString("t60_31to60") == null ? -1 : rs.getDouble("t60_31to60") );
				thisRow.setT60_61To90(rs.getString("t60_61to90") == null ? -1 : rs.getDouble("t60_61to90") );
				thisRow.setT60_91To180(rs.getString("t60_91to180") == null ? -1 : rs.getDouble("t60_91to180") );
				thisRow.setT60_181To365(rs.getString("t60_181to365") == null ? -1 : rs.getDouble("t60_181to365") );
				thisRow.setT60_366Plus(rs.getString("t60_366plus") == null ? -1 : rs.getDouble("t60_366plus") );
				thisRow.setT60_all(rs.getString("t60_all") == null ? -1 : rs.getDouble("t60_all") );

				thisRow.setT90_0To30(rs.getString("t90_0to30") == null ? -1 : rs.getDouble("t90_0to30") );
				thisRow.setT90_31To60(rs.getString("t90_31to60") == null ? -1 : rs.getDouble("t90_31to60") );
				thisRow.setT90_61To90(rs.getString("t90_61to90") == null ? -1 : rs.getDouble("t90_61to90") );
				thisRow.setT90_91To180(rs.getString("t90_91to180") == null ? -1 : rs.getDouble("t90_91to180") );
				thisRow.setT90_181To365(rs.getString("t90_181to365") == null ? -1 : rs.getDouble("t90_181to365") );
				thisRow.setT90_366Plus(rs.getString("t90_366plus") == null ? -1 : rs.getDouble("t90_366plus") );
				thisRow.setT90_all(rs.getString("t90_all") == null ? -1 : rs.getDouble("t90_all") );

				thisRow.setT180_0To30(rs.getString("t180_0to30") == null ? -1 : rs.getDouble("t180_0to30") );
				thisRow.setT180_31To60(rs.getString("t180_31to60") == null ? -1 : rs.getDouble("t180_31to60") );
				thisRow.setT180_61To90(rs.getString("t180_61to90") == null ? -1 : rs.getDouble("t180_61to90") );
				thisRow.setT180_91To180(rs.getString("t180_91to180") == null ? -1 : rs.getDouble("t180_91to180") );
				thisRow.setT180_181To365(rs.getString("t180_181to365") == null ? -1 : rs.getDouble("t180_181to365") );
				thisRow.setT180_366Plus(rs.getString("t180_366plus") == null ? -1 : rs.getDouble("t180_366plus") );
				thisRow.setT180_all(rs.getString("t180_all") == null ? -1 : rs.getDouble("t180_all") );

				thisRow.setT365_0To30(rs.getString("t365_0to30") == null ? -1 : rs.getDouble("t365_0to30") );
				thisRow.setT365_31To60(rs.getString("t365_31to60") == null ? -1 : rs.getDouble("t365_31to60") );
				thisRow.setT365_61To90(rs.getString("t365_61to90") == null ? -1 : rs.getDouble("t365_61to90") );
				thisRow.setT365_91To180(rs.getString("t365_91to180") == null ? -1 : rs.getDouble("t365_91to180") );
				thisRow.setT365_181To365(rs.getString("t365_181to365") == null ? -1 : rs.getDouble("t365_181to365") );
				thisRow.setT365_366Plus(rs.getString("t365_366plus") == null ? -1 : rs.getDouble("t365_366plus") );
				thisRow.setT365_all(rs.getString("t365_all") == null ? -1 : rs.getDouble("t365_all") );
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
