package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;

public class Driver {
	
	String driverName;
	String driverType;
	String driverLabel;
	Integer observations;
	Double influencet30;
	Double influencet60;
	Double influencet90;
	Double influencet180;
	Double influencet365;
	ArrayList<DriverCategory> categoryValues;
	
	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}
	
	String getDriverName(){
		return this.driverName;
	}

	public void setDriverType(String driverType) {
		this.driverType = driverType;
	}
	
	String getDriverType(){
		return this.driverType;
	}

	public void setDriverLabel(String driverLabel) {
		this.driverLabel = driverLabel;
	}
	
	String getDriverLabel(){
		return this.driverLabel;
	}

	public void setObservations(Integer observations) {
		this.observations = observations;
	}
	
	Integer getObservations(){
		return this.observations;
	}

	public void setCategoryValues(ArrayList<DriverCategory> categoryValues) {
		this.categoryValues = categoryValues;
	}

	public Double getInfluencet30() {
		return influencet30;
	}

	public void setInfluencet30(Double influencet30) {
		this.influencet30 = influencet30;
	}

	public Double getInfluencet60() {
		return influencet60;
	}

	public void setInfluencet60(Double influencet60) {
		this.influencet60 = influencet60;
	}

	public Double getInfluencet90() {
		return influencet90;
	}

	public void setInfluencet90(Double influencet90) {
		this.influencet90 = influencet90;
	}

	public Double getInfluencet180() {
		return influencet180;
	}

	public void setInfluencet180(Double influencet180) {
		this.influencet180 = influencet180;
	}

	public Double getInfluencet365() {
		return influencet365;
	}

	public void setInfluencet365(Double influencet365) {
		this.influencet365 = influencet365;
	}


	
	ArrayList<DriverCategory> getCategoryValues(){
		return this.categoryValues;
	}

	public void addCategoryValue(DriverCategory categoryValue) {
		if ( this.categoryValues == null ) {
			this.categoryValues = new ArrayList<DriverCategory>();
		}
		this.categoryValues.add(categoryValue);
	}

	

	

	
	public static Hashtable<String,String> getListAsTable(String database) throws Exception {
		
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		Hashtable<String,String> returnTable = new Hashtable<String,String>();
		
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
			rs = st.executeQuery("SELECT modelvariablename FROM modelling  where activeindicator = 1 AND filterindicator != 1 GROUP BY modelvariablename;");

			while(rs.next()) {
				if ( rs.getString(1) != null & !("null").equals(rs.getString(1)) ) {
					returnTable.put(rs.getString(1), rs.getString(1));
				}
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
				Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}

			return returnTable;
			
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed: db is" + url); // + queryException.getMessage()
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

	public static ArrayList<String> getList(String database) throws Exception {
		
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		ArrayList<String> returnList= new ArrayList<String>();
		
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
			rs = st.executeQuery("SELECT modelvariablename FROM modelling  where activeindicator = 1 AND filterindicator != 1 GROUP BY modelvariablename;");

			while(rs.next()) {
				if ( rs.getString(1) != null & !("null").equals(rs.getString(1)) ) {
					returnList.add(rs.getString(1));
				}
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
				Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}

			return returnList;
			
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed: db is" + url); // + queryException.getMessage()
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
	
	
	public static Hashtable<String,String> getTypes(String database ) throws Exception {
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		Hashtable<String,String> returnTable = new Hashtable<String,String>();		
		
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
			rs = st.executeQuery("SELECT drivertype from modelling where activeindicator = 1 AND filterindicator = 0 GROUP BY drivertype;");

			while(rs.next()) {
				if ( rs.getString(1) != null && !("").equals(rs.getString(1)) ) {
					returnTable.put(rs.getString(1),rs.getString(1));
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
			
			return returnTable;
					
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
				Exception rethrownCloseException = new Exception("SQL query failed on close too:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}
			throw rethrownQueryException;

		}

	}


	public static Hashtable<String,String[]> typesAndLabels(String database ) throws Exception {
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		Hashtable<String,String[]> returnTable = new Hashtable<String,String[]>();		
		
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
			rs = st.executeQuery("SELECT modelvariablename , drivertype , variablelabel from modelling where activeindicator = 1 AND filterindicator = 0 GROUP BY modelvariablename;");

			while(rs.next()) {
				if ( rs.getString(1) != null && !("").equals(rs.getString(1)) ) {
					returnTable.put(rs.getString(1),new String[]{rs.getString(2),rs.getString(3)});
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
			
			return returnTable;
					
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
				Exception rethrownCloseException = new Exception("SQL query failed on close too:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}
			throw rethrownQueryException;

		}

	}
	
	public static Hashtable<String,String> getTypeLabels() {
		Hashtable<String,String> returnTable = new Hashtable<String,String>();
		
		returnTable.put("Education","Education");
		returnTable.put("Demographics","Demographics");
		returnTable.put("ELM","External Labor Markets");
		returnTable.put("Mobility","Mobility Patterns");
		returnTable.put("Employment","Employment Characteristics");
		returnTable.put("Entry","Entry Channel");
		returnTable.put("PriorPresence","Prior Application History");
		returnTable.put("Interview","Interview Assessment");
		returnTable.put("Interviewer","Interviewer Quality");
		returnTable.put("Assessments","Application Assessments");
		
		return returnTable;

	}


	
}
