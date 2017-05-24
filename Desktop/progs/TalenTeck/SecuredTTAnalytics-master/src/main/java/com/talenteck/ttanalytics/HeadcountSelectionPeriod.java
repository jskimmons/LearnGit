package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class HeadcountSelectionPeriod {
	
	int month;
	int year;
	int startEmployment;
	int hires;
	int terminations;
	int voluntaryTerminations;
	int involuntaryTerminations;
	Double seatTurnover;


	@XmlElement(name = "Month")
	public void setMonth(int month) {
		this.month = month;
	}

	int getMonth() {
		return month;
	}

	@XmlElement(name = "Year")
	public void setYear(int year) {
		this.year = year;
	}

	int getYear() {
		return this.year;
	}

	@XmlElement(name = "StartEmployment")
	public void setStartEmployment(int startEmployment) {
		this.startEmployment = startEmployment;
	}

	int getStartEmployment() {
		return startEmployment;
	}

	@XmlElement(name = "Hires")
	public void setHires(int hires) {
		this.hires = hires;
	}

	int getHires() {
		return hires;
	}

	@XmlElement(name = "Terminations")
	public void setTerminations(int terminations) {
		this.terminations = terminations;
	}

	int getTerminations() {
		return terminations;
	}

	@XmlElement(name="VoluntaryTerminations")
	public void setVoluntaryTerminations(int voluntaryTerminations) {
		this.voluntaryTerminations = voluntaryTerminations;
	}

	int getVoluntaryTerminations() {
		return voluntaryTerminations;
	}

	@XmlElement(name = "InvoluntaryTerminations")
	public void setInvoluntaryTerminations(int involuntaryTerminations) {
		this.involuntaryTerminations = involuntaryTerminations;
	}

	int getInvoluntaryTerminations() {
		return involuntaryTerminations;
	}

	@XmlElement(name = "InvoluntaryTerminations")
	public void setSeatTurnover(Double seatTurnover) {
		this.seatTurnover = seatTurnover;
	}

	Double getSeatTurnover() {
		return this.seatTurnover;
	}


}
