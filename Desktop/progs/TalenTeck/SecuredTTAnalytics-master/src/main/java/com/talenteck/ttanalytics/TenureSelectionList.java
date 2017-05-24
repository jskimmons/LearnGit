package com.talenteck.ttanalytics;

import java.util.ArrayList;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class TenureSelectionList {

	String varyingFilter;
	ArrayList<TenureSelection> tenureSelectionList;

	public void setVaryingFilter(String varyingFilter) {
		this.varyingFilter = varyingFilter;
	}
	
	String getVaryingFilter(){
		return this.varyingFilter;
	}

	
	public void setTenureSelectionList(ArrayList<TenureSelection> tenureSelectionList) {
		this.tenureSelectionList = tenureSelectionList;
	}

	public ArrayList<TenureSelection> getTenureSelectionList() {
		return this.tenureSelectionList;
	}

	public void addTenureSelection(TenureSelection selection) {
		if (this.tenureSelectionList == null ) {
			this.tenureSelectionList = new ArrayList<TenureSelection>();
		}
		this.tenureSelectionList.add(selection);
	}

	
	public void setVaryingFilterWithCheck(String varyingFilter, String database) throws Exception {
		Hashtable<String,String> filterNames = null;
		try {
			filterNames = FilterList.getNamesAsHashtable(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		if ( varyingFilter != null && ( ("period").equals(varyingFilter) || filterNames.containsKey(varyingFilter))) { 
			this.varyingFilter = varyingFilter;
		}
		else {
			throw new Exception("Invalid varying selector name '" + varyingFilter + "'.");						
		}
	}

	
	public void populateSelectorsFromJSON(String json, String database) throws Exception {
		
		Gson gson = new Gson();
		FilterSelection validFilterSelection = null;
		Hashtable<String,String> periodTable = null;
		Hashtable<String,Hashtable<String,String>> compareHash = null;
		Hashtable<String,String> thisFilterHash = null;
		SelectorSelection thisSelectorSelection = null;
		ArrayList<SelectorMultiSelection> selectionList = null;
		ArrayList<SelectorSelection> thisSelectorSelectionList = null;
		ArrayList<ArrayList<SelectorSelection>> tokenizedBigList = new ArrayList<ArrayList<SelectorSelection>>();
		TenureSelection thisTenureSelection = null;
		TenurePeriodSelection thisTenureSelectionGraph;
		
		FilterList compareList = new FilterList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		compareHash = compareList.toHashtable();
		
		try {
			periodTable = PeriodListTenure.periodLabels(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorMultiSelection>>() {}.getType());
		} catch(Exception jsonException) { throw new Exception("Error parsing JSON: " + jsonException.getMessage()); }

		//Only one index is allowed to have multiple values.  So we parse to an array of SelectorSelection
		int multiIndex = -1;
		for (int i = 0 ; i < selectionList.size() ; i++ ) {
			if ( selectionList.get(i).selectorValues.size() > 1) {
				if ( multiIndex != -1) {
					throw new Exception("Only one index is allowed to have multiple values.");
				}
				multiIndex = i;
				if (this.varyingFilter == null ) {
					this.varyingFilter =  selectionList.get(i).selectorName;
				}	
			}
		}
		//Possible there was no multi-index
		if ( multiIndex == -1 ) {
			multiIndex = 0;
			if ( this.varyingFilter == null ) {
				this.varyingFilter =  selectionList.get(0).selectorName;
			}	
		}

		for (int i = 0 ; i < selectionList.get(multiIndex).selectorValues.size() ; i++ ) {
			thisSelectorSelectionList = new ArrayList<SelectorSelection>();
			thisSelectorSelection = new SelectorSelection();
			thisSelectorSelection.setSelectorName(selectionList.get(multiIndex).selectorName);
			thisSelectorSelection.setSelectorValue(selectionList.get(multiIndex).selectorValues.get(i));
			thisSelectorSelectionList.add(thisSelectorSelection);
			for (int j = 0 ; j < selectionList.size() ; j++ ) {
				if ( j != multiIndex ) {
					thisSelectorSelection = new SelectorSelection();
					thisSelectorSelection.setSelectorName(selectionList.get(j).selectorName);
					thisSelectorSelection.setSelectorValue(selectionList.get(j).selectorValues.get(0));					
					thisSelectorSelectionList.add(thisSelectorSelection);
				}
			}
			tokenizedBigList.add(thisSelectorSelectionList);
		}
			
		// Okay we have the list of single selector lists, now make an empty TenureSelection
		// out of each one and add it to parent structure
		
		for ( int thisListIndex = 0 ; thisListIndex < tokenizedBigList.size() ; thisListIndex++ ) {
			thisTenureSelection = new TenureSelection();
			thisSelectorSelectionList = tokenizedBigList.get(thisListIndex);
			for (int i = 0 ; i < thisSelectorSelectionList.size() ; i++ ) {
				if (this.varyingFilter != null && this.varyingFilter.equals(thisSelectorSelectionList.get(i).selectorName)) {
					thisTenureSelectionGraph = new TenurePeriodSelection();
					thisTenureSelection.graph = thisTenureSelectionGraph; 
					thisTenureSelection.graph.filterValue = new String(thisSelectorSelectionList.get(i).selectorValue);
				}
				if ( thisSelectorSelectionList.get(i) != null && ("period").equals(thisSelectorSelectionList.get(i).selectorName ) ) {
					if ( periodTable.containsKey(thisSelectorSelectionList.get(i).selectorValue) ) {
						thisTenureSelection.periodName = thisSelectorSelectionList.get(i).selectorValue;
					}
					else {
						throw new Exception("Invalid period specified: " + thisSelectorSelectionList.get(i).selectorValue);
					}
				}
				else {
					if ( compareHash.containsKey(thisSelectorSelectionList.get(i).selectorName) ) {
						thisFilterHash = compareHash.get(thisSelectorSelectionList.get(i).selectorName);
						if ( thisFilterHash.containsKey(thisSelectorSelectionList.get(i).selectorValue)) {
							validFilterSelection = new FilterSelection();
							validFilterSelection.setFilterName(thisSelectorSelectionList.get(i).selectorName);
							validFilterSelection.setFilterValue(thisSelectorSelectionList.get(i).selectorValue);
							thisTenureSelection.addFilterSelection(validFilterSelection);
							
						}
						else {
							throw new Exception("Invalid filter value " + thisSelectorSelectionList.get(i).selectorValue
									+ " for filter " + thisSelectorSelectionList.get(i).selectorName );
						}
					}
					else {
						throw new Exception("Invalid selector name " + thisSelectorSelectionList.get(i).selectorName);
					}
				}
			}		
			this.addTenureSelection(thisTenureSelection);
		}
		
	}

	public void fetchData(String database) throws Exception {
		for (int i = 0 ; i < this.tenureSelectionList.size(); i++ ) {
			try {
				this.tenureSelectionList.get(i).fetchData(database , this.varyingFilter );
			} catch (Exception rethrownException) {
				throw new Exception(rethrownException.getMessage());
			}
		}		
	}
	
	
}
