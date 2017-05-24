package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class DriverPeriodSelectionList {


	String filterName;
	ArrayList<DriverPeriodSelection> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<DriverPeriodSelection> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<DriverPeriodSelection> getFilterValues() {
		return this.filterValues;
	}

	public void addSelection(DriverPeriodSelection selection) {
		if ( this.filterValues == null ){
			this.filterValues = new ArrayList<DriverPeriodSelection>();
		}
		this.filterValues.add(selection);
	}

	
}
