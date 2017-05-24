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

public class EmployeePlaygroundSelectorList {
	
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
		Selector thisFilterSelector = null;
		SelectorValue thisSelectorValue = null;
		
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
		
		for ( int i = 1 ; i <=2 ; i++ ) {

			String query = "SELECT distinct filtername" + i + ", filtervalue" + i + ",defaultfiltervalue FROM employeeplayground GROUP BY filtervalue" + i ;
			try {
				
				st = con.prepareStatement(query);
				rs = st.executeQuery();

				boolean selectorCreated = false;
				while (rs.next() ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null ) {
						if ( !selectorCreated) {
							thisFilterSelector = new Selector();
							thisFilterSelector.setSelectorName(rs.getString("filtername" + i));
							thisFilterSelector.setSelectorLabel(rs.getString("filtername" + i));
							thisFilterSelector.setDefaultValue(rs.getString("defaultfiltervalue"));
							
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel("Select " + rs.getString("filtername" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);	
							
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel(rs.getString("filtervalue" + i));
							thisSelectorValue.setValueName(rs.getString("filtervalue" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);	
							selectorCreated = true;
						}
						else{
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel(rs.getString("filtervalue" + i));
							thisSelectorValue.setValueName(rs.getString("filtervalue" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);	
							
						}
						
					}
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

	

}
