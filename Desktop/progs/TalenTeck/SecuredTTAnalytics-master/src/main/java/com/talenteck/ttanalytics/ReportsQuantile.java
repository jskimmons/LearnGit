package com.talenteck.ttanalytics;

public class ReportsQuantile {
	
	Integer quantileNumber;
	Double applied;
	Double offered;
	Double accepted;
	Double hired;
	Double turnover;
	
	public void setQuantileNumber(int quantileNumber) {
		this.quantileNumber = quantileNumber;
	}
	
	public int getQuantileNumber(){
		return this.quantileNumber;
	}

	public void setApplied(Double applied) {
		this.applied = applied;
	}
	
	public Double getApplied(){
		return this.applied;
	}

	public void setOffered(Double offered) {
		this.offered = offered;
	}
	
	public Double getOffered(){
		return this.offered;
	}


	public void setAccepted(Double accepted) {
		this.accepted = accepted;
	}
	
	public Double getAccepted(){
		return this.accepted;
	}


	public void setHired(Double hired) {
		this.hired = hired;
	}
	
	public Double getHired(){
		return this.hired;
	}

	public void setTurnover(Double turnover) {
		this.turnover = turnover;
	}
	
	public Double getTurnover(){
		return this.turnover;
	}

}
