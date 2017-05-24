package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class HeadcountFilterValue {

	String filterValue;
	ArrayList<HeadcountSelectionPeriod> periodList;

	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}
	
	String getFilterValue(){
		return this.filterValue;
	}

	public void setPeriodList(ArrayList<HeadcountSelectionPeriod> periodList) {
		this.periodList = periodList;
	}

	public ArrayList<HeadcountSelectionPeriod> getPeriodList() {
		return this.periodList;
	}

	public void addPeriod(HeadcountSelectionPeriod period) {
		if (this.periodList == null ) {
			this.periodList = new ArrayList<HeadcountSelectionPeriod>();
		}
		this.periodList.add(period);
	}

	
}
