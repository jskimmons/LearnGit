package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class SeparationPeriodSelectionList {

	String filterName;
	ArrayList<SeparationPeriodSelection> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<SeparationPeriodSelection> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<SeparationPeriodSelection> getFilterValues() {
		return this.filterValues;
	}

	public void addSelection(SeparationPeriodSelection selection) {
		if ( this.filterValues == null ){
			this.filterValues = new ArrayList<SeparationPeriodSelection>();
		}
		this.filterValues.add(selection);
	}

	
}
