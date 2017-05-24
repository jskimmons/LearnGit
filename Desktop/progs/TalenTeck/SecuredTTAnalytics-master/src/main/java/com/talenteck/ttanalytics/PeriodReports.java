package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class PeriodReports {

	String periodName;
	String periodLabel;

	@XmlElement(name = "PeriodName")
	public void setPeriodName(String name) {
		this.periodName = name;
	}
	
	String getPeriodName(){
		return this.periodName;
	}

	@XmlElement(name = "PeriodLabel")
	public void setPeriodLabel(String label) {
		this.periodLabel = label;
	}
	
	String getPeriodLabel(){
		return this.periodLabel;
	}

	
}
