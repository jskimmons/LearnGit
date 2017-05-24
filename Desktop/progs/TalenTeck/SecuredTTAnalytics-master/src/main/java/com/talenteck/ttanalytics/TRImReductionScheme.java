package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Hashtable;


public class TRImReductionScheme {
	
	
	public static Boolean exists(String database) throws Exception {
		
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
			Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
			throw driverInitException;
		}

		try {
			con = DriverManager.getConnection(url, user, password);
			st = con.prepareStatement("SHOW TABLES LIKE 'trimschemes'");
		      rs = st.executeQuery();

		    Boolean matchExists = false;
		      
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
			if (con != null) {
				con.close();
			}
			
			return matchExists;
			
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
				throw new Exception("SQL query failed:" + closeSQLException.getMessage());
			}
			throw rethrownQueryException;

		}

		
	}
	
	
    public static Boolean isUpToDate(String filterDatabase) throws Exception {       
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        Integer configurationModelID = null; 
        Integer trimModelID = null; 
         
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;

        
        try {

            if ( !TRImReductionScheme.exists(filterDatabase)) {
                return false;
            }

        } catch (Exception openException) {
            throw new Exception("Failure to confirm if dataset exists."); 
        }
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
            st = con.prepareStatement("SELECT modelid from triminput GROUP BY modelid");
              rs = st.executeQuery();
              
            if(rs.next() && rs.getString(1) != null  && !(rs.getString(1)).isEmpty() ) {
                configurationModelID = Integer.parseInt(rs.getString(1));
            }
            else {
                throw new Exception("Unable to fetch model ID from configuration table.  Does it exist?");
            }

            if (rs != null) {
                rs.close();
            }
            if (st != null) {
                st.close();
            }

            st = con.prepareStatement("SELECT modelid from trimschemes GROUP BY modelid");
              rs = st.executeQuery();
              
            if(rs.next() && rs.getString(1) != null  && !(rs.getString(1)).isEmpty() ) {
                trimModelID = Integer.parseInt(rs.getString(1));
            }
            else {
                return false;
            }

            if (rs != null) {
                rs.close();
            }
            if (st != null) {
                st.close();
            }

            return ( configurationModelID - trimModelID == 0 );
            
        } catch (SQLException queryException) {
            Exception rethrownQueryException = new Exception("Database error attempting to fetch configuration model ID: " + queryException.getMessage().replaceAll("'","`"));
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
                throw new Exception("Database error attempting to fetch configuration model ID and also closing: " + queryException.getMessage().replaceAll("'","`"));
            }
            throw rethrownQueryException;
        }
    }


	
	
	public static Hashtable<String,Double> fetchAsHashTable(String database , String filterValue ) throws Exception {

        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;

		Hashtable<String,Double> returnTable = new Hashtable<String,Double>();
		
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
            st = con.prepareStatement("SELECT categorylabel , reduction FROM trimschemes WHERE schemelabel = ?;");
            st.setString(1, filterValue);
            rs = st.executeQuery();
            
            while(rs.next()) {
                if ( rs.getString("categorylabel") != null && !("").equals(rs.getString("categorylabel").trim()) &&
                		rs.getString("reduction") != null && !("").equals(rs.getString("reduction").trim())) {
                	returnTable.put(rs.getString("categorylabel"), rs.getDouble("reduction"));
                }
            }
        } catch (SQLException queryException) {
            Exception rethrownQueryException = new Exception("SQL query failed: Exception is " + queryException.getMessage().replaceAll("'","`"));
            throw rethrownQueryException;
        }finally{
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
        }
        
        return returnTable;
	}

}
