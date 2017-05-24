package com.talenteck.ttanalytics;

public class EmployeeScoreQuery {

	public String fetchQuery(String startDate, String endDate, String location,String dateRange) {
		String dateQuery ="";		
		if(dateRange.equalsIgnoreCase("All")){
			dateQuery = " ORDER BY date ASC ";
		}else if(dateRange.equalsIgnoreCase("Range")){
			dateQuery = " AND date BETWEEN '" + startDate + "' AND '" + endDate + "' ORDER BY date ASC ";
		}else{
			dateQuery = " AND date BETWEEN (SELECT DATE_SUB(MAX(date),INTERVAL 7 DAY) AS defaultstartdate FROM employeeriskreport)"
					+ " AND (SELECT MAX(date) FROM employeeriskreport) ORDER BY date ASC ";
		}
		String query= "SELECT employeeid"
				+ ",tenure"
				+ ",DATE_FORMAT(date,'%Y/%m/%d') as datee"
				+ ",currenttitle"
				+ ",weeklyhours"
				+ ",periodeffwage"
				+ ",periodtotalbonus"
				+ ",currentrating"
				+ ",noofratings"
				+ ",dayssincelastrating"
				+ ",currentteam"
				+ ",currentsupervisor"
				+ ",refer"
				+ ",traveltime"
				+ ",n_referrals"
				+ ",n_interviews"
				+ ",ptd "
				+ "FROM employeeriskreport WHERE locationname='" + location + "'" + dateQuery;
				
				
		//System.out.println("QUWEY:" + query);  //'%d-%b-%Y'
		return query;		
	}

}
