package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class DriversTableRow {

	
	ArrayList<SelectorSelection> selectorValues;
	ArrayList<Driver> drivers;
	boolean hasObservations;
	
	@XmlElement(name = "SelectorValues")
	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	public ArrayList<SelectorSelection> getSelectorValues() {
		return this.selectorValues;
	}

	public void setDrivers(ArrayList<Driver> drivers) {
		this.drivers = drivers;
	}
	
	ArrayList<Driver> getDrivers(){
		return this.drivers;
	}
	
	public void addDriver(Driver driver) {
		if ( this.drivers == null ){
			this.drivers = new ArrayList<Driver>();
		}
		this.drivers.add(driver);
	}

	public void addSelectorValue(SelectorSelection selectorValue) {
		if ( this.selectorValues == null ) {
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorValue);
	}



}
