package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class Selector {

	String selectorName;
	String selectorLabel;
	String defaultValue;
	ArrayList<SelectorValue> selectorValues;
	
	@XmlElement(name = "SelectorName")
	public void setSelectorName(String name) {
		this.selectorName = name;
	}
	
	String getSelectorName(){
		return this.selectorName;
	}

	@XmlElement(name = "SelectorLabel")
	public void setSelectorLabel(String label) {
		this.selectorLabel = label;
	}
	
	String getSelectorLabel(){
		return this.selectorLabel;
	}

	@XmlElement(name = "DefaultValue")
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
	
	String getDefaultValue(){
		return this.defaultValue;
	}

	@XmlElement(name = "SelectorValue")
	public void setSelectorValues(ArrayList<SelectorValue> values) {
		this.selectorValues = values;
	}

	public ArrayList<SelectorValue> getSelectorValues() {
		return this.selectorValues;
	}


	void addSelectorValue(SelectorValue value) {
		if (this.selectorValues == null) {
			this.selectorValues = new ArrayList<SelectorValue>();
		}
		this.selectorValues.add(value);
	}

}
