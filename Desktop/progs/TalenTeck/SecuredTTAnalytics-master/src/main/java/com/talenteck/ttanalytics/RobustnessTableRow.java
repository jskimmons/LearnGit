package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class RobustnessTableRow {

	boolean hasObservations;
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<RobustnessQuantile> quantiles;

	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	ArrayList<SelectorSelection> getSelectorValues(){
		return this.selectorValues;
	}

	public void setQuantiles(ArrayList<RobustnessQuantile> quantiles) {
		this.quantiles = quantiles;
	}
	
	ArrayList<RobustnessQuantile> getQuantiles(){
		return this.quantiles;
	}
	
	public void addSelectorSelection(SelectorSelection selectorSelection) {
		if ( this.selectorValues == null ){
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorSelection);
	}

	public void addQuantile(RobustnessQuantile quantile) {
		if ( this.quantiles == null ){
			this.quantiles = new ArrayList<RobustnessQuantile>();
		}
		this.quantiles.add(quantile);
	}

}
