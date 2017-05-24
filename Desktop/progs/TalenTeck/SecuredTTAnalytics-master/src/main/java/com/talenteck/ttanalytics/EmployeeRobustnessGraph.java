package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class EmployeeRobustnessGraph {
	
	PeriodRobustness period;
	Integer totalQuantiles;
	Double auct30;
	Double auct60;
	Double auct90;
	Double auct180;
	Double auct365;
	Double bandwidthT30;
	Double bandwidthT60;
	Double bandwidthT90;
	Double bandwidthT180;
	Double bandwidthT365;
	ArrayList<FilterSelection> filterSelectionList;
	ArrayList<RobustnessGraphQuantile> quantiles;
	Messages messages;
	
	public void setPeriod(PeriodRobustness period) {
		this.period = period;
	}
	
	public PeriodRobustness getPeriod(){
		return this.period;
	}

	public void setAUCT30(double auct30) {
		this.auct30 = auct30;
	}
	
	public Double getAUCT30(){
		return this.auct30;
	}

	public void setAUCT60(double auct60) {
		this.auct60 = auct60;
	}
	
	public Double getAUCT60(){
		return this.auct60;
	}

	public void setAUCT90(double auct90) {
		this.auct90 = auct90;
	}
	
	public Double getAUCT90(){
		return this.auct90;
	}

	public void setAUCT180(double auct180) {
		this.auct180 = auct180;
	}
	
	public Double getAUCT180(){
		return this.auct180;
	}

	public void setAUCT365(double auct365) {
		this.auct365 = auct365;
	}
	
	public Double getAUCT365(){
		return this.auct365;
	}

	public void setBandwidthT30(double bandwidthT30) {
		this.bandwidthT30 = bandwidthT30;
	}
	
	public Double getBandwidthT30(){
		return this.bandwidthT30;
	}

	public void setBandwidthT60(double bandwidthT60) {
		this.bandwidthT60 = bandwidthT60;
	}
	
	public Double getBandwidthT60(){
		return this.bandwidthT60;
	}

	public void setBandwidthT90(double bandwidthT90) {
		this.bandwidthT90 = bandwidthT90;
	}
	
	public Double getBandwidthT90(){
		return this.bandwidthT90;
	}

	public void setBandwidthT180(double bandwidthT180) {
		this.bandwidthT180 = bandwidthT180;
	}
	
	public Double getBandwidthT180(){
		return this.bandwidthT180;
	}

	public void setBandwidthT365(double bandwidthT365) {
		this.bandwidthT365 = bandwidthT365;
	}
	
	public Double getBandwidthT365(){
		return this.bandwidthT365;
	}

	public void setFilterSelectionList(ArrayList<FilterSelection> filterSelectionList) {
		this.filterSelectionList = filterSelectionList;
	}
	
	ArrayList<FilterSelection> getFilterSelectionList(){
		return this.filterSelectionList;
	}

	public void setQuantiles(ArrayList<RobustnessGraphQuantile> quantiles) {
		this.quantiles = quantiles;
	}
	
	ArrayList<RobustnessGraphQuantile> getQuantiles(){
		return this.quantiles;
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

	public void addQuantile(RobustnessGraphQuantile quantile) {
		if ( this.quantiles == null ){
			this.quantiles = new ArrayList<RobustnessGraphQuantile>();
		}
		this.quantiles.add(quantile);
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
		Hashtable<String,HashSet<String>> compareHash = null;
		HashSet<String> thisFilterHash = null;
		FilterSelection thisFilterSelection = null;
		ArrayList<SelectorSelection> selectionList = null;
		String thisSelectorName = "";
		
		RobustnessSelectorList compareList = new RobustnessSelectorList();
		try {
			compareList.populate(database);
		} catch(Exception fetchFiltersException) {
			throw new Exception("Error fetching list of valid filters.");			
		}
		compareHash = compareList.toHashtable();

		/* Should be removable
		try {
			periodTable = PeriodListRobustness.periodTable(database);
		} catch(Exception fetchPeriodsException) {
			throw new Exception("Error fetching list of valid periods.");			
		}
		*/
		try {
			selectionList = gson.fromJson(json, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());
		} catch(Exception jsonException) { throw new Exception("Error parsing JSON: " + jsonException.getMessage()); }


		for (int j = 0 ; j < selectionList.size() ; j++ ) {
			thisSelectorName =  selectionList.get(j).selectorName;
			switch (selectionList.get(j).selectorName) {
				case "periodName":
					if ( compareHash.containsKey("periodName") ) {
						this.period = new PeriodRobustness();
						if ( compareHash.get("periodName").contains(selectionList.get(j).selectorValue) ) {
							this.period.periodName = selectionList.get(j).selectorValue;
						}
						else {
							throw new Exception("Invalid period specified: " + selectionList.get(j).selectorValue);
						}
					}
					else {
						throw new Exception("Period selector is not populated in table (internal error).");
					}

					break;
				default:
					if ( compareHash.containsKey(selectionList.get(j).selectorName) ) {
						thisFilterHash = compareHash.get(selectionList.get(j).selectorName);
						try {
						if ( thisFilterHash.contains(selectionList.get(j).selectorValue)) {
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
		RobustnessGraphQuantile thisQuantile = null;
		Integer totalQuantiles = 0;
		
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

		query = "SELECT quantile , mpt30 , mt30 , set30 , tprt30 , fprt30 , bandwidtht30" +
				", mpt60 , mt60 , set60 , tprt60 , fprt60 , bandwidtht60" +
				", mpt90 , mt90 , set90 , tprt90 , fprt90 , bandwidtht90" +
				", mpt180 , mt180 , set180 , tprt180 , fprt180 , bandwidtht180" +
				", mpt365 , mt365 , set365 , tprt365 , fprt365 , bandwidtht365" +
				" from employeerobustnessgraph WHERE ";
		for (int filterNo = 0  ; filterNo < this.filterSelectionList.size(); filterNo++ ) {
			query = query + this.filterSelectionList.get(filterNo).filterName + " = '"
											+ this.filterSelectionList.get(filterNo).filterValue + "' AND ";
		}
		
		query = query + "periodname = '" + this.period.periodName + "';";

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

		//Debug: this.period.periodLabel = query;
		try {

			st = con.prepareStatement(query);
			rs = st.executeQuery();

			this.bandwidthT30 = (double) 0;
			this.bandwidthT60 = (double) 0;
			this.bandwidthT90 = (double) 0;
			this.bandwidthT180 = (double) 0;
			this.bandwidthT365 = (double) 0;
			
			
			this.addMessage(query);
			String lastRowVariable = "";
			int resultSetCount = 0;
			while (rs.next() ) {
				if ( rs.getString("quantile") != null ) {
					resultSetCount++;
					thisQuantile = new RobustnessGraphQuantile();
					thisQuantile.mpt30 = rs.getDouble("mpt30");
					thisQuantile.mt30 = rs.getDouble("mt30");
					thisQuantile.lbt30 = rs.getDouble("mt30") - 1.96*rs.getDouble("set30");
					thisQuantile.ubt30 = rs.getDouble("mt30") + 1.96*rs.getDouble("set30");
					thisQuantile.roct30 = rs.getDouble("tprt30")*rs.getDouble("fprt30")*100/rs.getDouble("quantile");
					thisQuantile.mpt60 = rs.getDouble("mpt60");
					thisQuantile.mt60 = rs.getDouble("mt60");
					thisQuantile.lbt60 = rs.getDouble("mt60") - 1.96*rs.getDouble("set60");
					thisQuantile.ubt60 = rs.getDouble("mt60") + 1.96*rs.getDouble("set60");
					thisQuantile.roct60 = rs.getDouble("tprt60")*rs.getDouble("fprt60")*100/rs.getDouble("quantile");
					thisQuantile.mpt90 = rs.getDouble("mpt90");
					thisQuantile.mt90 = rs.getDouble("mt90");
					thisQuantile.lbt90 = rs.getDouble("mt90") - 1.96*rs.getDouble("set90");
					thisQuantile.ubt90 = rs.getDouble("mt90") + 1.96*rs.getDouble("set90");
					thisQuantile.roct90 = rs.getDouble("tprt90")*rs.getDouble("fprt90")*100/rs.getDouble("quantile");
					thisQuantile.mpt180 = rs.getDouble("mpt180");
					thisQuantile.mt180 = rs.getDouble("mt180");
					thisQuantile.lbt180 = rs.getDouble("mt180") - 1.96*rs.getDouble("set180");
					thisQuantile.ubt180 = rs.getDouble("mt180") + 1.96*rs.getDouble("set180");
					thisQuantile.roct180 = rs.getDouble("tprt180")*rs.getDouble("fprt180")*100/rs.getDouble("quantile");
					thisQuantile.mpt365 = rs.getDouble("mpt365");
					thisQuantile.mt365 = rs.getDouble("mt365");
					thisQuantile.lbt365 = rs.getDouble("mt365") - 1.96*rs.getDouble("set365");
					thisQuantile.ubt365 = rs.getDouble("mt365") + 1.96*rs.getDouble("set365");
					thisQuantile.roct365 = rs.getDouble("tprt365")*rs.getDouble("fprt365")*100/rs.getDouble("quantile");
					
					thisQuantile.quantileNumber = rs.getInt("quantile");
					this.addQuantile(thisQuantile);
					
					if ( this.bandwidthT30 == 0 ) {
						this.bandwidthT30 = rs.getDouble("bandwidtht30");
					}
					if ( this.bandwidthT60 == 0 ) {
						this.bandwidthT60 = rs.getDouble("bandwidtht60");
					}
					if ( this.bandwidthT90 == 0 ) {
						this.bandwidthT90 = rs.getDouble("bandwidtht90");
					}
					if ( this.bandwidthT180 == 0 ) {
						this.bandwidthT180 = rs.getDouble("bandwidtht180");
					}
					if ( this.bandwidthT365 == 0 ) {
						this.bandwidthT365 = rs.getDouble("bandwidtht365");
					}
				
				}
			}
			
			if ( this.quantiles != null ) {
				this.totalQuantiles = this.quantiles.size();
			}

			this.auct30 = (double) 0;
			this.auct60 = (double) 0;
			this.auct90 = (double) 0;
			this.auct180 = (double) 0;
			this.auct365 = (double) 0;
			
			for ( int i = 0 ; i < this.quantiles.size(); i++ ) {
				this.auct30 += this.quantiles.get(i).roct30/100;
				this.auct60 += this.quantiles.get(i).roct60/100;
				this.auct90 += this.quantiles.get(i).roct90/100;
				this.auct180 += this.quantiles.get(i).roct180/100;
				this.auct365 += this.quantiles.get(i).roct365/100;				
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
