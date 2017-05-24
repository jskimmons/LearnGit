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

import javax.xml.bind.annotation.XmlElement;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;

import com.google.gson.Gson;
import com.talenteck.persistence.model.User;

public class LiveReportSelectorList {
	
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
	//Filters&Inputs - locationSelector,sampleSelector,statisticSelector,turnoverrateSelector
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;
		String query = "";

		Selector startDateSelector = new Selector();
		Selector endDateSelector = new Selector();
		Selector locationSelector = new Selector();
		Selector countrySelector = new Selector();
		Selector sampleSelector = new Selector();
		Selector statisticSelector = new Selector();
		Selector rateSelector = new Selector();
		SelectorValue thisSelectorValue = null;
		

	    String activeUser =  (String) RequestContextHolder.currentRequestAttributes().getAttribute("email", 1);

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
		
		try {	
			startDateSelector.setSelectorName("StartDate");
			startDateSelector.setSelectorLabel("StartDate");

			endDateSelector.setSelectorName("EndDate");
			endDateSelector.setSelectorLabel("EDate");
			
			SimpleDateFormat odf =  new SimpleDateFormat("MM/dd/yyyy");
			SimpleDateFormat idf =  new SimpleDateFormat("yyyy-MM-dd");
			
			query = "SELECT MAX(receiveddate) AS max,MIN(receiveddate) AS min FROM applicantreport";

			st = con.prepareStatement(query);
			rs = st.executeQuery();
			
			while(rs.next()){
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("Start Date: " + odf.format(idf.parse(rs.getString("min"))));
				thisSelectorValue.setValueName(odf.format(idf.parse(rs.getString("min"))));
				startDateSelector.addSelectorValue(thisSelectorValue);
				
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("End Date: " + odf.format(idf.parse(rs.getString("max"))));
				thisSelectorValue.setValueName(odf.format(idf.parse(rs.getString("max"))));
				endDateSelector.addSelectorValue(thisSelectorValue);
				
			}
			this.addSelector(startDateSelector);
			this.addSelector(endDateSelector);
			rs.close();


			locationSelector.setSelectorName("Location");
			locationSelector.setSelectorLabel("Location");
			
			query = "SELECT DISTINCT applicantlocx FROM applicantreport WHERE applicantlocx <> 'Rest' ORDER BY applicantlocx ASC";

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			thisSelectorValue = new SelectorValue();
			thisSelectorValue.setValueLabel("Location: All");
			thisSelectorValue.setValueName("All");
			locationSelector.addSelectorValue(thisSelectorValue);

			
			thisSelectorValue = new SelectorValue();
			thisSelectorValue.setValueLabel("All");
			thisSelectorValue.setValueName("All");
			locationSelector.addSelectorValue(thisSelectorValue);
			
			while (rs.next()) {
				if(rs.getString("applicantlocx")!=" "){
				thisSelectorValue = new SelectorValue();
				if(activeUser.equalsIgnoreCase("demouser@talenteck.com")){
					thisSelectorValue.setValueLabel(maskLocation(rs.getString("applicantlocx")));
					thisSelectorValue.setValueName(maskLocation(rs.getString("applicantlocx")));
				}else{
					thisSelectorValue.setValueLabel(rs.getString("applicantlocx"));
					thisSelectorValue.setValueName(rs.getString("applicantlocx"));
				}
				
				locationSelector.addSelectorValue(thisSelectorValue);
				}
			}
			this.addSelector(locationSelector);
			
			
			countrySelector.setSelectorName("Country");
			countrySelector.setSelectorLabel("Country");
			
			query = "SELECT  DISTINCT IF(applicantcountry='US' OR applicantcountry='Philippines',applicantcountry,'Rest') AS applicantcountry,IF(applicantcountry='US', 2,IF(applicantcountry='Philippines',1,3)) AS corder FROM applicantreport ORDER BY corder ASC";	
				st = con.prepareStatement(query);
				rs = st.executeQuery();

				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("Country: All");
				thisSelectorValue.setValueName("All");
				countrySelector.addSelectorValue(thisSelectorValue);

	
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel("All");
				thisSelectorValue.setValueName("All");
				countrySelector.addSelectorValue(thisSelectorValue);
				
				while (rs.next() ) {
					thisSelectorValue = new SelectorValue();
					if(activeUser.equalsIgnoreCase("demouser@talenteck.com")){
					thisSelectorValue.setValueLabel(maskCountry(rs.getString("applicantcountry")));
					thisSelectorValue.setValueName(maskCountry(rs.getString("applicantcountry")));
					}
					else{
						thisSelectorValue.setValueLabel(rs.getString("applicantcountry"));
						thisSelectorValue.setValueName(rs.getString("applicantcountry"));	
					}
					
					countrySelector.addSelectorValue(thisSelectorValue);
				}
				this.addSelector(countrySelector);
			rs.close();

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
		
		
		
		sampleSelector.setSelectorName("Sample");
		sampleSelector.setSelectorLabel("Sample");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Sample: All");
		thisSelectorValue.setValueName("All");
		sampleSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("All");
		thisSelectorValue.setValueName("All");
		sampleSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("TalenTeck1");
		thisSelectorValue.setValueName("TT");
		sampleSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("TalenTeck2");
		thisSelectorValue.setValueName("DSA");
		sampleSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(sampleSelector);
		
		
		statisticSelector.setSelectorName("Statistics");
		statisticSelector.setSelectorLabel("Statistics");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Statistic: Count");
		thisSelectorValue.setValueName("Count");
		statisticSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Count");
		thisSelectorValue.setValueName("Count");
		statisticSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Conditional Percent");
		thisSelectorValue.setValueName("Conditional Percent");
		statisticSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Absolute Percent");
		thisSelectorValue.setValueName("Absolute Percent");
		statisticSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Percent");
		thisSelectorValue.setValueName("Percent");
		statisticSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Average Score");
		thisSelectorValue.setValueName("Average Score");
		statisticSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(statisticSelector);
		
		
		rateSelector.setSelectorName("Rate");
		rateSelector.setSelectorLabel("Rate");

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("Turnover Rate: 30-Day");
		thisSelectorValue.setValueName("30-Day");
		rateSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("30-Day");
		thisSelectorValue.setValueName("30-Day");
		rateSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("60-Day");
		thisSelectorValue.setValueName("60-Day");
		rateSelector.addSelectorValue(thisSelectorValue);

		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("90-Day");
		thisSelectorValue.setValueName("90-Day");
		rateSelector.addSelectorValue(thisSelectorValue);
		
		thisSelectorValue = new SelectorValue();
		thisSelectorValue.setValueLabel("180-Day");
		thisSelectorValue.setValueName("180-Day");
		rateSelector.addSelectorValue(thisSelectorValue);
		
		this.addSelector(rateSelector);
		
	}

	
	public Hashtable<String,HashSet<String>> toHashtable() {
		
		Hashtable<String,HashSet<String>> returnTable = new Hashtable<String,HashSet<String>>();
		for ( Selector thisSelector : this.selectorList ) {
			HashSet<String> thisSelectorOptions = new HashSet<>();
			for ( SelectorValue thisSelectorValue : thisSelector.selectorValues ) {
				thisSelectorOptions.add(thisSelectorValue.valueLabel);
			}
			returnTable.put(thisSelector.selectorName, thisSelectorOptions);
		}
		
		return returnTable;
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
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}
	
	public String maskLocation(String location){
		String maskedLocation = "";
		HashMap<String,String> locations = new HashMap<String,String>();
		locations.put("All", "All");
		locations.put("Rest", "Riverside");
		locations.put("Charlotte", "Chambers");
		locations.put("Charleston", "Charles");
		locations.put("Dasmarinas", "Delancey");
		locations.put("Clark2", "Claremonte");
		locations.put("Phoenix", "Park");
		locations.put("Dallas", "Dyckman");
		locations.put("Miramar", "Madison");
		locations.put("Houston", "Houston");
		locations.put("Clark1", "Claremonta");
		locations.put("Fort Lauderdale", "Front");
		locations.put("Columbus", "Columbus");
		locations.put("Clark3", "Claremonti");
		locations.put("Davao", "Duane");
		maskedLocation=locations.get(location);
		return maskedLocation;
	}
	
	public String maskCountry(String country){
		String maskedCountry = "";
		HashMap<String,String> countries = new HashMap<String,String>();
		countries.put("All","All");
		countries.put("Rest","Rest");
		countries.put("US","Nolita");
		countries.put("Philippines", "Tribeca");
		maskedCountry = countries.get(country);

		return maskedCountry;
	}

}
	
