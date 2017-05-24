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

public class TRImReductionSchemeLabels {
	
	ArrayList<String> schemeLabels;
	ArrayList<String> schemeNames;
	Messages messages;
	
	public void fetchData(String database) throws Exception {
		
	        Connection con = null;
	        PreparedStatement st = null;
	        ResultSet rs = null;

	        try {
	        	if (TRImReductionScheme.isUpToDate(database) == false ) {
	        		this.schemeLabels = new ArrayList<String>();
	            	this.addSchemeLabel("5% increase");
	            	this.addSchemeLabel("2.5% increase");
	            	this.addSchemeLabel("No change");
	            	this.addSchemeLabel("2.5% reduction");
	            	this.addSchemeLabel("5% reduction");
	            	this.addSchemeLabel("10% reduction");
	            	this.addSchemeLabel("15% reduction");
	            	this.addSchemeLabel("20% reduction");
	            	this.addSchemeLabel("25% reduction");
	        		this.schemeNames = new ArrayList<String>();
	            	this.addSchemeName("-5pct");
	            	this.addSchemeName("-2.5pct");
	            	this.addSchemeName("0pct");
	            	this.addSchemeName("2.5pct");
	            	this.addSchemeName("5pct");
	            	this.addSchemeName("10pct");
	            	this.addSchemeName("15pct");
	            	this.addSchemeName("20pct");
	            	this.addSchemeName("25pct");

	            	return;
	        	}
	        } catch(Exception checkExistsException ) {
	        	throw new Exception("Failed to determine if any schemes exist: " + checkExistsException.getMessage());
	        }

    		this.schemeLabels = new ArrayList<String>();
        	this.addSchemeLabel("5% increase");
        	this.addSchemeLabel("5% reduction");
        	this.addSchemeLabel("10% reduction");
        	this.addSchemeLabel("20% reduction");
    		this.schemeNames = new ArrayList<String>();
        	this.addSchemeName("-5pct");
        	this.addSchemeName("5pct");
        	this.addSchemeName("10pct");
        	this.addSchemeName("20pct");
	        
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
	            st = con.prepareStatement("SELECT schemelabel FROM trimschemes GROUP BY schemelabel;");
	            rs = st.executeQuery();
	            
	            while(rs.next()) {
	                if ( rs.getString("schemelabel") != null && !("").equals(rs.getString("schemelabel").trim())) {
	                	this.addSchemeLabel(rs.getString("schemelabel"));
	                	this.addSchemeName(rs.getString("schemelabel"));
	                }
	            }
	            
	            if ( this.schemeLabels == null ) {
	        		this.schemeLabels = new ArrayList<String>();
	            }
	            if ( this.schemeNames == null ) {
	        		this.schemeNames = new ArrayList<String>();
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
	     
		
	}
	
	public ArrayList<String> getSchemeLabels() {
		return this.schemeLabels;
	}
	
	public void setSchemeLabels(ArrayList<String> schemeLabels) {
		this.schemeLabels = schemeLabels;
	}
	
	public ArrayList<String> getSchemeNames() {
		return this.schemeNames;
	}
	
	public void setSchemeNames(ArrayList<String> schemeNames) {
		this.schemeNames = schemeNames;
	}
	
	public void addSchemeLabel(String schemeLabel) {
		if (this.schemeLabels == null ) {
			this.schemeLabels = new ArrayList<String>();
		}
		this.schemeLabels.add(schemeLabel);
	}
	
	public void addSchemeName(String schemeName) {
		if (this.schemeNames == null ) {
			this.schemeNames = new ArrayList<String>();
		}
		this.schemeNames.add(schemeName);
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
        Messages messageList = new Messages();
        messageList.addMessage(errorMessage);
        this.setMessages(messageList);
        try {
            Gson gson = new Gson();
            writer.println(gson.toJson(this));
        } catch (Exception e) {
            writer.println("JSON exception:" + e.getMessage());
        }
        return;

    }

	


}
