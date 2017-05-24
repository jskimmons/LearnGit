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

public class ApplicantPlaygroundTable {

	String filterName;
	String defaultFilterValue;
	String defaultFilterValue2;
	ArrayList<ApplicantPlaygroundFilterValue> filterValues;
	ArrayList<ApplicantPlaygroundFilterValue> graphFilterValues;
	ArrayList<EmployeePlaygroundGraphData> graphData;

	Messages messages;

	public String getDefaultFilterValue2() {
		return defaultFilterValue2;
	}

	public void setDefaultFilterValue2(String defaultFilterValue2) {
		this.defaultFilterValue2 = defaultFilterValue2;
	}
	
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

	public ArrayList<ApplicantPlaygroundFilterValue> getFilterValues() {
		return filterValues;
	}

	public void setFilterValues(ArrayList<ApplicantPlaygroundFilterValue> filterValues) {
		this.filterValues = filterValues;
	}

	public Messages getMessages() {
		return messages;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public void addFilterValue(ApplicantPlaygroundFilterValue filterValue) {
		if (this.filterValues == null) {
			this.filterValues = new ArrayList<ApplicantPlaygroundFilterValue>();
		}
		this.filterValues.add(filterValue);
	}
	
	public void addGraphFilterValue(ApplicantPlaygroundFilterValue filterValue) {
		if (this.graphFilterValues == null) {
			this.graphFilterValues = new ArrayList<ApplicantPlaygroundFilterValue>();
		}
		this.graphFilterValues.add(filterValue);
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

		Hashtable<String, ApplicantPlaygroundFilterValue> filterValueIndex = new Hashtable<>();
		Hashtable<String, Hashtable<String, ApplicantPlaygroundFilterValueVariable>> variableIndexIndex = new Hashtable<>();
		Hashtable<String, ApplicantPlaygroundFilterValueVariable> thisFilterValueIndex = null;

		String thisFilterName = null;
		String thisDefaultFilterValue = null;
		String thisDefaultFilterValue2 = null;
		ArrayList<ApplicantPlaygroundFilterValue> thisFilterValues = new ArrayList<>();

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

		String query = "SELECT filtername1 , filtervalue1 , filtername2 , filtervalue2 , variable, variabletype , influence , "
				+ "defaultselectorname1, defaultselectorvalue1, defaultselectorname2, defaultselectorvalue2 , periodname, periodlabel "
				+ "FROM applicantinfluence ORDER BY filtervalue1 , filtervalue2, influence DESC";

		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			boolean overallValuesSet = false;

			while (rs.next()) {
				if (!overallValuesSet) {
					thisFilterName = rs.getString("filtername1");
					thisDefaultFilterValue = rs.getString("defaultselectorvalue1");
					thisDefaultFilterValue2 = rs.getString("defaultselectorvalue2");
					overallValuesSet = true;
				}

				String thisFilterValueName = rs.getString("filtervalue1");
				String thisTenure = rs.getString("filtervalue2");

				ApplicantPlaygroundFilterValue thisFilterValue = filterValueIndex.get(thisFilterValueName + ":" + thisTenure);
				if (thisFilterValue == null) {
					thisFilterValue = new ApplicantPlaygroundFilterValue();
					filterValueIndex.put(thisFilterValueName + ":" + thisTenure, thisFilterValue);
					thisFilterValueIndex = new Hashtable<>();
					variableIndexIndex.put(thisFilterValueName, thisFilterValueIndex);

					thisFilterValue.setFilterValue(thisFilterValueName);
					thisFilterValue.setTurnoverRate(thisTenure);
					thisFilterValues.add(thisFilterValue);
				} else {
					thisFilterValueIndex = variableIndexIndex.get(thisFilterValueName);
				}

				String thisVariableName = rs.getString("variable");
				String thisVariableType = rs.getString("variabletype");

				// if ( ("XXCONSTANT").equals(thisVariableName)) {
				// thisFilterValue.setConstantTerm(rs.getDouble("coefficient"));
				// }
				// else {
				ApplicantPlaygroundFilterValueVariable thisVariable = thisFilterValueIndex.get(thisFilterValueName + ":" + thisTenure + ":" + thisVariableName);
				if (thisVariable == null) {
					thisVariable = new ApplicantPlaygroundFilterValueVariable();
					thisFilterValueIndex.put(thisFilterValueName + ":" + thisTenure + ":" + thisVariableName, thisVariable);
					thisVariable.setVariableName(thisVariableName);
					thisVariable.setVariableLabel(thisVariableType);
					thisVariable.setCoefficient(rs.getDouble("influence"));
					thisVariable.setDefaultCategory(rs.getString("defaultselectorvalue1"));
					thisFilterValue.addVariable(thisVariable);
				}
			}

			// }

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}

		} catch (Exception queryException) {
			queryException.printStackTrace();
			Exception rethrownQueryException = new Exception(
					"Error during SQL query:" + queryException.getMessage() + " and " + queryException.getStackTrace()[0]);
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
		this.setDefaultFilterValue2(thisDefaultFilterValue2);

		this.setFilterValues(thisFilterValues);

		Hashtable<String, EmployeePlaygroundGraphData> tempStorage = new Hashtable<String, EmployeePlaygroundGraphData>();

		query = "SELECT count, goodscore, averagescore, badscore, filtervalue1 FROM applicantturnoverprofile ORDER BY filtervalue1 DESC, count ASC";

		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next()) {
				// System.out.println("rs.getString(filtervalue1)" + rs.getString("filtervalue1"));
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
			queryException.printStackTrace();
			Exception rethrownQueryException = new Exception(
					"Error during SQL query:" + queryException.getMessage() + " and " + queryException.getStackTrace()[0]);
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
			// System.out.println(s);
			graphData.add(tempStorage.get(s));
		}
		// System.out.println("Conversion done");

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
