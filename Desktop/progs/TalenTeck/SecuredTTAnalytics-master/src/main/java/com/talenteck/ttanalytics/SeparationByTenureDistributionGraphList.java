package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class SeparationByTenureDistributionGraphList {

	ArrayList<SeparationByTenurePeriodSelection> graphList;
	Messages messages;

	@XmlElement(name = "Graph")
	public void setFilterList(ArrayList<SeparationByTenurePeriodSelection> graphList) {
		this.graphList = graphList;
	}

	public ArrayList<SeparationByTenurePeriodSelection> getGraphList() {
		return this.graphList;
	}

	public void addGraph(SeparationByTenurePeriodSelection graph) {
		if ( this.graphList == null ){
			this.graphList = new ArrayList<SeparationByTenurePeriodSelection>();
		}
		this.graphList.add(graph);
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void populateFromSeparationByTenureSelectionList(SeparationByTenureSelectionList results) {
		for (int i = 0 ; i < results.separationByTenureSelectionList.size(); i++ ) {
			this.addGraph(results.separationByTenureSelectionList.get(i).graph);
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
