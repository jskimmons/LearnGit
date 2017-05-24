package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.google.gson.Gson;

public class TRImSelector {
	
	String filterName;
	ArrayList<String> filterValues;
	Messages messages;
	
    public void setFilterName(String filterName) {
        this.filterName = filterName;
    }
    public String getFilterName() {
        return filterName;
    }

    public void setFilterValues(ArrayList<String> filterValues) {
        this.filterValues = filterValues;
    }
    public ArrayList<String> getFilterValues() {
        return filterValues;
    }

    public void setMessages(Messages messages) {
        this.messages = messages;
    }
    public Messages getMessages() {
        return messages;
    }    

    public void addMessage(String message) {
        if ( this.messages == null ) {
        	this.messages = new Messages();
        }
        this.messages.addMessage(message); 
    }
    

    public void addFilterValue(String filterValue) {
        if ( this.filterValues == null ) {
        	this.filterValues = new ArrayList<String>();
        }
        this.filterValues.add(filterValue); 
    }
    

    public void fetchData(String database) throws Exception {       
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        String url = DatabaseParameters.url + database;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;
        
        String filterName = "";
    
        
        try {
            // The newInstance() call is a work around for some
            // broken Java implementations
            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
            throw driverInitException;
        }
        
        this.addFilterValue("All");
  
          
        try {
            con = DriverManager.getConnection(url, user, password);
            st = con.prepareStatement("SELECT modelvariablename , categorylabel FROM triminput;");
            rs = st.executeQuery();
            
            while(rs.next()) {
  
                if ( rs.getString("categorylabel") != null && !("").equals(rs.getString("categorylabel").trim()) ) {
                	if ( rs.getString("modelvariablename") == null || ("").equals(rs.getString("modelvariablename")) ) {
                		throw new Exception("Empty or null model variable name encountered.");
                	}
                	if (("").equals(filterName) ) {
                		filterName = rs.getString("modelvariablename");
                	}
                	else {
                		if (!filterName.equals(rs.getString("modelvariablename")) ) {
                			throw new Exception("Multiple filters encountered.");
                		}
                	}
                }
                this.addFilterValue(rs.getString("categorylabel"));
           }
            
        } catch (SQLException queryException) {
            Exception rethrownQueryException = new Exception("SQL query failed: Exception is " + queryException.getMessage().replaceAll("'","`"));
            throw rethrownQueryException;
        } finally{
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
        
        this.setFilterName(filterName);
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



  

  

    

}
