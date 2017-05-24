package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class TenurePeriodSelectionList {

	String filterName;
	ArrayList<TenurePeriodSelection> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<TenurePeriodSelection> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<TenurePeriodSelection> getFilterValues() {
		return this.filterValues;
	}

	public void addSelection(TenurePeriodSelection selection) {
		if ( this.filterValues == null ){
			this.filterValues = new ArrayList<TenurePeriodSelection>();
		}
		this.filterValues.add(selection);
	}

}
