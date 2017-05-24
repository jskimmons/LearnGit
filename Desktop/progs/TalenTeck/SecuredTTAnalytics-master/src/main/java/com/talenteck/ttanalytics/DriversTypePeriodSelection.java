package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class DriversTypePeriodSelection {
	
	PeriodDriver period;
	String driverType;
	ArrayList<FilterSelection> filterSelectionList;
	ArrayList<Driver> drivers;
	Messages messages;
	
	public void setPeriod(PeriodDriver period) {
		this.period = period;
	}
	
	PeriodDriver getPeriod(){
		return this.period;
	}

	public void setDriverType(String driverType) {
		this.driverType = driverType;
	}
	
	String getDriverType(){
		return this.driverType;
	}

	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}
	
	ArrayList<FilterSelection> getFilterSelectionList(){
		return this.filterSelectionList;
	}

	public void setDrivers(ArrayList<Driver> drivers) {
		this.drivers = drivers;
	}
	
	ArrayList<Driver> getDrivers(){
		return this.drivers;
	}
	
	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}
	
	public void addFilterSelection(FilterSelection filterSelection) {
		if ( this.filterSelectionList == null ){
			this.filterSelectionList = new ArrayList<FilterSelection>();
		}
		this.filterSelectionList.add(filterSelection);
	}

	public void addDriver(Driver driver) {
		if ( this.drivers == null ){
			this.drivers = new ArrayList<Driver>();
		}
		this.drivers.add(driver);
	}

	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}


	public void populateSelectorsFromJSON(String json, String database ) throws Exception {
		
		Gson gson = new Gson();
		Hashtable<String,String> periodTable = null;
		Hashtable<String,Hashtable<String,String>> compareHash = null;
		Hashtable<String,String> thisFilterHash = null;
		Hashtable<String,String> driverTypes = null;
		FilterSelection thisFilterSelection = null;
		ArrayList<SelectorSelection> selectionList = null;
		String thisSelectorName = "";
		
		FilterList compareList = new FilterList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		compareHash = compareList.toHashtable();
		
		try {
			periodTable = PeriodListDriver.periodTable(database);
		} catch(Exception fetchPeriodsException) {
			throw new Exception("Error fetching list of valid periods.");			
		}
		try {
			driverTypes = Driver.getTypes(database);
		} catch(Exception fetchDriversException) {
			throw new Exception("Error fetching list of driver types.");			
		}
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());
		} catch(Exception jsonException) { throw new Exception("Error parsing JSON: " + jsonException.getMessage()); }


		for (int j = 0 ; j < selectionList.size() ; j++ ) {
			thisSelectorName =  selectionList.get(j).selectorName;
			switch (selectionList.get(j).selectorName) {
				case "periodName":
					if ( periodTable.containsKey(selectionList.get(j).selectorValue) ) {
						this.period = new PeriodDriver();
						this.period.periodName = selectionList.get(j).selectorValue;
						if ( periodTable.get(selectionList.get(j).selectorValue) != null ) {
							this.period.periodLabel = periodTable.get(selectionList.get(j).selectorValue);
						}
					}
					else {
						throw new Exception("Invalid period specified: " + selectionList.get(j).selectorValue);
					}
					break;
				case "driverType":
					if ( driverTypes.containsKey(selectionList.get(j).selectorValue) ) {
						this.setDriverType(selectionList.get(j).selectorValue);
					}
					else {
						throw new Exception("Invalid driver name " + selectionList.get(j).selectorValue);
					}
					break;
				default:
					if ( compareHash.containsKey(selectionList.get(j).selectorName) ) {
						thisFilterHash = compareHash.get(selectionList.get(j).selectorName);
						try {
						if ( thisFilterHash.containsKey(selectionList.get(j).selectorValue)) {
							thisFilterSelection = new FilterSelection();
							thisFilterSelection.setFilterName(selectionList.get(j).selectorName);
							thisFilterSelection.setFilterValue(selectionList.get(j).selectorValue);					
							this.addFilterSelection(thisFilterSelection);							
						}
						else {
							throw new Exception("Invalid filter value " + selectionList.get(j).selectorValue
									+ " for filter " + selectionList.get(j).selectorName );
						}
						} catch(Exception thisException) { throw new Exception("Selector was " + thisSelectorName + ", error was " + thisException.getMessage());}
					}
					else {
						throw new Exception("Invalid selector name " + selectionList.get(j).selectorName);
					}
				break;
					
			}
		}		
	}

	
	
	public void fetchData(String database ) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		StructuredDataParameters dataParameters = null;
		String query = "";
		DriverCategory thisDriverCategory = null;
		Driver thisDriver = null;
		Integer overallNt30 , overallNt60 , overallNt90 , overallNt180 , overallNt365;
		Double overallP30 , overallP60 , overallP90 , overallP180 , overallP365;
		Double seP30 , seP60 , seP90 , seP180 , seP365;
		Double otherCategoriesSEP30 , otherCategoriesSEP60 , otherCategoriesSEP90 , otherCategoriesSEP180 , otherCategoriesSEP365;
		Integer otherCategoriesNt30 , otherCategoriesNt60 , otherCategoriesNt90 , otherCategoriesNt180 , otherCategoriesNt365;
		Double otherCategoriesP30 , otherCategoriesP60 , otherCategoriesP90 , otherCategoriesP180 , otherCategoriesP365;
		ArrayList<DriverCategory> thisCategoryArray = null;
		Hashtable<String,String[]> driverTypesAndLabels = null;
		Integer totalHires = 0;
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		if (this.filterSelectionList == null) {
			throw new Exception("Filter selection list is empty.");
		}

		if (this.period == null ) {
			throw new Exception("Period must be specified.");			
		}

		if (this.period.periodName == null ) {
			throw new Exception("Period name must be specified.");			
		}

		query = "SELECT drivername , drivercategory , totalhires , proportion , "
				+ " pt30 , nt30 , tt30 , influencet30 , "
				+ " pt60 , nt60 , tt60 , influencet60 , " 
				+ " pt90 , nt90 , tt90 , influencet90 , "
				+ " pt180 , nt180 , tt180 , influencet180 , "
				+ " pt365 , nt365 , tt365 , influencet365 "
				+ "from driversummarystatistics WHERE ";
		for (int filterNo = 0  ; filterNo < this.filterSelectionList.size(); filterNo++ ) {
			query = query + "filtervalue" + (filterNo+1) + " = '" + this.filterSelectionList.get(filterNo).filterValue + "' AND ";
		}
		
		query = query + "periodname = '" + this.period.periodName + "' AND drivertype = '" +
						this.driverType + "' ORDER BY drivername , drivercategory;";

		overallNt30 = 0;
		overallNt60 = 0;
		overallNt90 = 0;
		overallNt180 = 0;
		overallNt365 = 0;
		overallP30 = (double) 0;
		overallP60 = (double) 0;
		overallP90 = (double) 0;
		overallP180 = (double) 0;
		overallP365 = (double) 0;

		try {
			driverTypesAndLabels = Driver.typesAndLabels(database);
		} catch(Exception getTypesException) {
			throw new Exception("Error attempting to fetch driver types and labels: " + getTypesException.getMessage());
		}
			
		try {

			// The newInstance() call is a work around for some
			// broken Java implementations

			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception openException) {
			Exception driverInitException = new Exception("Failed to open SQL driver instance:" + openException.getMessage());
			throw driverInitException;
		}

		try {

			con = DriverManager.getConnection(url, user, password);

		} catch (Exception connectException) {
			Exception driverInitException = new Exception("Failed to connect to database:" + connectException.getMessage());
			throw driverInitException;
		}
		// First query employment on the beginning of the first month

		//Debug: this.period.periodLabel = query;
		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			
			String lastRowVariable = "";
			Double lastRowInfluenceT30 = -2.0;
			Double lastRowInfluenceT60 = -2.0;
			Double lastRowInfluenceT90 = -2.0;
			Double lastRowInfluenceT180 = -2.0;
			Double lastRowInfluenceT365 = -2.0;
			int resultSetCount = 0;
			while (rs.next() ) {
				if ( rs.getString("drivername") != null ) {
					resultSetCount++;
					if (!(lastRowVariable).equals(rs.getString("drivername") )) {
						if ( !("").equals(lastRowVariable ) ) {
							thisDriver = new Driver();
							thisDriver.setDriverName(lastRowVariable);
							thisDriver.setObservations(0);
							thisDriver.setInfluencet30(lastRowInfluenceT30);
							thisDriver.setInfluencet60(lastRowInfluenceT60);
							thisDriver.setInfluencet90(lastRowInfluenceT90);
							thisDriver.setInfluencet180(lastRowInfluenceT180);
							thisDriver.setInfluencet365(lastRowInfluenceT365);
							if ( driverTypesAndLabels.get(lastRowVariable) != null ) {
								thisDriver.setDriverType(driverTypesAndLabels.get(lastRowVariable)[0]);
								thisDriver.setDriverLabel(driverTypesAndLabels.get(lastRowVariable)[1]);
							}
							thisDriver.setCategoryValues(thisCategoryArray);
							for ( int categoryNumber = 0 ; categoryNumber < thisCategoryArray.size() ; categoryNumber++ ) {
								thisDriver.observations += thisCategoryArray.get(categoryNumber).totalHires;
								
							}
							if ( driverTypesAndLabels.get(lastRowVariable) != null ) {
								thisDriver.setDriverType(driverTypesAndLabels.get(lastRowVariable)[0]);
								thisDriver.setDriverLabel(driverTypesAndLabels.get(lastRowVariable)[1]);
							}

							this.addDriver(thisDriver);
						}
						
						thisCategoryArray = new ArrayList<DriverCategory>();
					}
					thisDriverCategory = new DriverCategory();
					thisDriverCategory.nt30 = rs.getInt("nt30");
					thisDriverCategory.pt30 = rs.getDouble("pt30");
					thisDriverCategory.tt30 = rs.getDouble("tt30");
					thisDriverCategory.nt60 = rs.getInt("nt60");
					thisDriverCategory.pt60 = rs.getDouble("pt60");
					thisDriverCategory.tt60 = rs.getDouble("tt60");
					thisDriverCategory.nt90 = rs.getInt("nt90");
					thisDriverCategory.pt90 = rs.getDouble("pt90");
					thisDriverCategory.tt90 = rs.getDouble("tt90");
					thisDriverCategory.nt180 = rs.getInt("nt180");
					thisDriverCategory.pt180 = rs.getDouble("pt180");
					thisDriverCategory.tt180 = rs.getDouble("tt180");
					thisDriverCategory.nt365 = rs.getInt("nt365");
					thisDriverCategory.pt365 = rs.getDouble("pt365");
					thisDriverCategory.tt365 = rs.getDouble("tt365");
					thisDriverCategory.proportion = rs.getDouble("proportion");
					thisDriverCategory.totalHires = rs.getInt("totalhires");
					
					thisDriverCategory.categoryValue = rs.getString("drivercategory");
					lastRowVariable = rs.getString("drivername");
					if (rs.getString("influencet30") != null ) {
						lastRowInfluenceT30 = rs.getDouble("influencet30");
					}
					if (rs.getString("influencet60") != null ) {
						lastRowInfluenceT60 = rs.getDouble("influencet60");
					}
					if (rs.getString("influencet90") != null ) {
						lastRowInfluenceT90 = rs.getDouble("influencet90");
					}
					if (rs.getString("influencet180") != null ) {
						lastRowInfluenceT180 = rs.getDouble("influencet180");
					}
					if (rs.getString("influencet365") != null ) {
						lastRowInfluenceT365 = rs.getDouble("influencet365");
					}
					thisCategoryArray.add(thisDriverCategory);
				}
			}
			

			//We haven't done the last variable yet.....
			if ( !("").equals(lastRowVariable ) ) {
				thisDriver = new Driver();
				thisDriver.setDriverName(lastRowVariable);
				thisDriver.setObservations(0);
				thisDriver.setInfluencet30(lastRowInfluenceT30);
				thisDriver.setInfluencet60(lastRowInfluenceT60);
				thisDriver.setInfluencet90(lastRowInfluenceT90);
				thisDriver.setInfluencet180(lastRowInfluenceT180);
				thisDriver.setInfluencet365(lastRowInfluenceT365);
				if ( driverTypesAndLabels.get(lastRowVariable) != null ) {
					thisDriver.setDriverType(driverTypesAndLabels.get(lastRowVariable)[0]);
					thisDriver.setDriverLabel(driverTypesAndLabels.get(lastRowVariable)[1]);
				}
				thisDriver.setCategoryValues(thisCategoryArray);
				for ( int categoryNumber = 0 ; categoryNumber < thisCategoryArray.size() ; categoryNumber++ ) {
					thisDriver.observations += thisCategoryArray.get(categoryNumber).totalHires;
					
				}
				this.addDriver(thisDriver);
			}
			
			
			
		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage() + ".  Query was: " + query);
			try {
				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
				}
				if (con != null) {
					con.close();
				}

			} catch (SQLException closeSQLException) {
				Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}
			throw rethrownQueryException;
		}

	}
	
	
	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		this.addMessage(errorMessage);
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			GsonBuilder gsonBuilder = new GsonBuilder();  
			gsonBuilder.serializeSpecialFloatingPointValues();  
			Gson gson = gsonBuilder.setPrettyPrinting().create();  
			//Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}











}





