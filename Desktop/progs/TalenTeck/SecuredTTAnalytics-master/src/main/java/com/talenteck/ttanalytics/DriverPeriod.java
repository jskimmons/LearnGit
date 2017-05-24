package com.talenteck.ttanalytics;

import java.io.PrintWriter;
//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class DriverPeriod {


	String periodName;
	ArrayList<DriverPeriodSelectionList> filterList;
	Messages messages;
	

	@XmlElement(name = "PeriodLabel")
	public void setPeriodLabel(String periodName) {
		this.periodName = periodName;
	}
	
	String getPeriodName(){
		return this.periodName;
	}

	
	@XmlElement(name = "Selection")
	public void setFilterList(ArrayList<DriverPeriodSelectionList> filterList) {
		this.filterList = filterList;
	}

	public ArrayList<DriverPeriodSelectionList> getFilterList() {
		return this.filterList;
	}

	public void addFilter(DriverPeriodSelectionList filter) {
		if ( this.filterList == null ){
			this.filterList = new ArrayList<DriverPeriodSelectionList>();
		}
		this.filterList.add(filter);
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	

	
	
	
	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
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
	
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	
}
