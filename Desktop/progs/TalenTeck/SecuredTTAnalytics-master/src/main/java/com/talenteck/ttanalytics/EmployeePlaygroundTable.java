package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class EmployeePlaygroundTable {

	String filterName;
	String defaultFilterValue;
	ArrayList<EmployeePlaygroundFilterValue> filterValues;
	ArrayList<EmployeePlaygroundGraphData> graphData;

	Messages messages;

	public String getFilterName() {
		return filterName;
	}

	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}

	public String getDefaultFilterValue() {
		return defaultFilterValue;
	}

	public void setDefaultFilterValue(String defaultFilterValue) {
		this.defaultFilterValue = defaultFilterValue;
	}

	public ArrayList<EmployeePlaygroundFilterValue> getFilterValues() {
		return filterValues;
	}

	public void setFilterValues(ArrayList<EmployeePlaygroundFilterValue> filterValues) {
		this.filterValues = filterValues;
	}

	public Messages getMessages() {
		return messages;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public void addFilterValue(EmployeePlaygroundFilterValue filterValue) {
		if (this.filterValues == null) {
			this.filterValues = new ArrayList<EmployeePlaygroundFilterValue>();
		}
		this.filterValues.add(filterValue);
	}

	public void addMessage(String message) {
		if (this.messages == null) {
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	public void fetchData(String database) throws Exception {

		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		Hashtable<String, EmployeePlaygroundFilterValue> filterValueIndex = new Hashtable<>();
		Hashtable<String, Hashtable<String, EmployeePlaygroundFilterValueVariable>> variableIndexIndex = new Hashtable<>();
		Hashtable<String, EmployeePlaygroundFilterValueVariable> thisFilterValueIndex = null;

		String thisFilterName = null;
		String thisDefaultFilterValue = null;
		ArrayList<EmployeePlaygroundFilterValue> thisFilterValues = new ArrayList<>();

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

		String query = "SELECT filtername1,filtervalue1 ,filtername2,filtervalue2, variablename ,variablelabel , categoryname , "
				+ "categorylabel,coefficient ,defaultvalue , meanoutput ,  defaultfiltervalue , sortorder "
				+ "FROM employeeplayground ORDER BY filtervalue1 ,filtervalue2, variablename , categoryname";

		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			boolean overallValuesSet = false;
			
			while (rs.next()) {
					if ( !overallValuesSet ) {
						thisFilterName = rs.getString("filtername1");
						thisDefaultFilterValue = rs.getString("defaultfiltervalue");
						overallValuesSet = true;
					}
					
					String thisFilterValueName = rs.getString("filtervalue1"); 
					String thisTenure = rs.getString("filtervalue2"); 
					
					EmployeePlaygroundFilterValue thisFilterValue = filterValueIndex.get(thisFilterValueName + ":" +thisTenure);
					if ( thisFilterValue == null ) {
						thisFilterValue = new EmployeePlaygroundFilterValue();
						filterValueIndex.put(thisFilterValueName+ ":" +thisTenure , thisFilterValue);
						thisFilterValueIndex = new Hashtable<>();
						variableIndexIndex.put(thisFilterValueName, thisFilterValueIndex);
						
						thisFilterValue.setFilterValue(thisFilterValueName);
						thisFilterValue.setTenure(thisTenure);
						thisFilterValue.setMeanOutput(rs.getDouble("meanoutput"));
						thisFilterValues.add(thisFilterValue);
					}
					else {
						thisFilterValueIndex = variableIndexIndex.get(thisFilterValueName);
					}
					
					String thisVariableName = rs.getString("variablename");
					if ( ("XXCONSTANT").equals(thisVariableName)) {
						thisFilterValue.setConstantTerm(rs.getDouble("coefficient"));
					}
					else {
						EmployeePlaygroundFilterValueVariable thisVariable = thisFilterValueIndex.get(thisFilterValueName + ":" +thisTenure + ":" + thisVariableName);
						if (thisVariable == null ) {
							thisVariable = new EmployeePlaygroundFilterValueVariable();
							thisFilterValueIndex.put(thisFilterValueName + ":" +thisTenure + ":" + thisVariableName,thisVariable);
							thisVariable.setVariableName(thisVariableName);
							thisVariable.setVariableLabel(rs.getString("variablelabel"));
							thisFilterValue.addVariable(thisVariable);
						}
						
						EmployeePlaygroundCategory thisCategory = new EmployeePlaygroundCategory();
						
						thisCategory.setCategoryLabel(rs.getString("categorylabel"));
						thisCategory.setCategoryName(rs.getString("categoryname"));
						thisCategory.setCoefficient(rs.getDouble("coefficient"));
						thisCategory.setSortOrder(rs.getInt("sortorder"));
						
						thisVariable.addCategory(thisCategory);
						if ( rs.getBoolean("defaultvalue")) {
							thisVariable.setDefaultCategory(thisCategory.getCategoryName());
						}						
					}					
				}
			
				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
				}
			
		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage() + " and " + queryException.getStackTrace()[0]);
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

		this.setFilterName(thisFilterName);
		this.setDefaultFilterValue(thisDefaultFilterValue);
		this.setFilterValues(thisFilterValues);
		
		
		Hashtable<String, EmployeePlaygroundGraphData> tempStorage = new Hashtable<String, EmployeePlaygroundGraphData>();

		query = "SELECT count, goodscore, averagescore, badscore, filtervalue1 FROM turnoverprofile ORDER BY filtervalue1 DESC, count ASC";

		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next()) {
				//System.out.println("rs.getString(filtervalue1)" + rs.getString("filtervalue1"));
				EmployeePlaygroundGraphDatapoint tempDatapoint = new EmployeePlaygroundGraphDatapoint();
				tempDatapoint.setCount(rs.getInt("count"));
				tempDatapoint.setGoodScore(rs.getDouble("goodscore"));
				tempDatapoint.setAverageScore(rs.getDouble("averagescore"));
				tempDatapoint.setBadScore(rs.getDouble("badscore"));
				if (!tempStorage.containsKey(rs.getString("filtervalue1"))) {
					EmployeePlaygroundGraphData tempData = new EmployeePlaygroundGraphData();
					tempData.setLocation(rs.getString("filtervalue1"));
					tempData.addDatapoint(tempDatapoint);
					tempStorage.put(rs.getString("filtervalue1"), tempData);
				} else {
					EmployeePlaygroundGraphData tempData = tempStorage.get(rs.getString("filtervalue1"));
					
					
					tempData.addDatapoint(tempDatapoint);
				}
			}
		
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}

		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage() + " and " + queryException.getStackTrace()[0]);
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

		graphData = new ArrayList<EmployeePlaygroundGraphData>();
		for (String s : tempStorage.keySet()) {
			//System.out.println(s);
			graphData.add(tempStorage.get(s));
		}
		//System.out.println("Conversion done");


	}

	public void insertErrorAndWrite(String errorMessage, PrintWriter writer) {
		this.addMessage(errorMessage);
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();
			gsonBuilder.serializeSpecialFloatingPointValues();
			Gson gson = gsonBuilder.setPrettyPrinting().create();
			// Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	public void writeSuccess(PrintWriter writer) {
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();
			gsonBuilder.serializeSpecialFloatingPointValues();
			Gson gson = gsonBuilder.setPrettyPrinting().create();
			// Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

}
