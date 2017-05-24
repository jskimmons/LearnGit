package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;

//import javax.xml.bind.JAXBContext;
//import javax.xml.bind.JAXBException;
//import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;

@XmlRootElement(name="FilterList")
public class FilterList {

	ArrayList<Filter> filters;
	Messages messages;
	
	@XmlElement(name = "Filter")
	public void setFilterList(ArrayList<Filter> filterList) {
		this.filters = filterList;
	}

	public ArrayList<Filter> getFilterList() {
		return this.filters;
	}

	@XmlElement(name = "Messages")
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}	
	
	void addFilter(Filter filter) {
		this.filters.add(filter);
	}
	
	public Hashtable<String,Hashtable<String,String>> toHashtable() {
		
		Hashtable<String,Hashtable<String,String>> returnTable = new Hashtable<String,Hashtable<String,String>>();
		Hashtable<String,String> thisFilterTable = null;
		Filter thisFilter = null;
		
		for (int i = 0 ; i < this.filters.size(); i++ ) {
			thisFilterTable = new Hashtable<String,String>();
			thisFilter = this.filters.get(i);
			for (int j = 0 ; j < thisFilter.filterValues.size(); j++ ) {
				thisFilterTable.put(thisFilter.filterValues.get(j), thisFilter.filterValues.get(j));
			}
			returnTable.put(thisFilter.filterName, thisFilterTable);
		}
		
		return returnTable;
	}
	
	void populate(String database ) throws Exception {
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		ArrayList<Filter> filterList = new ArrayList<Filter>();		
		Filter thisFilter = null;
		
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
			st = con.createStatement();
			rs = st.executeQuery("SELECT modelvariablename , categorylabel from modelling where filterindicator = 1 GROUP BY modelvariablename , categorylabel;");

			String lastVariableName = "";
			while(rs.next()) {
				if (rs.getString(1) != null ) {
					if ( !lastVariableName.equals(rs.getString(1)) ) {
						// If we're not on the first item, add the previous filter to the list, then move on
						if ( !lastVariableName.equals("") ) {
							filterList.add(thisFilter);
						}
						thisFilter = new Filter();
						thisFilter.setFilterName(rs.getString(1));
						thisFilter.addValue("All");
						lastVariableName = rs.getString(1);
					}
					if ( rs.getString(2) != null ) {
						thisFilter.addValue(rs.getString(2));
					}
				}
			}

			//The last one didn't get added yet
			filterList.add(thisFilter);
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			if (con != null) {
				con.close();
			}
		
		this.setFilterList(filterList);
			
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage());
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

	
	public static ArrayList<String> getNames(String database) throws Exception {

		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		ArrayList<String> nameList = new ArrayList<String>();		
		
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
			st = con.createStatement();
			rs = st.executeQuery("SELECT modelvariablename from modelling where filterindicator = 1 GROUP BY modelvariablename;");

			while(rs.next()) {
				nameList.add(rs.getString(1));
			}
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			if (con != null) {
				con.close();
			}
					
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage());
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

		return nameList;
	}

	public static Hashtable<String,String> getNamesAsHashtable(String database) throws Exception {

		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		Hashtable<String,String> nameList = new Hashtable<String,String>();		
		
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
			st = con.createStatement();
			rs = st.executeQuery("SELECT modelvariablename from modelling where filterindicator = 1 GROUP BY modelvariablename;");

			while(rs.next()) {
				if ( rs.getString(1) != null && !("").equals(rs.getString(1)) ) {
					nameList.put(rs.getString(1),rs.getString(1));
				}
			}
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			if (con != null) {
				con.close();
			}
					
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage());
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

		return nameList;
	}

	
}
