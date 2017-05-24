package com.talenteck.ttanalytics;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class ApplicantGraphRow {
	
	ArrayList<SelectorSelection> selectorValues;
	int applied;
	int offered;
	int accepted;
	int hired;
	double offerRate;
	double appliedAcceptRate;
	double offeredAcceptRate;
	double employRate;
	
	@XmlElement(name = "SelectorValues")
	public void setSelectorValues(ArrayList<SelectorSelection> selectorValues) {
		this.selectorValues = selectorValues;
	}
	
	public ArrayList<SelectorSelection> getSelectorValues() {
		return this.selectorValues;
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
	
	
	public void addSelectorValue(SelectorSelection selectorValue) {
		if ( this.selectorValues == null ) {
			this.selectorValues = new ArrayList<SelectorSelection>();
		}
		this.selectorValues.add(selectorValue);
	}



}
