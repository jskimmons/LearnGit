package com.talenteck.ttanalytics;

//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
import java.util.ArrayList;

public class ApplicantSelection {


	String periodName;
	String periodLabel;
	ArrayList<FilterSelection> filterSelectionList;
	ApplicantPeriodSelection graph;

	public void setPeriodName(String name) {
		this.periodName = name;
	}
	
	String getPeriodName(){
		return this.periodName;
	}
		
	public void setPeriodLabel(String label) {
		this.periodLabel = label;
	}
	
	String getPeriodLabel(){
		return this.periodLabel;
	}
		
	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}

	public ArrayList<FilterSelection> getFilterSelectionList() {
		return this.filterSelectionList;
	}

	public void setGraph(ApplicantPeriodSelection graph) {
		this.graph = graph;
	}

	public ApplicantPeriodSelection getGraph() {
		return this.graph;
	}

	public void addFilterSelection(FilterSelection selection) {
		if (this.filterSelectionList == null ) {
			this.filterSelectionList = new ArrayList<FilterSelection>();
		}
		this.filterSelectionList.add(selection);
	}
	

	
}
