package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class SelectorValue {

	String valueName;
	String valueLabel;
	
	@XmlElement(name = "ValueName")
	public void setValueName(String name) {
		this.valueName = name;
	}
	
	String getValueName(){
		return this.valueName;
	}

	@XmlElement(name = "ValueLabel")
	public void setValueLabel(String label) {
		this.valueLabel = label;
	}
	
	String getValueLabel(){
		return this.valueLabel;
	}

	
}
