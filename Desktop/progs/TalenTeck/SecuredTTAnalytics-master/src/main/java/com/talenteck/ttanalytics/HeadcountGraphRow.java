package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class HeadcountGraphRow {

	ArrayList<SelectorSelection> selectorValues;
	int year;
	int month;
	int startEmployment;
	int hires;
	int terminations;
	double seatTurnover;
	
	public HeadcountGraphRow() {
	}
	public HeadcountGraphRow(HeadcountGraphRow anotherRow) {
		this.setSelectorValues(anotherRow.selectorValues);
		this.year = anotherRow.year;
		this.month = anotherRow.month;
		this.startEmployment = anotherRow.startEmployment;
		this.hires = anotherRow.hires;
		this.terminations = anotherRow.terminations;
		this.seatTurnover = anotherRow.seatTurnover;
	}
	
	@XmlElement(name = "SelectorValues")
	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	public ArrayList<SelectorSelection> getSelectorValues() {
		return this.selectorValues;
	}
	
	@XmlElement(name = "Year")
	public void setYear(int year) {
		this.year = year;
	}
	
	int getYear(){
		return this.year;
	}

	@XmlElement(name = "Month")
	public void setMonth(int month) {
		this.month = month;
	}
	
	int getMonth(){
		return this.month;
	}

	@XmlElement(name = "startEmployment")
	public void setStartEmployment(int startEmployment) {
		this.startEmployment = startEmployment;
	}
	
	int getStartEmployment(){
		return this.startEmployment;
	}

	@XmlElement(name = "hires")
	public void setHires(int hires) {
		this.hires = hires;
	}
	
	int getHires(){
		return this.hires;
	}

	@XmlElement(name = "terminations")
	public void setTerminations(int terminations) {
		this.terminations = terminations;
	}
	
	int getTerminations(){
		return this.terminations;
	}

	@XmlElement(name = "seatTurnover")
	public void setSeatTurnover(double seatTurnover) {
		this.seatTurnover = seatTurnover;
	}
	
	double getSeatTurnover(){
		return this.seatTurnover;
	}

	public void addSelectorValue(SelectorSelection selectorValue) {
		if ( this.selectorValues == null ) {
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorValue);
	}


}
