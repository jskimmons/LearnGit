package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class ReportsTableRow {
	
	boolean hasObservations;
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<ReportsQuantile> quantiles;

	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	ArrayList<SelectorSelection> getSelectorValues(){
		return this.selectorValues;
	}

	public void setQuantiles(ArrayList<ReportsQuantile> quantiles) {
		this.quantiles = quantiles;
	}
	
	ArrayList<ReportsQuantile> getQuantiles(){
		return this.quantiles;
	}
	
	public void addSelectorSelection(SelectorSelection selectorSelection) {
		if ( this.selectorValues == null ){
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorSelection);
	}

	public void addQuantile(ReportsQuantile quantile) {
		if ( this.quantiles == null ){
			this.quantiles = new ArrayList<ReportsQuantile>();
		}
		this.quantiles.add(quantile);
	}


}
