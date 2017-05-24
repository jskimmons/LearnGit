package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class MarketsTable {

	String defaultSelectorName;
	String defaultSelectorValue;
	ArrayList<PostalCodeSelection> rows;
	Messages messages;

	
	
	public String getDefaultSelectorName() {
		return defaultSelectorName;
	}
	public void setDefaultSelectorName(String defaultSelectorName) {
		this.defaultSelectorName = defaultSelectorName;
	}
	public String getDefaultSelectorValue() {
		return defaultSelectorValue;
	}
	public void setDefaultSelectorValue(String defaultSelectorValue) {
		this.defaultSelectorValue = defaultSelectorValue;
	}
	public ArrayList<PostalCodeSelection> getRows() {
		return rows;
	}
	public void setRows(ArrayList<PostalCodeSelection> rows) {
		this.rows = rows;
	}
	public Messages getMessages() {
		return messages;
	}
	public void setMessages(Messages messages) {
		this.messages = messages;
	}
	
	public void addRow(PostalCodeSelection row) {
		if ( this.rows == null ){
			this.rows = new ArrayList<PostalCodeSelection>();
		}
		this.rows.add(row);
	}


	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	
	public void fetchData(String database) throws Exception {
		
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		Gson gson = new Gson();


		ArrayList<SelectorSelection> selectorValues;
		SelectorSelection thisSelection = null;
		Hashtable<String,ArrayList<PostalCodeAttributes>> selections = new Hashtable<String,ArrayList<PostalCodeAttributes>>();
		ArrayList<PostalCodeAttributes> thisSelectionPostalCodes;
		PostalCodeAttributes thisPostalCode = null;
		PostalCodeSelection thisSelectionData = null;
		Enumeration selectionEnumeration = null;
		final String[] statistics = { "n" , "freq" , "rate" , "mpt" };
		
		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		
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
		
		
		
		

		/*String query = "SELECT postalcode, latitude, longitude, predictedapplicants, actualapplicants, "
				+ " predictedhires, actualhires, predictedgoodhires, actualgoodhires," +
			    " defaultselectorname , defaultselectorvalue , periodname , periodlabel , " +
			    " filtername1 , filtervalue1 , filtername2 , filtervalue2 , filtername3 , filtervalue3 ," +
			    " filtername4 , filtervalue4 , filtername5 , filtervalue5 ,actualapplicants-predictedapplicants AS oppapplicants, " +
			    " actualhires-predictedhires AS opphires, actualgoodhires-predictedgoodhires AS oppgoodhires, "
			    + "under25, between25and50 ,t30rate , appliedreferred, ghirereferred, hiredreferred, saturation, medianlistingprice ,traveltime, "
				+ "laborforce, blackpeople, renteroccupied, density, totalcompetitors,  " +
			    " FROM markets ORDER BY filtervalue1 ASC,actualapplicants DESC";*/
		
		String query = "SELECT id,modelid,tableversionid,rawdataversionid,rawdatatimestamp,updatedby,updateddate,defaultselectorname"
				+ ",defaultselectorvalue,periodname,periodlabel,postalcode,latitude,longitude,predictedapplicants,actualapplicants"
				+ ",predictedhires,	actualhires,predictedgoodhires,actualgoodhires,traveltime,laborforce,blackpeople"
				+ ",renteroccupied,density,totalcompetitors,medianlistingprice,appliedreferred,	offeredreferred,hiredreferred,ghirereferred"
				+ ",saturation,t30rate,t90rate,under25,	between25and50,	badhire,totalapplicants,totalhires,belowpovertylevel,population"
				+ ",unemploymentrate,medianage,femnohusbandchildren,femaleover18population,	state,	population20to24,population25to34,sexratio"
				+ ",housingpercrenteroccup,	householdmoved2010plus,propertyvalue0to50000,propertyvalue50000to100000,propertyvalue100000to200000"
				+ ",propertyvalue200000to500000,propertyvalue500000plus,medianrent,rentpercinc0to20,rentpercinc20to30,rentpercinc30plus"
				+ ",lived1yragodiffhouse,medianfamilyincome,medianworkerincome,employedwohealthinsurance,unemployedwohealthinsurance"
				+ ",maritalhispanictotal,malepercnotenrolledincollege,femalepercnotenrolledincollege,commutecar,commutenocarpool,traveltimemean"
				+ ",novehicle,	workersperctv,	annualpayroll,schoolnotenrolled,married,single,blacksingle,location,filtername1,filtervalue1"
				+ ",filtername2,filtervalue2,filtername3,filtervalue3,	filtername4,filtervalue4,filtername5,filtervalue5"
				+ ",actualapplicants-predictedapplicants AS oppapplicants,actualhires-predictedhires AS opphires"
				+ ",actualgoodhires-predictedgoodhires AS oppgoodhires FROM markets ORDER BY filtervalue1 ASC,actualapplicants DESC";
		
		//System.out.println(query);
		
		try {
			
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next() ) {
				
				if ( this.defaultSelectorName == null ) {
					this.setDefaultSelectorName(rs.getString("defaultselectorname"));
				}
				if ( this.defaultSelectorValue == null ) {
					this.setDefaultSelectorValue(rs.getString("defaultselectorvalue"));
				}

				selectorValues = new ArrayList<SelectorSelection>();				
				/*thisSelection = new SelectorSelection();
				thisSelection.selectorName = "Model";
				thisSelection.selectorValue = "Applicant";
				selectorValues.add(thisSelection);*/				
				for ( int i = 1 ; i <= 5 ; i++ ) {
					if ( rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null  ) {
						thisSelection = new SelectorSelection();
						thisSelection.selectorName = rs.getString("filtername" + i);
						thisSelection.selectorValue = rs.getString("filtervalue" + i);
						selectorValues.add(thisSelection);
					}
				}
				
				
				thisSelectionPostalCodes = selections.get(gson.toJson(selectorValues));
				
				if ( thisSelectionPostalCodes == null ) {
					thisSelectionPostalCodes = new ArrayList<PostalCodeAttributes>();
					selections.put(gson.toJson(selectorValues), thisSelectionPostalCodes);
				}

				thisPostalCode = new PostalCodeAttributes();
				thisPostalCode.setPostalCode(rs.getString("postalcode") == null ? null : rs.getString("postalcode"));
				thisPostalCode.setLatitude(rs.getString("latitude") == null ? -1 : rs.getDouble("latitude"));
				thisPostalCode.setLongitude(rs.getString("longitude") == null ? -1 : rs.getDouble("longitude"));
				thisPostalCode.setPredictedApplicants(rs.getString("predictedapplicants") == null ? -1 : rs.getDouble("predictedapplicants"));
				thisPostalCode.setActualApplicants(rs.getString("actualapplicants") == null ? -1 : rs.getInt("actualapplicants"));
				thisPostalCode.setPredictedHires(rs.getString("predictedhires") == null ? -1 : rs.getDouble("predictedhires"));
				thisPostalCode.setActualHires(rs.getString("actualhires") == null ? -1 : rs.getInt("actualhires"));
				thisPostalCode.setPredictedGoodHires(rs.getString("predictedgoodhires") == null ? -1 : rs.getDouble("predictedgoodhires"));
				thisPostalCode.setActualGoodHires(rs.getString("actualgoodhires") == null ? -1 : rs.getInt("actualgoodhires"));
				
				/*thisPostalCode.setTraveltime(rs.getString("traveltime") == null ? -1 : rs.getDouble("traveltime"));
				//thisPostalCode.setActualJobOffers(rs.getString("actualjoboffers") == null ? -1 : rs.getInt("actualjoboffers"));
				thisPostalCode.setBlackpeople(rs.getString("blackPeople") == null ? -1 : rs.getDouble("blackPeople"));
				thisPostalCode.setDensity(rs.getString("density") == null ? -1 : rs.getDouble("density"));
				thisPostalCode.setLaborforce(rs.getString("laborforce") == null ? -1 : rs.getDouble("laborforce"));
				thisPostalCode.setRenteroccupied(rs.getString("renteroccupied") == null ? -1 : rs.getDouble("renteroccupied"));
				thisPostalCode.setTotalcompetitors(rs.getString("totalcompetitors") == null ? -1 : rs.getDouble("totalcompetitors"));
				thisPostalCode.setT30rate(rs.getString("t30rate") == null ? -1 : rs.getDouble("t30rate"));
				thisPostalCode.setSaturation(rs.getString("saturation") == null ? -1 : rs.getDouble("saturation"));
				thisPostalCode.setHiredreferred(rs.getString("hiredreferred") == null ? -1 : rs.getDouble("hiredreferred"));
				thisPostalCode.setAppliedreferred(rs.getString("appliedreferred") == null ? -1 : rs.getDouble("appliedreferred"));
				thisPostalCode.setGhirereferred(rs.getString("ghirereferred") == null ? -1 : rs.getDouble("ghirereferred"));
				thisPostalCode.setMedianlistingprice(rs.getString("medianlistingprice") == null ? -1 : rs.getDouble("medianlistingprice"));
				thisPostalCode.setOppApplicants(rs.getString("oppapplicants") == null ? -1 : rs.getInt("oppapplicants"));
				thisPostalCode.setOppHires(rs.getString("opphires") == null ? -1 : rs.getInt("opphires"));
				thisPostalCode.setOppGoodHires(rs.getString("oppgoodhires") == null ? -1 : rs.getInt("oppgoodhires"));
				thisPostalCode.setUnder25(rs.getString("under25") == null ? -1 : rs.getDouble("under25"));
				thisPostalCode.setBetween25and50(rs.getString("between25and50") == null ? -1 : rs.getDouble("between25and50"));

				//thisPostalCode.setUnemployment(rs.getString("unemployment") == null ? -1 : rs.getDouble("unemployment"));*/
				thisPostalCode.setOppApplicants(rs.getString("oppapplicants") == null ? -1 : rs.getInt("oppapplicants"));
				thisPostalCode.setOppHires(rs.getString("opphires") == null ? -1 : rs.getInt("opphires"));
				thisPostalCode.setOppGoodHires(rs.getString("oppgoodhires") == null ? -1 : rs.getInt("oppgoodhires"));
				thisPostalCode.setLaborforce(rs.getString("laborforce")==null?-1:rs.getDouble("laborforce"));
				thisPostalCode.setTraveltime(rs.getString("traveltime")==null?-1:rs.getDouble("traveltime"));
				thisPostalCode.setBlackpeople(rs.getString("blackpeople")==null?-1:rs.getDouble("blackpeople"));
				thisPostalCode.setRenteroccupied(rs.getString("renteroccupied")==null?-1:rs.getDouble("renteroccupied"));
				thisPostalCode.setTotalcompetitors(rs.getString("totalcompetitors")==null?-1:rs.getDouble("totalcompetitors"));
				thisPostalCode.setMedianlistingprice(rs.getString("medianlistingprice")==null?-1:rs.getDouble("medianlistingprice"));
				thisPostalCode.setSaturation(rs.getString("saturation")==null?-1:rs.getDouble("saturation"));
				thisPostalCode.setT30rate(rs.getString("t30rate")==null?-1:rs.getDouble("t30rate"));
				thisPostalCode.setT90rate(rs.getString("t90rate")==null?-1:rs.getDouble("t90rate"));
				thisPostalCode.setUnder25(rs.getString("under25")==null?-1:rs.getDouble("under25"));
				thisPostalCode.setBetween25and50(rs.getString("between25and50")==null?-1:rs.getDouble("between25and50"));
				thisPostalCode.setAppliedreferred(rs.getString("appliedreferred")==null?-1:rs.getDouble("appliedreferred"));
				thisPostalCode.setOfferedreferred(rs.getString("offeredreferred")==null?-1:rs.getDouble("offeredreferred"));
				thisPostalCode.setHiredreferred(rs.getString("hiredreferred")==null?-1:rs.getDouble("hiredreferred"));
				thisPostalCode.setGhirereferred(rs.getString("ghirereferred")==null?-1:rs.getDouble("ghirereferred"));
				thisPostalCode.setBadhire(rs.getString("badhire")==null?-1:rs.getDouble("badhire"));
				thisPostalCode.setTotalapplicants(rs.getString("totalapplicants")==null?-1:rs.getDouble("totalapplicants"));
				thisPostalCode.setTotalhires(rs.getString("totalhires")==null?-1:rs.getDouble("totalhires"));
				thisPostalCode.setBelowpovertylevel(rs.getString("belowpovertylevel")==null?-1:rs.getDouble("belowpovertylevel"));
				thisPostalCode.setPopulation(rs.getString("population")==null?-1:rs.getDouble("population"));
				thisPostalCode.setUnemploymentrate(rs.getString("unemploymentrate")==null?-1:rs.getDouble("unemploymentrate"));
				thisPostalCode.setMedianage(rs.getString("medianage")==null?-1:rs.getDouble("medianage"));
				thisPostalCode.setFemnohusbandchildren(rs.getString("femnohusbandchildren")==null?-1:rs.getDouble("femnohusbandchildren"));
				thisPostalCode.setFemaleover18population(rs.getString("femaleover18population")==null?-1:rs.getDouble("femaleover18population"));
				thisPostalCode.setState(rs.getString("state")==null?null:rs.getString("state"));
				thisPostalCode.setPopulation20to24(rs.getString("population20to24")==null?-1:rs.getDouble("population20to24"));
				thisPostalCode.setPopulation25to34(rs.getString("population25to34")==null?-1:rs.getDouble("population25to34"));
				thisPostalCode.setSexratio(rs.getString("sexratio")==null?-1:rs.getDouble("sexratio"));
				thisPostalCode.setHousingpercrenteroccup(rs.getString("housingpercrenteroccup")==null?-1:rs.getDouble("housingpercrenteroccup"));
				thisPostalCode.setHouseholdmoved2010plus(rs.getString("householdmoved2010plus")==null?-1:rs.getDouble("householdmoved2010plus"));
				thisPostalCode.setPropertyvalue0to50000(rs.getString("propertyvalue0to50000")==null?-1:rs.getDouble("propertyvalue0to50000"));
				thisPostalCode.setPropertyvalue50000to100000(rs.getString("propertyvalue50000to100000")==null?-1:rs.getDouble("propertyvalue50000to100000"));
				thisPostalCode.setPropertyvalue100000to200000(rs.getString("propertyvalue100000to200000")==null?-1:rs.getDouble("propertyvalue100000to200000"));
				thisPostalCode.setPropertyvalue200000to500000(rs.getString("propertyvalue200000to500000")==null?-1:rs.getDouble("propertyvalue200000to500000"));
				thisPostalCode.setPropertyvalue500000plus(rs.getString("propertyvalue500000plus")==null?-1:rs.getDouble("propertyvalue500000plus"));
				thisPostalCode.setMedianrent(rs.getString("medianrent")==null?-1:rs.getDouble("medianrent"));
				thisPostalCode.setRentpercinc0to20(rs.getString("rentpercinc0to20")==null?-1:rs.getDouble("rentpercinc0to20"));
				thisPostalCode.setRentpercinc20to30(rs.getString("rentpercinc20to30")==null?-1:rs.getDouble("rentpercinc20to30"));
				thisPostalCode.setRentpercinc30plus(rs.getString("rentpercinc30plus")==null?-1:rs.getDouble("rentpercinc30plus"));
				thisPostalCode.setLived1yragodiffhouse(rs.getString("lived1yragodiffhouse")==null?-1:rs.getDouble("lived1yragodiffhouse"));
				thisPostalCode.setMedianfamilyincome(rs.getString("medianfamilyincome")==null?-1:rs.getDouble("medianfamilyincome"));
				thisPostalCode.setMedianworkerincome(rs.getString("medianworkerincome")==null?-1:rs.getDouble("medianworkerincome"));
				thisPostalCode.setEmployedwohealthinsurance(rs.getString("employedwohealthinsurance")==null?-1:rs.getDouble("employedwohealthinsurance"));
				thisPostalCode.setUnemployedwohealthinsurance(rs.getString("unemployedwohealthinsurance")==null?-1:rs.getDouble("unemployedwohealthinsurance"));
				thisPostalCode.setMaritalhispanictotal(rs.getString("maritalhispanictotal")==null?-1:rs.getDouble("maritalhispanictotal"));
				thisPostalCode.setMalepercnotenrolledincollege(rs.getString("malepercnotenrolledincollege")==null?-1:rs.getDouble("malepercnotenrolledincollege"));
				thisPostalCode.setFemalepercnotenrolledincollege(rs.getString("femalepercnotenrolledincollege")==null?-1:rs.getDouble("femalepercnotenrolledincollege"));
				thisPostalCode.setCommutecar(rs.getString("commutecar")==null?-1:rs.getDouble("commutecar"));
				thisPostalCode.setCommutenocarpool(rs.getString("commutenocarpool")==null?-1:rs.getDouble("commutenocarpool"));
				thisPostalCode.setTraveltimemean(rs.getString("traveltimemean")==null?-1:rs.getDouble("traveltimemean"));
				thisPostalCode.setNovehicle(rs.getString("novehicle")==null?-1:rs.getDouble("novehicle"));
				thisPostalCode.setWorkersperctv(rs.getString("workersperctv")==null?-1:rs.getDouble("workersperctv"));
				thisPostalCode.setAnnualpayroll(rs.getString("annualpayroll")==null?-1:rs.getDouble("annualpayroll"));
				thisPostalCode.setSchoolnotenrolled(rs.getString("schoolnotenrolled")==null?-1:rs.getDouble("schoolnotenrolled"));
				thisPostalCode.setMarried(rs.getString("married")==null?-1:rs.getDouble("married"));
				thisPostalCode.setSingle(rs.getString("single")==null?-1:rs.getDouble("single"));
				thisPostalCode.setBlacksingle(rs.getString("blacksingle")==null?-1:rs.getDouble("blacksingle"));
				thisPostalCode.setDensity(rs.getString("density")==null?-1:rs.getDouble("density"));
				thisPostalCode.setLocation(rs.getString("location")==null?null:rs.getString("location"));
				thisSelectionPostalCodes.add(thisPostalCode);
				//System.out.println("Adding " + gson.toJson(selectorValues) + " with " + gson.toJson(thisPostalCode));
				
			}
						
			if (rs != null) {
				rs.close();
			}
			if (st != null) {
				st.close();
			}
			
		
			

		} catch (Exception queryException) {
			Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage());
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

	
		selectionEnumeration = selections.keys();
		while ( selectionEnumeration.hasMoreElements()) {
			

			String selectorValuesString = (String) selectionEnumeration.nextElement();
			try {
				selectorValues = gson.fromJson(selectorValuesString, new TypeToken<ArrayList<SelectorSelection>>() {}.getType());				
			} catch (Exception jsonException ) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);
			}
			if (selectorValues == null ) {
				throw new Exception("Failed to parse JSON:" + selectorValuesString);				
			}
			thisSelectionData = new PostalCodeSelection();
			Boolean hasObservations = false;
			thisSelectionData.setSelectorValues(selectorValues);
			thisSelectionPostalCodes = selections.get(selectorValuesString);
			ArrayList<PostalCodeAttributes> outputPostalCodes = new ArrayList<>();
			if (thisSelectionPostalCodes == null ) {
				throw new Exception("Failed to find entry:" + selectorValuesString);				
			}
			for ( PostalCodeAttributes currentPostalCode : thisSelectionPostalCodes  ) {
				// Need to add a condition here for displaying the ZIP code
				if ( true ) {
					outputPostalCodes.add(currentPostalCode);
				}
			}
			
			thisSelectionData.setPostalCodes(outputPostalCodes);
			this.addRow(thisSelectionData);
						
		}
			

	}

	public void insertErrorAndWrite(String errorMessage,PrintWriter writer){
		Messages messageList = new Messages();
		messageList.addMessage(errorMessage);
		this.setMessages(messageList);
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}
	
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));			
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	
	
}
