package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class PostalCodeSelection {
	
	String filterValue; //Used for table
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<PostalCodeAttributes> postalCodes;

	public String getFilterValue() {
		return filterValue;
	}

	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}

	public ArrayList<SelectorSelection> getSelectorValues() {
		return selectorValues;
	}
	
	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}

	public ArrayList<PostalCodeAttributes> getPostalCodes() {
		return postalCodes;
	}

	public void setPostalCodes(ArrayList<PostalCodeAttributes> postalCodes) {
		this.postalCodes = postalCodes;
	}
	

	public void addPostalCode(PostalCodeAttributes postalCode) {
		if ( this.postalCodes == null ) {
			this.postalCodes = new ArrayList<PostalCodeAttributes>();
		}
		this.postalCodes.add(postalCode);
	}

}
