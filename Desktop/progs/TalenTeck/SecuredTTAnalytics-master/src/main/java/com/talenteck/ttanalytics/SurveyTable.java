package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


public class SurveyTable {

	ArrayList<SurveyQuestion> questions;
	Messages messages;

	public ArrayList<SurveyQuestion> getQuestions() {
		return questions;
	}

	public void setQuestions(ArrayList<SurveyQuestion> questions) {
		this.questions = questions;
	}
	
	public void addQuestion(SurveyQuestion question) {
		if ( this.questions == null ) {
			this.questions = new ArrayList<SurveyQuestion>();
		}
		this.questions.add(question);
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	
	public void fetchData(String filterDatabase) throws Exception {

		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		String url = DatabaseParameters.url + filterDatabase;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;
		String query = "";

		try {


			// The newInstance() call is a work around for some
			// broken Java implementations

			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception openException) {
			Exception driverInitException = new Exception("Failed to open SQL driver instance:");
			throw driverInitException;
		}

		try {
			con = DriverManager.getConnection(url, user, password);
			
		} catch(Exception skeletonException) {
			try {
				if ( con != null ) {
					con.close();
				}
			} catch(Exception E) { /* Do nothing */ }
			
			throw new Exception("Error opening connection: " + skeletonException.getMessage());
			
		}

		query = "SELECT "
				+ "questionid , "
				+ "survey , "
				+ "question , "
				+ "response01 , "
				+ "response02 , "
				+ "response03 , "
				+ "response04 , "
				+ "response05 , "
				+ "response06 , "
				+ "response07 , "
				+ "response08 , "
				+ "response09 , "
				+ "response10 , "
				+ "response11 , "
				+ "response12 , "
				+ "response13 , "
				+ "response14 , "
				+ "response15 , "
				+ "response16 , "
				+ "response17 , "
				+ "response18 , "
				+ "response19 , "
				+ "response20 "
				+ "FROM surveys WHERE active = 1;";

		try {
			st = con.prepareStatement(query);
			rs = st.executeQuery();
			
			while ( rs.next() ) {
				
				
				if ( rs.getString("questionid") != null && !rs.getString("questionid").isEmpty() ) {
					SurveyQuestion thisQuestion = new SurveyQuestion();
					thisQuestion.setQuestionID(rs.getInt("questionid"));
					thisQuestion.setSurvey(rs.getString("survey"));
					thisQuestion.setQuestionText(rs.getString("question"));
					for ( int i = 1 ; i <= 20 ; i++ ) {
						String thisResponse = rs.getString("response" + (i < 10 ? "0" : "") + i); 
						if ( thisResponse != null) {
							thisQuestion.addResponse(thisResponse);
						}
					}
					this.addQuestion(thisQuestion);
					
				}
				
			}
			
			
		} catch(Exception fetchDataException) {
			throw new Exception("Error fetching survey data: " + fetchDataException.getMessage() + " at " + fetchDataException.getStackTrace()[0] + " at " + fetchDataException.getStackTrace()[1]);
		}
		
	}

	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		this.addMessage(errorMessage);
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	
}
