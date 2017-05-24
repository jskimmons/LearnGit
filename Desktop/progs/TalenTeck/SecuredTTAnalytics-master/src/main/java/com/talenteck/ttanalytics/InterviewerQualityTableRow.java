package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class InterviewerQualityTableRow {

	boolean hasObservations;
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<InterviewerQualityQuantile> quantiles;

	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	ArrayList<SelectorSelection> getSelectorValues(){
		return this.selectorValues;
	}

	public void setQuantiles(ArrayList<InterviewerQualityQuantile> quantiles) {
		this.quantiles = quantiles;
	}
	
	ArrayList<InterviewerQualityQuantile> getQuantiles(){
		return this.quantiles;
	}
	
	public void addSelectorSelection(SelectorSelection selectorSelection) {
		if ( this.selectorValues == null ){
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorSelection);
	}

	public void addQuantile(InterviewerQualityQuantile quantile) {
		if ( this.quantiles == null ){
			this.quantiles = new ArrayList<InterviewerQualityQuantile>();
		}
		this.quantiles.add(quantile);
	}

	
}
