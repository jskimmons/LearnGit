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

public class ELMReportGraph {

	
	ArrayList<ELMReportGraphRow> rows;
	Messages messages;

	public void setRows(ArrayList<ELMReportGraphRow> rows) {
		this.rows = rows;
	}

	public ArrayList<ELMReportGraphRow> getRows() {
		return rows;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addRow(ELMReportGraphRow row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<ELMReportGraphRow>();
		}
		this.rows.add(row);
	}

	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}


	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		ELMReportGraphRow thisRow = null;
		ELMReportGraphRow thisRowCopy = null;
		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		
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

		
		String query = "SELECT  filtername1 , filtervalue1 , filtername2 , filtervalue2,testmonth , applicant,hire,goodhire FROM elmreport";
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {

				selectorValues = new ArrayList<SelectorSelection>();
				for ( int i = 1 ; i <= 2 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null  ) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}					
				thisRow = new ELMReportGraphRow();
				thisRow.setSelectorValues(selectorValues);
				thisRow.setTestMonth(rs.getString("testmonth"));
				thisRow.setApplicants(rs.getInt("applicant"));
				thisRow.setHires(rs.getInt("hire"));
				thisRow.setGoodhires(rs.getInt("goodhire"));
				this.addRow(thisRow);	
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

