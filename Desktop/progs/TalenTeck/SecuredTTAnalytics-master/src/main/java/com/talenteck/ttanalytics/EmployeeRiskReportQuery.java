package com.talenteck.ttanalytics;

import java.util.Arrays;
import java.util.Hashtable;

public class EmployeeRiskReportQuery {
	
	public String fetchQuery(String startDate,String endDate,String location,String tenure) {
		String query ="";
		String tenureCondition = " tenure =" + tenure;
		String locationCondition = " AND LOWER(locationname) = LOWER('" + location + "')";
		String dateCondition = " AND date BETWEEN '"+ startDate +"' AND '" + endDate +"'";

	query= "SELECT ptd AS quantileNumber,COALESCE(SUM(IF(employeeid IS NOT NULL, 1, 0)),0) AS employees,COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0) AS eligibleemployees,"
			+ "ROUND(COALESCE(SUM(IF(turnover IS NOT NULL, pturnover, 0)),0)/COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0)*100)  AS predictedturnover,"
			+ "ROUND(COALESCE(SUM(IF(turnover IS NOT NULL,turnover, 0)),0)/COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0)*100) AS actualturnover "
			+ "FROM employeeriskreport WHERE trainTS=0 AND " + tenureCondition  + dateCondition  + locationCondition + "GROUP BY ptd "
			+ "UNION "
			+ "SELECT 'Total' AS quantileNumber,COALESCE(SUM(IF(employeeid IS NOT NULL, 1, 0)),0) AS employees,COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0) AS eligibleemployees,"
			+ "ROUND(COALESCE(SUM(IF(turnover IS NOT NULL, pturnover, 0)),0)/COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0)*100)  AS predictedturnover,"
			+ "ROUND(COALESCE(SUM(IF(turnover IS NOT NULL,turnover, 0)),0)/COALESCE(SUM(IF(turnover IS NOT NULL, 1, 0)),0)*100) AS actualturnover "
			+ "FROM employeeriskreport WHERE trainTS=0 AND " + tenureCondition  + dateCondition  + locationCondition ;	
	//System.out.println(query);
	return query;
	}
}


