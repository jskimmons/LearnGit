package com.talenteck.ttanalytics;

//import javax.xml.bind.JAXBContext;
//import javax.xml.bind.JAXBException;
//import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.io.PrintWriter;


	//This class mainly exists for the JAXB marshaller to create the headcount table XML document,
	//but it also was a convenient place to add the function to place the error message in that document.

	@XmlRootElement
public class HeadcountTable {
	int firstMonth;
	int firstMonthYear;
	int lastMonth;
	int lastMonthYear;
	ArrayList<HeadcountFilter> filterList;
	Messages messages;

	@XmlElement(name = "Location")
	public void setFilterList(ArrayList<HeadcountFilter> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<HeadcountFilter> getFilterList() {
		return this.filterList;
	}

	public void addHeadcountFilter(HeadcountFilter filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<HeadcountFilter>();
		}
		this.filterList.add(filter);
	}

		
	@XmlElement(name = "Messages")
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	@XmlElement(name = "FirstMonth")
	public void setFirstMonth(int month) {
		this.firstMonth = month;
	}
		
	int getFirstMonth(){
		return this.firstMonth;
	}

	@XmlElement(name = "FirstMonthYear")
	public void setFirstMonthYear(int year) {
		this.firstMonthYear = year;
	}
		
	int getFirstMonthYear(){
		return this.firstMonthYear;
	}

	@XmlElement(name = "LastMonth")
	public void setLastMonth(int month) {
		this.lastMonth = month;
	}
		
	int getLastMonth(){
		return this.lastMonth;
	}

	@XmlElement(name = "LastMonthYear")
	public void setLastMonthYear(int year) {
		this.lastMonthYear = year;
	}
		
	int getLastMonthYear(){
		return this.lastMonthYear;
	}

    public void addMessage(String message) {
        if ( this.messages == null ) {
        	this.messages = new Messages();
        }
        this.messages.addMessage(message); 
    }

		
	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		StructuredDataParameters dataParameters = null;
		int firstQueriedMonthNo, lastQueriedMonthNo;
		int firstSampleMonthNo , lastSampleMonthNo;
		String fullSampleWhereStatement = "";
		String timePeriodCondition = "";
		int lastMonthNo = 0;
		int firstMonthNo = 36000;

		HeadcountSelectionPeriod thisMonth = null;
		HeadcountFilterValue thisFilterValue = null;
		HeadcountFilter thisFilter = null;
		String thisFilterName = null;
		FilterList activeFilters = new FilterList();
		Hashtable<String,HeadcountFilterValue> thisFilterHash = null;
		Hashtable<String,Hashtable<String,HeadcountFilterValue>> filterValueListTable = new Hashtable<String,Hashtable<String,HeadcountFilterValue>>(); 
		Hashtable<String,HeadcountFilter> filterListTable = new Hashtable<String,HeadcountFilter>();
		
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

		try {

			con = DriverManager.getConnection(url, user, password);

		} catch (Exception connectException) {
			Exception driverInitException = new Exception("Failed to connect to database:" + connectException.getMessage());
			throw driverInitException;
		}

		
		String query = "SELECT    periodname , periodlabel , periodyear , startemployment , hires , terminations , seatturnover , " +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 "  + 
			    " FROM employees ORDER BY periodname;";
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			int rowsReturned = 0;
			while (rs.next() ) {
				rowsReturned++;

				int activeFilterNo = -1;
				int totalActiveFilters = 0;
				int totalNullFilters = 0;
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null &&
							!("All").equals(rs.getString("filtervalue" + i)) ) {
						activeFilterNo = i;
						totalActiveFilters++;
					}
					if ( rs.getString("filtername" + i) == null ) {
						totalNullFilters++;
					}
				}

				switch ( totalActiveFilters ) {
				case 0:
					
					if ( totalNullFilters < 5 ) {
						if ( filterValueListTable.get("All") == null ) {
							thisFilter = new HeadcountFilter();
							thisFilter.setFilterName("All");
							filterListTable.put("All",thisFilter);
							thisFilterHash = new Hashtable<String,HeadcountFilterValue>();
							thisFilterValue = new HeadcountFilterValue();
							thisFilterValue.setFilterValue("All");
							thisFilter.addFilterValue(thisFilterValue);
							this.addHeadcountFilter(thisFilter);
							thisFilterHash.put("All",thisFilterValue);
							filterValueListTable.put("All", thisFilterHash);
						}
						else {
							thisFilterHash = filterValueListTable.get("All");
							thisFilterValue = thisFilterHash.get("All");
						}
						thisMonth = new HeadcountSelectionPeriod();
						thisMonth.setMonth(Integer.parseInt(rs.getString("periodname").substring(5,7)));
						thisMonth.setYear(Integer.parseInt(rs.getString("periodname").substring(0,4)));
						thisMonth.setStartEmployment(rs.getInt("startemployment"));
						thisMonth.setHires(rs.getInt("hires"));
						thisMonth.setTerminations(rs.getInt("terminations"));
						thisMonth.setSeatTurnover(rs.getDouble("seatturnover"));
						thisFilterValue.addPeriod(thisMonth);
						if ( 12*thisMonth.year + thisMonth.month > lastMonthNo ) {
							lastMonthNo = 12*thisMonth.year + thisMonth.month ;
						}
						//System.out.println("thisMonth" + thisMonth);
						//System.out.println("lastMonth" + (lastMonthNo - 12*this.lastMonthYear + 1));
						if ( thisMonth.year != 0 &&  12*thisMonth.year + thisMonth.month < firstMonthNo ) {
							firstMonthNo = 12*thisMonth.year + thisMonth.month;
						}
					}
					
				break;
				case 1:
					
					if ( totalNullFilters < 5 ) {
						
						if ( filterValueListTable.get(rs.getString("filtername" + activeFilterNo)) == null ) {
							thisFilter = new HeadcountFilter();
							thisFilter.setFilterName(rs.getString("filtername" + activeFilterNo));
							filterListTable.put(rs.getString("filtername" + activeFilterNo),thisFilter);
							thisFilterHash = new Hashtable<String,HeadcountFilterValue>();
							thisFilterValue = new HeadcountFilterValue();
							thisFilterValue.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
							thisFilter.addFilterValue(thisFilterValue);
							this.addHeadcountFilter(thisFilter);
							thisFilterHash.put(rs.getString("filtervalue" + activeFilterNo),thisFilterValue);
							filterValueListTable.put(rs.getString("filtername" + activeFilterNo), thisFilterHash);	
						}
						else {
							thisFilterHash = filterValueListTable.get(rs.getString("filtername" + activeFilterNo));
							if ( thisFilterHash.get(rs.getString("filtervalue" + activeFilterNo)) == null ) {
								thisFilter = filterListTable.get(rs.getString("filtername" + activeFilterNo));
								if ( thisFilter == null ) {
									throw new Exception("Found null filter where it shouldn't be null.");
								}
								thisFilterValue = new HeadcountFilterValue();
								thisFilterValue.setFilterValue(rs.getString("filtervalue" + activeFilterNo));
								thisFilter.addFilterValue(thisFilterValue);
								thisFilterHash.put(rs.getString("filtervalue" + activeFilterNo),thisFilterValue);								
							}
							else {
								thisFilterValue = thisFilterHash.get(rs.getString("filtervalue" + activeFilterNo));
							}
						}
						
						thisMonth = new HeadcountSelectionPeriod();
						thisMonth.setMonth(Integer.parseInt(rs.getString("periodname").substring(5,7)));
						thisMonth.setYear(Integer.parseInt(rs.getString("periodname").substring(0,4)));
						thisMonth.setStartEmployment(rs.getInt("startemployment"));
						thisMonth.setHires(rs.getInt("hires"));
						thisMonth.setTerminations(rs.getInt("terminations"));
						thisMonth.setSeatTurnover(rs.getDouble("seatturnover"));
						thisFilterValue.addPeriod(thisMonth);
					}
					
				break;
					
				default:
				break;
						
				}	

				
			}
			
			
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			
			this.setFirstMonthYear((int)firstMonthNo/12);
			this.setFirstMonth(firstMonthNo - 12*this.firstMonthYear + 1);
			this.setLastMonthYear((int)lastMonthNo/12);
			this.setLastMonth(lastMonthNo - 12*this.lastMonthYear + 1);
			

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
			writer.println("JSON exception:" + e.getMessage());
		}
		return;
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

		
		
} 
	