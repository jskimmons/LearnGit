
package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.BatchUpdateException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;

import org.apache.commons.math3.special.Gamma;

import com.google.gson.reflect.TypeToken;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ClientTRImTable {    
    String filterName;
    Integer versionNumber;
    Integer modelID;
    Integer modelVariableID;
	String schemeLabel;
    ArrayList<ClientTRImTableRow> filterValues;
    Messages messages;

    public void addFilterValue(ClientTRImTableRow filterValue) {
        if ( this.filterValues == null ) {
            this.filterValues = new ArrayList<ClientTRImTableRow>();
        }
        this.filterValues.add(filterValue);
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

    public static Boolean exists(String filterDatabase) throws Exception {        
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;

        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
            throw driverInitException;
        }

        try {
            con = DriverManager.getConnection(url, user, password);
            st = con.prepareStatement("SHOW TABLES LIKE 'triminput'");
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

    public static String getActiveModelID(String filterDatabase) throws Exception {
        
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        String modelID = null;
        
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;

        try {


            // The newInstance() call is a work around for some
            // broken Java implementations

            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            throw new Exception("Failed to open SQL driver instance:"); 
        }

        try {
            con = DriverManager.getConnection(url, user, password);
            st = con.prepareStatement("SELECT modelid from triminput GROUP BY modelid");
              rs = st.executeQuery();
              
            if(rs.next()) {
                modelID = rs.getString(1);
            }
            if(rs.next()) {
                throw new Exception("TRIm configuration appears to have more than one modelid.");
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
            
            return modelID;
            
        } catch (SQLException queryException) {
            Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage().replaceAll("'","`"));
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
   
    public static Integer getActiveVersionNumber(String filterDatabase) throws Exception {       
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        Integer versionNumber = null;
        
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;

        try {


            // The newInstance() call is a work around for some
            // broken Java implementations

            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            throw new Exception("Failed to open SQL driver instance:"); 
        }

        try {
            con = DriverManager.getConnection(url, user, password);
            st = con.prepareStatement("SELECT versionnumber from triminput GROUP BY versionnumber");
              rs = st.executeQuery();
              
            if(rs.next()) {
                if (rs.getString(1) != null ) {
                    versionNumber = rs.getInt(1);                   
                }
            }
            if(rs.next()) {
                throw new Exception("TRIm configuration appears to have more than one version number.");
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
            
            return versionNumber;
            
        } catch (SQLException queryException) {
            Exception rethrownQueryException = new Exception("SQL query failed:" + queryException.getMessage().replaceAll("'","`"));
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

            if ( !ClientTRImTable.exists(filterDatabase)) {
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
            st = con.prepareStatement("SELECT modelid from modelling GROUP BY modelid");
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

            st = con.prepareStatement("SELECT modelid from triminput GROUP BY modelid");
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

            return ( configurationModelID == trimModelID );
            
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
    
    public void fetchData(String filterDatabase) throws Exception {       
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        ClientTRImTableRow thisTRImTableRow = null;
        
        
        String url = DatabaseParameters.url + filterDatabase;
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
            st = con.prepareStatement("SELECT modelid , modelvariablename , categorylabel, employeeheadcount , individualturnoverrate , valueadded , totalcompensation , hiringcost , trainingcost , trainingperiod , vacancyperiod , shapeparameter , scaleparameter , productivity0to30 , productivity31to60 , productivity61to90 , productivity91to180 , productivity181to365 FROM triminput;");
            rs = st.executeQuery();
            
            while(rs.next()) {
            	Float thisScaleParameter , thisShapeParameter;
                thisTRImTableRow = new ClientTRImTableRow();
                if ( rs.getString("modelid") != null && !("").equals(rs.getString("modelid").trim()) ) {
                    this.modelID = rs.getInt("modelid");
                }
                if ( rs.getString("modelvariablename") != null && !("").equals(rs.getString("modelvariablename").trim()) ) {
                    this.filterName = rs.getString("modelvariablename");
                }
                if ( rs.getString("productivity0to30") != null && !("").equals(rs.getString("productivity0to30").trim()) ) {
                	thisTRImTableRow.productivity0To30 = rs.getDouble("productivity0to30");
                }
                if ( rs.getString("productivity31to60") != null && !("").equals(rs.getString("productivity31to60").trim()) ) {
                	thisTRImTableRow.productivity31To60 = rs.getDouble("productivity31to60");
                }
                if ( rs.getString("productivity61to90") != null && !("").equals(rs.getString("productivity61to90").trim()) ) {
                	thisTRImTableRow.productivity61To90 = rs.getDouble("productivity61to90");
                }
                if ( rs.getString("productivity91to180") != null && !("").equals(rs.getString("productivity91to180").trim()) ) {
                	thisTRImTableRow.productivity91To180 = rs.getDouble("productivity91to180");
                }
                if ( rs.getString("productivity181to365") != null && !("").equals(rs.getString("productivity181to365").trim()) ) {
                	thisTRImTableRow.productivity181To365 = rs.getDouble("productivity181to365");
                }
                if ( rs.getString("categorylabel") != null && !("").equals(rs.getString("categorylabel").trim()) ) {
                    thisTRImTableRow.filterValue = rs.getString("categorylabel");
                }
                if ( rs.getString("employeeheadcount") != null && !("").equals(rs.getString("employeeheadcount").trim()) ) {
                    thisTRImTableRow.employeeHeadcount = rs.getDouble("employeeheadcount");
                }
                if ( rs.getString("individualturnoverrate") != null && !("").equals(rs.getString("individualturnoverrate").trim()) ) {
                    thisTRImTableRow.individualTurnoverRate = rs.getDouble("individualturnoverrate");
                }
                if ( rs.getString("valueadded") != null && !("").equals(rs.getString("valueadded").trim()) ) {
                    thisTRImTableRow.valueAdded = rs.getInt("valueadded");
                }
                if ( rs.getString("totalcompensation") != null && !("").equals(rs.getString("totalcompensation").trim()) ) {
                    thisTRImTableRow.totalCompensation = rs.getDouble("totalcompensation");
                }
                if ( rs.getString("hiringcost") != null && !("").equals(rs.getString("hiringcost").trim()) ) {
                    thisTRImTableRow.hiringCost =  rs.getDouble("hiringcost");
                }
                if ( rs.getString("trainingcost") != null && !("").equals(rs.getString("trainingcost").trim()) ) {
                    thisTRImTableRow.trainingCost = rs.getDouble("trainingcost");
                }
                if ( rs.getString("trainingperiod") != null && !("").equals(rs.getString("trainingperiod").trim()) ) {
                    thisTRImTableRow.trainingPeriod = rs.getDouble("trainingperiod");
                }
                if ( rs.getString("vacancyperiod") != null && !("").equals(rs.getString("vacancyperiod").trim()) ) {
                    thisTRImTableRow.vacancyPeriod = rs.getDouble("vacancyperiod");
                }
                if ( rs.getString("shapeparameter") != null && !("").equals(rs.getString("shapeparameter").trim()) ) {
                    thisTRImTableRow.shapeParameter = rs.getDouble("shapeparameter");
                    if ( rs.getString("scaleparameter") != null && !("").equals(rs.getString("scaleparameter").trim()) ) {
                        thisTRImTableRow.scaleParameter = rs.getDouble("scaleparameter");
                        thisTRImTableRow.annualTurnover = (double) (1-Math.exp(-(Math.pow((1/thisTRImTableRow.scaleParameter),thisTRImTableRow.shapeParameter))));                        
                    }

                }
                thisTRImTableRow.productivityGreater365=100.0;
                this.addFilterValue(thisTRImTableRow);                              
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
        //this.schemeLabel = "Tweedle";
        if ( this.schemeLabel != null ) {
        	populateReductionScheme(filterDatabase);
        	ClientTRImTableRow allRow = new ClientTRImTableRow();
        	allRow.filterValue = "All";
        	allRow.employeeHeadcount = (double) 0;
        	allRow.individualTurnoverRate = (double) 0;
        	allRow.valueAdded = 0;
        	allRow.totalCompensation = (double) 0;
        	allRow.hiringCost = (double) 0;
        	allRow.trainingCost = (double) 0;
        	allRow.trainingPeriod = (double) 0;
        	allRow.vacancyPeriod = (double) 0;
        	allRow.annualTurnover = (double) 0;
        	allRow.reduction = (double) 0;
        	allRow.shapeParameter = (double) 0;
        	allRow.scaleParameter = (double) 0;
        	allRow.productivity0To30 = (double) 0;
        	allRow.productivity31To60 = (double) 0;
        	allRow.productivity61To90 = (double) 0;
        	allRow.productivity91To180 = (double) 0;
        	allRow.productivity181To365 = (double) 0;
        	allRow.impliedTurnover = (double) 0;
        	allRow.topLineGain = (double) 0;
        	allRow.costSavings = (double) 0;
        	allRow.bottomLineImpact = (double) 0;
        	allRow.hireReductionPercent = (double) 0;
        	allRow.hireReductionNumber = 0;
        	allRow.currentNewHires = (double) 0;
        	allRow.impliedNewHires = (double) 0;

        	for (int thisFilterValueNo = 0 ; thisFilterValueNo < this.filterValues.size(); thisFilterValueNo++ ) {
        		Double thisHeadcount = this.filterValues.get(thisFilterValueNo).employeeHeadcount;
        		allRow.employeeHeadcount += thisHeadcount;
            	allRow.individualTurnoverRate += this.filterValues.get(thisFilterValueNo).individualTurnoverRate*thisHeadcount;
            	allRow.valueAdded += this.filterValues.get(thisFilterValueNo).valueAdded;
            	allRow.totalCompensation += this.filterValues.get(thisFilterValueNo).totalCompensation*thisHeadcount;
            	allRow.hiringCost += this.filterValues.get(thisFilterValueNo).hiringCost*thisHeadcount;
            	allRow.trainingCost += this.filterValues.get(thisFilterValueNo).trainingCost*thisHeadcount;
            	allRow.trainingPeriod += this.filterValues.get(thisFilterValueNo).trainingPeriod*thisHeadcount;
            	allRow.vacancyPeriod += this.filterValues.get(thisFilterValueNo).vacancyPeriod*thisHeadcount;
            	allRow.annualTurnover += this.filterValues.get(thisFilterValueNo).annualTurnover*thisHeadcount;
            	allRow.reduction += this.filterValues.get(thisFilterValueNo).reduction*thisHeadcount;
            	allRow.shapeParameter += this.filterValues.get(thisFilterValueNo).shapeParameter*thisHeadcount ;
            	allRow.scaleParameter += this.filterValues.get(thisFilterValueNo).scaleParameter*thisHeadcount ;
            	allRow.productivity0To30 += this.filterValues.get(thisFilterValueNo).productivity0To30*thisHeadcount ;
            	allRow.productivity31To60 += this.filterValues.get(thisFilterValueNo).productivity31To60*thisHeadcount ;
            	allRow.productivity61To90 += this.filterValues.get(thisFilterValueNo).productivity61To90*thisHeadcount ;
            	allRow.productivity91To180 += this.filterValues.get(thisFilterValueNo).productivity91To180*thisHeadcount ;
            	allRow.productivity181To365 += this.filterValues.get(thisFilterValueNo).productivity181To365*thisHeadcount ;
            	allRow.impliedTurnover += this.filterValues.get(thisFilterValueNo).impliedTurnover*thisHeadcount;
            	allRow.topLineGain += this.filterValues.get(thisFilterValueNo).topLineGain;
            	allRow.costSavings += this.filterValues.get(thisFilterValueNo).costSavings;
            	allRow.bottomLineImpact += this.filterValues.get(thisFilterValueNo).bottomLineImpact;
            	//allRow.hireReductionPercent += this.filterValues.get(thisFilterValueNo).hireReductionPercent*thisHeadcount;
            	allRow.hireReductionNumber += this.filterValues.get(thisFilterValueNo).hireReductionNumber;
            	allRow.currentNewHires += this.filterValues.get(thisFilterValueNo).currentNewHires;
            	allRow.impliedNewHires += this.filterValues.get(thisFilterValueNo).impliedNewHires;
        		
        	}
        	
        	Gson gson = new Gson();
        	this.addMessage(gson.toJson(allRow));

        	allRow.individualTurnoverRate = allRow.individualTurnoverRate/allRow.employeeHeadcount;
        	allRow.totalCompensation = allRow.totalCompensation/allRow.employeeHeadcount;
        	allRow.hiringCost = allRow.hiringCost/allRow.employeeHeadcount;
        	allRow.trainingCost = allRow.trainingCost/allRow.employeeHeadcount;
        	allRow.trainingPeriod = allRow.trainingPeriod/allRow.employeeHeadcount;
        	allRow.vacancyPeriod = allRow.vacancyPeriod/allRow.employeeHeadcount;
        	allRow.annualTurnover = allRow.annualTurnover/allRow.employeeHeadcount;
        	allRow.reduction = allRow.reduction/allRow.employeeHeadcount;
        	allRow.shapeParameter = allRow.shapeParameter/allRow.employeeHeadcount ;
        	allRow.scaleParameter = allRow.scaleParameter/allRow.employeeHeadcount;
        	allRow.productivity0To30 = allRow.productivity0To30/allRow.employeeHeadcount;
        	allRow.productivity31To60 = allRow.productivity31To60/allRow.employeeHeadcount;
        	allRow.productivity61To90 = allRow.productivity61To90/allRow.employeeHeadcount;
        	allRow.productivity91To180 = allRow.productivity91To180/allRow.employeeHeadcount;
        	allRow.productivity181To365 = allRow.productivity181To365/allRow.employeeHeadcount;
        	allRow.impliedTurnover = allRow.impliedTurnover/allRow.employeeHeadcount;
        	allRow.hireReductionPercent = allRow.hireReductionPercent/allRow.employeeHeadcount;
        	this.addFilterValue(allRow);

        }
        //Null out the shape and scale so the client doesn't see them
        for (int i = 0 ; i < this.filterValues.size(); i++ ) {
        	this.filterValues.get(i).shapeParameter = null;
        	this.filterValues.get(i).scaleParameter = null;
        }
    }
    
    public void populateReductionScheme(String database) throws Exception {
    	
    	Hashtable<String,Double> reductionTable = null;
    	Double thisReduction = null;
    	ClientTRImTableRow thisTableRow = null;
    	
    	//System.out.println("this.schemeLabel" + this.schemeLabel);
    	
   		thisReduction = null;
   	  	if ( !("-5pct").equals(this.schemeLabel) 
   	    		&& !("-2.5pct").equals(this.schemeLabel) 
   	    		&& !("0pct").equals(this.schemeLabel) 
   	    		&& !("2.5pct").equals(this.schemeLabel) 
   	    		&& !("5pct").equals(this.schemeLabel) 
   	    		&& !("10pct").equals(this.schemeLabel) 
   	    		&& !("15pct").equals(this.schemeLabel) 
   	    		&& !("20pct").equals(this.schemeLabel) 
   	    		&& !("25pct").equals(this.schemeLabel)	) {
    		   	try {
    	    		reductionTable = TRImReductionScheme.fetchAsHashTable(database, this.schemeLabel);
    	    	} catch(Exception fetchSchemeException) {
    	    		throw new Exception("Error fetching scheme data from database: " + fetchSchemeException.getMessage());
    	    	}
   			
    		}

     	
    	for (int thisFilterValueNo = 0 ; thisFilterValueNo < this.filterValues.size() ; thisFilterValueNo++ ) {
       		thisReduction = null;
       	  	if ( ("-5pct").equals(this.schemeLabel) 
       	    		|| ("-2.5pct").equals(this.schemeLabel) 
       	    		|| ("0pct").equals(this.schemeLabel) 
       	    		|| ("2.5pct").equals(this.schemeLabel) 
       	    		|| ("5pct").equals(this.schemeLabel) 
       	    		|| ("10pct").equals(this.schemeLabel) 
       	    		|| ("15pct").equals(this.schemeLabel) 
       	    		|| ("20pct").equals(this.schemeLabel) 
       	    	    || ("25pct").equals(this.schemeLabel)	) {
       	  		thisReduction = Double.parseDouble(this.schemeLabel.replaceAll("pct", ""));
       	  	}
       	  	else {
        		if ( this.filterValues.get(thisFilterValueNo).filterValue != null ) {
        			thisReduction = reductionTable.get(this.filterValues.get(thisFilterValueNo).filterValue);
        		}       	  		
       	  	}
    		if ( thisReduction != null ) {
    			thisTableRow = this.filterValues.get(thisFilterValueNo); 
        		thisTableRow.reduction = thisReduction;
        		thisTableRow.reductionFraction = thisReduction/100;
        		
        		Double employeeHeadcount = thisTableRow.employeeHeadcount;
        		Double newHireTurnoverRate = thisTableRow.individualTurnoverRate;
        		Double averageCompensation = thisTableRow.totalCompensation;
        		Double valueAdded = (double) thisTableRow.valueAdded + employeeHeadcount*averageCompensation;
        		Double hiringCost = thisTableRow.hiringCost;
        		Double trainingCost = thisTableRow.trainingCost;
        		Double vacancyPeriod = thisTableRow.vacancyPeriod;
        		Double MLEShape = thisTableRow.shapeParameter;
        		Double productivity0to30 = thisTableRow.productivity0To30;
        		Double productivity31to60 = thisTableRow.productivity31To60;
        		Double productivity61to90 = thisTableRow.productivity61To90;
        		Double productivity91to180 = thisTableRow.productivity91To180;
        		Double productivity181to365 = thisTableRow.productivity181To365;
        		Double productivityGreater365 = thisTableRow.productivityGreater365;

        		Double turnoverReduction = thisTableRow.reductionFraction;

        		Double MLEScale = Math.pow(-Math.log(1 - newHireTurnoverRate), -(1 / MLEShape));

        		Double testReductionInTurnover = (1 - turnoverReduction) * newHireTurnoverRate;
        		Double adjustedScale = Math.pow(-Math.log(1 - testReductionInTurnover), -(1 / MLEShape));
        		
        		Double ctr_Day30TurnoverRate = 1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape));
        		Double ctr_Day60TurnoverRate = 1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape));
        		Double ctr_Day90TurnoverRate = 1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape));
        		Double ctr_Day180TurnoverRate = 1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale), MLEShape));
        		Double ctr_Day365TurnoverRate = 1 - Math.exp(-Math.pow(((365 / (double) 365) / MLEScale), MLEShape));

        		Double ctr_empYearsperHireForTenure0To30 = (1 - 0) * (1 - (1 - ctr_Day30TurnoverRate) / (1 - 0)) * (30 / (double) 365) / (Math.log(1 - 0) - Math.log(1
        				- ctr_Day30TurnoverRate));
        		Double ctr_empYearsperHireForTenure31To60 = (1 - ctr_Day30TurnoverRate) * (1 - (1 - ctr_Day60TurnoverRate) / (1 - ctr_Day30TurnoverRate)) * (30 / (double) 365) / (Math.log(
        				1 - ctr_Day30TurnoverRate) - Math.log(1 - ctr_Day60TurnoverRate));
        		Double ctr_empYearsperHireForTenure61To90 = (1 - ctr_Day60TurnoverRate) * (1 - (1 - ctr_Day90TurnoverRate) / (1 - ctr_Day60TurnoverRate)) * (30 / (double) 365) / (Math.log(
        				1 - ctr_Day60TurnoverRate) - Math.log(1 - ctr_Day90TurnoverRate));
        		Double ctr_empYearsperHireForTenure91To180 = (1 - ctr_Day90TurnoverRate) * (1 - (1 - ctr_Day180TurnoverRate) / (1 - ctr_Day90TurnoverRate)) * (90 / (double) 365) / (Math
        				.log(1 - ctr_Day90TurnoverRate) - Math.log(1 - ctr_Day180TurnoverRate));
        		Double ctr_empYearsperHireForTenure181To365 = (1 - ctr_Day180TurnoverRate) * (1 - (1 - ctr_Day365TurnoverRate) / (1 - ctr_Day180TurnoverRate)) * (185 / (double) 365)
        				/ (Math.log(1 - ctr_Day180TurnoverRate) - Math.log(1 - ctr_Day365TurnoverRate));
        		Double ctr_empYearsperHireForTenure365p = MLEScale * Gamma.gamma(1 + (1 / MLEShape)) - (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
        				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365);
        		
        		Double ctr_empShare0To30 = ctr_empYearsperHireForTenure0To30 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60 + ctr_empYearsperHireForTenure61To90
        				+ ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
        				
        		Double ctr_empShare31To60 = ctr_empYearsperHireForTenure31To60 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
        				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
        		Double ctr_empShare61To90 = ctr_empYearsperHireForTenure61To90 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
        				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
        		Double ctr_empShare91To180 = ctr_empYearsperHireForTenure91To180 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
        				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
        		Double ctr_empShare181To365 = ctr_empYearsperHireForTenure181To365 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
        				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
        		Double ctr_empShare365p = ctr_empYearsperHireForTenure365p / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60 + ctr_empYearsperHireForTenure61To90
        				+ ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
      		
        		Double ctr_revenueOverall = productivity0to30 * ctr_empShare0To30 + productivity31to60 * ctr_empShare31To60 + productivity61to90 * ctr_empShare61To90 + productivity91to180
        				* ctr_empShare91To180 + productivity181to365 * ctr_empShare181To365 + productivityGreater365 * ctr_empShare365p;

        		
        		
        		Double rtr_Day30TurnoverRate = 1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale), MLEShape));
        		Double rtr_Day60TurnoverRate = 1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale), MLEShape));
        		Double rtr_Day90TurnoverRate = 1 - Math.exp(-Math.pow(((90 / (double) 365) / adjustedScale), MLEShape));
        		Double rtr_Day180TurnoverRate = 1 - Math.exp(-Math.pow(((180 / (double) 365) / adjustedScale), MLEShape));
        		Double rtr_Day365TurnoverRate = 1 - Math.exp(-Math.pow(((365 / (double) 365) / adjustedScale), MLEShape));

        		Double rtr_empYearsperHireForTenure0To30 = (1 - 0) * (1 - (1 - rtr_Day30TurnoverRate) / (1 - 0)) * (30 / (double) 365) / (Math.log(1 - 0) - Math.log(1
        				- rtr_Day30TurnoverRate));
        		Double rtr_empYearsperHireForTenure31To60 = (1 - rtr_Day30TurnoverRate) * (1 - (1 - rtr_Day60TurnoverRate) / (1 - rtr_Day30TurnoverRate)) * (30 / (double) 365) / (Math.log(
        				1 - rtr_Day30TurnoverRate) - Math.log(1 - rtr_Day60TurnoverRate));
        		Double rtr_empYearsperHireForTenure61To90 = (1 - rtr_Day60TurnoverRate) * (1 - (1 - rtr_Day90TurnoverRate) / (1 - rtr_Day60TurnoverRate)) * (30 / (double) 365) / (Math.log(
        				1 - rtr_Day60TurnoverRate) - Math.log(1 - rtr_Day90TurnoverRate));
        		Double rtr_empYearsperHireForTenure91To180 = (1 - rtr_Day90TurnoverRate) * (1 - (1 - rtr_Day180TurnoverRate) / (1 - rtr_Day90TurnoverRate)) * (90 / (double) 365) / (Math
        				.log(1 - rtr_Day90TurnoverRate) - Math.log(1 - rtr_Day180TurnoverRate));
        		Double rtr_empYearsperHireForTenure181To365 = (1 - rtr_Day180TurnoverRate) * (1 - (1 - rtr_Day365TurnoverRate) / (1 - rtr_Day180TurnoverRate)) * (185 / (double) 365)
        				/ (Math.log(1 - rtr_Day180TurnoverRate) - Math.log(1 - rtr_Day365TurnoverRate));
        		Double rtr_empYearsperHireForTenure365p = adjustedScale * Gamma.gamma(1 + (1 / MLEShape)) - (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
        				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365);

        		Double rtr_empShare0To30 = rtr_empYearsperHireForTenure0To30 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60 + rtr_empYearsperHireForTenure61To90
        				+ rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
        		Double rtr_empShare31To60 = rtr_empYearsperHireForTenure31To60 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
        				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
        		Double rtr_empShare61To90 = rtr_empYearsperHireForTenure61To90 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
        				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
        		Double rtr_empShare91To180 = rtr_empYearsperHireForTenure91To180 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
        				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
        		Double rtr_empShare181To365 = rtr_empYearsperHireForTenure181To365 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
        				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
        		Double rtr_empShare365p = rtr_empYearsperHireForTenure365p / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60 + rtr_empYearsperHireForTenure61To90
        				+ rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);

        		Double rtr_revenueOverall = productivity0to30 * rtr_empShare0To30 + productivity31to60 * rtr_empShare31To60 + productivity61to90 * rtr_empShare61To90 + productivity91to180
        				* rtr_empShare91To180 + productivity181to365 * rtr_empShare181To365 + productivityGreater365 * rtr_empShare365p;
        		Double revenueGain = (rtr_revenueOverall - ctr_revenueOverall) / 100 * valueAdded;

        		Double shareOfQuits0To30 = 1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape));
        		Double shareOfQuits31To60 = (1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape)));
        		Double shareOfQuits61To90 = (1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape)));
        		Double shareOfQuits91To180 = (1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape)));
        		Double shareOfQuits181To365 = (1 - Math.exp(-Math.pow(((365 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale),
        				MLEShape)));
        		Double shareOfQuits365p = 1 - (shareOfQuits0To30 + shareOfQuits31To60 + shareOfQuits61To90 + shareOfQuits91To180 + shareOfQuits181To365);

        		Double revenueOfQuitters = productivity0to30 * shareOfQuits0To30 + productivity31to60 * shareOfQuits31To60 + productivity61to90 * shareOfQuits61To90 + productivity91to180
        				* shareOfQuits91To180 + productivity181to365 * shareOfQuits181To365 + productivityGreater365 * shareOfQuits365p;
        		Double revenueOverall = ctr_revenueOverall;
        		Double quitterProductivity = revenueOfQuitters / revenueOverall;

        		Double rtr_shareOfQuits0To30 = 1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale), MLEShape));
        		Double rtr_shareOfQuits31To60 = (1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale),
        				MLEShape)));
        		Double rtr_shareOfQuits61To90 = (1 - Math.exp(-Math.pow(((90 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale),
        				MLEShape)));
        		Double rtr_shareOfQuits91To180 = (1 - Math.exp(-Math.pow(((180 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((90 / (double) 365)
        				/ adjustedScale), MLEShape)));
        		Double rtr_shareOfQuits181To365 = (1 - Math.exp(-Math.pow(((365 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((180 / (double) 365)
        				/ adjustedScale), MLEShape)));
        		Double rtr_shareOfQuits365p = 1 - (rtr_shareOfQuits0To30 + rtr_shareOfQuits31To60 + rtr_shareOfQuits61To90 + rtr_shareOfQuits91To180 + rtr_shareOfQuits181To365);

        		Double rtr_revenueOfQuitters = productivity0to30 * rtr_shareOfQuits0To30 + productivity31to60 * rtr_shareOfQuits31To60 + productivity61to90 * rtr_shareOfQuits61To90
        				+ productivity91to180 * rtr_shareOfQuits91To180 + productivity181to365 * rtr_shareOfQuits181To365 + productivityGreater365 * rtr_shareOfQuits365p;
        		Double rtr_quitterProductivity = rtr_revenueOfQuitters / rtr_revenueOverall;

        		Double totalCompensation = employeeHeadcount * averageCompensation;
        		Double revenueNetOfPay = valueAdded - totalCompensation;
        		Double grossProfitsPerEmployee = revenueNetOfPay / employeeHeadcount;
        		Double revenuePerEmployee = valueAdded / employeeHeadcount;
        		Double revenuePerEmployeeAtQuit = quitterProductivity * valueAdded / employeeHeadcount;
        		Double desiredRevenuePerEmployeeAtQuit = rtr_quitterProductivity * valueAdded / employeeHeadcount;
        		Double desiredIndividualTurnover = testReductionInTurnover;
        		Double currentHeadcountTurnoverMLE = 1 / (Gamma.gamma(1 + (1 / MLEShape)) * MLEScale);
        		Double desiredHeadcountTurnoverMLE = 1 / (Gamma.gamma(1 + (1 / MLEShape)) * adjustedScale);
        		Double currentNewHires = employeeHeadcount * currentHeadcountTurnoverMLE;
        		Double impliedNewHires = employeeHeadcount * desiredHeadcountTurnoverMLE;
        		Double newHireReduction = (currentNewHires - impliedNewHires) / currentNewHires;
        		Double currentTurnoverCosts = currentNewHires * (hiringCost + trainingCost);
        		Double currentVacancyCosts = (vacancyPeriod / 52) * revenuePerEmployeeAtQuit * currentNewHires - (vacancyPeriod / 52) * averageCompensation * currentNewHires;
        		Double desiredTurnoverCosts = impliedNewHires * (hiringCost + trainingCost);
        		Double desiredVacancyCosts = (vacancyPeriod / 52) * desiredRevenuePerEmployeeAtQuit * impliedNewHires - (vacancyPeriod / 52) * averageCompensation * impliedNewHires;

        		Double topLineGains = currentVacancyCosts - desiredVacancyCosts + revenueGain;
        		Double costSavings = currentTurnoverCosts - desiredTurnoverCosts;
        		Double EBITDAImpact = topLineGains + costSavings;

        		
        		thisTableRow.topLineGain = (double) Math.round(topLineGains);
        		thisTableRow.costSavings = (double) Math.round(costSavings);
        		thisTableRow.bottomLineImpact = (double) Math.round(EBITDAImpact);
        		thisTableRow.newHireTurnoverRateCurrent = newHireTurnoverRate;
        		thisTableRow.newHireTurnoverRateNew = thisTableRow.newHireTurnoverRateCurrent * (1 - (thisReduction / 100));
        		thisTableRow.newHireTurnoverRateReduction = thisReduction;
        		thisTableRow.seatTurnoverRateCurrent = currentHeadcountTurnoverMLE;
        		thisTableRow.seatTurnoverRateNew =desiredHeadcountTurnoverMLE;
        		thisTableRow.seatTurnoverRateReduction = (thisTableRow.seatTurnoverRateCurrent - thisTableRow.seatTurnoverRateNew)
						/ thisTableRow.seatTurnoverRateCurrent;
        		thisTableRow.currentNewHires = (double) Math.round(currentNewHires);
        		thisTableRow.impliedNewHires = (double) Math.round(impliedNewHires);
        		//if (thisTableRow.filterValue.equalsIgnoreCase("clark3") && thisTableRow.reduction == 0.1) {
        			/*System.out.println("filtervalue" + thisTableRow.filterValue + "\nreduction" + thisTableRow.reduction + "\nvalueAdded" + valueAdded + "\nMLEScale:" + MLEScale
        					+ "\ntestReductionInTurnover:" + testReductionInTurnover + "\nadjustedScale:" + adjustedScale + "\nctr_Day30TurnoverRate:" + ctr_Day30TurnoverRate
        					+ "\nctr_Day60TurnoverRate:" + ctr_Day60TurnoverRate + "\nctr_Day90TurnoverRate:" + ctr_Day90TurnoverRate + "\nctr_Day180TurnoverRate:" + ctr_Day180TurnoverRate
        					+ "\nctr_Day365TurnoverRate:" + ctr_Day365TurnoverRate + "\nctr_empYearsperHireForTenure0To30:" + ctr_empYearsperHireForTenure0To30
        					+ "\nctr_empYearsperHireForTenure31To60:" + ctr_empYearsperHireForTenure31To60 + "\nctr_empYearsperHireForTenure61To90:" + ctr_empYearsperHireForTenure61To90
        					+ "\nctr_empYearsperHireForTenure91To180:" + ctr_empYearsperHireForTenure91To180 + "\nctr_empYearsperHireForTenure181To365:"
        					+ ctr_empYearsperHireForTenure181To365 + "\nctr_empYearsperHireForTenure365p:" + ctr_empYearsperHireForTenure365p + "\nctr_empShare0To30:" + ctr_empShare0To30
        					+ "\nctr_empShare31To60:" + ctr_empShare31To60 + "\nctr_empShare61To90:" + ctr_empShare61To90 + "\nctr_empShare91To180:" + ctr_empShare91To180
        					+ "\nctr_empShare181To365:" + ctr_empShare181To365 + "\nctr_empShare365p:" + ctr_empShare365p + "\nctr_revenueOverall:" + ctr_revenueOverall
        					+ "\nrtr_Day30TurnoverRate:" + rtr_Day30TurnoverRate + "\nrtr_Day60TurnoverRate:" + rtr_Day60TurnoverRate + "\nrtr_Day90TurnoverRate:" + rtr_Day90TurnoverRate
        					+ "\nrtr_Day180TurnoverRate:" + rtr_Day180TurnoverRate + "\nrtr_Day365TurnoverRate:" + rtr_Day365TurnoverRate + "\nrtr_empYearsperHireForTenure0To30:"
        					+ rtr_empYearsperHireForTenure0To30 + "\nrtr_empYearsperHireForTenure31To60:" + rtr_empYearsperHireForTenure31To60 + "\nrtr_empYearsperHireForTenure61To90:"
        					+ rtr_empYearsperHireForTenure61To90 + "\nrtr_empYearsperHireForTenure91To180:" + rtr_empYearsperHireForTenure91To180
        					+ "\nrtr_empYearsperHireForTenure181To365:" + rtr_empYearsperHireForTenure181To365 + "\nrtr_empYearsperHireForTenure365p:" + rtr_empYearsperHireForTenure365p
        					+ "\nrtr_empShare0To30:" + rtr_empShare0To30 + "\nrtr_empShare31To60:" + rtr_empShare31To60 + "\nrtr_empShare61To90:" + rtr_empShare61To90
        					+ "\nrtr_empShare91To180:" + rtr_empShare91To180 + "\nrtr_empShare181To365:" + rtr_empShare181To365 + "\nrtr_empShare365p:" + rtr_empShare365p
        					+ "\nrtr_revenueOverall:" + rtr_revenueOverall + "\nrevenueGain:" + revenueGain + "\nshareOfQuits0To30:" + shareOfQuits0To30 + "\nshareOfQuits31To60:"
        					+ shareOfQuits31To60 + "\nshareOfQuits61To90:" + shareOfQuits61To90 + "\nshareOfQuits91To180:" + shareOfQuits91To180 + "\nshareOfQuits181To365:"
        					+ shareOfQuits181To365 + "\nshareOfQuits365p:" + shareOfQuits365p + "\nrevenueOfQuitters:" + revenueOfQuitters + "\nrevenueOverall:" + revenueOverall
        					+ "\nquitterProductivity" + quitterProductivity + "\nrtr_shareOfQuits0To30:" + rtr_shareOfQuits0To30 + "\nrtr_shareOfQuits31To60:" + rtr_shareOfQuits31To60
        					+ "\nrtr_shareOfQuits61To90:" + rtr_shareOfQuits61To90 + "\nrtr_shareOfQuits91To180:" + rtr_shareOfQuits91To180 + "\nrtr_shareOfQuits181To365:"
        					+ rtr_shareOfQuits181To365 + "\nrtr_shareOfQuits365p:" + rtr_shareOfQuits365p + "\nrtr_revenueOfQuitters:" + rtr_revenueOfQuitters + "\nrtr_revenueOverall:"
        					+ rtr_revenueOverall + "\nrtr_quitterProductivity:" + rtr_quitterProductivity + "\ntotalCompensation:" + totalCompensation + "\nrevenueNetOfPay:"
        					+ revenueNetOfPay + "\ngrossProfitsPerEmployee:" + grossProfitsPerEmployee + "\nrevenuePerEmployee:" + revenuePerEmployee + "\nrevenuePerEmployeeAtQuit:"
        					+ revenuePerEmployeeAtQuit + "\ndesiredRevenuePerEmployeeAtQuit:" + desiredRevenuePerEmployeeAtQuit + "\ndesiredIndividualTurnover:" + desiredIndividualTurnover
        					+ "\ncurrentHeadcountTurnoverMLE:" + currentHeadcountTurnoverMLE + "\ndesiredHeadcountTurnoverMLE:" + desiredHeadcountTurnoverMLE + "\ncurrentNewHires:"
        					+ currentNewHires + "\nimpliedNewHires:" + impliedNewHires + "\nnewHireReduction:" + newHireReduction + "\ncurrentTurnoverCosts:" + currentTurnoverCosts
        					+ "\ncurrentVacancyCosts:" + currentVacancyCosts + "\ndesiredTurnoverCosts:" + desiredTurnoverCosts + "\ndesiredVacancyCosts:" + desiredVacancyCosts
        					+ "\ntopLineGains:" + topLineGains + "\ncostSavings:" + costSavings + "\nEBITDAImpact:" + EBITDAImpact);*/
        		//}
        		
            	/*Double thisCurrentTurnover , thisDesiredScale , thisCurrentNewHires , thisImpliedNewHires , thisHireReduction;
    			thisTableRow.annualTurnover = (double) 1/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
    			if ( Double.isNaN(thisTableRow.annualTurnover) ) {
    				thisTableRow.annualTurnover = (double) -1;
    			}
    			thisTableRow.currentNewHires = (int) (thisTableRow.employeeHeadcount/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter)));
            	thisDesiredScale = Math.pow(-Math.log(1-(thisTableRow.individualTurnoverRate*(100-thisReduction)/100)), -1/thisTableRow.shapeParameter);
    			thisTableRow.impliedTurnover = (double) 1/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
    			if ( Double.isNaN(thisTableRow.impliedTurnover) ) {
    				thisTableRow.impliedTurnover = (double) -1;
    			}
            	thisTableRow.impliedNewHires = (int) (thisTableRow.employeeHeadcount/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter)));
            	thisTableRow.hireReductionNumber = (int) ((thisTableRow.employeeHeadcount/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter))) - (thisTableRow.employeeHeadcount/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter))));
            	thisTableRow.costSavings = (int) (thisTableRow.hireReductionNumber*(thisTableRow.hiringCost + thisTableRow.trainingCost));
            	
            	double years0to30PerHire = 0;
            	double years31to60PerHire = 0;
            	double years61to90PerHire = 0;
            	double years91to180PerHire = 0;
            	double years181to365PerHire = 0;
            	double years366PlusPerHire = 0;
            	
            	double years0to30ImpliedPerHire = 0;
            	double years31to60ImpliedPerHire = 0;
            	double years61to90ImpliedPerHire = 0;
            	double years91to180ImpliedPerHire = 0;
            	double years181to365ImpliedPerHire = 0;
            	double years366PlusImpliedPerHire = 0;
            	
            	for (double today = 0 ; today <= 365 ; today++ ) {
            		if ( today <= 30 ) {
            			years0to30PerHire += Math.exp(-Math.pow(((double)(today/365))/thisTableRow.scaleParameter, thisTableRow.shapeParameter))/365;
            			years0to30ImpliedPerHire += Math.exp(-Math.pow(((double)(today/365))/thisDesiredScale, thisTableRow.shapeParameter))/365;
            		}
            		if ( today > 30 && today <= 60 ) {
            			years31to60PerHire += Math.exp(-Math.pow((double)((today/365))/thisTableRow.scaleParameter, thisTableRow.shapeParameter))/365;
            			years31to60ImpliedPerHire += Math.exp(-Math.pow(((double)(today/365))/thisDesiredScale, thisTableRow.shapeParameter))/365;
            		}
            		if ( today > 60 && today <= 90 ) {
            			years61to90PerHire += Math.exp(-Math.pow(((double)(today/365))/thisTableRow.scaleParameter, thisTableRow.shapeParameter))/365;
            			years61to90ImpliedPerHire += Math.exp(-Math.pow(((double)(today/365))/thisDesiredScale, thisTableRow.shapeParameter))/365;
            		}
            		if ( today > 90 && today <= 180 ) {
            			years91to180PerHire += Math.exp(-Math.pow(((double)(today/365))/thisTableRow.scaleParameter, thisTableRow.shapeParameter))/365;
            			years91to180ImpliedPerHire += Math.exp(-Math.pow((today/365)/thisDesiredScale, thisTableRow.shapeParameter))/365;
            		}
            		if ( today > 180  ) {
            			years181to365PerHire += Math.exp(-Math.pow(((double)(today/365))/thisTableRow.scaleParameter, thisTableRow.shapeParameter))/365;
            			years181to365ImpliedPerHire += Math.exp(-Math.pow((double)((today/365))/thisDesiredScale, thisTableRow.shapeParameter))/365;
            		}
            	}
            	
            	
            	years366PlusPerHire = thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter) - years0to30PerHire - years31to60PerHire - years61to90PerHire - years91to180PerHire - years181to365PerHire;
            	years366PlusImpliedPerHire = thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter) - years0to30ImpliedPerHire - years31to60ImpliedPerHire - years61to90ImpliedPerHire - years91to180ImpliedPerHire - years181to365ImpliedPerHire;	
            	
            	double tenureFraction0to30 = years0to30PerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction31to60 = years31to60PerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction61to90 = years61to90PerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction91to180 = years91to180PerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction181to365 = years181to365PerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction366Plus = years366PlusPerHire/(thisTableRow.scaleParameter*Gamma.gamma(1+1/thisTableRow.shapeParameter));

            	double tenureFraction0to30Implied = years0to30ImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction31to60Implied = years31to60ImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction61to90Implied = years61to90ImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction91to180Implied = years91to180ImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction181to365Implied = years181to365ImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            	double tenureFraction366PlusImplied = years366PlusImpliedPerHire/(thisDesiredScale*Gamma.gamma(1+1/thisTableRow.shapeParameter));
            
            	double currentProductivity = (tenureFraction0to30*thisTableRow.productivity0To30 + tenureFraction31to60*thisTableRow.productivity31To60 + tenureFraction61to90*thisTableRow.productivity61To90 + tenureFraction91to180*thisTableRow.productivity91To180 + tenureFraction181to365*thisTableRow.productivity181To365 + tenureFraction366Plus*100)/100;

            	double impliedProductivity = (tenureFraction0to30Implied*thisTableRow.productivity0To30 + tenureFraction31to60Implied*thisTableRow.productivity31To60 + tenureFraction61to90Implied*thisTableRow.productivity61To90 + tenureFraction91to180Implied*thisTableRow.productivity91To180 + tenureFraction181to365Implied*thisTableRow.productivity181To365 + tenureFraction366PlusImplied*100)/100;

            	double quitProductivity = ((1-Math.exp(-Math.pow((30/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*thisTableRow.productivity0To30
            								+ (Math.exp(-Math.pow((30/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter))-Math.exp(-Math.pow((60/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*thisTableRow.productivity31To60
            								+ (Math.exp(-Math.pow((60/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter))-Math.exp(-Math.pow((90/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*thisTableRow.productivity61To90
            								+ (Math.exp(-Math.pow((90/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter))-Math.exp(-Math.pow((180/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*thisTableRow.productivity91To180
            								+ (Math.exp(-Math.pow((180/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter))-Math.exp(-Math.pow((365/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*thisTableRow.productivity181To365
            								+ (Math.exp(-Math.pow((365/365)/thisTableRow.scaleParameter, thisTableRow.shapeParameter)))*100)/100;

            	double quitProductivityImplied = ((1-Math.exp(-Math.pow((30/365)/thisDesiredScale, thisTableRow.shapeParameter)))*thisTableRow.productivity0To30
    					+ (Math.exp(-Math.pow((30/365)/thisDesiredScale, thisTableRow.shapeParameter))-Math.exp(-Math.pow((60/365)/thisDesiredScale, thisTableRow.shapeParameter)))*thisTableRow.productivity31To60
    					+ (Math.exp(-Math.pow((60/365)/thisDesiredScale, thisTableRow.shapeParameter))-Math.exp(-Math.pow((90/365)/thisDesiredScale, thisTableRow.shapeParameter)))*thisTableRow.productivity61To90
    					+ (Math.exp(-Math.pow((90/365)/thisDesiredScale, thisTableRow.shapeParameter))-Math.exp(-Math.pow((180/365)/thisDesiredScale, thisTableRow.shapeParameter)))*thisTableRow.productivity91To180
    					+ (Math.exp(-Math.pow((180/365)/thisDesiredScale, thisTableRow.shapeParameter))-Math.exp(-Math.pow((365/365)/thisDesiredScale, thisTableRow.shapeParameter)))*thisTableRow.productivity181To365
    					+ (Math.exp(-Math.pow((365/365)/thisDesiredScale, thisTableRow.shapeParameter)))*100)/100;


            	double productivityGain = (impliedProductivity - currentProductivity)*thisTableRow.valueAdded/currentProductivity;
            	
            	double currentVacancyCostPerHire = (quitProductivity*((float)thisTableRow.valueAdded/
            			thisTableRow.employeeHeadcount)/currentProductivity -
            			thisTableRow.totalCompensation)*thisTableRow.vacancyPeriod/52;

            	double impliedVacancyCostPerHire = (quitProductivityImplied*((float)thisTableRow.valueAdded/
            			thisTableRow.employeeHeadcount)/currentProductivity -
            			thisTableRow.totalCompensation)*thisTableRow.vacancyPeriod/52;

            	
            	thisTableRow.topLineGain = (int) (productivityGain + impliedVacancyCostPerHire*thisTableRow.impliedNewHires 
            					- currentVacancyCostPerHire*thisTableRow.currentNewHires);
            	
            	thisTableRow.bottomLineImpact = thisTableRow.topLineGain + thisTableRow.costSavings;

*/
            	/*System.out.println("Filter value is " + this.filterValues.get(thisFilterValueNo).filterValue + "\n"
            			+ "years0to30 is " + years0to30PerHire + "\n"  
            			+ "years31to60 is " + years31to60PerHire   + "\n"
            			+ "years61to90 is " + years61to90PerHire   + "\n"
            			+ "years91to180 is " + years91to180PerHire   + "\n"
            			+ "years181to365 is " + years181to365PerHire   + "\n"
            			+ "years366plus is " + years366PlusPerHire   + "\n"
            			+ "years0to30Implied is " + years0to30ImpliedPerHire + "\n"  
            			+ "years31to60Implied is " + years31to60ImpliedPerHire   + "\n"
            			+ "years61to90Implied is " + years61to90ImpliedPerHire   + "\n"
            			+ "years91to180Implied is " + years91to180ImpliedPerHire   + "\n"
            			+ "years181to365Implied is " + years181to365ImpliedPerHire   + "\n"
            			+ "years366plusImplied is " + years366PlusImpliedPerHire   + "\n"
            			+ "tenureFraction0to30 is " + tenureFraction0to30 + "\n"  
            			+ "tenureFraction31to60 is " + tenureFraction31to60 + "\n"
            			+ "tenureFraction61to90 is " + tenureFraction61to90   + "\n"
            			+ "tenureFraction91to180 is " + tenureFraction91to180   + "\n"
            			+ "tenureFraction181to365 is " + tenureFraction181to365 + "\n"
            			+ "tenureFraction366plus is " + tenureFraction366Plus + "\n"
            			+ "tenureFraction0to30Implied is " + tenureFraction0to30Implied + "\n"  
            			+ "tenureFraction31to60Implied is " + tenureFraction31to60Implied + "\n"
            			+ "tenureFraction61to90Implied is " + tenureFraction61to90Implied   + "\n"
            			+ "tenureFraction91to180Implied is " + tenureFraction91to180Implied   + "\n"
            			+ "tenureFraction181to365Implied is " + tenureFraction181to365Implied + "\n"
            			+ "tenureFraction366plusImplied is " + tenureFraction366PlusImplied + "\n"
            			+ "Current productivity is " + currentProductivity + "\n"
            			+ "Implied productivity is " + impliedProductivity + "\n"
            			+ "Current vacancy cost per hire is " + currentVacancyCostPerHire + "\n" 
            			+ "Implied vacancy cost per hire is " + impliedVacancyCostPerHire + "\n" 
            			+ "Current vacancy cost is " + (currentVacancyCostPerHire*thisTableRow.currentNewHires) + "\n" 
            			+ "Implied vacancy cost is " + (impliedVacancyCostPerHire*thisTableRow.impliedNewHires) + "\n"
            			+ "Productivity gain is " + productivityGain + "\n" + "\n"
            			);*/

    			
    		}
    	}
    	
    	
    }
    
    
    
    
    
    

    public boolean updateTable(String filterDatabase, String clientUserID,String clientInput ) throws Exception {  
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;
        String queryString = "";

        String currentModelID = null;
        Integer activeVersionNumber = null;
        int rowsAffected;        
        List<ClientTRImTableRow> clientTRImTableRows = null;
        
        try {
            currentModelID = StructuredDataParameters.getModelID(filterDatabase);
        } catch (Exception getModelIDException) {
            throw new Exception("Model ID is undefined.  Are there any filters defined?");
        }
        this.addMessage("Got model ID.");
        
        if ( currentModelID == null ) {
            throw new Exception("Model ID is undefined.  Are there any filters defined?");
        }
        
        if ( this.modelID != null && this.modelID != Integer.parseInt(currentModelID) && this.modelID >= 0 ) {
            throw new Exception("Model ID of filters is inconsistent with model ID of the table you are attempting to create.");            
        }
        
        if ( this.modelID == null || this.modelID < 0 ) {
            this.modelID = Integer.parseInt(currentModelID);
        }
        
        try {
            activeVersionNumber = ClientTRImTable.getActiveVersionNumber(filterDatabase);
        } catch (Exception getActiveVersionException) {
            throw new Exception("Error querying active table version number.");
        }
        this.addMessage("GOt active version.");

        if (activeVersionNumber == null ) {
            this.versionNumber = 1;
        }
        else {
            this.versionNumber = activeVersionNumber + 1;
        }       
        try {
            // The newInstance() call is a work around for some
            // broken Java implementations
            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
            throw driverInitException;
        }       
        try{        	
        	Gson gson = new Gson();
        	clientTRImTableRows = gson.fromJson(clientInput, new TypeToken<ArrayList<ClientTRImTableRow>>() {}.getType());

        } catch(Exception gsonException) {
        	throw new Exception("Error parsing JSON: " + gsonException.getMessage() + " String was " + clientInput);
        }
          
        //queryString = "UPDATE triminput "
               // + "SET totalcompensation= ? ,valueadded = ?,hiringcost = ?,trainingcost = ? ,vacancyperiod = ?,productivity0to30 = ? , productivity31to60 = ? , productivity61to90 = ? , productivity91to180 = ? , productivity181to365 = ? , clientuserid = ? "
               // + "WHERE categorylabel = ? "; 
        
        queryString="INSERT INTO usertriminput(clientuser,createddate,categorylabel,modelvariablename,"
        		+ "employeeheadcount,individualturnoverrate,valueadded,totalcompensation,hiringcost,trainingcost,vacancyperiod,"
        		+ "productivity0to30,productivity31to60,productivity61to90,productivity91to180,productivity181to365) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        
        //might want to add all fields on the table + schemlabel
        
        System.out.println(queryString);

        try {
            con = DriverManager.getConnection(url, user, password);
            con.setAutoCommit(false);
            st = con.prepareStatement(queryString);
           
        for(ClientTRImTableRow clientTRImTableRow:clientTRImTableRows){
           // java.sql.Date today = new java.sql.Date(Calendar.getInstance().getTime().getTime());
        	String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
        	st.setString(1, clientUserID);
        	st.setString(2,timeStamp);
            st.setString(3,clientTRImTableRow.getFilterValue());
            st.setString(4,"Location");
            st.setDouble(5,clientTRImTableRow.getEmployeeHeadcount());
            st.setDouble(6,clientTRImTableRow.getIndividualTurnoverRate());
            st.setInt(7, clientTRImTableRow.getValueAdded());
        	st.setDouble(8,  clientTRImTableRow.getTotalCompensation());
            st.setDouble(9, clientTRImTableRow.getHiringCost());
            st.setDouble(10, clientTRImTableRow.getTrainingCost());
            st.setDouble(11, clientTRImTableRow.getVacancyPeriod());
            st.setDouble(12, clientTRImTableRow.getProductivity0To30());
            st.setDouble(13, clientTRImTableRow.getProductivity31To60());
            st.setDouble(14, clientTRImTableRow.getProductivity61To90());
            st.setDouble(15, clientTRImTableRow.getProductivity91To180());
            st.setDouble(16, clientTRImTableRow.getProductivity181To365());
            st.addBatch();
            this.addMessage(st.toString());
        } 
        st.executeBatch();
        con.commit();
        fetchData(clientTRImTableRows,filterDatabase);

        return true;
        }catch(BatchUpdateException batchexception){
            Exception bexception = new Exception("Batch Update failed: Exception is " + batchexception.getMessage().replaceAll("'","`"));
            throw bexception;
        }catch (SQLException queryException) {
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

    
    
    public void fetchData(List<ClientTRImTableRow> updatedValues,String filterDatabase) throws Exception {
        
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        ClientTRImTableRow thisTRImTableRow = null;
        
        
        String url = DatabaseParameters.url + filterDatabase;
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
            st = con.prepareStatement("SELECT modelid , modelvariablename , categorylabel, employeeheadcount , individualturnoverrate ,shapeparameter , scaleparameter FROM triminput;");
            rs = st.executeQuery();
            
            while(rs.next()) {
            	int index = 0;
            	 if ( rs.getString("categorylabel") != null && !("").equals(rs.getString("categorylabel").trim()) ) {
            		 for(ClientTRImTableRow row :updatedValues){
            			 String categoryLabel = rs.getString("categorylabel");
            			 if(categoryLabel.equalsIgnoreCase(row.getFilterValue())){
            				 index =updatedValues.indexOf(row);
            			 }
            		 }
                 }            	

                if ( rs.getString("modelid") != null && !("").equals(rs.getString("modelid").trim()) ) {
                    this.modelID = rs.getInt("modelid");
                }
                if ( rs.getString("modelvariablename") != null && !("").equals(rs.getString("modelvariablename").trim()) ) {
                    this.filterName = rs.getString("modelvariablename");
                }
               
                if ( rs.getString("employeeheadcount") != null && !("").equals(rs.getString("employeeheadcount").trim()) ) {
                	updatedValues.get(index).employeeHeadcount = rs.getDouble("employeeheadcount");
                }
                if ( rs.getString("individualturnoverrate") != null && !("").equals(rs.getString("individualturnoverrate").trim()) ) {
                	updatedValues.get(index).individualTurnoverRate = rs.getDouble("individualturnoverrate");
                }
                if ( rs.getString("shapeparameter") != null && !("").equals(rs.getString("shapeparameter").trim()) ) {
                	updatedValues.get(index).shapeParameter = rs.getDouble("shapeparameter");
                    if ( rs.getString("scaleparameter") != null && !("").equals(rs.getString("scaleparameter").trim()) ) {
                    	updatedValues.get(index).scaleParameter = rs.getDouble("scaleparameter");
                    	updatedValues.get(index).annualTurnover = (double) (1-Math.exp(-(Math.pow((1/updatedValues.get(index).scaleParameter),updatedValues.get(index).shapeParameter))));                        
                    }

                }
                updatedValues.get(index).productivityGreater365=100.0;

                this.addFilterValue(updatedValues.get(index));                              
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
        //this.schemeLabel = "Tweedle";
        if ( this.schemeLabel != null ) {
        	populateReductionScheme(filterDatabase);
        	ClientTRImTableRow allRow = new ClientTRImTableRow();
        	allRow.filterValue = "All";
        	allRow.employeeHeadcount = (double) 0;
        	allRow.individualTurnoverRate = (double) 0;
        	allRow.valueAdded = 0;
        	allRow.totalCompensation = (double) 0;
        	allRow.hiringCost = (double) 0;
        	allRow.trainingCost = (double) 0;
        	allRow.trainingPeriod = (double) 0;
        	allRow.vacancyPeriod = (double) 0;
        	allRow.annualTurnover = (double) 0;
        	allRow.reduction = (double) 0;
        	allRow.shapeParameter = (double) 0;
        	allRow.scaleParameter = (double) 0;
        	allRow.productivity0To30 = (double) 0;
        	allRow.productivity31To60 = (double) 0;
        	allRow.productivity61To90 = (double) 0;
        	allRow.productivity91To180 = (double) 0;
        	allRow.productivity181To365 = (double) 0;
        	allRow.impliedTurnover = (double) 0;
        	allRow.topLineGain = (double) 0;
        	allRow.costSavings = (double) 0;
        	allRow.bottomLineImpact = (double) 0;
        	allRow.hireReductionPercent = (double) 0;
        	allRow.hireReductionNumber = 0;
        	allRow.currentNewHires = (double) 0;
        	allRow.impliedNewHires = (double) 0;

        	for (int thisFilterValueNo = 0 ; thisFilterValueNo < this.filterValues.size(); thisFilterValueNo++ ) {
        		Double thisHeadcount = this.filterValues.get(thisFilterValueNo).employeeHeadcount;
        		allRow.employeeHeadcount += thisHeadcount;
            	allRow.individualTurnoverRate += this.filterValues.get(thisFilterValueNo).individualTurnoverRate*thisHeadcount;
            	allRow.valueAdded += this.filterValues.get(thisFilterValueNo).valueAdded;
            	allRow.totalCompensation += this.filterValues.get(thisFilterValueNo).totalCompensation*thisHeadcount;
            	allRow.hiringCost += this.filterValues.get(thisFilterValueNo).hiringCost*thisHeadcount;
            	allRow.trainingCost += this.filterValues.get(thisFilterValueNo).trainingCost*thisHeadcount;
            	allRow.trainingPeriod += this.filterValues.get(thisFilterValueNo).trainingPeriod*thisHeadcount;
            	allRow.vacancyPeriod += this.filterValues.get(thisFilterValueNo).vacancyPeriod*thisHeadcount;
            	allRow.annualTurnover += this.filterValues.get(thisFilterValueNo).annualTurnover*thisHeadcount;
            	allRow.reduction += this.filterValues.get(thisFilterValueNo).reduction*thisHeadcount;
            	allRow.shapeParameter += this.filterValues.get(thisFilterValueNo).shapeParameter*thisHeadcount ;
            	allRow.scaleParameter += this.filterValues.get(thisFilterValueNo).scaleParameter*thisHeadcount ;
            	allRow.productivity0To30 += this.filterValues.get(thisFilterValueNo).productivity0To30*thisHeadcount ;
            	allRow.productivity31To60 += this.filterValues.get(thisFilterValueNo).productivity31To60*thisHeadcount ;
            	allRow.productivity61To90 += this.filterValues.get(thisFilterValueNo).productivity61To90*thisHeadcount ;
            	allRow.productivity91To180 += this.filterValues.get(thisFilterValueNo).productivity91To180*thisHeadcount ;
            	allRow.productivity181To365 += this.filterValues.get(thisFilterValueNo).productivity181To365*thisHeadcount ;
            	allRow.impliedTurnover += this.filterValues.get(thisFilterValueNo).impliedTurnover*thisHeadcount;
            	allRow.topLineGain += this.filterValues.get(thisFilterValueNo).topLineGain;
            	allRow.costSavings += this.filterValues.get(thisFilterValueNo).costSavings;
            	allRow.bottomLineImpact += this.filterValues.get(thisFilterValueNo).bottomLineImpact;
            	//allRow.hireReductionPercent += this.filterValues.get(thisFilterValueNo).hireReductionPercent*thisHeadcount;
            	allRow.hireReductionNumber += this.filterValues.get(thisFilterValueNo).hireReductionNumber;
            	allRow.currentNewHires += this.filterValues.get(thisFilterValueNo).currentNewHires;
            	allRow.impliedNewHires += this.filterValues.get(thisFilterValueNo).impliedNewHires;
        		
        	}
        	
        	Gson gson = new Gson();
        	this.addMessage(gson.toJson(allRow));

        	allRow.individualTurnoverRate = allRow.individualTurnoverRate/allRow.employeeHeadcount;
        	allRow.totalCompensation = allRow.totalCompensation/allRow.employeeHeadcount;
        	allRow.hiringCost = allRow.hiringCost/allRow.employeeHeadcount;
        	allRow.trainingCost = allRow.trainingCost/allRow.employeeHeadcount;
        	allRow.trainingPeriod = allRow.trainingPeriod/allRow.employeeHeadcount;
        	allRow.vacancyPeriod = allRow.vacancyPeriod/allRow.employeeHeadcount;
        	allRow.annualTurnover = allRow.annualTurnover/allRow.employeeHeadcount;
        	allRow.reduction = allRow.reduction/allRow.employeeHeadcount;
        	allRow.shapeParameter = allRow.shapeParameter/allRow.employeeHeadcount ;
        	allRow.scaleParameter = allRow.scaleParameter/allRow.employeeHeadcount;
        	allRow.productivity0To30 = allRow.productivity0To30/allRow.employeeHeadcount;
        	allRow.productivity31To60 = allRow.productivity31To60/allRow.employeeHeadcount;
        	allRow.productivity61To90 = allRow.productivity61To90/allRow.employeeHeadcount;
        	allRow.productivity91To180 = allRow.productivity91To180/allRow.employeeHeadcount;
        	allRow.productivity181To365 = allRow.productivity181To365/allRow.employeeHeadcount;
        	allRow.impliedTurnover = allRow.impliedTurnover/allRow.employeeHeadcount;
        	allRow.hireReductionPercent = allRow.hireReductionPercent/allRow.employeeHeadcount;
        	this.addFilterValue(allRow);

        }
        //Null out the shape and scale so the client doesn't see them
        for (int i = 0 ; i < this.filterValues.size(); i++ ) {
        	this.filterValues.get(i).shapeParameter = null;
        	this.filterValues.get(i).scaleParameter = null;
        }
    	
    	
    }
    

    /*This function was used to set company-wide productivity.  Could be resurrected if we resurrect that measure....
    public boolean updateProductivity(String filterDatabase, Integer clientUserID ) throws Exception {       
        Connection con = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        String url = DatabaseParameters.url + filterDatabase;
        String user = DatabaseParameters.username;
        String password = DatabaseParameters.password;
        String queryString = "";

        String currentModelID = null;
        Integer activeVersionNumber = null;
        int rowsAffected = 0;        
        List<ClientTRImTableRow> clientTRImTableRows = null;


        
        try {
            currentModelID = StructuredDataParameters.getModelID(filterDatabase);
        } catch (Exception getModelIDException) {
            throw new Exception("Model ID is undefined.  Are there any filters defined?");
        }
        
        if ( currentModelID == null ) {
            throw new Exception("Model ID is undefined.  Are there any filters defined?");
        }

        try {
            activeVersionNumber = ClientTRImTable.getActiveVersionNumber(filterDatabase);
        } catch (Exception getActiveVersionException) {
            throw new Exception("Error querying active table version number.");
        }

        if (activeVersionNumber == null ) {
            this.versionNumber = 1;
        }
        else {
            this.versionNumber = activeVersionNumber + 1;
        }       
        try {
            // The newInstance() call is a work around for some
            // broken Java implementations
            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (Exception openException) {
            Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
            throw driverInitException;
        }       
        
        //if (rowsAffected == 0 ) { throw new Exception("Fter checks, before update.");}
        
        
        queryString = "UPDATE triminput "
                + "SET productivity0to30 = ? , productivity31to60 = ? , productivity61to90 = ? , productivity91to180 = ? , productivity181to365 = ? , versionnumber = ? , createddate = ? , clientuserid = ?;";  
        try {
            con = DriverManager.getConnection(url, user, password);
            st = con.prepareStatement(queryString);

            java.sql.Date today = new java.sql.Date(Calendar.getInstance().getTime().getTime());
            st.setDouble(1,  this.productivity0to30);
            st.setDouble(2,  this.productivity31to60);
            st.setDouble(3,  this.productivity61to90);
            st.setDouble(4,  this.productivity91to180);
            st.setDouble(5,  this.productivity181to365);
            st.setInt(6, this.versionNumber);
            st.setDate(7, today);
            st.setInt(8, clientUserID);
            rowsAffected = st.executeUpdate();

            //if (rowsAffected != -1 ) {
            //	throw new Exception("Rows affected is " + rowsAffected + " , statement is " + st);
            //}
            return (rowsAffected > 0);
        }catch(Exception updateException){
            Exception bexception = new Exception("Update failed: Exception is " + updateException.getMessage().replaceAll("'","`") + ", query was " + st );
            throw bexception;
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
                Exception rethrownCloseException = new Exception("Closing SQL query failed:" + closeSQLException.getMessage());
                throw rethrownCloseException;
            }
        }
   }*/


    /* This is for the company-wide productivity values.  Could be resurrected at some point....
   public void populateProductivityValues(String clientInput) throws Exception {
	   Gson gson = new Gson();
	   ClientTRImTable skeletonTable = new ClientTRImTable();
	   try{
        	skeletonTable = gson.fromJson(clientInput, new TypeToken<ClientTRImTable>() {}.getType());
        } catch(Exception gsonException) {
        	throw new Exception("Error parsing JSON: " + gsonException.getMessage());
        }
	   if ( skeletonTable.productivity0to30 != null ) {
		   this.productivity0to30 = skeletonTable.productivity0to30;
	   }
	   else {
		   throw new Exception("Productivity0to30 not specified.");
	   }
	   if ( skeletonTable.productivity31to60 != null ) {
		   this.productivity31to60 = skeletonTable.productivity31to60;
	   }
	   else {
		   throw new Exception("Productivity31to60 not specified.");
	   }
	   if ( skeletonTable.productivity61to90 != null ) {
		   this.productivity61to90 = skeletonTable.productivity61to90;
	   }
	   else {
		   throw new Exception("Productivity61to90 not specified.");
	   }
	   if ( skeletonTable.productivity91to180 != null ) {
		   this.productivity91to180 = skeletonTable.productivity91to180;
	   }
	   else {
		   throw new Exception("Productivity91to180 not specified.");
	   }
	   if ( skeletonTable.productivity181to365 != null ) {
		   this.productivity181to365 = skeletonTable.productivity181to365;
	   }
	   else {
		   throw new Exception("Productivity181to365 not specified.");
	   }
   }
   */

	   
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