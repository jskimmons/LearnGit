package com.talenteck.ttanalytics;


import java.util.ArrayList;

public class TRImReductionGraph {
	
	String filterValue;
	ArrayList<TRImReductionGraphRow> graph;
	Double EBITDA;
	
	public void addGraphRow(TRImReductionGraphRow graphRow) {
		if ( this.graph == null ) {
			this.graph = new ArrayList<TRImReductionGraphRow>();
		}
		this.graph.add(graphRow);
	}


}