package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;

import org.springframework.web.context.request.RequestContextHolder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class EmployeeRiskReportTable {

	ArrayList<EmployeeRiskReportTableRow> rows;
	Messages messages;
	ArrayList<FilterSelection> filterSelectionList;

	public ArrayList<FilterSelection> getFilterSelectionList() {
		return filterSelectionList;
	}

	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}

	public void setRows(ArrayList<EmployeeRiskReportTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<EmployeeRiskReportTableRow> getRows() {
		return rows;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(EmployeeRiskReportTableRow row) {
		if (this.rows == null) {
			this.rows = new ArrayList<EmployeeRiskReportTableRow>();
		}
		this.rows.add(row);
	}

	public void addMessage(String message) {
		if (this.messages == null) {
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	public void addFilterSelection(FilterSelection filterSelection) {
		if (this.filterSelectionList == null) {
			this.filterSelectionList = new ArrayList<FilterSelection>();
		}
		this.filterSelectionList.add(filterSelection);
	}

	public void populateSelectorsFromJSON(String json, String database) throws Exception {

		Gson gson = new Gson();
		Hashtable<String, HashSet<String>> compareHash = null;
		HashSet<String> thisFilterHash = null;
		FilterSelection thisFilterSelection = null;
		ArrayList<SelectorSelection> selectionList = null;
		String thisSelectorName = "";

		EmployeeRiskReportSelectorList compareList = new EmployeeRiskReportSelectorList();
		try {
			compareList.populate(database);
		} catch (Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");
		}
		compareHash = compareList.toHashtable();
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {
			}.getType());
		} catch (Exception jsonException) {
			throw new Exception("Error parsing JSON: " + jsonException.getMessage());
		}

		for (int j = 0; j < selectionList.size(); j++) {
			thisSelectorName = selectionList.get(j).selectorName;
				if(!(selectionList.get(j).selectorName.equalsIgnoreCase("StartDate") || selectionList.get(j).selectorName.equalsIgnoreCase("EndDate"))){
				if (compareHash.containsKey(selectionList.get(j).selectorName)) {
					thisFilterHash = compareHash.get(selectionList.get(j).selectorName);
					try {
						if (thisFilterHash.contains(selectionList.get(j).selectorValue)) {
							thisFilterSelection = new FilterSelection();
							thisFilterSelection.setFilterName(selectionList.get(j).selectorName);
							thisFilterSelection.setFilterValue(selectionList.get(j).selectorValue);
							this.addFilterSelection(thisFilterSelection);
						} else {
							throw new Exception("Invalid filter value " + selectionList.get(j).selectorValue + " for filter "
									+ selectionList.get(j).selectorName);
						}
					} catch (Exception thisException) {
						throw new Exception("Selector was " + thisSelectorName + ", error was " + thisException.getMessage());
					}
				} else {
					throw new Exception("Invalid selector name " + selectionList.get(j).selectorName);
				}
				}
				else{
					thisFilterSelection = new FilterSelection();
					thisFilterSelection.setFilterName(selectionList.get(j).selectorName);
					thisFilterSelection.setFilterValue(selectionList.get(j).selectorValue);
					this.addFilterSelection(thisFilterSelection);
				}
		}
	}

	public void fetchData(String database) throws Exception {
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();

		EmployeeRiskReportTableRow thisTableRow = null;
		final String[] statistics = { "count", "abs", "cond", "per" };

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		try {

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


		if (filterSelectionList == null) {
			throw new Exception("Filter selection list is empty.");
		}

		else {
			SimpleDateFormat idf =  new SimpleDateFormat("MM/dd/yyyy");
			SimpleDateFormat odf =  new SimpleDateFormat("yyyy-MM-dd");

			String startDate =filterSelectionList.get(0).filterValue;
			startDate=odf.format(idf.parse(startDate));
			
			String endDate = filterSelectionList.get(1).filterValue;
			endDate=odf.format(idf.parse(endDate));
			
			String location = filterSelectionList.get(2).filterValue;
						
		   String activeUser =  (String) RequestContextHolder.currentRequestAttributes().getAttribute("email", 1);
			if(activeUser.equalsIgnoreCase("demouser@talenteck.com")){
				location = unmaskLocation(filterSelectionList.get(2).filterValue);
			}
			String tenure = filterSelectionList.get(3).filterValue;
			//System.out.println("tenure-----" + tenure);
			String query = new EmployeeRiskReportQuery().fetchQuery(startDate, endDate, location,tenure);			
			try {
				st = con.prepareStatement(query);
				rs = st.executeQuery();

				if (rs != null) {
					while (rs.next()) {
						thisTableRow = new EmployeeRiskReportTableRow();
						thisTableRow.quantileNumber = rs.getString("quantileNumber");
						thisTableRow.employees = rs.getInt("employees");
						thisTableRow.eligibleemployees = rs.getInt("eligibleemployees");
						thisTableRow.predictedTurnover = rs.getDouble("predictedturnover");
						thisTableRow.actualTurnover = rs.getDouble("actualturnover");
						this.addRow(thisTableRow);
					}
					
					if (rs != null) {
						rs.close();
					}
					if (st != null) {
						st.close();

					}
				}
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
	}

	

	private String unmaskCountry(String maskedCountry) {
		String unmaskedCountry = "";
		HashMap<String,String> countries = new HashMap<String,String>();
		countries.put("Rest","Rest");
		countries.put("All","All");
		countries.put("Nolita","US");
		countries.put("Tribeca","Philippines");
		unmaskedCountry = countries.get(maskedCountry);

		return unmaskedCountry;	
		}

	private String unmaskLocation(String maskedLocation) {
		String unmaskedLocation = "";
		HashMap<String,String> locations = new HashMap<String,String>();
		locations.put("All", "All");
		locations.put("Riverside", "Rest");
		locations.put("Chambers","Charlotte");
		locations.put("Charles","Charleston");
		locations.put("Delancey","Dasmarinas");
		locations.put("Claremonte","Clark2");
		locations.put("Park","Phoenix");
		locations.put("Dyckman","Dallas");
		locations.put("Madison","Miramar");
		locations.put("Houston","Houston");
		locations.put("Claremonta","Clark1");
		locations.put("Front","Fort Lauderdale");
		locations.put("Columbus","Columbus");
		locations.put("Claremonti","Clark3");
		locations.put("Duane","Davao");
		unmaskedLocation = locations.get(maskedLocation);

		return unmaskedLocation;
		}

	
	private int round(double value) {
		return (int) Math.round(value)*100;
	}

	private Double roundTo2DecPlaces(double value) {
		return (double) Math.round(value * 10d) / 10d;
	}

	private Double roundDouble(double value) {
		return (double) Math.round(value * 100);
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
