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

public class LiveReportTable {

	ArrayList<LiveReportTableRow> rows;
	Messages messages;
	ArrayList<FilterSelection> filterSelectionList;

	public ArrayList<FilterSelection> getFilterSelectionList() {
		return filterSelectionList;
	}

	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}

	public void setRows(ArrayList<LiveReportTableRow> rows) {
		this.rows = rows;
	}

	public ArrayList<LiveReportTableRow> getRows() {
		return rows;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(LiveReportTableRow row) {
		if (this.rows == null) {
			this.rows = new ArrayList<LiveReportTableRow>();
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

		LiveReportSelectorList compareList = new LiveReportSelectorList();
		try {
			compareList.populate(database);
		} catch (Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");
		}
		compareHash = compareList.toHashtable();

		/*
		 * Should be removable try { periodTable =
		 * PeriodListRobustness.periodTable(database); } catch(Exception
		 * fetchPeriodsException) { throw new
		 * Exception("Error fetching list of valid periods."); }
		 */
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {
			}.getType());
		} catch (Exception jsonException) {
			throw new Exception("Error parsing JSON: " + jsonException.getMessage());
		}

		for (int j = 0; j < selectionList.size(); j++) {
			thisSelectorName = selectionList.get(j).selectorName;
			switch (selectionList.get(j).selectorName) {
			case "periodName":
				if (compareHash.containsKey("periodName")) {
					// this.period = new PeriodRobustness();
					if (compareHash.get("periodName").contains(selectionList.get(j).selectorValue)) {
						// this.period.periodName =
						// selectionList.get(j).selectorValue;
					} else {
						throw new Exception("Invalid period specified: " + selectionList.get(j).selectorValue);
					}
				} else {
					throw new Exception("Period selector is not populated in table (internal error).");
				}

				break;
			default:
				if(!(selectionList.get(j).selectorName.equalsIgnoreCase("StartDate") || selectionList.get(j).selectorName.equalsIgnoreCase("EndDate"))){
				if (compareHash.containsKey(selectionList.get(j).selectorName)) {
					thisFilterHash = compareHash.get(selectionList.get(j).selectorName);
					try {
						String checkValue = selectionList.get(j).selectorValue;
						if(checkValue.equalsIgnoreCase("TT"))
							checkValue="TalenTeck1";
							else if (checkValue.equalsIgnoreCase("DSA"))
								checkValue="TalenTeck2";
						
						if (thisFilterHash.contains(checkValue)) {
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
				break;

			}
		}
	}

	public void fetchData(String database) throws Exception {
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();

		LiveReportTableRow thisTableRow = null;
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

		//String startDate = "2016-03-04";
		//String endDate = "2016-05-18";

		if (filterSelectionList == null) {
			throw new Exception("Filter selection list is empty.");
		}

		else {
			int totalApplied = 0;
			int totalInterviewed = 0;
			int totalOffered = 0;
			int totalAccepted = 0;
			int totalHired = 0;
			int totalTerminated = 0;
			int totalEligibility = 0;
			Double totalTurnover = null;

			int nonscoredApplied = 0;
			int nonscoredInterviewed = 0;
			int nonscoredOffered = 0;
			int nonscoredAccepted = 0;
			int nonscoredHired = 0;
			int nonscoredTerminated = 0;
			int nonscoredEligibility = 0;
			Double nonscoredTurnover = null;

			int scoredApplied = 0;
			int scoredInterviewed = 0;
			int scoredOffered = 0;
			int scoredAccepted = 0;
			int scoredHired = 0;
			int scoredTerminated = 0;
			int scoredEligibility = 0;
			Double scoredTurnover = null;
			
			SimpleDateFormat idf =  new SimpleDateFormat("MM/dd/yyyy");
			SimpleDateFormat odf =  new SimpleDateFormat("yyyy-MM-dd");

			String startDate =filterSelectionList.get(0).filterValue;
			startDate=odf.format(idf.parse(startDate));
			String endDate = filterSelectionList.get(1).filterValue;
			endDate=odf.format(idf.parse(endDate));
			String location = filterSelectionList.get(2).filterValue;
			String country = filterSelectionList.get(3).filterValue;
		    String activeUser =  (String) RequestContextHolder.currentRequestAttributes().getAttribute("email", 1);
			if(activeUser.equalsIgnoreCase("demouser@talenteck.com")){
				location = unmaskLocation(filterSelectionList.get(2).filterValue);
				country = unmaskCountry(filterSelectionList.get(3).filterValue);
			}
			String sample = filterSelectionList.get(4).filterValue;
			String statistic = filterSelectionList.get(5).filterValue;
			String rate = filterSelectionList.get(6).filterValue;
			
			String query = new LiveReportTableQuery().fetchCuttoffQuery(startDate, endDate, location, country,sample, rate);
			Hashtable<Integer,Double> cutoffs = new Hashtable<Integer,Double>();

			try {
				st = con.prepareStatement(query);
				rs = st.executeQuery();
				int i=0;
				while(rs.next()) {
				cutoffs.put(++i,rs.getDouble("rate"));
				}				
			rs.close();
			}catch (Exception queryException) {
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
			
			query = new LiveReportTableQuery().fetchQuery(startDate, endDate, location, country,sample, rate,cutoffs);
			
			
			try {
				st = con.prepareStatement(query);
				rs = st.executeQuery();

				if (rs != null) {
					// The query output for statistic = count,
					rs.last(); // Total-NonScored.
					nonscoredApplied = rs.getInt("applicants");
					nonscoredInterviewed = rs.getInt("interviewed");
					nonscoredOffered = rs.getInt("offered");
					nonscoredAccepted = rs.getInt("accepted");
					nonscoredHired = rs.getInt("hired");
					nonscoredTerminated = rs.getInt("terminatedd");
					nonscoredEligibility = rs.getInt("xdayeligibility");
					nonscoredTurnover = roundTo2DecPlaces((double) nonscoredTerminated/nonscoredEligibility *100);
					
					rs.previous(); // Total-Scored
					
					scoredApplied = rs.getInt("applicants");
					scoredInterviewed = rs.getInt("interviewed");
					scoredOffered = rs.getInt("offered");
					scoredAccepted = rs.getInt("accepted");
					scoredHired = rs.getInt("hired");
					scoredTerminated = rs.getInt("terminatedd");
					scoredEligibility = rs.getInt("xdayeligibility");
					scoredTurnover = roundTo2DecPlaces((double)scoredTerminated/scoredEligibility *100);
					
					// GrandTotal
					totalApplied = scoredApplied + nonscoredApplied;
					totalInterviewed = scoredInterviewed + nonscoredInterviewed;
					totalOffered = scoredOffered + nonscoredOffered;
					totalAccepted = scoredAccepted + nonscoredAccepted;
					totalHired = scoredHired + nonscoredHired;
					totalTerminated = scoredTerminated + nonscoredTerminated;
					totalEligibility = scoredEligibility + nonscoredEligibility;
					totalTurnover = roundTo2DecPlaces((double) totalTerminated/totalEligibility *100);
					//System.out.println((double) totalTerminated/totalEligibility);

					rs.beforeFirst();
					
					int rsCounter = 0;
					
					while (rs.next()) {
						rsCounter++;
						String quantileNumber = rs.getString("quantileNumber");
						int applied = rs.getInt("applicants");
						int interviewed = rs.getInt("interviewed");
						int offered = rs.getInt("offered");
						int accepted = rs.getInt("accepted");
						int hired = rs.getInt("hired");
						int terminated = rs.getInt("terminatedd");
						int eligibility = rs.getInt("xdayeligibility");
						Double turnover = rs.getDouble("xdayturnover");

						thisTableRow = new LiveReportTableRow();
						thisTableRow.quantileNumber = quantileNumber;

						switch (statistic.toLowerCase()) {
						case "count":
							thisTableRow.applied = (double)applied;
							thisTableRow.interviewed = (double)interviewed;
							thisTableRow.offered = (double)offered;
							thisTableRow.accepted = (double)accepted;
							thisTableRow.hired = (double)hired;
							thisTableRow.terminated = (double)terminated;
							thisTableRow.eligibility = (double)eligibility;
							if(rsCounter==7){
								thisTableRow.turnover = scoredTurnover;
							}
							else if(rsCounter==8){
								thisTableRow.turnover = nonscoredTurnover;
							}
							else thisTableRow.turnover = turnover;
							break;
						case "conditional percent":
							thisTableRow.applied = (double)applied;
							thisTableRow.interviewed = roundDouble((double)interviewed/applied) ;
							thisTableRow.offered = roundDouble((double)offered / interviewed) ;
							thisTableRow.accepted = roundDouble((double)accepted / offered) ;
							thisTableRow.hired = roundDouble((double)hired / accepted) ;
							thisTableRow.terminated = (double)terminated;
							thisTableRow.eligibility = (double)eligibility;
							if(rsCounter==7){
								thisTableRow.turnover = scoredTurnover;
							}
							else if(rsCounter==8){
								thisTableRow.turnover = nonscoredTurnover;
							}
							else thisTableRow.turnover = turnover;
							break;
						case "absolute percent":
							thisTableRow.applied = (double)applied;
							thisTableRow.interviewed = roundDouble((double)interviewed/applied) ;
							thisTableRow.offered = roundDouble((double)offered / applied);
							thisTableRow.accepted = roundDouble((double)accepted / applied);
							thisTableRow.hired = roundDouble((double)hired / applied);
							thisTableRow.terminated = (double)terminated;
							thisTableRow.eligibility = (double)eligibility;
							if(rsCounter==7){
								thisTableRow.turnover = scoredTurnover;
							}
							else if(rsCounter==8){
								thisTableRow.turnover = nonscoredTurnover;
							}
							else thisTableRow.turnover = turnover;
							break;
						case "percent":
							if (rsCounter == 7) {
								thisTableRow.applied = roundDouble((double)scoredApplied / totalApplied);
								thisTableRow.interviewed = roundDouble((double)scoredInterviewed / totalInterviewed);
								thisTableRow.offered = roundDouble((double)scoredOffered / totalOffered);
								thisTableRow.accepted = roundDouble((double)scoredAccepted / totalAccepted);
								thisTableRow.hired = roundDouble((double)scoredHired / totalHired);
								thisTableRow.terminated = roundDouble((double)scoredTerminated / totalTerminated);
								thisTableRow.eligibility = roundDouble((double)scoredEligibility / totalEligibility);
							} else if (rsCounter == 8) {
								thisTableRow.applied = roundDouble((double)nonscoredApplied / totalApplied);
								thisTableRow.interviewed = roundDouble((double)nonscoredInterviewed / totalInterviewed);
								thisTableRow.offered = roundDouble((double)nonscoredOffered / totalOffered);
								thisTableRow.accepted = roundDouble((double)nonscoredAccepted / totalAccepted);
								thisTableRow.hired = roundDouble((double)nonscoredHired / totalHired);
								thisTableRow.terminated = roundDouble((double)nonscoredTerminated / totalTerminated);
								thisTableRow.eligibility = roundDouble((double)nonscoredEligibility / totalEligibility);
							} else {
								thisTableRow.applied = roundDouble((double)applied / scoredApplied);
								thisTableRow.interviewed = roundDouble((double)interviewed / scoredInterviewed);
								thisTableRow.offered = roundDouble((double)offered / scoredOffered);
								thisTableRow.accepted = roundDouble((double)accepted / scoredAccepted);
								thisTableRow.hired = roundDouble((double)hired / scoredHired);
								thisTableRow.terminated = roundDouble((double)terminated / scoredTerminated);
								thisTableRow.eligibility = roundDouble((double)eligibility / scoredEligibility);
							}
							if(rsCounter==7){
								thisTableRow.turnover = scoredTurnover;
							}
							else if(rsCounter==8){
								thisTableRow.turnover = nonscoredTurnover;
							}
							else thisTableRow.turnover = turnover;
							break;
						case "average score":
							if(rsCounter==8){
								thisTableRow.applied = (double)nonscoredApplied;
								thisTableRow.interviewed = (double)nonscoredInterviewed;
								thisTableRow.offered = (double)nonscoredOffered;
								thisTableRow.accepted = (double)nonscoredAccepted;
								thisTableRow.hired = (double)nonscoredHired;
								thisTableRow.terminated = (double)nonscoredTerminated;
								thisTableRow.eligibility = (double)nonscoredEligibility;
							}
							else{
							thisTableRow.applied = roundDouble((double)rs.getDouble("papplicants")/applied);
							thisTableRow.interviewed = roundDouble((double)rs.getDouble("pinterviewed")/interviewed);
							thisTableRow.offered = roundDouble((double)rs.getDouble("poffered")/offered);
							thisTableRow.accepted = roundDouble((double)rs.getDouble("paccepted")/accepted);
							thisTableRow.hired = roundDouble((double)rs.getDouble("phired")/hired);
							thisTableRow.terminated = roundDouble((double)rs.getDouble("pterminatedd")/terminated);
							thisTableRow.eligibility = roundDouble((double)rs.getDouble("pxdayeligibility")/eligibility);
							}
							if(rsCounter==7){
								thisTableRow.turnover = scoredTurnover;
							}
							else if(rsCounter==8){
								thisTableRow.turnover = nonscoredTurnover;
							}
							else thisTableRow.turnover = turnover;
							break;

						}
						this.addRow(thisTableRow);
					}
					// Creating GrandTotal Row
					thisTableRow = new LiveReportTableRow();
					thisTableRow.quantileNumber = "Grand Total";

					if (statistic.equalsIgnoreCase("conditional Percent")) {
						thisTableRow.applied = (double)totalApplied;
						thisTableRow.interviewed = roundDouble((double)totalInterviewed / totalApplied) ;
						thisTableRow.offered = roundDouble((double)totalOffered / totalInterviewed) ;
						thisTableRow.accepted = roundDouble((double)totalAccepted / totalOffered) ;
						thisTableRow.hired = roundDouble((double)totalHired / totalAccepted) ;
						thisTableRow.terminated = (double)totalTerminated;
						thisTableRow.eligibility = (double)totalEligibility;
						thisTableRow.turnover = totalTurnover;
					} 
					else if (statistic.equalsIgnoreCase("absolute Percent")) {
						thisTableRow.applied = (double)totalApplied;
						thisTableRow.interviewed = roundDouble((double)totalInterviewed / totalApplied) ;
						thisTableRow.offered =roundDouble((double)totalOffered / totalApplied) ;
						thisTableRow.accepted = roundDouble((double)totalAccepted / totalApplied) ;
						thisTableRow.hired = roundDouble((double)totalHired / totalApplied) ;
						thisTableRow.terminated = (double)totalTerminated;
						thisTableRow.eligibility = (double)totalEligibility;
						thisTableRow.turnover = totalTurnover;
					} 
					else if (statistic.equalsIgnoreCase("Percent")) {
						thisTableRow.applied = 100.0;
						thisTableRow.interviewed = 100.0;
						thisTableRow.offered = 100.0;
						thisTableRow.accepted =  100.0;
						thisTableRow.hired = 100.0;
						thisTableRow.terminated = 100.0;
						thisTableRow.eligibility = 100.0;
						thisTableRow.turnover = totalTurnover;
					}
					else {
						thisTableRow.applied = (double)totalApplied;
						thisTableRow.interviewed = (double)totalInterviewed;
						thisTableRow.offered = (double)totalOffered;
						thisTableRow.accepted = (double)totalAccepted;
						thisTableRow.hired = (double)totalHired;
						thisTableRow.terminated = (double)totalTerminated;
						thisTableRow.eligibility = (double)totalEligibility;
						thisTableRow.turnover = totalTurnover;
					}
					this.addRow(thisTableRow);

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
