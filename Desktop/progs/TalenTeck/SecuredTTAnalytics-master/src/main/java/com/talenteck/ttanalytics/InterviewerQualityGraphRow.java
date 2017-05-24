package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class InterviewerQualityGraphRow {

	boolean hasObservations;
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<InterviewerQualityGraphQuantile> quantiles;

	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	ArrayList<SelectorSelection> getSelectorValues(){
		return this.selectorValues;
	}

	public void setQuantiles(ArrayList<InterviewerQualityGraphQuantile> quantiles) {
		this.quantiles = quantiles;
	}
	
	ArrayList<InterviewerQualityGraphQuantile> getQuantiles(){
		return this.quantiles;
	}
	
	public void addSelectorSelection(SelectorSelection selectorSelection) {
		if ( this.selectorValues == null ){
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorSelection);
	}

	public void addQuantile(InterviewerQualityGraphQuantile quantile) {
		if ( this.quantiles == null ){
			this.quantiles = new ArrayList<InterviewerQualityGraphQuantile>();
		}
		this.quantiles.add(quantile);
	}


	
}
