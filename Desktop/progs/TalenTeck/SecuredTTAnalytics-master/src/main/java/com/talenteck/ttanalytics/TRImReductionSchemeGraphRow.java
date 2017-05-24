package com.talenteck.ttanalytics;

public class TRImReductionSchemeGraphRow {
	
	String filterValue;
	Double ebitdaImpact;
	Double topLineGain;
	Double costSavings;
	Double bottomLineImpact;

	
	public String getFilterValue() {
		return filterValue;
	}

	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}

	public Double getEbitda() {
		return ebitdaImpact;
	}

	public void setEbitda(Double ebitda) {
		this.ebitdaImpact = ebitda;
	}

	public Double getBottomLineImpact() {
		return bottomLineImpact;
	}

	public void setBottomLineImpact(Double bottomLineImpact) {
		this.bottomLineImpact = bottomLineImpact;
	}

	void setTopLineGain(Double topLineGain) {
		this.topLineGain = topLineGain;
	}
	
	Double getTopLineGain() {
		return this.topLineGain;
	}
	void setCostSavings(Double costSavings) {
		this.costSavings = costSavings;
	}
	
	Double getCostSavings() {
		return this.costSavings;
	}


}
