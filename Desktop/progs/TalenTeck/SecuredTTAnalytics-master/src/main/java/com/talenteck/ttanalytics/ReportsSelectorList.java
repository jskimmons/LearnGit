package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class ReportsSelectorList {

	ArrayList<Selector> selectorList;
	Messages messages;

	@XmlElement(name = "SelectorValue")
	public void setSelectorList(ArrayList<Selector> selectorList) {
		this.selectorList = selectorList;
	}

	public ArrayList<Selector> getSelectorList() {
		return this.selectorList;
	}

	@XmlElement(name = "Messages")
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	void addSelector(Selector selector) {
		if (this.selectorList == null) {
			this.selectorList = new ArrayList<Selector>();
		}
		this.selectorList.add(selector);
	}

	public void populate(String database) throws Exception {

		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		PeriodListReports periodList = new PeriodListReports();
		Selector periodSelector = new Selector();
		Selector thisFilterSelector = null;
		SelectorValue thisSelectorValue = null;
		Selector rateSelector = new Selector();
		Selector statisticSelector = new Selector();
		String query = "";

		try {
			periodList.populate(database);
		} catch (Exception unexaminedException) {
			throw new Exception("Error while attempting to fetch period list.");
		}

		periodSelector.setSelectorName("periodName");
		periodSelector.setSelectorLabel("Time Period");
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Select Time Period");
		thisSelectorValue.setValueName("All");
		periodSelector.addSelectorValue(thisSelectorValue);
		periodSelector.setDefaultValue("All");
		for (int i = 0; i < periodList.periods.size(); i++) {
			thisSelectorValue = new SelectorValue();
			thisSelectorValue.setValueLabel(periodList.periods.get(i).periodLabel);
			thisSelectorValue.setValueName(periodList.periods.get(i).periodName);
			periodSelector.addSelectorValue(thisSelectorValue);
		}

		this.addSelector(periodSelector);

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

		for (int i = 1; i <= 5; i++) {

			query = "SELECT filtername" + i + ", filtervalue" + i + " FROM reports GROUP BY filtervalue" + i + ";";
			try {

				st = con.prepareStatement(query);
				rs = st.executeQuery();

				boolean selectorCreated = false;
				boolean defaultSet = false;
				while (rs.next()) {
					if (rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null) {
						if (!selectorCreated) {
							thisFilterSelector = new Selector();
							thisFilterSelector.setSelectorName(rs.getString("filtername" + i));
							thisFilterSelector.setSelectorLabel(rs.getString("filtername" + i));
							thisFilterSelector.setDefaultValue("All");
							// Make sure "All" appears first
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel("Select " + rs.getString("filtername" + i));
							thisSelectorValue.setValueName("All");
							thisFilterSelector.addSelectorValue(thisSelectorValue);
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel("All");
							thisSelectorValue.setValueName("All");
							thisFilterSelector.addSelectorValue(thisSelectorValue);
							selectorCreated = true;
						}
						if (!defaultSet) {
							if (rs.getString("filtervalue" + i).equalsIgnoreCase("Tribeca")) {
								thisFilterSelector.setDefaultValue(rs.getString("filtervalue" + i));
								defaultSet = true;
							}
						}
						if (!("All").equals(rs.getString("filtervalue" + i))) {
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel(rs.getString("filtervalue" + i));
							thisSelectorValue.setValueName(rs.getString("filtervalue" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);
						}
					}
				}

				if (selectorCreated) {
					this.addSelector(thisFilterSelector);

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

		query = "SELECT rate FROM reports GROUP BY rate;";
		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			rateSelector.setSelectorName("rate");
			rateSelector.setSelectorLabel("Turnover Rate");
			boolean t90Encountered = false;
			while (rs.next()) {
				if (rs.getString("rate") != null && !("").equals(rs.getString("rate").trim())) {
					if (rs.getString("rate").equals( "t90")) {
						t90Encountered = true;
					}
					thisSelectorValue = new SelectorValue();
					thisSelectorValue.setValueLabel(rs.getString("rate").substring(1) + "-Day");
					thisSelectorValue.setValueName(rs.getString("rate"));
					rateSelector.addSelectorValue(thisSelectorValue);

				}
			}

			Collections.sort(rateSelector.selectorValues, new Comparator<SelectorValue>() {
				public int compare(SelectorValue value1, SelectorValue value2) {
					return ((int) Math.signum((double) (Integer.parseInt(value1.valueName.substring(1)) - Integer.parseInt(value2.valueName.substring(1)))));
				}
			});

			if (t90Encountered) {
				rateSelector.setDefaultValue("t90");
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("Select Turnover Rate");
				thisSelectorValue.setValueName("t90");
				rateSelector.selectorValues.add(0, thisSelectorValue);
			}
			else {
				String defaultValue = rateSelector.selectorValues.get(0).valueName;
				rateSelector.setDefaultValue(defaultValue);
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("Select Turnover Rate");
				thisSelectorValue.setValueName(defaultValue);
				rateSelector.selectorValues.add(0, thisSelectorValue);
			}

			this.addSelector(rateSelector);

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

		statisticSelector.setSelectorName("statistic");
		statisticSelector.setSelectorLabel("Statistic");
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Select Statistic");
		thisSelectorValue.setValueName("n");
		statisticSelector.addSelectorValue(thisSelectorValue);
		statisticSelector.setDefaultValue("n");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Count");
		thisSelectorValue.setValueName("n");
		statisticSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Distribution");
		thisSelectorValue.setValueName("freq");
		statisticSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Rate");
		thisSelectorValue.setValueName("rate");
		statisticSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Predicted Turnover");
		thisSelectorValue.setValueName("mpt");
		statisticSelector.addSelectorValue(thisSelectorValue);

		this.addSelector(statisticSelector);

	}

	public void insertErrorAndWrite(String errorMessage, PrintWriter writer) {
		Messages messageList = new Messages();
		messageList.addMessage(errorMessage);
		this.setMessages(messageList);
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}

	public void writeSuccess(PrintWriter writer) {
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}

}
