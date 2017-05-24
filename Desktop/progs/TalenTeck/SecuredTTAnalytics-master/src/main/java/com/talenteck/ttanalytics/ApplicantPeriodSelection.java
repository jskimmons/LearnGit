package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class ApplicantPeriodSelection {

	
	String filterValue;
	int applied;
	int offered;
	int accepted;
	int hired;
	double offerRate;
	double appliedAcceptRate;
	double offeredAcceptRate;
	double employRate;
	
	public void setFilterValue(String filterValue) {
		this.filterValue = filterValue;
	}
	
	String getFilterValue(){
		return this.filterValue;
	}

	@XmlElement(name = "Applied")
	public void setApplied(int applied) {
		this.applied = applied;
	}
	
	int getApplied(){
		return this.applied;
	}

	@XmlElement(name = "Offered")
	public void setOffered(int offered) {
		this.offered = offered;
	}
	
	int getAccepted(){
		return this.accepted;
	}

	@XmlElement(name = "Accepted")
	public void setAccepted(int accepted) {
		this.accepted = accepted;
	}
	
	int getOffered(){
		return this.offered;
	}

	@XmlElement(name = "Hired")
	public void setHired(int hired) {
		this.hired = hired;
	}
	
	int getHired(){
		return this.hired;
	}

	@XmlElement(name = "OfferRate")
	public void setOfferRate(double offerRate) {
		this.offerRate = offerRate;
	}
	
	double getOfferRate(){
		return this.offerRate;
	}

	@XmlElement(name = "AppliedAcceptRate")
	public void setAppliedAcceptRate(double appliedAcceptRate) {
		this.appliedAcceptRate = appliedAcceptRate;
	}
	
	double getAppliedAcceptRate(){
		return this.appliedAcceptRate;
	}

	@XmlElement(name = "OfferedAcceptRate")
	public void setOfferedAcceptRate(double offeredAcceptRate) {
		this.offeredAcceptRate = offeredAcceptRate;
	}
	
	double getOfferedAcceptRate(){
		return this.offeredAcceptRate;
	}

	@XmlElement(name = "EmployRate")
	public void setEmployRate(double employRate) {
		this.employRate = employRate;
	}
	
	double getEmployRate(){
		return this.employRate;
	}

	
}
