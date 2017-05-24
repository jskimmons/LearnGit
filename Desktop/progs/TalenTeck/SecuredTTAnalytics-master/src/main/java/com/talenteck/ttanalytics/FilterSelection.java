package com.talenteck.ttanalytics;

import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class FilterSelection {

	String filterName;
	String filterValue;
	
	
	public void setFilterName(String name) {
		this.filterName = name;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	public void setFilterValue(String value) {
		this.filterValue = value;
	}
	
	String getFilterValue(){
		return this.filterValue;
	}

	public static ArrayList<FilterSelection> getListFromJSON(String json, String database) throws Exception {
		
		Gson gson = new Gson();
		ArrayList<FilterSelection> returnList = new ArrayList<FilterSelection>();
		FilterSelection validFilterSelection = null;
		Filter thisFilter = null;
		String thisFilterName = null;
		String thisValue = null;
		Boolean filterFound;
		Boolean valueFound;
		
		FilterList compareList = new FilterList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		
		ArrayList<FilterSelection> selectionList = gson.fromJson(json, new TypeToken<ArrayList<FilterSelection>>() {}.getType());
		
		for (int i = 0 ; i < compareList.filters.size() ; i++ ) {
			thisFilter = compareList.filters.get(i);
			thisFilterName = thisFilter.filterName;
			filterFound = false;
			for (int j = 0 ; j < selectionList.size() && filterFound == false ; j++ ) {
				if (thisFilterName.equals(selectionList.get(j).filterName)) {
					filterFound = true;
					thisValue = selectionList.get(j).filterValue;
					valueFound = false;
					if ( thisValue == null ) {
						throw new Exception("Null filter value for filter " + thisFilterName);
					}
					if ( ("All").equals(thisValue)) {
						validFilterSelection = new FilterSelection();
						validFilterSelection.setFilterName(thisFilterName);
						validFilterSelection.setFilterValue("All");
						returnList.add(validFilterSelection);
						valueFound = true;
					}
					for (int k=0 ; (k < thisFilter.filterValues.size()) && valueFound == false ; k++ ) {
						if ( (thisFilter.filterValues.get(k)).equals(thisValue) ) {
							validFilterSelection = new FilterSelection();
							validFilterSelection.setFilterName(thisFilterName);
							validFilterSelection.setFilterValue(thisValue);
							returnList.add(validFilterSelection);
							valueFound = true;
						}
					}
					if (valueFound == false ) {
						throw new Exception("Invalid value " + thisValue + " for filter " + thisFilterName);
					}
					
				}
				
			}
			if ( filterFound == false) {
				throw new Exception("Filter " + thisFilterName + " has not been specified.");
			}
			
		}

		return returnList;
		
	}



	
}
