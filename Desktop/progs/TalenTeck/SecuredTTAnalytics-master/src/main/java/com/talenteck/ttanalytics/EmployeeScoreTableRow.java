package com.talenteck.ttanalytics;

import java.util.Date;

public class EmployeeScoreTableRow {
	int employeeID;
	int tenure;
	String date;
	String title;
	int weeklyHours;
	Double effectiveWage;
	Double bonus;
	String rating;
	int noOfRatings;
	int daysSinceRated;
	String team;
	String supervisor;
	String referred;
	int commuteTime;
	int noOfReferrals;
	int noOfInterviews;
	int ptd;

	public int getPtd() {
		return ptd;
	}
	public void setPtd(int ptd) {
		this.ptd = ptd;
	}
	public int getEmployeeID() {
		return employeeID;
	}
	public void setEmployeeID(int employeeID) {
		this.employeeID = employeeID;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public int getTenure() {
		return tenure;
	}
	public void setTenure(int tenure) {
		this.tenure = tenure;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getSupervisor() {
		return supervisor;
	}
	public void setSupervisor(String supervisor) {
		this.supervisor = supervisor;
	}
	public int getWeeklyHours() {
		return weeklyHours;
	}
	public void setWeeklyHours(int weeklyHours) {
		this.weeklyHours = weeklyHours;
	}
	public Double getEffectiveWage() {
		return effectiveWage;
	}
	public void setEffectiveWage(Double effectiveWage) {
		this.effectiveWage = effectiveWage;
	}
	public Double getBonus() {
		return bonus;
	}
	public void setBonus(Double bonus) {
		this.bonus = bonus;
	}
	public int getNoOfRatings() {
		return noOfRatings;
	}
	public void setNoOfRatings(int noOfRatings) {
		this.noOfRatings = noOfRatings;
	}
	public int getDaysSinceRated() {
		return daysSinceRated;
	}
	public void setDaysSinceRated(int daysSinceRated) {
		this.daysSinceRated = daysSinceRated;
	}
	public String getTeam() {
		return team;
	}
	public void setTeam(String team) {
		this.team = team;
	}
	public String getReferred() {
		return referred;
	}
	public void setReferred(String referred) {
		this.referred = referred;
	}
	public int getCommuteTime() {
		return commuteTime;
	}
	public void setCommuteTime(int commuteTime) {
		this.commuteTime = commuteTime;
	}
	public int getNoOfReferrals() {
		return noOfReferrals;
	}
	public void setNoOfReferrals(int noOfReferrals) {
		this.noOfReferrals = noOfReferrals;
	}
	public int getNoOfInterviews() {
		return noOfInterviews;
	}
	public void setNoOfInterviews(int noOfInterviews) {
		this.noOfInterviews = noOfInterviews;
	}
}
