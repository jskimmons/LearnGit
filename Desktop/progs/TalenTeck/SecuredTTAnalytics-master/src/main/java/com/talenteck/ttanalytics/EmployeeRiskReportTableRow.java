package com.talenteck.ttanalytics;

public class EmployeeRiskReportTableRow {
	String quantileNumber;
	int employees;
	int eligibleemployees;
	Double predictedTurnover;
	Double actualTurnover;
	public String getQuantileNumber() {
		return quantileNumber;
	}
	public void setQuantileNumber(String quantileNumber) {
		this.quantileNumber = quantileNumber;
	}
	public int getEmployees() {
		return employees;
	}
	public void setEmployees(int employees) {
		this.employees = employees;
	}
	public int getEligibleemployees() {
		return eligibleemployees;
	}
	public void setEligibleemployees(int eligibleemployees) {
		this.eligibleemployees = eligibleemployees;
	}
	public Double getPredictedTurnover() {
		return predictedTurnover;
	}
	public void setPredictedTurnover(Double predictedTurnover) {
		this.predictedTurnover = predictedTurnover;
	}
	public Double getActualTurnover() {
		return actualTurnover;
	}
	public void setActualTurnover(Double actualTurnover) {
		this.actualTurnover = actualTurnover;
	}

	
}
