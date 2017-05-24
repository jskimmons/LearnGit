package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class MarketsSelectorList {

	String defaultSelectorName;
	String defaultSelectorValue;
	ArrayList<Selector> selectorList;
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
		Selector thisFilterSelector = null;
		SelectorValue thisSelectorValue = null;
		
		Selector modelSelector = new Selector();
		modelSelector.setSelectorName("Model");
		modelSelector.setSelectorLabel("Model");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Select Model");
		thisSelectorValue.setValueName("Good Hires");
		modelSelector.addSelectorValue(thisSelectorValue);
		modelSelector.setDefaultValue("Good Hires");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Applicant");
		thisSelectorValue.setValueName("Applicant");
		modelSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Hires");
		thisSelectorValue.setValueName("Hires");
		modelSelector.addSelectorValue(thisSelectorValue);
		
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Good Hires");
		thisSelectorValue.setValueName("Good Hires");
		modelSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(modelSelector);
		
		
		
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

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
				
		for ( int i = 1 ; i <= 5 ; i++ ) {

			String query = "SELECT filtername" + i + ", filtervalue" + i + " , defaultselectorname , defaultselectorvalue FROM markets GROUP BY filtervalue" + i ;
			try {
				
				st = con.prepareStatement(query);
				rs = st.executeQuery();

				boolean selectorCreated = false;
				while (rs.next() ) {
					if ( this.defaultSelectorName == null ) {
						this.defaultSelectorName = rs.getString("defaultselectorname");
					}
					if ( this.defaultSelectorValue == null ) {
						this.defaultSelectorValue = rs.getString("defaultselectorvalue");
					}
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null ) {
						if ( !selectorCreated) {
							thisFilterSelector = new Selector();
							thisFilterSelector.setSelectorName(rs.getString("filtername" + i));
							thisFilterSelector.setSelectorLabel(rs.getString("filtername" + i));
							thisFilterSelector.setDefaultValue(rs.getString("defaultselectorvalue"));
							//Make sure "All" appears first
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel("Select " + rs.getString("filtername" + i));
							thisSelectorValue.setValueName("All");
							thisFilterSelector.addSelectorValue(thisSelectorValue);
							
							/*thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel("All");
							thisSelectorValue.setValueName("All");
							thisFilterSelector.addSelectorValue(thisSelectorValue);?*/
							selectorCreated = true;
						}
						if ( !("All").equals(rs.getString("filtervalue" + i))) {
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel(rs.getString("filtervalue" + i));
							thisSelectorValue.setValueName(rs.getString("filtervalue" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);							
						}
						
					}
				}

				if ( this.defaultSelectorName == null ) {
					this.defaultSelectorName = "periodName";
				}
				if ( this.defaultSelectorValue == null ) {
					this.defaultSelectorValue = "All";
				}
				
				if ( selectorCreated ) {
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
		
		
		Selector zipSelector = new Selector();
		zipSelector.setSelectorName("Zip");
		zipSelector.setSelectorLabel("Zip");
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Select File Size ");
		thisSelectorValue.setValueName("Top 25 Zips");
		zipSelector.addSelectorValue(thisSelectorValue);
		zipSelector.setDefaultValue("Top 25 Zips");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Top 25 Zips");
		thisSelectorValue.setValueName("Top 25 Zips");
		zipSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("All Zips");
		thisSelectorValue.setValueName("All Zips");
		zipSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(zipSelector);
		
		
		Selector mapSelector = new Selector();
		mapSelector.setSelectorName("Map");
		mapSelector.setSelectorLabel("Map");
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Select Map ");
		thisSelectorValue.setValueName("Actual");
		mapSelector.addSelectorValue(thisSelectorValue);
		mapSelector.setDefaultValue("Actual");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Actual");
		thisSelectorValue.setValueName("Actual");
		mapSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Opportunity");
		thisSelectorValue.setValueName("Opportunity");
		mapSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(mapSelector);
		


	}

	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
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
	
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
			//System.out.println("writer " + gson.toJson(this));
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}

	
	//PeriodListMarkets periodList = new PeriodListMarkets();
	//Selector periodSelector = new Selector();

	
	/* myComment try {
		periodList.populate(database);
	} catch(Exception unexaminedException ) {
		throw new Exception("Error while attempting to fetch period list.");
	}

	periodSelector.setSelectorName("periodName");
	periodSelector.setSelectorLabel("Time Period");
	thisSelectorValue = new SelectorValue();
	thisSelectorValue.setValueLabel("Select Time Period");
	thisSelectorValue.setValueName("All");
	periodSelector.addSelectorValue(thisSelectorValue);
	periodSelector.setDefaultValue(periodList.periods.get(0).periodName);
	for (int i=0 ; i < periodList.periods.size(); i++) {
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel(periodList.periods.get(i).periodLabel);
		thisSelectorValue.setValueName(periodList.periods.get(i).periodName);
		periodSelector.addSelectorValue(thisSelectorValue);
	}

	this.addSelector(periodSelector); myComment*/
	
			
	
	
}
