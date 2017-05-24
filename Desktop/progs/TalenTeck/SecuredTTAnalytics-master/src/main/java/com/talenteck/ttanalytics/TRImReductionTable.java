package com.talenteck.ttanalytics;

import java.util.ArrayList;

public class TRImReductionTable {
	
	String filterValue;
	ArrayList<TRImReductionTableRow> table;
	
	public void addTableRow(TRImReductionTableRow tableRow) {
		if ( this.table == null ) {
			this.table = new ArrayList<TRImReductionTableRow>();
		}
		this.table.add(tableRow);
	}

}
