package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class PublishedSheetsList {
	
	ArrayList<SheetStatus> sheetStatuses;
	Messages messages;

	public ArrayList<SheetStatus> getSheetStatuses() {
		return sheetStatuses;
	}

	public void setSheetStatuses(ArrayList<SheetStatus> sheetStatuses) {
		this.sheetStatuses = sheetStatuses;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}
	
	public void addStatus(SheetStatus sheetStatus) {
		if ( this.sheetStatuses == null ) {
			this.sheetStatuses = new ArrayList<>();
		}
		this.sheetStatuses.add(sheetStatus);
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
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;
		

		ArrayList<SheetStatus> returnList = new ArrayList<SheetStatus>();
	    boolean matchExists = false;
		
		
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
			
			st = con.prepareStatement("SHOW TABLES LIKE 'publishedsheets'");
			rs = st.executeQuery();

			while(rs.next()) {
				if ( rs.getString(1) != null  && !(rs.getString(1)).isEmpty() ) {
					matchExists = true;
				}
			}

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
		
		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query to determine if table exists.");
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
				/* Just throw original exception */
			}
			throw rethrownQueryException;
		}
		
		/* If table doesn't exist, we just declare nothing published */

		if ( !matchExists ) {
			this.setSheetStatuses(returnList);
			try {
				if (con != null) {
					con.close();
				}
			} catch (SQLException closeSQLException) {
				/* Fugeddaboutit */
			}
			return;
		}

		try {
			
			st = con.prepareStatement("SELECT sheetname , status FROM publishedsheets");
			rs = st.executeQuery();

			while(rs.next()) {
				
				if ( rs.getString("sheetname") != null  && !(rs.getString("sheetname")).isEmpty() ) {
					SheetStatus thisSheetStatus = new SheetStatus();
					thisSheetStatus.setSheetName(rs.getString("sheetname"));
					thisSheetStatus.setPublished(rs.getBoolean("status"));
					returnList.add(thisSheetStatus);
				}
			}
		
		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query to fill table.");
			throw rethrownQueryException;
		} finally {
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
				/* Just throw original exception */
			}

		}

		this.setSheetStatuses(returnList);
	

		
	}
	
	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		this.addMessage(errorMessage);
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  

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

			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

}
