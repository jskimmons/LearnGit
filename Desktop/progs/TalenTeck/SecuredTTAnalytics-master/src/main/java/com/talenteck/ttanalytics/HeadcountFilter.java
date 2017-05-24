package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class HeadcountFilter {

	String filterName;
	ArrayList<HeadcountFilterValue> filterValues;
	
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValues(ArrayList<HeadcountFilterValue> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<HeadcountFilterValue> getFilterValues() {
		return this.filterValues;
	}

	public void addFilterValue(HeadcountFilterValue filterValue) {
		if (this.filterValues == null ) {
			this.filterValues = new ArrayList<HeadcountFilterValue>();
		}
		this.filterValues.add(filterValue);
	}


	
	
	
}
