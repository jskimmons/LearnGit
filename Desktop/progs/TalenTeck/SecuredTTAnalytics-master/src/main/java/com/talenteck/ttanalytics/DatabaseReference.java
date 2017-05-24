package com.talenteck.ttanalytics;

import java.util.HashMap;

public class DatabaseReference {
	
	public String getDBCode(String database){
		 HashMap<String,String> dbnames = new HashMap<String,String>();
   	   	   dbnames.put("testworksheetdb","TEST");
     	   dbnames.put("iqorfilterdb","iQOR");
     	   dbnames.put("iqorfilterdbtest","iQORTEST");
     	   dbnames.put("iqorfilterdbpresentation","PRESENTATION");
     	   dbnames.put("filterdblocal","FILTERLOLCAL");
     	   dbnames.put("brandixworksheetdb","BRANDIX");
     	   dbnames.put("teletechworksheetdb","TELETECH");
     	   dbnames.put("iqormarketdb","MDB");
     	   dbnames.put("staplesfilterdb","STAPLES");
      	  //System.out.println(database + ":"+dbnames.get(database));
      	  return dbnames.get(database);
	}

	
	
	public String getDB(String dbCode){
		String database="";
		switch(dbCode){
			case "iQOR":
				database = "iqorfilterdb";
				break;
			case "iQORTEST":
				database = "iqorfilterdbtest";
				break;
			case "FILTERLOLCAL":
				database = "filterdblocal";
				break;
			case "BRANDIX":
				database = "brandixworksheetdb";
				break;
			case "TELETECH":
				database = "teletechworksheetdb";
				break;
			case "MDB":
				database = "iqormarketdb";
				break;
			case "TEST":
				database = "testworksheetdb";
				break;
			case "PRESENTATION":
				database = "iqorfilterdbpresentation";
				break;
			case "STAPLES":
				database = "staplesfilterdb";
				break;
			}
		
		return database;
	}



	public String getRawDB(String database) {
		 HashMap<String,String> rawDBnames = new HashMap<String,String>();
		 rawDBnames.put("testworksheetdb","testdb");
		 rawDBnames.put("iqorfilterdb","iqorrawdb");
		 rawDBnames.put("iqorfilterdbtest","iqorrawdb");
		 rawDBnames.put("iqorfilterdbpresentation","iqorrawdbpresentation");
		 rawDBnames.put("filterdblocal","filterdblocal");
		 rawDBnames.put("brandixworksheetdb","brandixrawdb");
		 rawDBnames.put("teletechworksheetdb","teletechrawdb");
		 rawDBnames.put("iqormarketdb","iqorrawdb");
		 rawDBnames.put("staplesfilterdb","staplesrawdb");
    	  //System.out.println(database + ":"+dbnames.get(database));
    	  return rawDBnames.get(database);	
	}
}
