package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class PeriodListReports {
	
	String defaultValue;
	ArrayList<PeriodReports> periods;
	Messages messages;
	
	@XmlElement(name = "DefaultValue")
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
	
	String getDefaultValue(){
		return this.defaultValue;
	}
	
	@XmlElement(name = "Period")
	public void setPeriodList(ArrayList<PeriodReports> periodList) {
		this.periods = periodList;
	}

	public ArrayList<PeriodReports> getPeriodList() {
		return this.periods;
	}

	@XmlElement(name = "Messages")
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}
	
	public void addPeriod(PeriodReports period) {
		if ( this.periods == null ) {
			this.periods = new ArrayList<PeriodReports>();
		}
		this.periods.add(period);
	}
	
	
	public static Hashtable<String,String> periodTable(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;
		
		Hashtable<String,String> returnTable = new Hashtable<String,String>();
		
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


		String query = "SELECT periodname , periodlabel FROM reports GROUP BY periodname;";
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {
				if ( rs.getString("periodname") != null ) {
					returnTable.put(rs.getString("periodname"), rs.getString("periodlabel"));					
				}
			}

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			
			return returnTable;

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

	
	public void populate(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

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


		String query = "SELECT periodname , periodlabel FROM reports GROUP BY periodname DESC;";
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			boolean defaultValueSet = false;
			while (rs.next() ) {
				if ( rs.getString("periodname") != null ) {
					if ( !defaultValueSet) {
						this.setDefaultValue(rs.getString("periodname"));
						defaultValueSet = true;
					}
					PeriodReports thisPeriod = new PeriodReports();
					thisPeriod.setPeriodLabel(rs.getString("periodlabel"));
					thisPeriod.setPeriodName(rs.getString("periodname"));
					this.addPeriod(thisPeriod);
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
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}


}
