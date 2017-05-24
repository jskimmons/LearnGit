package com.talenteck.ttanalytics;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

public class TRImReductionSchemeList {
	
	ArrayList<String> schemeLabels;
	ArrayList<Hashtable<String,Double>> schemes;
	
	public void populate(String database ) throws Exception {

        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;

		ArrayList<Hashtable<String,Double>> returnList= new ArrayList<Hashtable<String,Double>>();
		ArrayList<String> schemeList = new ArrayList<String>();
		Hashtable<String,Double> thisSchemeTable = null;
		
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
            st = con.prepareStatement("SELECT schemelabel , categorylabel , reduction FROM trimschemes ORDER BY schemelabel;");
            rs = st.executeQuery();
            
            String lastSchemeLabel = "";
            while(rs.next()) {
            	if ( rs.getString("schemelabel") != null && !lastSchemeLabel.equals(rs.getString("schemelabel"))) {
            		if ( !("").equals(lastSchemeLabel) ) {
            			returnList.add(thisSchemeTable);
            			schemeList.add(lastSchemeLabel);
            		}
            		thisSchemeTable = new Hashtable<String,Double>();
            		lastSchemeLabel = rs.getString("schemelabel");
            	}
                if ( rs.getString("categorylabel") != null && !("").equals(rs.getString("categorylabel").trim()) &&
                		rs.getString("reduction") != null && !("").equals(rs.getString("reduction").trim())) {
                	thisSchemeTable.put(rs.getString("categorylabel"), rs.getDouble("reduction"));
                }
            }
    		if ( !("").equals(lastSchemeLabel) ) {
    			returnList.add(thisSchemeTable);
    			schemeList.add(lastSchemeLabel);
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
        
        this.schemeLabels = schemeList;
        this.schemes = returnList;
	}


}
