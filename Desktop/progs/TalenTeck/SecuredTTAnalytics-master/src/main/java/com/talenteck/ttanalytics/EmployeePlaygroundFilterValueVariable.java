package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class EmployeePlaygroundFilterValueVariable {
	
	String variableName;
	String variableLabel;
	String defaultCategory;
	ArrayList<EmployeePlaygroundCategory> categories;
	
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
	public String getDefaultCategory() {
		return defaultCategory;
	}
	public void setDefaultCategory(String defaultCategory) {
		this.defaultCategory = defaultCategory;
	}
	public ArrayList<EmployeePlaygroundCategory> getCategories() {
		return categories;
	}
	public void setCategories(ArrayList<EmployeePlaygroundCategory> categories) {
		this.categories = categories;
	}
	
	public void addCategory(EmployeePlaygroundCategory category) {
		if ( this.categories == null ){
			this.categories = new ArrayList<EmployeePlaygroundCategory>();
		}
		this.categories.add(category);
	}


}
