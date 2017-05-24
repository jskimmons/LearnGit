package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class SeparationByTenurePeriodSelectionList {

	String filterName;
	ArrayList<SeparationByTenurePeriodSelection> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<SeparationByTenurePeriodSelection> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<SeparationByTenurePeriodSelection> getFilterValues() {
		return this.filterValues;
	}

	public void addSelection(SeparationByTenurePeriodSelection selection) {
		if ( this.filterValues == null ){
			this.filterValues = new ArrayList<SeparationByTenurePeriodSelection>();
		}
		this.filterValues.add(selection);
	}

	
}
