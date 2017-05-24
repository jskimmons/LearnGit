package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class SurveyQuestion {

	Integer questionID;
	Boolean active;
	String survey;
	String questionText;
	ArrayList<String> responses;
	
	
	
	public Integer getQuestionID() {
		return questionID;
	}
	public void setQuestionID(Integer questionID) {
		this.questionID = questionID;
	}
	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}
	public String getSurvey() {
		return survey;
	}
	public void setSurvey(String survey) {
		this.survey = survey;
	}
	public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	public ArrayList<String> getResponses() {
		return responses;
	}
	public void setResponses(ArrayList<String> responses) {
		this.responses = responses;
	}
	
	public void addResponse(String response) {
		if ( this.responses == null ) {
			this.responses = new ArrayList<String>();
		}
		this.responses.add(response);
	}
	
}
