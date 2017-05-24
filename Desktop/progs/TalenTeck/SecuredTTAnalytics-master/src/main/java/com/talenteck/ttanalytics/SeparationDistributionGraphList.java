package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

import com.google.gson.Gson;

public class SeparationDistributionGraphList {

	ArrayList<SeparationPeriodSelection> graphList;
	Messages messages;

	@XmlElement(name = "Graph")
	public void setFilterList(ArrayList<SeparationPeriodSelection> graphList) {
		this.graphList = graphList;
	}

	public ArrayList<SeparationPeriodSelection> getGraphList() {
		return this.graphList;
	}

	public void addGraph(SeparationPeriodSelection graph) {
		if ( this.graphList == null ){
			this.graphList = new ArrayList<SeparationPeriodSelection>();
		}
		this.graphList.add(graph);
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void populateFromSeparationSelectionList(SeparationSelectionList results) {
		for (int i = 0 ; i < results.separationSelectionList.size(); i++ ) {
			this.addGraph(results.separationSelectionList.get(i).graph);
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
