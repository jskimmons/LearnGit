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

public class EmployeeRiskReportSelectorList {
	
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
		Selector tenureSelector = new Selector();
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
			
			query = "SELECT MAX(date) AS max,MIN(date) AS min FROM employeeriskreport";

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
			
			query = "SELECT DISTINCT locationname FROM employeeriskreport ORDER BY locationname ASC";

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			/*thisSelectorValue = new SelectorValue();
			thisSelectorValue.setValueLabel("Location: Columbus");
			thisSelectorValue.setValueName("Columbus");
			locationSelector.addSelectorValue(thisSelectorValue);*/
			
			while (rs.next()) {
				if(rs.getString("locationname")!=" "){
				thisSelectorValue = new SelectorValue();
				if(activeUser.equalsIgnoreCase("demouser@talenteck.com")){
					thisSelectorValue.setValueLabel(maskLocation(rs.getString("locationname")));
					thisSelectorValue.setValueName(maskLocation(rs.getString("locationname")));
				}else{
					thisSelectorValue.setValueLabel(rs.getString("locationname"));
					thisSelectorValue.setValueName(rs.getString("locationname"));
				}				
				locationSelector.addSelectorValue(thisSelectorValue);
				}
			}
			this.addSelector(locationSelector);
			rs.close();			
			
			tenureSelector.setSelectorName("Tenure");
			tenureSelector.setSelectorLabel("Tenure");
			tenureSelector.setDefaultValue("90");

			query = "SELECT DISTINCT tenure AS tenure FROM employeeriskreport ORDER BY tenure ASC";	
			st = con.prepareStatement(query);
			rs = st.executeQuery();
			
			/*thisSelectorValue = new SelectorValue();
			thisSelectorValue.setValueLabel("Tenure: 30");
			thisSelectorValue.setValueName("30");
			tenureSelector.addSelectorValue(thisSelectorValue);*/

			
			while (rs.next() ) {
				thisSelectorValue = new SelectorValue();
				thisSelectorValue.setValueLabel(rs.getString("tenure"));
				thisSelectorValue.setValueName(rs.getString("tenure"));					
				tenureSelector.addSelectorValue(thisSelectorValue);
			}
			this.addSelector(tenureSelector);
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
		
		
		/*rateSelector.setSelectorName("Rate");
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
		
		this.addSelector(rateSelector);*/
		
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
	