package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class DriverPeriodSelection {
	
	String driverName;
	String filterValue;
	String turnoverPeriod;
	ArrayList<DriverCategory> turnoverRates;

	
	@XmlElement(name = "DriverName")
	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}
	
	String getDriverName(){
		return this.driverName;
	}

	
	@XmlElement(name = "FilterValue")
	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}
	
	String getFilterValue(){
		return this.filterValue;
	}

	@XmlElement(name = "TurnoverPeriod")
	public void setTurnoverPeriod(String turnoverPeriod) {
		this.turnoverPeriod = turnoverPeriod;
	}
	
	String getTurnoverPeriod(){
		return this.turnoverPeriod;
	}

	public void setTurnoverRates(ArrayList<DriverCategory> turnoverRates) {
		this.turnoverRates = turnoverRates;
	}

	public ArrayList<DriverCategory> getTurnoverRates() {
		return this.turnoverRates;
	}

	public void addTurnoverRate(DriverCategory turnoverRate) {
		if ( this.turnoverRates == null ){
			this.turnoverRates = new ArrayList<DriverCategory>();
		}
		this.turnoverRates.add(turnoverRate);
	}

	
}

