package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class CallCenterAttributes {
	Integer averageHeadcount;
	Integer hiresPerMonth;
	Double t30Rate;
	Double t90Rate;
	ArrayList<String> parentLocations;
	String location;
	double lat;
	double lng;

	public ArrayList<String> getParentLocations() {
		return parentLocations;
	}
	public void setParentLocations(ArrayList<String> parentLocations) {
		this.parentLocations = parentLocations;
	}
	public void addParentLocation(String parent) {
		if(this.parentLocations == null) {
			this.parentLocations = new ArrayList<String>();
		}
		this.parentLocations.add(parent);
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double lat) {
		this.lat = lat;
	}
	public double getLng() {
		return lng;
	}
	public void setLng(double lng) {
		this.lng = lng;
	}
	public Integer getAverageHeadcount() {
		return averageHeadcount;
	}
	public void setAverageHeadcount(Integer averageHeadcount) {
		this.averageHeadcount = averageHeadcount;
	}
	public Integer getHiresPerMonth() {
		return hiresPerMonth;
	}
	public void setHiresPerMonth(Integer hiresPerMonth) {
		this.hiresPerMonth = hiresPerMonth;
	}
	public Double getT30Rate() {
		return t30Rate;
	}
	public void setT30Rate(Double t30Rate) {
		this.t30Rate = t30Rate;
	}
	public Double getT90Rate() {
		return t90Rate;
	}
	public void setT90Rate(Double t90Rate) {
		this.t90Rate = t90Rate;
	}
	
	public String toString(){
		return ("averageHeadcount: " +averageHeadcount + 
		"hiresPerMonth: " +  hiresPerMonth + 
		"t30Rate:" +  t30Rate + 
		"t90Rate:" +  t90Rate + 
		"location:" +  location + 
		"parentlocations:" +  parentLocations + 
		"lat:" +  lat+
		"lng:" +  lng);
	}
}
