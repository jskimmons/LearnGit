package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class ApplicantPlaygroundFilterValue {

	String filterValue;
	String turnoverRate;
	Double influence;
	ArrayList<ApplicantPlaygroundFilterValueVariable> variables;


	public String getTurnoverRate() {
		return turnoverRate;
	}

	public void setTurnoverRate(String turnoverRate) {
		this.turnoverRate = turnoverRate;
	}

	public String getFilterValue() {
		return filterValue;
	}

	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}

	public Double getMeanOutput() {
		return influence;
	}

	public void setMeanOutput(Double meanOutput) {
		this.influence = meanOutput;
	}

	public ArrayList<ApplicantPlaygroundFilterValueVariable> getVariables() {
		return variables;
	}

	public void setVariables(ArrayList<ApplicantPlaygroundFilterValueVariable> variables) {
		this.variables = variables;
	}

	public void addVariable(ApplicantPlaygroundFilterValueVariable variable) {
		if (this.variables == null) {
			this.variables = new ArrayList<ApplicantPlaygroundFilterValueVariable>();
		}
		this.variables.add(variable);
	}

}
