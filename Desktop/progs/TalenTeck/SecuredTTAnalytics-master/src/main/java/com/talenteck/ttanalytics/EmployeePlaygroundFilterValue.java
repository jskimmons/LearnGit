package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class EmployeePlaygroundFilterValue {
	
	String filterValue;
	String tenure;
	Double meanOutput;
	Double constantTerm;
	ArrayList<EmployeePlaygroundFilterValueVariable> variables;
	
	
	public String getTenure() {
		return tenure;
	}
	public void setTenure(String tenure) {
		this.tenure = tenure;
	}
	public String getFilterValue() {
		return filterValue;
	}
	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}
	public Double getMeanOutput() {
		return meanOutput;
	}
	public void setMeanOutput(Double meanOutput) {
		this.meanOutput = meanOutput;
	}
	public Double getConstantTerm() {
		return constantTerm;
	}
	public void setConstantTerm(Double constantTerm) {
		this.constantTerm = constantTerm;
	}
	public ArrayList<EmployeePlaygroundFilterValueVariable> getVariables() {
		return variables;
	}
	public void setVariables(ArrayList<EmployeePlaygroundFilterValueVariable> variables) {
		this.variables = variables;
	}
	
	public void addVariable(EmployeePlaygroundFilterValueVariable variable) {
		if ( this.variables == null ){
			this.variables = new ArrayList<EmployeePlaygroundFilterValueVariable>();
		}
		this.variables.add(variable);
	}

	

}
