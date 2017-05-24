package com.talenteck.ttanalytics;

public class TRImReductionGraphRow {
	
	/*int reduction;
	int impact;
	
	void setReduction(int reduction) {
		this.reduction = reduction;
	}

	int getReduction() {
		return this.reduction;
	}

	void setImpact(int impact) {
		this.impact = impact;
	}
	
	int getImpact() {
		return this.impact;
	}*/
	
	

	Double filterValue;
	Double ebitdaImpact;
	Double topLineGain;
	Double costSavings;
	Double bottomLineImpact;
	
	
	
	public Double getEbitda() {
		return ebitdaImpact;
	}
	public void setEbitda(Double ebitda) {
		this.ebitdaImpact = ebitda;
	}
	public Double getFilterValue() {
		return filterValue;
	}
	public void setFilterValue(Double filterValue) {
		this.filterValue = filterValue;
	}
	public Double getTopLineGain() {
		return topLineGain;
	}
	public void setTopLineGain(Double topLineGain) {
		this.topLineGain = topLineGain;
	}
	public Double getCostSavings() {
		return costSavings;
	}
	public void setCostSavings(Double costSavings) {
		this.costSavings = costSavings;
	}
	public Double getBottomLineImpact() {
		return bottomLineImpact;
	}
	public void setBottomLineImpact(Double bottomLineImpact) {
		this.bottomLineImpact = bottomLineImpact;
	}
	
	
	
	
}
