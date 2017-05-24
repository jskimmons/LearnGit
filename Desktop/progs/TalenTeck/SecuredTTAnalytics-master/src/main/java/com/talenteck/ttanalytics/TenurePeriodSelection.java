package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class TenurePeriodSelection {

	String filterValue;
	double t0to30;
	double t31to60;
	double t61to90;
	double t91to180;
	double t181to365;
	double t366plus;
	int n;

	@XmlElement(name = "FilterValue")
	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}
	
	String getFilterValue(){
		return this.filterValue;
	}

	
	@XmlElement(name = "t0to30")
	public void setT0To30(double t0to30) {
		this.t0to30 = t0to30;
	}
	
	double getT0To30(){
		return this.t0to30;
	}

	@XmlElement(name = "t31to60")
	public void setT31To60(double t31to60) {
		this.t31to60 = t31to60;
	}
	
	double getT31To60(){
		return this.t31to60;
	}

	@XmlElement(name = "t61to90")
	public void setT61To90(double t61to90) {
		this.t61to90 = t61to90;
	}
	
	double getT61To90(){
		return this.t61to90;
	}

	@XmlElement(name = "t91to180")
	public void setT91To180(double t91to180) {
		this.t91to180 = t91to180;
	}
	
	double getT91To180(){
		return this.t91to180;
	}

	@XmlElement(name = "t181to365")
	public void setT181To365(double t181to365) {
		this.t181to365 = t181to365;
	}
	
	double getT181To365(){
		return this.t181to365;
	}

	@XmlElement(name = "t366plus")
	public void setT366Plus(double t366plus) {
		this.t366plus = t366plus;
	}
	
	double getT366Plus(){
		return this.t366plus;
	}

	@XmlElement(name = "n")
	public void setN(int n) {
		this.n = n;
	}
	
	double getN(){
		return this.n;
	}

	
}
