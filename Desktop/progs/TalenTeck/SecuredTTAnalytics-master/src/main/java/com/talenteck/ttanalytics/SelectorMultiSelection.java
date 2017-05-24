package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class SelectorMultiSelection {

	String selectorName;
	ArrayList<String> selectorValues;
	
	@XmlElement(name = "SelectorName")
	public void setSelectorName(String name) {
		this.selectorName = name;
	}
	
	String getSelectorName(){
		return this.selectorName;
	}

	@XmlElement(name = "SelectorValue")
	public void setSelectorValues(ArrayList<String> values) {
		this.selectorValues = values;
	}

	public ArrayList<String> getSelectorValues() {
		return this.selectorValues;
	}


	void addSelectorValue(String value) {
		if (this.selectorValues == null) {
			this.selectorValues = new ArrayList<String>();
		}
		this.selectorValues.add(value);
	}

	
}
