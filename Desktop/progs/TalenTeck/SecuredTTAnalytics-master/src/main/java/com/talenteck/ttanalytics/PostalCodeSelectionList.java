package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class PostalCodeSelectionList {

	String filterName;
	ArrayList<PostalCodeSelection> filterValues;
	public String getFilterName() {
		return filterName;
	}
	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}
	public ArrayList<PostalCodeSelection> getFilterValues() {
		return filterValues;
	}
	public void setFilterValues(ArrayList<PostalCodeSelection> filterValues) {
		this.filterValues = filterValues;
	}
	
	public void addFilterValue(PostalCodeSelection filterValue) {
		if ( this.filterValues == null ) {
			this.filterValues = new ArrayList<>();
		}
		this.filterValues.add(filterValue);
	}
	
}
