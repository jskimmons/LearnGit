package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class ELMReportGraphRow {
	ArrayList<SelectorSelection> selectorValues;
	Integer applicants;
	Integer hires;
	Integer goodhires;
	String testMonth;
		
	
	public ELMReportGraphRow() {
	}
	public ELMReportGraphRow(ELMReportGraphRow anotherRow) {
		this.setSelectorValues(anotherRow.selectorValues);
		this.applicants = anotherRow.applicants;
		this.hires = anotherRow.hires;
		this.goodhires = anotherRow.goodhires;
	}
	
	
	@XmlElement(name = "SelectorValues")
	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	public ArrayList<SelectorSelection> getSelectorValues() {
		return this.selectorValues;
	}
	
	@XmlElement(name = "Applicants")
	public void setApplicants(Integer applicants) {
		this.applicants = applicants;
	}
	
	int getApplicants() {
		return applicants;
	}

	@XmlElement(name = "Hires")
	public void setHires(Integer hires) {
		this.hires = hires;
	}

	Integer getHires() {
		return hires;
	}

	@XmlElement(name = "goodHires")
	public void setGoodhires(Integer goodhires) {
		this.goodhires = goodhires;
	}
	Integer getGoodhires() {
		return goodhires;
	}
	
	
	@XmlElement(name = "testMonth")
	public void setTestMonth(String testMonth) {
		this.testMonth = testMonth;
	}
	String getTestMonth() {
		return testMonth;
	}
	
	public void addSelectorValue(SelectorSelection selectorValue) {
		if ( this.selectorValues == null ) {
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorValue);
	}
}
