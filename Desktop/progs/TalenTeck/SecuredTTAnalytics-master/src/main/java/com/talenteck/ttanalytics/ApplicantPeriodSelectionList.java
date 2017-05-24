package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class ApplicantPeriodSelectionList {

	String filterName;
	ArrayList<ApplicantPeriodSelection> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<ApplicantPeriodSelection> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<ApplicantPeriodSelection> getFilterValues() {
		return this.filterValues;
	}

	public void addSelection(ApplicantPeriodSelection selection) {
		if ( this.filterValues == null ){
			this.filterValues = new ArrayList<ApplicantPeriodSelection>();
		}
		this.filterValues.add(selection);
	}

	
	
}
