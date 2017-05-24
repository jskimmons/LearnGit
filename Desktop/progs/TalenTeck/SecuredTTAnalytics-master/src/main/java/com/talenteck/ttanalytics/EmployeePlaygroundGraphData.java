package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class EmployeePlaygroundGraphData {
	ArrayList<EmployeePlaygroundGraphDatapoint> graphData;

	String location;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public EmployeePlaygroundGraphData() {
		graphData = new ArrayList<EmployeePlaygroundGraphDatapoint>();
	}

	public void addDatapoint(EmployeePlaygroundGraphDatapoint e) {
		graphData.add(e);
	}
}
