package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class ApplicantPlaygroundFilterValueVariable {
	
	String variableName;
	String variableLabel;
	String defaultCategory;
	Double coefficient;
	
	public Double getCoefficient() {
		return coefficient;
	}
	public void setCoefficient(Double coefficient) {
		this.coefficient = coefficient;
	}
	public String getDefaultCategory() {
		return defaultCategory;
	}
	public void setDefaultCategory(String defaultCategory) {
		this.defaultCategory = defaultCategory;
	}
	public String getVariableName() {
		return variableName;
	}
	public void setVariableName(String variableName) {
		this.variableName = variableName;
	}
	public String getVariableLabel() {
		return variableLabel;
	}
	public void setVariableLabel(String variableLabel) {
		this.variableLabel = variableLabel;
	}
}
