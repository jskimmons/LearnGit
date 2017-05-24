package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
//import java.util.ArrayList;
import java.sql.Statement;

public class StructuredDataParameters {

	int firstMonth , firstYear , lastMonth , lastYear;
	
	StructuredDataParameters(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;
		
		int startdateMonth , startdateYear , enddateMonth , enddateYear;
		
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
			st = con.prepareStatement("SELECT startdate , enddate FROM modelling;");
			rs = st.executeQuery();
			if(rs.next()) {
				//Parse them all first, so that parent is not altered if there is an exception
					startdateYear = Integer.parseInt(rs.getString(1).substring(0,4));
					startdateMonth = Integer.parseInt(rs.getString(1).substring(5,7));
					enddateYear = Integer.parseInt(rs.getString(2).substring(0,4));
					enddateMonth = Integer.parseInt(rs.getString(2).substring(5,7));

					this.firstMonth = startdateMonth;
					this.firstYear = startdateYear;
					this.lastMonth = enddateMonth;
					this.lastYear = enddateYear;
			
			}

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
		} catch (SQLException fetchDateQueryException) {
			throw new Exception("Error when fetching dates: " + fetchDateQueryException.getMessage());
		}

		
	}
	
	public static String getModelID(String database ) throws Exception {
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		String modelID = null;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		try {

			// The newInstance() call is a work around for some
			// broken Java implementations

			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception openException) {
			Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
			throw driverInitException;
		}

		try {
			con = DriverManager.getConnection(url, user, password);
			st = con.createStatement();
			rs = st.executeQuery("SELECT modelid FROM modelling GROUP BY modelid;");

			if(rs.next()) {
				modelID = rs.getString(1);
			}
			if(rs.next()) {
				throw new Exception("There seems to be more than one model ID in the dataset.");
			}

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
				Exception rethrownCloseException = new Exception("Closing SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}

			return modelID;
			
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed: " + queryException.getMessage());
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

}
