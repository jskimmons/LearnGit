package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class TRImReductionSchemeGraph {
	
	String schemeLabel;
	boolean schemeIsUniform;
	ArrayList<TRImReductionSchemeGraphRow> graph;
	
	public void addGraphRow(TRImReductionSchemeGraphRow graphRow) {
		if ( this.graph == null ) {
			this.graph = new ArrayList<TRImReductionSchemeGraphRow>();
		}
		this.graph.add(graphRow);
	}


}
