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
import java.util.Iterator;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class MarketsGraph {

	String defaultSelectorName;
	String defaultSelectorValue;
	ArrayList<PostalCodeSelection> rows;
	ArrayList<CallCenterAttributes> callCenters;
	Messages messages;

	public String getDefaultSelectorName() {
		return defaultSelectorName;
	}

	public void setDefaultSelectorName(String defaultSelectorName) {
		this.defaultSelectorName = defaultSelectorName;
	}

	public String getDefaultSelectorValue() {
		return defaultSelectorValue;
	}

	public void setDefaultSelectorValue(String defaultSelectorValue) {
		this.defaultSelectorValue = defaultSelectorValue;
	}

	public ArrayList<PostalCodeSelection> getRows() {
		return rows;
	}

	public void setRows(ArrayList<PostalCodeSelection> rows) {
		this.rows = rows;
	}

	public Messages getMessages() {
		return messages;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public void addRow(PostalCodeSelection row) {
		if (this.rows == null) {
			this.rows = new ArrayList<PostalCodeSelection>();
		}
		this.rows.add(row);
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

		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		Hashtable<String, ArrayList<PostalCodeAttributes>> selections = new Hashtable<String, ArrayList<PostalCodeAttributes>>();
		ArrayList<PostalCodeAttributes> thisSelectionPostalCodes;
		PostalCodeAttributes thisPostalCode = null;
		PostalCodeSelection thisSelectionData = null;
		Enumeration selectionEnumeration = null;
		final String[] statistics = { "n", "freq", "rate", "mpt" };

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

		String query = "SELECT postalcode, latitude, longitude, predictedapplicants, actualapplicants, "
				+ " predictedhires, actualhires, predictedgoodhires, actualgoodhires, traveltime, "
				+ "laborforce, blackpeople, renteroccupied, density, totalcompetitors, " +
				"defaultselectorname , defaultselectorvalue , periodname , periodlabel , " +
				"t30rate , appliedreferred, ghirereferred, hiredreferred, saturation, " +
				"filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
				" filtername4 , filtervalue4 , filtername5 , filtervalue5, actualgoodhires-predictedgoodhires AS oppurtunity, under25, between25and50" +
				" FROM markets ORDER BY oppurtunity DESC";

		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next()) {
				if (this.defaultSelectorName == null) {
					this.setDefaultSelectorName(rs.getString("defaultselectorname"));
				}
				if (this.defaultSelectorValue == null) {
					this.setDefaultSelectorValue(rs.getString("defaultselectorvalue"));
				}

				selectorValues = new ArrayList<SelectorSelection>();
				/*
				 * thisSelection = new SelectorSelection(); thisSelection.selectorName = "periodName";
				 * thisSelection.selectorValue = rs.getString("periodname"); selectorValues.add(thisSelection);
				 */
				for (int i = 1; i <= 5; i++) {
					if (rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}

				thisSelectionPostalCodes = selections.get(gson.toJson(selectorValues));

				if (thisSelectionPostalCodes == null) {
					thisSelectionPostalCodes = new ArrayList<PostalCodeAttributes>();
					selections.put(gson.toJson(selectorValues), thisSelectionPostalCodes);
				}

				thisPostalCode = new PostalCodeAttributes();
				thisPostalCode.setPostalCode(rs.getString("postalcode") == null ? null : rs.getString("postalcode"));
				thisPostalCode.setLatitude(rs.getString("latitude") == null ? -1 : rs.getDouble("latitude"));
				thisPostalCode.setLongitude(rs.getString("longitude") == null ? -1 : rs.getDouble("longitude"));
				thisPostalCode.setPredictedApplicants(rs.getString("predictedapplicants") == null ? -1 : rs.getDouble("predictedapplicants"));
				thisPostalCode.setActualApplicants(rs.getString("actualapplicants") == null ? -1 : rs.getInt("actualapplicants"));
				thisPostalCode.setPredictedHires(rs.getString("predictedhires") == null ? -1 : rs.getDouble("predictedhires"));
				thisPostalCode.setActualHires(rs.getString("actualhires") == null ? -1 : rs.getInt("actualhires"));
				thisPostalCode.setPredictedGoodHires(rs.getString("predictedgoodhires") == null ? -1 : rs.getDouble("predictedgoodhires"));
				thisPostalCode.setActualGoodHires(rs.getString("actualgoodhires") == null ? -1 : rs.getInt("actualgoodhires"));
				thisPostalCode.setTraveltime(rs.getString("traveltime") == null ? -1 : (double) (int) rs.getDouble("traveltime"));
				thisPostalCode.setBlackpeople(rs.getString("blackPeople") == null ? -1 : rs.getDouble("blackPeople"));
				thisPostalCode.setDensity(rs.getString("density") == null ? -1 : rs.getDouble("density"));
				thisPostalCode.setLaborforce(rs.getString("laborforce") == null ? -1 : rs.getDouble("laborforce"));
				thisPostalCode.setRenteroccupied(rs.getString("renteroccupied") == null ? -1 : rs.getDouble("renteroccupied"));
				thisPostalCode.setTotalcompetitors(rs.getString("totalcompetitors") == null ? -1 : rs.getDouble("totalcompetitors"));
				thisPostalCode.setT30rate(rs.getString("t30rate") == null ? -1 : rs.getDouble("t30rate"));
				thisPostalCode.setSaturation(rs.getString("saturation") == null ? -1 : rs.getDouble("saturation"));
				thisPostalCode.setHiredreferred(rs.getString("hiredreferred") == null ? -1 : rs.getDouble("hiredreferred"));
				thisPostalCode.setAppliedreferred(rs.getString("appliedreferred") == null ? -1 : rs.getDouble("appliedreferred"));
				thisPostalCode.setGhirereferred(rs.getString("ghirereferred") == null ? -1 : rs.getDouble("ghirereferred"));
				thisPostalCode.setUnder25(rs.getString("under25") == null ? -1 : rs.getDouble("under25"));
				thisPostalCode.setBetween25and50(rs.getString("between25and50") == null ? -1 : rs.getDouble("between25and50"));

				thisSelectionPostalCodes.add(thisPostalCode);
				// System.out.println("Adding " + gson.toJson(selectorValues) + " with " + gson.toJson(thisPostalCode));

			}

			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
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

		Hashtable<String, CallCenterAttributes> tempStorage = new Hashtable<String, CallCenterAttributes>();

		query = "SELECT startemployment, hires, filtervalue2 FROM employees WHERE periodlabel = "
				+ "'Last Year' AND hires != -1 AND filtervalue2 != 'All' AND filtervalue2 != 'Rest';";
		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next()) {
				CallCenterAttributes basicInfo = new CallCenterAttributes();
				basicInfo.setAverageHeadcount(rs.getString("startemployment") == null ? -1 : rs.getInt("startemployment"));
				basicInfo.setHiresPerMonth(rs.getString("hires") == null ? -1 : rs.getInt("hires") / 12);
				basicInfo.setLocation(rs.getString("filtervalue2") == null ? "none" : rs.getString("filtervalue2"));
				if (!tempStorage.containsKey(basicInfo.getLocation())) {
					tempStorage.put(basicInfo.getLocation(), basicInfo);
				}
			}
			
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
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

		for (String k : tempStorage.keySet()) {
			query = "SELECT t30, t90 FROM separation WHERE filtervalue2 = '" + k + "' AND t30 != '-1' AND t90 != '-1' ORDER BY periodlabel LIMIT 1;";

			try {

				st = con.prepareStatement(query);
				rs = st.executeQuery();

				while (rs.next()) {
					if (tempStorage.containsKey(k)) {
						CallCenterAttributes basicInfo = tempStorage.get(k);
						basicInfo.setT30Rate(rs.getString("t30") == null ? -1 : rs.getDouble("t30"));
						basicInfo.setT90Rate(rs.getString("t90") == null ? -1 : rs.getDouble("t90"));
						tempStorage.put(k, basicInfo);
					}
				}

				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
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

		for (String k : tempStorage.keySet()) {
			query = "SELECT parentlocation,locationname,lat, lng FROM callcenterlocations WHERE locationname = '" + k + "'";
			try {

				st = con.prepareStatement(query);
				rs = st.executeQuery();

				while (rs.next()) {
					if (tempStorage.containsKey(k)) {
						CallCenterAttributes basicInfo = tempStorage.get(rs.getString("locationname"));
						basicInfo.setLat(rs.getString("lat") == null ? -1 : rs.getDouble("lat"));
						basicInfo.setLng(rs.getString("lng") == null ? -1 : rs.getDouble("lng"));
						basicInfo.addParentLocation(rs.getString("parentlocation"));
						tempStorage.put(k, basicInfo);
					}
				}

				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
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

		callCenters = new ArrayList<CallCenterAttributes>();
		for (String k : tempStorage.keySet()) {
			callCenters.add(tempStorage.get(k));
		}

		selectionEnumeration = selections.keys();
		while (selectionEnumeration.hasMoreElements()) {

			String selectorValuesString = (String) selectionEnumeration.nextElement();
			try {
				selectorValues = gson.fromJson(selectorValuesString, new TypeToken<ArrayList<SelectorSelection>>() {
				}.getType());
			} catch (Exception jsonException) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);
			}
			if (selectorValues == null) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);
			}
			thisSelectionData = new PostalCodeSelection();
			Boolean hasObservations = false;
			thisSelectionData.setSelectorValues(selectorValues);
			thisSelectionPostalCodes = selections.get(selectorValuesString);
			ArrayList<PostalCodeAttributes> outputPostalCodes = new ArrayList<>();
			if (thisSelectionPostalCodes == null) {
				throw new Exception("Failed to find entry:" + selectorValuesString);
			}
			for (PostalCodeAttributes currentPostalCode : thisSelectionPostalCodes) {
				// Need to add a condition here for displaying the ZIP code
				if (true) {
					outputPostalCodes.add(currentPostalCode);
				}
			}

			thisSelectionData.setPostalCodes(outputPostalCodes);
			this.addRow(thisSelectionData);

		}

	}

	public void insertErrorAndWrite(String errorMessage, PrintWriter writer) {
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

	public void writeSuccess(PrintWriter writer) {
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

}
