package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class DriverSelection {

	String periodName;
	String periodLabel;
	ArrayList<FilterSelection> filterSelectionList;
	DriverPeriodSelection graph;

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

	public void setGraph(DriverPeriodSelection graph) {
		this.graph = graph;
	}

	public DriverPeriodSelection getGraph() {
		return this.graph;
	}
	

	public void addFilterSelection(FilterSelection selection) {
		if (this.filterSelectionList == null ) {
			this.filterSelectionList = new ArrayList<FilterSelection>();
		}
		this.filterSelectionList.add(selection);
	}

	
}
