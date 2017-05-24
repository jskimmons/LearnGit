package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;

import org.apache.commons.math3.special.Gamma;

import com.google.gson.Gson;

public class TRImGraph {

	String filterName;
	Boolean schemeExists;
	ArrayList<TRImReductionTable> filterValues;
	ArrayList<TRImReductionGraph> filterValueGraphs;
	ArrayList<TRImReductionSchemeGraph> schemeGraphs;

	Messages messages;

	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}

	public String getFilterName() {
		return filterName;
	}

	public void setFilterValues(ArrayList<TRImReductionTable> filterValues) {
		this.filterValues = filterValues;
	}

	public ArrayList<TRImReductionTable> getFilterValues() {
		return filterValues;
	}

	public void setFilterValueGraphs(ArrayList<TRImReductionGraph> filterValueGraphs) {
		this.filterValueGraphs = filterValueGraphs;
	}

	public ArrayList<TRImReductionGraph> getFilterValueGraphs() {
		return filterValueGraphs;
	}

	public void setSchemeGraphs(ArrayList<TRImReductionSchemeGraph> schemeGraphs) {
		this.schemeGraphs = schemeGraphs;
	}

	public ArrayList<TRImReductionSchemeGraph> getSchemeGraphs() {
		return this.schemeGraphs;
	}

	public void setMessages(Messages messages) {
		this.messages = messages;
	}

	public Messages getMessages() {
		return messages;
	}

	public void addFilterValue(TRImReductionTable filterValue) {
		if (this.filterValues == null) {
			this.filterValues = new ArrayList<TRImReductionTable>();
		}
		this.filterValues.add(filterValue);
	}

	public void addFilterValueGraph(TRImReductionGraph filterValueGraph) {
		if (this.filterValueGraphs == null) {
			this.filterValueGraphs = new ArrayList<TRImReductionGraph>();
		}
		this.filterValueGraphs.add(filterValueGraph);
	}

	public void addSchemeGraph(TRImReductionSchemeGraph schemeGraph) {
		if (this.schemeGraphs == null) {
			this.schemeGraphs = new ArrayList<TRImReductionSchemeGraph>();
		}
		this.schemeGraphs.add(schemeGraph);
	}

	public void addMessage(String message) {
		if (this.messages == null) {
			this.messages = new Messages();
		}
		this.messages.addMessage(message);
	}

	public void fetchData(String database) throws Exception {
		Connection con = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		String url = DatabaseParameters.url + database;
		String user = DatabaseParameters.username;
		String password = DatabaseParameters.password;

		ClientTRImTableRow thisFilterValueParameters = null;
		String query = "";
		double thisReduction;
		TRImReductionTableRow thisReductionRow = null;
		TRImReductionGraphRow thisReductionPoint = null;
		double[] reductionValues = { (double) -5, (double) -2.5, (double) 0, (double) 2.5, (double) 5, (double) 10, (double) 15, (double) 20, (double) 25 };
		double totalEmployeeHeadcount = 0;
		Double[] cutoffs = { 0.05, 0.1, 0.15, 0.25, 0.4, 0.5, 0.6, 0.7, 0.85, 0.9999 };

		TRImReductionTable thisFilterValue = null;
		TRImReductionGraph thisFilterValueGraph = null;
		boolean schemeExists = false;
		TRImReductionSchemeList schemeList = null;
		ArrayList<String> labelList = new ArrayList<String>();
		ArrayList<Double> reductionList = new ArrayList<Double>();
		ArrayList<String> uniformReductionLabels = null;
		ArrayList<Double> uniformReductionList = null;
		Hashtable<String, Double> filterValueHeadcounts = new Hashtable<String, Double>();

		try {
			if (TRImReductionScheme.isUpToDate(database)) {
				schemeExists = true;
			}
		} catch (Exception findSchemeException) {
			throw new Exception("Error looking for reduction scheme: " + findSchemeException.getMessage());
		}
		this.schemeExists = schemeExists;

		// If changing the number of uniform schemes, see also the last loop in
		// the function where schemeIsUniform is defined
		if (schemeExists) {
			schemeList = new TRImReductionSchemeList();
			try {
				schemeList.populate(database);
			} catch (Exception populateSchemeException) {
				throw new Exception("Error populating reduction schemes: " + populateSchemeException.getMessage());
			}
			uniformReductionLabels = new ArrayList<String>();
			uniformReductionLabels.add("5% increase");
			uniformReductionLabels.add("5% reduction");
			uniformReductionLabels.add("10% reduction");
			uniformReductionLabels.add("20% reduction");
			uniformReductionList = new ArrayList<Double>();
			uniformReductionList.add((double) -5);
			uniformReductionList.add((double) 5);
			uniformReductionList.add((double) 10);
			uniformReductionList.add((double) 20);
		} else {
			uniformReductionLabels = new ArrayList<String>();
			uniformReductionLabels.add("5% increase");
			uniformReductionLabels.add("2.5% increase");
			uniformReductionLabels.add("No change");
			uniformReductionLabels.add("2.5% reduction");
			uniformReductionLabels.add("5% reduction");
			uniformReductionLabels.add("10% reduction");
			uniformReductionLabels.add("15% reduction");
			uniformReductionLabels.add("20% reduction");
			uniformReductionLabels.add("25% reduction");
			uniformReductionList = new ArrayList<Double>();
			uniformReductionList.add((double) -5);
			uniformReductionList.add((double) -2.5);
			uniformReductionList.add((double) 0);
			uniformReductionList.add((double) 2.5);
			uniformReductionList.add((double) 5);
			uniformReductionList.add((double) 10);
			uniformReductionList.add((double) 15);
			uniformReductionList.add((double) 20);
			uniformReductionList.add((double) 25);
		}

		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch (Exception openException) {
			Exception driverInitException = new Exception("Failed to open SQL driver instance:"); // openException.getMessage()
			throw driverInitException;
		}

		query = "SELECT modelvariablename , employeeheadcount , individualturnoverrate , valueadded , totalcompensation , hiringcost , trainingcost , trainingperiod , vacancyperiod , shapeparameter , scaleparameter , productivity0to30 , productivity31to60 , productivity61to90 , productivity91to180 , productivity181to365 , categorylabel FROM triminput ORDER BY categorylabel;";

		try {
			con = DriverManager.getConnection(url, user, password);
			st = con.prepareStatement(query);
			rs = st.executeQuery();

			while (rs.next()) {
				if (this.filterName == null && rs.getString("modelvariablename") != null && !("").equals(rs.getString("modelvariablename").trim())) {
					this.filterName = rs.getString("modelvariablename");
				}
				if (rs.getString("categorylabel") != null) {
					thisFilterValue = new TRImReductionTable();
					thisFilterValueGraph = new TRImReductionGraph();
					thisFilterValue.filterValue = rs.getString("categorylabel");
					thisFilterValueGraph.filterValue = rs.getString("categorylabel");

					thisFilterValueParameters = new ClientTRImTableRow();
					thisFilterValueParameters.setFilterValue(thisFilterValue.filterValue);
					thisFilterValueParameters.setEmployeeHeadcount((double) 0);
					thisFilterValueParameters.setIndividualTurnoverRate((double) 0);
					thisFilterValueParameters.setValueAdded(0);
					thisFilterValueParameters.setTotalCompensation((double) 0);
					thisFilterValueParameters.setHiringCost((double) 0);
					thisFilterValueParameters.setTrainingCost((double) 0);
					thisFilterValueParameters.setTrainingPeriod((double) 0);
					thisFilterValueParameters.setVacancyPeriod((double) 0);
				} else {
					throw new Exception("Null filter value encountered in saved TRIm table.");
				}

				if (rs.getString("employeeheadcount") != null && !("").equals(rs.getString("employeeheadcount").trim())) {
					thisFilterValueParameters.employeeHeadcount = rs.getDouble("employeeheadcount");
					filterValueHeadcounts.put(rs.getString("categorylabel"), rs.getDouble("employeeHeadcount"));
					totalEmployeeHeadcount = totalEmployeeHeadcount + thisFilterValueParameters.employeeHeadcount;
				} else {
					throw new Exception("Null value encountered for headcount for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("individualturnoverrate") != null && !("").equals(rs.getString("individualturnoverrate").trim())) {
					thisFilterValueParameters.individualTurnoverRate = rs.getDouble("individualturnoverrate");
				} else {
					throw new Exception("Null value encountered for turnover rate for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("valueadded") != null && !("").equals(rs.getString("valueadded").trim())) {
					thisFilterValueParameters.valueAdded = rs.getInt("valueadded");
				} else {
					throw new Exception("Null value encountered for value added for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("totalcompensation") != null && !("").equals(rs.getString("totalcompensation").trim())) {
					thisFilterValueParameters.totalCompensation = rs.getDouble("totalcompensation");
				} else {
					throw new Exception("Null value encountered for total compensation for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("hiringcost") != null && !("").equals(rs.getString("hiringcost").trim())) {
					thisFilterValueParameters.hiringCost = rs.getDouble("hiringcost");
				} else {
					throw new Exception("Null value encountered for hiring cost for filter value " + rs.getString("categorylabel"));
				}

				if (rs.getString("trainingcost") != null && !("").equals(rs.getString("trainingcost").trim())) {
					thisFilterValueParameters.trainingCost = rs.getDouble("trainingcost");
				} else {
					throw new Exception("Null value encountered for training cost for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("trainingperiod") != null && !("").equals(rs.getString("trainingperiod").trim())) {
					thisFilterValueParameters.trainingPeriod = rs.getDouble("trainingperiod");
				} else {
					throw new Exception("Null value encountered for training period for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("vacancyperiod") != null && !("").equals(rs.getString("vacancyperiod").trim())) {
					thisFilterValueParameters.vacancyPeriod = rs.getDouble("vacancyperiod");
				} else {
					throw new Exception("Null value encountered for vacancy period for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("shapeparameter") != null && !("").equals(rs.getString("shapeparameter").trim())) {
					thisFilterValueParameters.shapeParameter = rs.getDouble("shapeparameter");
				} else {
					throw new Exception("Null value encountered for shape parameter for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("scaleparameter") != null && !("").equals(rs.getString("scaleparameter").trim())) {
					thisFilterValueParameters.scaleParameter = rs.getDouble("scaleparameter");
				} else {
					throw new Exception("Null value encountered for scale parameter for filter value " + rs.getString("categorylabel"));
				}
				if (rs.getString("productivity0to30") != null && !("").equals(rs.getString("productivity0to30").trim())) {
					thisFilterValueParameters.productivity0To30 = rs.getDouble("productivity0to30");

				}
				if (rs.getString("productivity31to60") != null && !("").equals(rs.getString("productivity31to60").trim())) {
					thisFilterValueParameters.productivity31To60 = rs.getDouble("productivity31to60");

				}
				if (rs.getString("productivity61to90") != null && !("").equals(rs.getString("productivity61to90").trim())) {
					thisFilterValueParameters.productivity61To90 = rs.getDouble("productivity61to90");

				}
				if (rs.getString("productivity91to180") != null && !("").equals(rs.getString("productivity91to180").trim())) {
					thisFilterValueParameters.productivity91To180 = rs.getDouble("productivity91to180");

				}
				if (rs.getString("productivity181to365") != null && !("").equals(rs.getString("productivity181to365").trim())) {
					thisFilterValueParameters.productivity181To365 = rs.getDouble("productivity181to365");

				}
				thisFilterValueParameters.productivityGreater365 = 100.0;

				if (schemeExists) {
					labelList = (ArrayList<String>) uniformReductionLabels.clone();
					reductionList = (ArrayList<Double>) uniformReductionList.clone();
					labelList.addAll(schemeList.schemeLabels);
					for (int i = 0; i < schemeList.schemes.size(); i++) {
						if (schemeList.schemes.get(i).containsKey(thisFilterValue.filterValue)) {
							reductionList.add(schemeList.schemes.get(i).get(thisFilterValue.filterValue));
						} else {
							throw new Exception("Scheme " + labelList.get(i) + " does not contain filter value " + thisFilterValue.filterValue);
						}
					}
				} else {
					labelList = uniformReductionLabels;
					reductionList = uniformReductionList;
				}
				Gson gson = new Gson();
				this.addMessage("Reduction list is " + gson.toJson(reductionList));

				this.addFilterValue(thisFilterValue);
				for (Double cutoff : cutoffs) {
					thisReduction = cutoff;
					thisReductionPoint = new TRImReductionGraphRow();
					thisReductionPoint.filterValue = thisReduction;
					thisReductionPoint.costSavings = 0.0;
					thisReductionPoint.topLineGain = 0.0;
					thisReductionPoint.bottomLineImpact = 0.0;
					thisReductionPoint.ebitdaImpact = 0.0;
					thisFilterValueGraph.addGraphRow(thisReductionPoint);
				}

				for (int i = 0; i < cutoffs.length; i++) {
					thisReductionPoint = thisFilterValueGraph.graph.get(i);
					thisReduction = (double) (Math.round(thisReductionPoint.filterValue * 100));
					HashMap<String, Double> thisCutoffValues = calculateImpact(thisFilterValueParameters, thisReductionPoint.filterValue);
					thisReductionPoint.filterValue = thisReduction;
					thisReductionPoint.topLineGain = thisCutoffValues.get("topLineGains");
					thisReductionPoint.costSavings = thisCutoffValues.get("costSavings");
					thisReductionPoint.bottomLineImpact = thisCutoffValues.get("EBITDAImpact");
					thisReductionPoint.ebitdaImpact = (double) thisCutoffValues.get("EBITDA") / thisReductionPoint.bottomLineImpact;

				}
				this.addFilterValueGraph(thisFilterValueGraph);

				for (int i = 0; i < reductionList.size(); i++) {
					thisReduction = reductionList.get(i);
					thisReductionRow = new TRImReductionTableRow();
					thisReductionRow.schemeLabel = labelList.get(i);
					thisReductionRow.reduction = new Double(thisReduction);
					thisReductionRow.topLineGain = new Double(0);
					thisReductionRow.costSavings = new Double(0);
					thisReductionRow.bottomLineImpact = new Double(0);

					thisReductionRow.newHireTurnoverRateCurrent = new Double(0);
					thisReductionRow.newHireTurnoverRateNew = new Double(0);
					thisReductionRow.newHireTurnoverRateReduction = new Double(0);
					thisReductionRow.seatTurnoverRateCurrent = new Double(0);
					thisReductionRow.seatTurnoverRateNew = new Double(0);
					thisReductionRow.seatTurnoverRateReduction = new Double(0);

					thisReductionRow.hireReductionPercent = new Double(0);
					thisReductionRow.hireReductionNumber = new Integer(0);
					thisReductionRow.currentNewHires = new Integer(0);
					thisReductionRow.impliedNewHires = new Integer(0);
					thisFilterValue.addTableRow(thisReductionRow);
				}

				for (int i = 0; i < reductionList.size(); i++) {
					thisReduction = reductionList.get(i);
					HashMap<String, Double> thisReductionValues = calculateImpact(thisFilterValueParameters, thisReduction / 100);
					thisReductionRow = thisFilterValue.table.get(i);
					thisReductionRow.topLineGain = thisReductionValues.get("topLineGains");
					thisReductionRow.costSavings = thisReductionValues.get("costSavings");
					thisReductionRow.bottomLineImpact = thisReductionValues.get("EBITDAImpact");
					thisReductionRow.newHireTurnoverRateCurrent = thisFilterValueParameters.individualTurnoverRate;
					thisReductionRow.newHireTurnoverRateNew = thisReductionRow.newHireTurnoverRateCurrent * (1 - (thisReduction / 100));
					;
					thisReductionRow.newHireTurnoverRateReduction = thisReduction;
					thisReductionRow.seatTurnoverRateCurrent = thisReductionValues.get("seatTurnoverRateCurrent");
					thisReductionRow.seatTurnoverRateNew = thisReductionValues.get("seatTurnoverRateNew");
					thisReductionRow.seatTurnoverRateReduction = (thisReductionRow.seatTurnoverRateCurrent - thisReductionRow.seatTurnoverRateNew)
							/ thisReductionRow.seatTurnoverRateCurrent;
				}
			}
		} catch (SQLException queryException) {
			Exception rethrownQueryException = new Exception("SQL query failed: Exception is " + queryException.getMessage().replaceAll("'", "`"));
			throw rethrownQueryException;
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (st != null) {
					st.close();
				}
				if (con != null) {
					con.close();
				}

			} catch (SQLException closeSQLException) {
				Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
				throw rethrownCloseException;
			}
		}

		this.addMessage("Before creating All table");
		thisFilterValue = new TRImReductionTable();
		thisFilterValue.filterValue = "All";

		for (int thisSchemeNo = 0; thisSchemeNo < labelList.size(); thisSchemeNo++) {
			thisReductionRow = new TRImReductionTableRow();
			thisReductionRow.schemeLabel = labelList.get(thisSchemeNo);
			thisReductionRow.reduction = new Double(0);
			thisReductionRow.currentTurnover = new Double(0);
			thisReductionRow.impliedTurnover = new Double(0);
			thisReductionRow.topLineGain = new Double(0);
			thisReductionRow.costSavings = new Double(0);
			thisReductionRow.bottomLineImpact = new Double(0);
			thisReductionRow.newHireTurnoverRateCurrent = new Double(0);
			thisReductionRow.newHireTurnoverRateNew = new Double(0);
			thisReductionRow.newHireTurnoverRateReduction = new Double(0);
			thisReductionRow.seatTurnoverRateCurrent = new Double(0);
			thisReductionRow.seatTurnoverRateNew = new Double(0);
			thisReductionRow.seatTurnoverRateReduction = new Double(0);
			thisReductionRow.hireReductionPercent = new Double(0);
			thisReductionRow.hireReductionNumber = new Integer(0);
			thisReductionRow.currentNewHires = new Integer(0);
			thisReductionRow.impliedNewHires = new Integer(0);

			thisFilterValue.addTableRow(thisReductionRow);

			for (int thisFilterValueNo = 0; thisFilterValueNo < this.filterValues.size(); thisFilterValueNo++) {
				double thisFilterValueHeadcount = 0;
				if (filterValueHeadcounts.containsKey(this.filterValues.get(thisFilterValueNo).filterValue)) {
					thisFilterValueHeadcount = filterValueHeadcounts.get(this.filterValues.get(thisFilterValueNo).filterValue);
				} else {
					throw new Exception("Filter value " + this.filterValues.get(thisFilterValueNo).filterValue + " missing headcount.");
				}

				thisReductionRow.reduction += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).reduction * thisFilterValueHeadcount;
				thisReductionRow.topLineGain += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).topLineGain;
				thisReductionRow.costSavings += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).costSavings;
				thisReductionRow.bottomLineImpact += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).bottomLineImpact;
				thisReductionRow.newHireTurnoverRateCurrent += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).newHireTurnoverRateCurrent
						* thisFilterValueHeadcount;
				thisReductionRow.newHireTurnoverRateNew += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).newHireTurnoverRateNew * thisFilterValueHeadcount;
				thisReductionRow.newHireTurnoverRateReduction += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).newHireTurnoverRateReduction
						* thisFilterValueHeadcount;
				thisReductionRow.seatTurnoverRateCurrent += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).seatTurnoverRateCurrent * thisFilterValueHeadcount;
				thisReductionRow.seatTurnoverRateNew += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).seatTurnoverRateNew * thisFilterValueHeadcount;
				thisReductionRow.seatTurnoverRateReduction += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).seatTurnoverRateReduction * thisFilterValueHeadcount;
				thisReductionRow.hireReductionPercent += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).hireReductionPercent * thisFilterValueHeadcount;
				thisReductionRow.hireReductionNumber += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).hireReductionNumber;
				thisReductionRow.currentNewHires += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).currentNewHires;
				thisReductionRow.impliedNewHires += this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).impliedNewHires;
			}
			thisReductionRow.reduction = thisReductionRow.reduction / totalEmployeeHeadcount;
			thisReductionRow.newHireTurnoverRateCurrent = thisReductionRow.newHireTurnoverRateCurrent / totalEmployeeHeadcount;
			thisReductionRow.newHireTurnoverRateNew = thisReductionRow.newHireTurnoverRateNew / totalEmployeeHeadcount;
			thisReductionRow.newHireTurnoverRateReduction = thisReductionRow.newHireTurnoverRateReduction / totalEmployeeHeadcount;
			thisReductionRow.seatTurnoverRateCurrent = thisReductionRow.seatTurnoverRateCurrent / totalEmployeeHeadcount;
			thisReductionRow.seatTurnoverRateNew = thisReductionRow.seatTurnoverRateNew / totalEmployeeHeadcount;
			thisReductionRow.seatTurnoverRateReduction = thisReductionRow.seatTurnoverRateReduction / totalEmployeeHeadcount;
		}
		this.addFilterValue(thisFilterValue);

		
		thisFilterValueGraph = new TRImReductionGraph();
		thisFilterValueGraph.filterValue = "All";
		for (int i = 0; i < cutoffs.length; i++) {
			thisReductionPoint = new TRImReductionGraphRow();
			thisReductionPoint.bottomLineImpact = 0.0;
			thisReductionPoint.topLineGain = 0.0;
			thisReductionPoint.costSavings = 0.0;
			thisReductionPoint.ebitdaImpact = 0.0;
			for (int thisFilterValueNo = 0; thisFilterValueNo < this.filterValueGraphs.size(); thisFilterValueNo++) {
				thisReductionPoint.filterValue = this.filterValueGraphs.get(thisFilterValueNo).graph.get(i).filterValue;
				thisReductionPoint.bottomLineImpact += this.filterValueGraphs.get(thisFilterValueNo).graph.get(i).bottomLineImpact;
				thisReductionPoint.topLineGain += this.filterValueGraphs.get(thisFilterValueNo).graph.get(i).topLineGain;
				thisReductionPoint.costSavings += this.filterValueGraphs.get(thisFilterValueNo).graph.get(i).costSavings;
				if (thisReductionPoint.bottomLineImpact != 0.0) {
					thisReductionPoint.ebitdaImpact +=  this.filterValueGraphs.get(thisFilterValueNo).graph.get(i).ebitdaImpact;
				}
			}
			thisFilterValueGraph.addGraphRow(thisReductionPoint);
		}
		this.addFilterValueGraph(thisFilterValueGraph);
		this.addMessage("After creating All table");

		for (int thisSchemeNo = 0; thisSchemeNo < labelList.size(); thisSchemeNo++) {
			TRImReductionSchemeGraph thisSchemeGraph = new TRImReductionSchemeGraph();
			thisSchemeGraph.schemeLabel = labelList.get(thisSchemeNo);
			thisSchemeGraph.schemeIsUniform = ((thisSchemeNo <= 3 || schemeExists == false) ? true : false);

			for (int thisFilterValueNo = 0; thisFilterValueNo < this.filterValues.size(); thisFilterValueNo++) {
				if (!("All").equals(this.filterValues.get(thisFilterValueNo).filterValue)) {
					TRImReductionSchemeGraphRow thisSchemeGraphRow = new TRImReductionSchemeGraphRow();
					thisSchemeGraphRow.filterValue = this.filterValues.get(thisFilterValueNo).filterValue;
					thisSchemeGraphRow.topLineGain = (double) this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).topLineGain;
					thisSchemeGraphRow.costSavings = (double) this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).costSavings;
					thisSchemeGraphRow.bottomLineImpact = (double) this.filterValues.get(thisFilterValueNo).table.get(thisSchemeNo).bottomLineImpact;
					if (thisSchemeGraphRow.bottomLineImpact != 0.0) {
						thisSchemeGraphRow.ebitdaImpact = (double) (thisFilterValueParameters.valueAdded+thisFilterValueParameters.employeeHeadcount*thisFilterValueParameters.totalCompensation) / thisSchemeGraphRow.bottomLineImpact;
					} else
						thisSchemeGraphRow.ebitdaImpact = 0.0;
					thisSchemeGraph.addGraphRow(thisSchemeGraphRow);
				}
			}
			this.addSchemeGraph(thisSchemeGraph);
		}
	}

	public HashMap<String, Double> calculateImpact(ClientTRImTableRow trimInputs, Double cutoff) {

		Double employeeHeadcount = trimInputs.employeeHeadcount;
		Double newHireTurnoverRate = trimInputs.individualTurnoverRate;
		//Double valueAdded = (double) trimInputs.valueAdded;
		Double averageCompensation = trimInputs.totalCompensation;
		Double valueAdded = (double) trimInputs.valueAdded + employeeHeadcount*averageCompensation;
		Double hiringCost = trimInputs.hiringCost;
		Double trainingCost = trimInputs.trainingCost;
		Double vacancyPeriod = trimInputs.vacancyPeriod;
		Double MLEShape = trimInputs.shapeParameter;
		Double productivity0to30 = trimInputs.productivity0To30;
		Double productivity31to60 = trimInputs.productivity31To60;
		Double productivity61to90 = trimInputs.productivity61To90;
		Double productivity91to180 = trimInputs.productivity91To180;
		Double productivity181to365 = trimInputs.productivity181To365;
		Double productivityGreater365 = trimInputs.productivityGreater365;

		Double turnoverReduction = cutoff;

		Double MLEScale = Math.pow(-Math.log(1 - newHireTurnoverRate), -(1 / MLEShape));

		Double testReductionInTurnover = (1 - turnoverReduction) * newHireTurnoverRate;
		Double adjustedScale = Math.pow(-Math.log(1 - testReductionInTurnover), -(1 / MLEShape));

		Double ctr_Day30TurnoverRate = 1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape));
		Double ctr_Day60TurnoverRate = 1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape));
		Double ctr_Day90TurnoverRate = 1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape));
		Double ctr_Day180TurnoverRate = 1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale), MLEShape));
		Double ctr_Day365TurnoverRate = 1 - Math.exp(-Math.pow(((365 / (double) 365) / MLEScale), MLEShape));

		Double ctr_empYearsperHireForTenure0To30 = (1 - 0) * (1 - (1 - ctr_Day30TurnoverRate) / (1 - 0)) * (30 / (double) 365) / (Math.log(1 - 0) - Math.log(1
				- ctr_Day30TurnoverRate));
		Double ctr_empYearsperHireForTenure31To60 = (1 - ctr_Day30TurnoverRate) * (1 - (1 - ctr_Day60TurnoverRate) / (1 - ctr_Day30TurnoverRate)) * (30 / (double) 365) / (Math.log(
				1 - ctr_Day30TurnoverRate) - Math.log(1 - ctr_Day60TurnoverRate));
		Double ctr_empYearsperHireForTenure61To90 = (1 - ctr_Day60TurnoverRate) * (1 - (1 - ctr_Day90TurnoverRate) / (1 - ctr_Day60TurnoverRate)) * (30 / (double) 365) / (Math.log(
				1 - ctr_Day60TurnoverRate) - Math.log(1 - ctr_Day90TurnoverRate));
		Double ctr_empYearsperHireForTenure91To180 = (1 - ctr_Day90TurnoverRate) * (1 - (1 - ctr_Day180TurnoverRate) / (1 - ctr_Day90TurnoverRate)) * (90 / (double) 365) / (Math
				.log(1 - ctr_Day90TurnoverRate) - Math.log(1 - ctr_Day180TurnoverRate));
		Double ctr_empYearsperHireForTenure181To365 = (1 - ctr_Day180TurnoverRate) * (1 - (1 - ctr_Day365TurnoverRate) / (1 - ctr_Day180TurnoverRate)) * (185 / (double) 365)
				/ (Math.log(1 - ctr_Day180TurnoverRate) - Math.log(1 - ctr_Day365TurnoverRate));
		Double ctr_empYearsperHireForTenure365p = MLEScale * Gamma.gamma(1 + (1 / MLEShape)) - (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365);

		Double ctr_empShare0To30 = ctr_empYearsperHireForTenure0To30 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60 + ctr_empYearsperHireForTenure61To90
				+ ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
		Double ctr_empShare31To60 = ctr_empYearsperHireForTenure31To60 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
		Double ctr_empShare61To90 = ctr_empYearsperHireForTenure61To90 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
		Double ctr_empShare91To180 = ctr_empYearsperHireForTenure91To180 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
		Double ctr_empShare181To365 = ctr_empYearsperHireForTenure181To365 / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60
				+ ctr_empYearsperHireForTenure61To90 + ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);
		Double ctr_empShare365p = ctr_empYearsperHireForTenure365p / (ctr_empYearsperHireForTenure0To30 + ctr_empYearsperHireForTenure31To60 + ctr_empYearsperHireForTenure61To90
				+ ctr_empYearsperHireForTenure91To180 + ctr_empYearsperHireForTenure181To365 + ctr_empYearsperHireForTenure365p);

		Double ctr_revenueOverall = productivity0to30 * ctr_empShare0To30 + productivity31to60 * ctr_empShare31To60 + productivity61to90 * ctr_empShare61To90 + productivity91to180
				* ctr_empShare91To180 + productivity181to365 * ctr_empShare181To365 + productivityGreater365 * ctr_empShare365p;

		Double rtr_Day30TurnoverRate = 1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale), MLEShape));
		Double rtr_Day60TurnoverRate = 1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale), MLEShape));
		Double rtr_Day90TurnoverRate = 1 - Math.exp(-Math.pow(((90 / (double) 365) / adjustedScale), MLEShape));
		Double rtr_Day180TurnoverRate = 1 - Math.exp(-Math.pow(((180 / (double) 365) / adjustedScale), MLEShape));
		Double rtr_Day365TurnoverRate = 1 - Math.exp(-Math.pow(((365 / (double) 365) / adjustedScale), MLEShape));

		Double rtr_empYearsperHireForTenure0To30 = (1 - 0) * (1 - (1 - rtr_Day30TurnoverRate) / (1 - 0)) * (30 / (double) 365) / (Math.log(1 - 0) - Math.log(1
				- rtr_Day30TurnoverRate));
		Double rtr_empYearsperHireForTenure31To60 = (1 - rtr_Day30TurnoverRate) * (1 - (1 - rtr_Day60TurnoverRate) / (1 - rtr_Day30TurnoverRate)) * (30 / (double) 365) / (Math.log(
				1 - rtr_Day30TurnoverRate) - Math.log(1 - rtr_Day60TurnoverRate));
		Double rtr_empYearsperHireForTenure61To90 = (1 - rtr_Day60TurnoverRate) * (1 - (1 - rtr_Day90TurnoverRate) / (1 - rtr_Day60TurnoverRate)) * (30 / (double) 365) / (Math.log(
				1 - rtr_Day60TurnoverRate) - Math.log(1 - rtr_Day90TurnoverRate));
		Double rtr_empYearsperHireForTenure91To180 = (1 - rtr_Day90TurnoverRate) * (1 - (1 - rtr_Day180TurnoverRate) / (1 - rtr_Day90TurnoverRate)) * (90 / (double) 365) / (Math
				.log(1 - rtr_Day90TurnoverRate) - Math.log(1 - rtr_Day180TurnoverRate));
		Double rtr_empYearsperHireForTenure181To365 = (1 - rtr_Day180TurnoverRate) * (1 - (1 - rtr_Day365TurnoverRate) / (1 - rtr_Day180TurnoverRate)) * (185 / (double) 365)
				/ (Math.log(1 - rtr_Day180TurnoverRate) - Math.log(1 - rtr_Day365TurnoverRate));
		Double rtr_empYearsperHireForTenure365p = adjustedScale * Gamma.gamma(1 + (1 / MLEShape)) - (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365);

		Double rtr_empShare0To30 = rtr_empYearsperHireForTenure0To30 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60 + rtr_empYearsperHireForTenure61To90
				+ rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
		Double rtr_empShare31To60 = rtr_empYearsperHireForTenure31To60 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
		Double rtr_empShare61To90 = rtr_empYearsperHireForTenure61To90 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
		Double rtr_empShare91To180 = rtr_empYearsperHireForTenure91To180 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
		Double rtr_empShare181To365 = rtr_empYearsperHireForTenure181To365 / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60
				+ rtr_empYearsperHireForTenure61To90 + rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);
		Double rtr_empShare365p = rtr_empYearsperHireForTenure365p / (rtr_empYearsperHireForTenure0To30 + rtr_empYearsperHireForTenure31To60 + rtr_empYearsperHireForTenure61To90
				+ rtr_empYearsperHireForTenure91To180 + rtr_empYearsperHireForTenure181To365 + rtr_empYearsperHireForTenure365p);

		Double rtr_revenueOverall = productivity0to30 * rtr_empShare0To30 + productivity31to60 * rtr_empShare31To60 + productivity61to90 * rtr_empShare61To90 + productivity91to180
				* rtr_empShare91To180 + productivity181to365 * rtr_empShare181To365 + productivityGreater365 * rtr_empShare365p;
		Double revenueGain = (rtr_revenueOverall - ctr_revenueOverall) / 100 * valueAdded;

		Double shareOfQuits0To30 = 1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape));
		Double shareOfQuits31To60 = (1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((30 / (double) 365) / MLEScale), MLEShape)));
		Double shareOfQuits61To90 = (1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((60 / (double) 365) / MLEScale), MLEShape)));
		Double shareOfQuits91To180 = (1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((90 / (double) 365) / MLEScale), MLEShape)));
		Double shareOfQuits181To365 = (1 - Math.exp(-Math.pow(((365 / (double) 365) / MLEScale), MLEShape))) - (1 - Math.exp(-Math.pow(((180 / (double) 365) / MLEScale),
				MLEShape)));
		Double shareOfQuits365p = 1 - (shareOfQuits0To30 + shareOfQuits31To60 + shareOfQuits61To90 + shareOfQuits91To180 + shareOfQuits181To365);

		Double revenueOfQuitters = productivity0to30 * shareOfQuits0To30 + productivity31to60 * shareOfQuits31To60 + productivity61to90 * shareOfQuits61To90 + productivity91to180
				* shareOfQuits91To180 + productivity181to365 * shareOfQuits181To365 + productivityGreater365 * shareOfQuits365p;
		Double revenueOverall = ctr_revenueOverall;
		Double quitterProductivity = revenueOfQuitters / revenueOverall;

		Double rtr_shareOfQuits0To30 = 1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale), MLEShape));
		Double rtr_shareOfQuits31To60 = (1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((30 / (double) 365) / adjustedScale),
				MLEShape)));
		Double rtr_shareOfQuits61To90 = (1 - Math.exp(-Math.pow(((90 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((60 / (double) 365) / adjustedScale),
				MLEShape)));
		Double rtr_shareOfQuits91To180 = (1 - Math.exp(-Math.pow(((180 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((90 / (double) 365)
				/ adjustedScale), MLEShape)));
		Double rtr_shareOfQuits181To365 = (1 - Math.exp(-Math.pow(((365 / (double) 365) / adjustedScale), MLEShape))) - (1 - Math.exp(-Math.pow(((180 / (double) 365)
				/ adjustedScale), MLEShape)));
		Double rtr_shareOfQuits365p = 1 - (rtr_shareOfQuits0To30 + rtr_shareOfQuits31To60 + rtr_shareOfQuits61To90 + rtr_shareOfQuits91To180 + rtr_shareOfQuits181To365);

		Double rtr_revenueOfQuitters = productivity0to30 * rtr_shareOfQuits0To30 + productivity31to60 * rtr_shareOfQuits31To60 + productivity61to90 * rtr_shareOfQuits61To90
				+ productivity91to180 * rtr_shareOfQuits91To180 + productivity181to365 * rtr_shareOfQuits181To365 + productivityGreater365 * rtr_shareOfQuits365p;
		Double rtr_quitterProductivity = rtr_revenueOfQuitters / rtr_revenueOverall;

		Double totalCompensation = employeeHeadcount * averageCompensation;
		Double revenueNetOfPay = valueAdded - totalCompensation;
		Double grossProfitsPerEmployee = revenueNetOfPay / employeeHeadcount;
		Double revenuePerEmployee = valueAdded / employeeHeadcount;
		Double revenuePerEmployeeAtQuit = quitterProductivity * valueAdded / employeeHeadcount;
		Double desiredRevenuePerEmployeeAtQuit = rtr_quitterProductivity * valueAdded / employeeHeadcount;
		Double desiredIndividualTurnover = testReductionInTurnover;
		Double currentHeadcountTurnoverMLE = 1 / (Gamma.gamma(1 + (1 / MLEShape)) * MLEScale);
		Double desiredHeadcountTurnoverMLE = 1 / (Gamma.gamma(1 + (1 / MLEShape)) * adjustedScale);
		Double currentNewHires = employeeHeadcount * currentHeadcountTurnoverMLE;
		Double impliedNewHires = employeeHeadcount * desiredHeadcountTurnoverMLE;
		Double newHireReduction = (currentNewHires - impliedNewHires) / currentNewHires;
		Double currentTurnoverCosts = currentNewHires * (hiringCost + trainingCost);
		Double currentVacancyCosts = (vacancyPeriod / 52) * revenuePerEmployeeAtQuit * currentNewHires - (vacancyPeriod / 52) * averageCompensation * currentNewHires;
		Double desiredTurnoverCosts = impliedNewHires * (hiringCost + trainingCost);
		Double desiredVacancyCosts = (vacancyPeriod / 52) * desiredRevenuePerEmployeeAtQuit * impliedNewHires - (vacancyPeriod / 52) * averageCompensation * impliedNewHires;

		Double topLineGains = currentVacancyCosts - desiredVacancyCosts + revenueGain;
		Double costSavings = currentTurnoverCosts - desiredTurnoverCosts;
		Double EBITDAImpact = topLineGains + costSavings;

		HashMap<String, Double> returnValues = new HashMap<String, Double>();
		returnValues.put("topLineGains", topLineGains);
		returnValues.put("costSavings", costSavings);
		returnValues.put("EBITDAImpact", EBITDAImpact);
		returnValues.put("EBITDA", valueAdded);
		returnValues.put("seatTurnoverRateCurrent", currentHeadcountTurnoverMLE);
		returnValues.put("seatTurnoverRateNew", desiredHeadcountTurnoverMLE);

		/*if (trimInputs.filterValue.equalsIgnoreCase("clark3") && cutoff == 0.05) {
			System.out.println("filtervalue" + trimInputs.filterValue + "\nreduction" + cutoff + "\nvalueAdded" + valueAdded + "\nMLEScale:" + MLEScale
					+ "\ntestReductionInTurnover:" + testReductionInTurnover + "\nadjustedScale:" + adjustedScale + "\nctr_Day30TurnoverRate:" + ctr_Day30TurnoverRate
					+ "\nctr_Day60TurnoverRate:" + ctr_Day60TurnoverRate + "\nctr_Day90TurnoverRate:" + ctr_Day90TurnoverRate + "\nctr_Day180TurnoverRate:" + ctr_Day180TurnoverRate
					+ "\nctr_Day365TurnoverRate:" + ctr_Day365TurnoverRate + "\nctr_empYearsperHireForTenure0To30:" + ctr_empYearsperHireForTenure0To30
					+ "\nctr_empYearsperHireForTenure31To60:" + ctr_empYearsperHireForTenure31To60 + "\nctr_empYearsperHireForTenure61To90:" + ctr_empYearsperHireForTenure61To90
					+ "\nctr_empYearsperHireForTenure91To180:" + ctr_empYearsperHireForTenure91To180 + "\nctr_empYearsperHireForTenure181To365:"
					+ ctr_empYearsperHireForTenure181To365 + "\nctr_empYearsperHireForTenure365p:" + ctr_empYearsperHireForTenure365p + "\nctr_empShare0To30:" + ctr_empShare0To30
					+ "\nctr_empShare31To60:" + ctr_empShare31To60 + "\nctr_empShare61To90:" + ctr_empShare61To90 + "\nctr_empShare91To180:" + ctr_empShare91To180
					+ "\nctr_empShare181To365:" + ctr_empShare181To365 + "\nctr_empShare365p:" + ctr_empShare365p + "\nctr_revenueOverall:" + ctr_revenueOverall
					+ "\nrtr_Day30TurnoverRate:" + rtr_Day30TurnoverRate + "\nrtr_Day60TurnoverRate:" + rtr_Day60TurnoverRate + "\nrtr_Day90TurnoverRate:" + rtr_Day90TurnoverRate
					+ "\nrtr_Day180TurnoverRate:" + rtr_Day180TurnoverRate + "\nrtr_Day365TurnoverRate:" + rtr_Day365TurnoverRate + "\nrtr_empYearsperHireForTenure0To30:"
					+ rtr_empYearsperHireForTenure0To30 + "\nrtr_empYearsperHireForTenure31To60:" + rtr_empYearsperHireForTenure31To60 + "\nrtr_empYearsperHireForTenure61To90:"
					+ rtr_empYearsperHireForTenure61To90 + "\nrtr_empYearsperHireForTenure91To180:" + rtr_empYearsperHireForTenure91To180
					+ "\nrtr_empYearsperHireForTenure181To365:" + rtr_empYearsperHireForTenure181To365 + "\nrtr_empYearsperHireForTenure365p:" + rtr_empYearsperHireForTenure365p
					+ "\nrtr_empShare0To30:" + rtr_empShare0To30 + "\nrtr_empShare31To60:" + rtr_empShare31To60 + "\nrtr_empShare61To90:" + rtr_empShare61To90
					+ "\nrtr_empShare91To180:" + rtr_empShare91To180 + "\nrtr_empShare181To365:" + rtr_empShare181To365 + "\nrtr_empShare365p:" + rtr_empShare365p
					+ "\nrtr_revenueOverall:" + rtr_revenueOverall + "\nrevenueGain:" + revenueGain + "\nshareOfQuits0To30:" + shareOfQuits0To30 + "\nshareOfQuits31To60:"
					+ shareOfQuits31To60 + "\nshareOfQuits61To90:" + shareOfQuits61To90 + "\nshareOfQuits91To180:" + shareOfQuits91To180 + "\nshareOfQuits181To365:"
					+ shareOfQuits181To365 + "\nshareOfQuits365p:" + shareOfQuits365p + "\nrevenueOfQuitters:" + revenueOfQuitters + "\nrevenueOverall:" + revenueOverall
					+ "\nquitterProductivity" + quitterProductivity + "\nrtr_shareOfQuits0To30:" + rtr_shareOfQuits0To30 + "\nrtr_shareOfQuits31To60:" + rtr_shareOfQuits31To60
					+ "\nrtr_shareOfQuits61To90:" + rtr_shareOfQuits61To90 + "\nrtr_shareOfQuits91To180:" + rtr_shareOfQuits91To180 + "\nrtr_shareOfQuits181To365:"
					+ rtr_shareOfQuits181To365 + "\nrtr_shareOfQuits365p:" + rtr_shareOfQuits365p + "\nrtr_revenueOfQuitters:" + rtr_revenueOfQuitters + "\nrtr_revenueOverall:"
					+ rtr_revenueOverall + "\nrtr_quitterProductivity:" + rtr_quitterProductivity + "\ntotalCompensation:" + totalCompensation + "\nrevenueNetOfPay:"
					+ revenueNetOfPay + "\ngrossProfitsPerEmployee:" + grossProfitsPerEmployee + "\nrevenuePerEmployee:" + revenuePerEmployee + "\nrevenuePerEmployeeAtQuit:"
					+ revenuePerEmployeeAtQuit + "\ndesiredRevenuePerEmployeeAtQuit:" + desiredRevenuePerEmployeeAtQuit + "\ndesiredIndividualTurnover:" + desiredIndividualTurnover
					+ "\ncurrentHeadcountTurnoverMLE:" + currentHeadcountTurnoverMLE + "\ndesiredHeadcountTurnoverMLE:" + desiredHeadcountTurnoverMLE + "\ncurrentNewHires:"
					+ currentNewHires + "\nimpliedNewHires:" + impliedNewHires + "\nnewHireReduction:" + newHireReduction + "\ncurrentTurnoverCosts:" + currentTurnoverCosts
					+ "\ncurrentVacancyCosts:" + currentVacancyCosts + "\ndesiredTurnoverCosts:" + desiredTurnoverCosts + "\ndesiredVacancyCosts:" + desiredVacancyCosts
					+ "\ntopLineGains:" + topLineGains + "\ncostSavings:" + costSavings + "\nEBITDAImpact:" + EBITDAImpact);
		}*/
		return returnValues;
	}

	public void writeSuccess(PrintWriter writer) {
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;

	}

	public void insertErrorAndWrite(String errorMessage, PrintWriter writer) {
		this.addMessage(errorMessage);
		try {
			Gson gson = new Gson();
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JSON exception:" + e.getMessage());
		}
		return;
	}
}
