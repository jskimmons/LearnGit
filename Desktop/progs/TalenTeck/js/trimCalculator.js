function validate(trimData){	

	return true;
}

var output={};

function prevcalculate(trimData){	   
	var employeeHeadcount= parseFloat(trimData['employeeHeadcount'].replace(/,/g,'')); 
	var newHireTurnoverRate=parseFloat(trimData['newHireTurnoverRate'].replace(/,/g,''))/100 ;
	var ebitda=parseFloat(trimData['ebitda'].replace(/,/g,''))*1000000;
	var averageCompensation=parseFloat(trimData['averageCompensation'].replace(/,/g,''));
	var hiringCost=parseFloat(trimData['hiringCost'].replace(/,/g,'')) ;
	var trainingCost=parseFloat(trimData['trainingCost'].replace(/,/g,''));
	var vacancyPeriod=parseFloat(trimData['vacancyPeriod'].replace(/,/g,''));
	var industry=trimData['industry'];
	var productivity0To30=parseFloat(trimData['productivity0To30'].replace(/,/g,''));
	var productivity31To60=parseFloat(trimData['productivity31To60'].replace(/,/g,'')) ;
	var productivity61To90=parseFloat(trimData['productivity61To90'].replace(/,/g,'')) ;
	var productivity91To180=parseFloat(trimData['productivity91To180'].replace(/,/g,''));
	var productivity181To365=parseFloat(trimData['productivity181To365'].replace(/,/g,'')) ;
	var productivityGreater365=parseFloat(trimData['productivityGreater365'].replace(/,/g,''));
	var cutoffs=[-0.15,-0.1,-0.05,0.05,0.1,0.15];
	var valueAdded = ebitda + employeeHeadcount* averageCompensation;
	
	for(var cutoff in cutoffs){
		var turnoverReduction = cutoffs[cutoff];

		var MLEScale=Math.pow(-Math.log(1-newHireTurnoverRate),-(1/industry));
		
		var testReductionInTurnover = (1-turnoverReduction)*newHireTurnoverRate;
		
		var adjustedScale = Math.pow(-Math.log(1- testReductionInTurnover),-(1/industry));
		
		var ctr_Day30TurnoverRate =1-Math.exp(-Math.pow(((30/365)/MLEScale),industry));
		var ctr_Day60TurnoverRate = 1-Math.exp(-Math.pow(((60/365)/MLEScale),industry));
		var ctr_Day90TurnoverRate = 1-Math.exp(-Math.pow(((90/365)/MLEScale),industry));
		var ctr_Day180TurnoverRate = 1-Math.exp(-Math.pow(((180/365)/MLEScale),industry));
		var ctr_Day365TurnoverRate = 1-Math.exp(-Math.pow(((365/365)/MLEScale),industry));
	
		var ctr_empYearsperHireForTenure0To30=(1-0)*(1-(1-ctr_Day30TurnoverRate)/(1-0))*(30/365)/(Math.log(1-0)-Math.log(1-ctr_Day30TurnoverRate));
		var ctr_empYearsperHireForTenure31To60=(1-ctr_Day30TurnoverRate)*(1-(1-ctr_Day60TurnoverRate)/(1-ctr_Day30TurnoverRate))*(30/365)/(Math.log(1-ctr_Day30TurnoverRate)-Math.log(1-ctr_Day60TurnoverRate));
		var ctr_empYearsperHireForTenure61To90=(1-ctr_Day60TurnoverRate)*(1-(1-ctr_Day90TurnoverRate )/(1-ctr_Day60TurnoverRate ))*(30/365)/(Math.log(1-ctr_Day60TurnoverRate )-Math.log(1-ctr_Day90TurnoverRate ));
		var ctr_empYearsperHireForTenure91To180=(1-ctr_Day90TurnoverRate)*(1-(1-ctr_Day180TurnoverRate)/(1-ctr_Day90TurnoverRate))*(90/365)/(Math.log(1-ctr_Day90TurnoverRate)-Math.log(1-ctr_Day180TurnoverRate));
		var ctr_empYearsperHireForTenure181To365=(1-ctr_Day180TurnoverRate)*(1-(1-ctr_Day365TurnoverRate)/(1-ctr_Day180TurnoverRate))*(185/365)/(Math.log(1-ctr_Day180TurnoverRate)-Math.log(1-ctr_Day365TurnoverRate));
		var ctr_empYearsperHireForTenure365p=MLEScale*math.gamma(1+(1/industry))-(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365);


	
	var ctr_empShare0To30=ctr_empYearsperHireForTenure0To30/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare31To60=ctr_empYearsperHireForTenure31To60/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare61To90=ctr_empYearsperHireForTenure61To90/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare91To180=ctr_empYearsperHireForTenure91To180/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare181To365=ctr_empYearsperHireForTenure181To365/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare365p=ctr_empYearsperHireForTenure365p/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);

	var ctr_revenueOverall=productivity0To30* ctr_empShare0To30 + productivity31To60*ctr_empShare31To60 +productivity61To90*ctr_empShare61To90  + productivity91To180*ctr_empShare91To180 + productivity181To365*ctr_empShare181To365 + productivityGreater365*ctr_empShare365p;
	

	var rtr_Day30TurnoverRate =1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry));
	var rtr_Day60TurnoverRate =1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)) ;
	var rtr_Day90TurnoverRate =1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)) ;
	var rtr_Day180TurnoverRate =1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry)) ;
	var rtr_Day365TurnoverRate = 1-Math.exp(-Math.pow(((365/365)/adjustedScale),industry));
	
	var rtr_empYearsperHireForTenure0To30=(1-0)*(1-(1-rtr_Day30TurnoverRate)/(1-0))*(30/365)/(Math.log(1-0)-Math.log(1-rtr_Day30TurnoverRate));
	var rtr_empYearsperHireForTenure31To60=(1-rtr_Day30TurnoverRate)*(1-(1-rtr_Day60TurnoverRate)/(1-rtr_Day30TurnoverRate))*(30/365)/(Math.log(1-rtr_Day30TurnoverRate)-Math.log(1-rtr_Day60TurnoverRate));
	var rtr_empYearsperHireForTenure61To90=(1-rtr_Day60TurnoverRate)*(1-(1-rtr_Day90TurnoverRate )/(1-rtr_Day60TurnoverRate ))*(30/365)/(Math.log(1-rtr_Day60TurnoverRate )-Math.log(1-rtr_Day90TurnoverRate ));
	var rtr_empYearsperHireForTenure91To180=(1-rtr_Day90TurnoverRate)*(1-(1-rtr_Day180TurnoverRate)/(1-rtr_Day90TurnoverRate))*(90/365)/(Math.log(1-rtr_Day90TurnoverRate)-Math.log(1-rtr_Day180TurnoverRate));
	var rtr_empYearsperHireForTenure181To365=(1-rtr_Day180TurnoverRate)*(1-(1-rtr_Day365TurnoverRate)/(1-rtr_Day180TurnoverRate))*(185/365)/(Math.log(1-rtr_Day180TurnoverRate)-Math.log(1-rtr_Day365TurnoverRate));
	var rtr_empYearsperHireForTenure365p=adjustedScale*math.gamma(1+(1/industry))-(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365);

	var rtr_empShare0To30=rtr_empYearsperHireForTenure0To30/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare31To60=rtr_empYearsperHireForTenure31To60/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare61To90=rtr_empYearsperHireForTenure61To90/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare91To180=rtr_empYearsperHireForTenure91To180/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare181To365=rtr_empYearsperHireForTenure181To365/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare365p=rtr_empYearsperHireForTenure365p/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	
	var rtr_revenueOverall=productivity0To30* rtr_empShare0To30 + productivity31To60*rtr_empShare31To60 +productivity61To90*rtr_empShare61To90  + productivity91To180*rtr_empShare91To180 + productivity181To365*rtr_empShare181To365 + productivityGreater365*rtr_empShare365p;

	
	var revenueGain= (rtr_revenueOverall- ctr_revenueOverall)/100*valueAdded;
	var shareOfQuits0To30 =1-Math.exp(-Math.pow(((30/365)/MLEScale),industry)) ;
	var shareOfQuits31To60 = (1-Math.exp(-Math.pow(((60/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((30/365)/MLEScale),industry)));
	var shareOfQuits61To90 =(1-Math.exp(-Math.pow(((90/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((60/365)/MLEScale),industry))) ;
	var shareOfQuits91To180 =(1-Math.exp(-Math.pow(((180/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((90/365)/MLEScale),industry))) ;
	var shareOfQuits181To365 =(1-Math.exp(-Math.pow(((365/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((180/365)/MLEScale),industry))) ;
	var shareOfQuits365p = 1-(shareOfQuits0To30+shareOfQuits31To60+shareOfQuits61To90+shareOfQuits91To180+shareOfQuits181To365) ;
	
	var revenueOfQuitters=productivity0To30* shareOfQuits0To30 + productivity31To60*shareOfQuits31To60 +productivity61To90*shareOfQuits61To90 + productivity91To180*shareOfQuits91To180 + productivity181To365*shareOfQuits181To365 + productivityGreater365*shareOfQuits365p;
	var revenueOverall =ctr_revenueOverall ;
	var quitterProductivity=revenueOfQuitters/revenueOverall;
		
	var rtr_shareOfQuits0To30 = 1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry));
	var rtr_shareOfQuits31To60 = (1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry)));
	var rtr_shareOfQuits61To90 = (1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)));
	var rtr_shareOfQuits91To180= (1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)));
	var rtr_shareOfQuits181To365=(1-Math.exp(-Math.pow(((365/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry))) ;
	var rtr_shareOfQuits365p =  1-(rtr_shareOfQuits0To30+rtr_shareOfQuits31To60+rtr_shareOfQuits61To90+rtr_shareOfQuits91To180+rtr_shareOfQuits181To365);

	var rtr_revenueOfQuitters = productivity0To30*rtr_shareOfQuits0To30 + productivity31To60*rtr_shareOfQuits31To60 +productivity61To90*rtr_shareOfQuits61To90  + productivity91To180*rtr_shareOfQuits91To180 + productivity181To365*rtr_shareOfQuits181To365 + productivityGreater365*rtr_shareOfQuits365p;
	var rtr_revenueOverall = rtr_revenueOverall;
	var rtr_quitterProductivity=rtr_revenueOfQuitters/rtr_revenueOverall;
	
	
	var totalCompensation=employeeHeadcount*averageCompensation;
	var revenueNetOfPay= valueAdded-totalCompensation;
	var grossProfitsPerEmployee=revenueNetOfPay/employeeHeadcount;
	var revenuePerEmployee=	valueAdded/employeeHeadcount;
	var revenuePerEmployeeAtQuit=quitterProductivity*valueAdded/employeeHeadcount;
	var desiredRevenuePerEmployeeAtQuit=rtr_quitterProductivity*valueAdded/employeeHeadcount;
	var desiredIndividualTurnover=testReductionInTurnover ;
	var currentHeadcountTurnoverMLE=1/(math.gamma(1+(1/industry))*MLEScale);
	var desiredHeadcountTurnoverMLE=1/(math.gamma(1+(1/industry))*adjustedScale);
	var currentNewHires=employeeHeadcount*currentHeadcountTurnoverMLE;
	var impliedNewHires=employeeHeadcount*desiredHeadcountTurnoverMLE;
	var newHireReduction=(currentNewHires-impliedNewHires)/currentNewHires;
	var currentTurnoverCosts=currentNewHires*(hiringCost+trainingCost);
	var currentVacancyCosts=(vacancyPeriod/52)*revenuePerEmployeeAtQuit*currentNewHires-(vacancyPeriod/52)*averageCompensation*currentNewHires;
	var desiredTurnoverCosts=impliedNewHires*(hiringCost+trainingCost);
	var desiredVacancyCosts=(vacancyPeriod/52)*desiredRevenuePerEmployeeAtQuit*impliedNewHires-(vacancyPeriod/52)*averageCompensation*impliedNewHires;

	var topLineGains=currentVacancyCosts-desiredVacancyCosts+revenueGain;
	var costSavings=currentTurnoverCosts-desiredTurnoverCosts;
	var EBITDAImpact=topLineGains+costSavings;
	
	output[cutoffs[cutoff]*100+"%topLineGains"]=  topLineGains;
	output[cutoffs[cutoff]*100+"%costSavings"]= costSavings;
	output[cutoffs[cutoff]*100+"%EBITDAImpact"]= EBITDAImpact;
	
	/*if(turnoverReduction=="0.9999"){
	console.log("valueAdded" +valueAdded +"\nMLEScale:"+MLEScale + "\ntestReductionInTurnover:"+ testReductionInTurnover + "\nadjustedScale:" + adjustedScale
			+"\nctr_Day30TurnoverRate:" +ctr_Day30TurnoverRate +"\nctr_Day60TurnoverRate:" +ctr_Day60TurnoverRate+"\nctr_Day90TurnoverRate:" +ctr_Day90TurnoverRate
			+"\nctr_Day180TurnoverRate:" +ctr_Day180TurnoverRate+"\nctr_Day365TurnoverRate:" +ctr_Day365TurnoverRate
			+"\nctr_empYearsperHireForTenure0To30:"+ctr_empYearsperHireForTenure0To30 +"\nctr_empYearsperHireForTenure31To60:" +ctr_empYearsperHireForTenure31To60
			+"\nctr_empYearsperHireForTenure61To90:" +ctr_empYearsperHireForTenure61To90
			+"\nctr_empYearsperHireForTenure91To180:" +ctr_empYearsperHireForTenure91To180+"\nctr_empYearsperHireForTenure181To365:" +ctr_empYearsperHireForTenure181To365
			+"\nctr_empYearsperHireForTenure365p:"+ctr_empYearsperHireForTenure365p + "\nctr_empShare0To30:" + ctr_empShare0To30 + "\nctr_empShare31To60:"+ctr_empShare31To60
			+"\nctr_empShare61To90:"+ctr_empShare61To90 + "\nctr_empShare91To180:"+ctr_empShare91To180 + "\nctr_empShare181To365:" + ctr_empShare181To365
			+"\nctr_empShare365p:"+ctr_empShare365p + "\nctr_revenueOverall:" + ctr_revenueOverall 
			+"\nrtr_Day30TurnoverRate:" + rtr_Day30TurnoverRate
			+"\nrtr_Day60TurnoverRate:" + rtr_Day60TurnoverRate+"\nrtr_Day90TurnoverRate:" + rtr_Day90TurnoverRate+"\nrtr_Day180TurnoverRate:" + rtr_Day180TurnoverRate
			+"\nrtr_Day365TurnoverRate:" + rtr_Day365TurnoverRate + "\nrtr_empYearsperHireForTenure0To30:"+rtr_empYearsperHireForTenure0To30 + "\nrtr_empYearsperHireForTenure31To60:"+rtr_empYearsperHireForTenure31To60 
			+"\nrtr_empYearsperHireForTenure61To90:"+rtr_empYearsperHireForTenure61To90 + "\nrtr_empYearsperHireForTenure91To180:"+rtr_empYearsperHireForTenure91To180
			+"\nrtr_empYearsperHireForTenure181To365:"+rtr_empYearsperHireForTenure181To365+ "\nrtr_empYearsperHireForTenure365p:"+rtr_empYearsperHireForTenure365p
			+"\nrtr_empShare0To30:" + rtr_empShare0To30 +"\nrtr_empShare31To60:" + rtr_empShare31To60 +"\nrtr_empShare61To90:" + rtr_empShare61To90 +"\nrtr_empShare91To180:" + rtr_empShare91To180 
			+"\nrtr_empShare181To365:" + rtr_empShare181To365 +"\nrtr_empShare365p:" + rtr_empShare365p +"\nrtr_revenueOverall:"+rtr_revenueOverall +"\nrevenueGain:"+revenueGain
			+"\nshareOfQuits0To30:"+shareOfQuits0To30 +"\nshareOfQuits31To60:"+shareOfQuits31To60 +"\nshareOfQuits61To90:"+shareOfQuits61To90 +"\nshareOfQuits91To180:"+shareOfQuits91To180 
			+"\nshareOfQuits181To365:"+shareOfQuits181To365 +"\nshareOfQuits365p:"+shareOfQuits365p +"\nrevenueOfQuitters:"+revenueOfQuitters+"\nrevenueOverall:" + revenueOverall
			+"\nquitterProductivity" +quitterProductivity +  "\nrtr_shareOfQuits0To30:"+rtr_shareOfQuits0To30+  "\nrtr_shareOfQuits31To60:"+rtr_shareOfQuits31To60+  "\nrtr_shareOfQuits61To90:"+rtr_shareOfQuits61To90
			+"\nrtr_shareOfQuits91To180:"+rtr_shareOfQuits91To180+  "\nrtr_shareOfQuits181To365:"+rtr_shareOfQuits181To365+  "\nrtr_shareOfQuits365p:"+rtr_shareOfQuits365p 
			+"\nrtr_revenueOfQuitters:" + rtr_revenueOfQuitters + "\nrtr_revenueOverall:" + rtr_revenueOverall + "\nrtr_quitterProductivity:"+rtr_quitterProductivity
			+"\ntotalCompensation:" + totalCompensation + "\nrevenueNetOfPay:"+revenueNetOfPay + "\ngrossProfitsPerEmployee:"+grossProfitsPerEmployee + "\nrevenuePerEmployee:" +revenuePerEmployee
			+"\nrevenuePerEmployeeAtQuit:" +revenuePerEmployeeAtQuit +"\ndesiredRevenuePerEmployeeAtQuit:" +desiredRevenuePerEmployeeAtQuit +"\ndesiredIndividualTurnover:" + desiredIndividualTurnover
			+"\ncurrentHeadcountTurnoverMLE:"+currentHeadcountTurnoverMLE + "\ndesiredHeadcountTurnoverMLE:"+desiredHeadcountTurnoverMLE + "\ncurrentNewHires:"+currentNewHires +"\nimpliedNewHires:"+impliedNewHires
			+"\nnewHireReduction:"+newHireReduction+"\ncurrentTurnoverCosts:" +currentTurnoverCosts + "\ncurrentVacancyCosts:"+currentVacancyCosts + "\ndesiredTurnoverCosts:"+desiredTurnoverCosts
			+"\ndesiredVacancyCosts:"+desiredVacancyCosts + "\ntopLineGains:"+topLineGains + "\ncostSavings:" +costSavings + "\nEBITDAImpact:"+EBITDAImpact);
	}*/
	}
	output["EBITDAImpact"]=ebitda ;
	return output;
}

function calculate(trimData){	   
	var employeeHeadcount= parseFloat(trimData['employeeHeadcount'].replace(/,/g,'')); 
	var newHireTurnoverRate=parseFloat(trimData['newHireTurnoverRate'].replace(/,/g,''))/100 ;
	var ebitda=parseFloat(trimData['ebitda'].replace(/,/g,''))*1000000;
	var averageCompensation=parseFloat(trimData['averageCompensation'].replace(/,/g,''));
	var hiringCost=parseFloat(trimData['hiringCost'].replace(/,/g,'')) ;
	var trainingCost=parseFloat(trimData['trainingCost'].replace(/,/g,''));
	var vacancyPeriod=parseFloat(trimData['vacancyPeriod'].replace(/,/g,''));
	var industry=trimData['industry'];
	var productivity0To30=parseFloat(trimData['productivity0To30'].replace(/,/g,''));
	var productivity31To60=parseFloat(trimData['productivity31To60'].replace(/,/g,'')) ;
	var productivity61To90=parseFloat(trimData['productivity61To90'].replace(/,/g,'')) ;
	var productivity91To180=parseFloat(trimData['productivity91To180'].replace(/,/g,''));
	var productivity181To365=parseFloat(trimData['productivity181To365'].replace(/,/g,'')) ;
	var productivityGreater365=parseFloat(trimData['productivityGreater365'].replace(/,/g,''));
	
	var cutoffs=[0,0.05,0.1,0.15,0.25,0.4,0.5,0.6,0.7,0.85,0.9999];
	var valueAdded = ebitda + employeeHeadcount* averageCompensation;
	
	for(var cutoff in cutoffs){
		var turnoverReduction = cutoffs[cutoff];

		var MLEScale=Math.pow(-Math.log(1-newHireTurnoverRate),-(1/industry));
		
		var testReductionInTurnover = (1-turnoverReduction)*newHireTurnoverRate;
		
		var adjustedScale = Math.pow(-Math.log(1- testReductionInTurnover),-(1/industry));
		
		var ctr_Day30TurnoverRate =1-Math.exp(-Math.pow(((30/365)/MLEScale),industry));
		var ctr_Day60TurnoverRate = 1-Math.exp(-Math.pow(((60/365)/MLEScale),industry));
		var ctr_Day90TurnoverRate = 1-Math.exp(-Math.pow(((90/365)/MLEScale),industry));
		var ctr_Day180TurnoverRate = 1-Math.exp(-Math.pow(((180/365)/MLEScale),industry));
		var ctr_Day365TurnoverRate = 1-Math.exp(-Math.pow(((365/365)/MLEScale),industry));
	
		var ctr_empYearsperHireForTenure0To30=(1-0)*(1-(1-ctr_Day30TurnoverRate)/(1-0))*(30/365)/(Math.log(1-0)-Math.log(1-ctr_Day30TurnoverRate));
		var ctr_empYearsperHireForTenure31To60=(1-ctr_Day30TurnoverRate)*(1-(1-ctr_Day60TurnoverRate)/(1-ctr_Day30TurnoverRate))*(30/365)/(Math.log(1-ctr_Day30TurnoverRate)-Math.log(1-ctr_Day60TurnoverRate));
		var ctr_empYearsperHireForTenure61To90=(1-ctr_Day60TurnoverRate)*(1-(1-ctr_Day90TurnoverRate )/(1-ctr_Day60TurnoverRate ))*(30/365)/(Math.log(1-ctr_Day60TurnoverRate )-Math.log(1-ctr_Day90TurnoverRate ));
		var ctr_empYearsperHireForTenure91To180=(1-ctr_Day90TurnoverRate)*(1-(1-ctr_Day180TurnoverRate)/(1-ctr_Day90TurnoverRate))*(90/365)/(Math.log(1-ctr_Day90TurnoverRate)-Math.log(1-ctr_Day180TurnoverRate));
		var ctr_empYearsperHireForTenure181To365=(1-ctr_Day180TurnoverRate)*(1-(1-ctr_Day365TurnoverRate)/(1-ctr_Day180TurnoverRate))*(185/365)/(Math.log(1-ctr_Day180TurnoverRate)-Math.log(1-ctr_Day365TurnoverRate));
		var ctr_empYearsperHireForTenure365p=MLEScale*math.gamma(1+(1/industry))-(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365);


	
	var ctr_empShare0To30=ctr_empYearsperHireForTenure0To30/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare31To60=ctr_empYearsperHireForTenure31To60/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare61To90=ctr_empYearsperHireForTenure61To90/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare91To180=ctr_empYearsperHireForTenure91To180/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare181To365=ctr_empYearsperHireForTenure181To365/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);
	var ctr_empShare365p=ctr_empYearsperHireForTenure365p/(ctr_empYearsperHireForTenure0To30+ctr_empYearsperHireForTenure31To60+ctr_empYearsperHireForTenure61To90+ctr_empYearsperHireForTenure91To180+ctr_empYearsperHireForTenure181To365+ctr_empYearsperHireForTenure365p);

	var ctr_revenueOverall=productivity0To30* ctr_empShare0To30 + productivity31To60*ctr_empShare31To60 +productivity61To90*ctr_empShare61To90  + productivity91To180*ctr_empShare91To180 + productivity181To365*ctr_empShare181To365 + productivityGreater365*ctr_empShare365p;
	

	var rtr_Day30TurnoverRate =1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry));
	var rtr_Day60TurnoverRate =1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)) ;
	var rtr_Day90TurnoverRate =1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)) ;
	var rtr_Day180TurnoverRate =1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry)) ;
	var rtr_Day365TurnoverRate = 1-Math.exp(-Math.pow(((365/365)/adjustedScale),industry));
	
	var rtr_empYearsperHireForTenure0To30=(1-0)*(1-(1-rtr_Day30TurnoverRate)/(1-0))*(30/365)/(Math.log(1-0)-Math.log(1-rtr_Day30TurnoverRate));
	var rtr_empYearsperHireForTenure31To60=(1-rtr_Day30TurnoverRate)*(1-(1-rtr_Day60TurnoverRate)/(1-rtr_Day30TurnoverRate))*(30/365)/(Math.log(1-rtr_Day30TurnoverRate)-Math.log(1-rtr_Day60TurnoverRate));
	var rtr_empYearsperHireForTenure61To90=(1-rtr_Day60TurnoverRate)*(1-(1-rtr_Day90TurnoverRate )/(1-rtr_Day60TurnoverRate ))*(30/365)/(Math.log(1-rtr_Day60TurnoverRate )-Math.log(1-rtr_Day90TurnoverRate ));
	var rtr_empYearsperHireForTenure91To180=(1-rtr_Day90TurnoverRate)*(1-(1-rtr_Day180TurnoverRate)/(1-rtr_Day90TurnoverRate))*(90/365)/(Math.log(1-rtr_Day90TurnoverRate)-Math.log(1-rtr_Day180TurnoverRate));
	var rtr_empYearsperHireForTenure181To365=(1-rtr_Day180TurnoverRate)*(1-(1-rtr_Day365TurnoverRate)/(1-rtr_Day180TurnoverRate))*(185/365)/(Math.log(1-rtr_Day180TurnoverRate)-Math.log(1-rtr_Day365TurnoverRate));
	var rtr_empYearsperHireForTenure365p=adjustedScale*math.gamma(1+(1/industry))-(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365);

	var rtr_empShare0To30=rtr_empYearsperHireForTenure0To30/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare31To60=rtr_empYearsperHireForTenure31To60/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare61To90=rtr_empYearsperHireForTenure61To90/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare91To180=rtr_empYearsperHireForTenure91To180/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare181To365=rtr_empYearsperHireForTenure181To365/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	var rtr_empShare365p=rtr_empYearsperHireForTenure365p/(rtr_empYearsperHireForTenure0To30+rtr_empYearsperHireForTenure31To60+rtr_empYearsperHireForTenure61To90+rtr_empYearsperHireForTenure91To180+rtr_empYearsperHireForTenure181To365+rtr_empYearsperHireForTenure365p);
	
	var rtr_revenueOverall=productivity0To30* rtr_empShare0To30 + productivity31To60*rtr_empShare31To60 +productivity61To90*rtr_empShare61To90  + productivity91To180*rtr_empShare91To180 + productivity181To365*rtr_empShare181To365 + productivityGreater365*rtr_empShare365p;

	
	var revenueGain= (rtr_revenueOverall- ctr_revenueOverall)/100*valueAdded;
	var shareOfQuits0To30 =1-Math.exp(-Math.pow(((30/365)/MLEScale),industry)) ;
	var shareOfQuits31To60 = (1-Math.exp(-Math.pow(((60/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((30/365)/MLEScale),industry)));
	var shareOfQuits61To90 =(1-Math.exp(-Math.pow(((90/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((60/365)/MLEScale),industry))) ;
	var shareOfQuits91To180 =(1-Math.exp(-Math.pow(((180/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((90/365)/MLEScale),industry))) ;
	var shareOfQuits181To365 =(1-Math.exp(-Math.pow(((365/365)/MLEScale),industry)))-(1-Math.exp(-Math.pow(((180/365)/MLEScale),industry))) ;
	var shareOfQuits365p = 1-(shareOfQuits0To30+shareOfQuits31To60+shareOfQuits61To90+shareOfQuits91To180+shareOfQuits181To365) ;
	
	var revenueOfQuitters=productivity0To30* shareOfQuits0To30 + productivity31To60*shareOfQuits31To60 +productivity61To90*shareOfQuits61To90 + productivity91To180*shareOfQuits91To180 + productivity181To365*shareOfQuits181To365 + productivityGreater365*shareOfQuits365p;
	var revenueOverall =ctr_revenueOverall ;
	var quitterProductivity=revenueOfQuitters/revenueOverall;
		
	var rtr_shareOfQuits0To30 = 1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry));
	var rtr_shareOfQuits31To60 = (1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((30/365)/adjustedScale),industry)));
	var rtr_shareOfQuits61To90 = (1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((60/365)/adjustedScale),industry)));
	var rtr_shareOfQuits91To180= (1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((90/365)/adjustedScale),industry)));
	var rtr_shareOfQuits181To365=(1-Math.exp(-Math.pow(((365/365)/adjustedScale),industry)))-(1-Math.exp(-Math.pow(((180/365)/adjustedScale),industry))) ;
	var rtr_shareOfQuits365p =  1-(rtr_shareOfQuits0To30+rtr_shareOfQuits31To60+rtr_shareOfQuits61To90+rtr_shareOfQuits91To180+rtr_shareOfQuits181To365);

	var rtr_revenueOfQuitters = productivity0To30*rtr_shareOfQuits0To30 + productivity31To60*rtr_shareOfQuits31To60 +productivity61To90*rtr_shareOfQuits61To90  + productivity91To180*rtr_shareOfQuits91To180 + productivity181To365*rtr_shareOfQuits181To365 + productivityGreater365*rtr_shareOfQuits365p;
	var rtr_revenueOverall = rtr_revenueOverall;
	var rtr_quitterProductivity=rtr_revenueOfQuitters/rtr_revenueOverall;
	
	
	var totalCompensation=employeeHeadcount*averageCompensation;
	var revenueNetOfPay= valueAdded-totalCompensation;
	var grossProfitsPerEmployee=revenueNetOfPay/employeeHeadcount;
	var revenuePerEmployee=	valueAdded/employeeHeadcount;
	var revenuePerEmployeeAtQuit=quitterProductivity*valueAdded/employeeHeadcount;
	var desiredRevenuePerEmployeeAtQuit=rtr_quitterProductivity*valueAdded/employeeHeadcount;
	var desiredIndividualTurnover=testReductionInTurnover ;
	var currentHeadcountTurnoverMLE=1/(math.gamma(1+(1/industry))*MLEScale);
	var desiredHeadcountTurnoverMLE=1/(math.gamma(1+(1/industry))*adjustedScale);
	var currentNewHires=employeeHeadcount*currentHeadcountTurnoverMLE;
	var impliedNewHires=employeeHeadcount*desiredHeadcountTurnoverMLE;
	var newHireReduction=(currentNewHires-impliedNewHires)/currentNewHires;
	var currentTurnoverCosts=currentNewHires*(hiringCost+trainingCost);
	var currentVacancyCosts=(vacancyPeriod/52)*revenuePerEmployeeAtQuit*currentNewHires-(vacancyPeriod/52)*averageCompensation*currentNewHires;
	var desiredTurnoverCosts=impliedNewHires*(hiringCost+trainingCost);
	var desiredVacancyCosts=(vacancyPeriod/52)*desiredRevenuePerEmployeeAtQuit*impliedNewHires-(vacancyPeriod/52)*averageCompensation*impliedNewHires;

	var topLineGains=currentVacancyCosts-desiredVacancyCosts+revenueGain;
	var costSavings=currentTurnoverCosts-desiredTurnoverCosts;
	var EBITDAImpact=topLineGains+costSavings;
	
	output[cutoffs[cutoff]*100+"%topLineGains"]=  topLineGains;
	output[cutoffs[cutoff]*100+"%costSavings"]= costSavings;
	output[cutoffs[cutoff]*100+"%EBITDAImpact"]= EBITDAImpact;
	
	/*if(turnoverReduction=="0.9999"){
	console.log("valueAdded" +valueAdded +"\nMLEScale:"+MLEScale + "\ntestReductionInTurnover:"+ testReductionInTurnover + "\nadjustedScale:" + adjustedScale
			+"\nctr_Day30TurnoverRate:" +ctr_Day30TurnoverRate +"\nctr_Day60TurnoverRate:" +ctr_Day60TurnoverRate+"\nctr_Day90TurnoverRate:" +ctr_Day90TurnoverRate
			+"\nctr_Day180TurnoverRate:" +ctr_Day180TurnoverRate+"\nctr_Day365TurnoverRate:" +ctr_Day365TurnoverRate
			+"\nctr_empYearsperHireForTenure0To30:"+ctr_empYearsperHireForTenure0To30 +"\nctr_empYearsperHireForTenure31To60:" +ctr_empYearsperHireForTenure31To60
			+"\nctr_empYearsperHireForTenure61To90:" +ctr_empYearsperHireForTenure61To90
			+"\nctr_empYearsperHireForTenure91To180:" +ctr_empYearsperHireForTenure91To180+"\nctr_empYearsperHireForTenure181To365:" +ctr_empYearsperHireForTenure181To365
			+"\nctr_empYearsperHireForTenure365p:"+ctr_empYearsperHireForTenure365p + "\nctr_empShare0To30:" + ctr_empShare0To30 + "\nctr_empShare31To60:"+ctr_empShare31To60
			+"\nctr_empShare61To90:"+ctr_empShare61To90 + "\nctr_empShare91To180:"+ctr_empShare91To180 + "\nctr_empShare181To365:" + ctr_empShare181To365
			+"\nctr_empShare365p:"+ctr_empShare365p + "\nctr_revenueOverall:" + ctr_revenueOverall 
			+"\nrtr_Day30TurnoverRate:" + rtr_Day30TurnoverRate
			+"\nrtr_Day60TurnoverRate:" + rtr_Day60TurnoverRate+"\nrtr_Day90TurnoverRate:" + rtr_Day90TurnoverRate+"\nrtr_Day180TurnoverRate:" + rtr_Day180TurnoverRate
			+"\nrtr_Day365TurnoverRate:" + rtr_Day365TurnoverRate + "\nrtr_empYearsperHireForTenure0To30:"+rtr_empYearsperHireForTenure0To30 + "\nrtr_empYearsperHireForTenure31To60:"+rtr_empYearsperHireForTenure31To60 
			+"\nrtr_empYearsperHireForTenure61To90:"+rtr_empYearsperHireForTenure61To90 + "\nrtr_empYearsperHireForTenure91To180:"+rtr_empYearsperHireForTenure91To180
			+"\nrtr_empYearsperHireForTenure181To365:"+rtr_empYearsperHireForTenure181To365+ "\nrtr_empYearsperHireForTenure365p:"+rtr_empYearsperHireForTenure365p
			+"\nrtr_empShare0To30:" + rtr_empShare0To30 +"\nrtr_empShare31To60:" + rtr_empShare31To60 +"\nrtr_empShare61To90:" + rtr_empShare61To90 +"\nrtr_empShare91To180:" + rtr_empShare91To180 
			+"\nrtr_empShare181To365:" + rtr_empShare181To365 +"\nrtr_empShare365p:" + rtr_empShare365p +"\nrtr_revenueOverall:"+rtr_revenueOverall +"\nrevenueGain:"+revenueGain
			+"\nshareOfQuits0To30:"+shareOfQuits0To30 +"\nshareOfQuits31To60:"+shareOfQuits31To60 +"\nshareOfQuits61To90:"+shareOfQuits61To90 +"\nshareOfQuits91To180:"+shareOfQuits91To180 
			+"\nshareOfQuits181To365:"+shareOfQuits181To365 +"\nshareOfQuits365p:"+shareOfQuits365p +"\nrevenueOfQuitters:"+revenueOfQuitters+"\nrevenueOverall:" + revenueOverall
			+"\nquitterProductivity" +quitterProductivity +  "\nrtr_shareOfQuits0To30:"+rtr_shareOfQuits0To30+  "\nrtr_shareOfQuits31To60:"+rtr_shareOfQuits31To60+  "\nrtr_shareOfQuits61To90:"+rtr_shareOfQuits61To90
			+"\nrtr_shareOfQuits91To180:"+rtr_shareOfQuits91To180+  "\nrtr_shareOfQuits181To365:"+rtr_shareOfQuits181To365+  "\nrtr_shareOfQuits365p:"+rtr_shareOfQuits365p 
			+"\nrtr_revenueOfQuitters:" + rtr_revenueOfQuitters + "\nrtr_revenueOverall:" + rtr_revenueOverall + "\nrtr_quitterProductivity:"+rtr_quitterProductivity
			+"\ntotalCompensation:" + totalCompensation + "\nrevenueNetOfPay:"+revenueNetOfPay + "\ngrossProfitsPerEmployee:"+grossProfitsPerEmployee + "\nrevenuePerEmployee:" +revenuePerEmployee
			+"\nrevenuePerEmployeeAtQuit:" +revenuePerEmployeeAtQuit +"\ndesiredRevenuePerEmployeeAtQuit:" +desiredRevenuePerEmployeeAtQuit +"\ndesiredIndividualTurnover:" + desiredIndividualTurnover
			+"\ncurrentHeadcountTurnoverMLE:"+currentHeadcountTurnoverMLE + "\ndesiredHeadcountTurnoverMLE:"+desiredHeadcountTurnoverMLE + "\ncurrentNewHires:"+currentNewHires +"\nimpliedNewHires:"+impliedNewHires
			+"\nnewHireReduction:"+newHireReduction+"\ncurrentTurnoverCosts:" +currentTurnoverCosts + "\ncurrentVacancyCosts:"+currentVacancyCosts + "\ndesiredTurnoverCosts:"+desiredTurnoverCosts
			+"\ndesiredVacancyCosts:"+desiredVacancyCosts + "\ntopLineGains:"+topLineGains + "\ncostSavings:" +costSavings + "\nEBITDAImpact:"+EBITDAImpact);
	}*/
	}
	output["EBITDAImpact"]=ebitda ;
	return output;
}

function drawGraph(trimValues) {
    var EBITDAImpact = trimValues["EBITDAImpact"];

    var xs = [5,10,15,25,40,60,50,70,85,100];
	var y1 = [trimValues["5%topLineGains"],trimValues["10%topLineGains"],trimValues["15%topLineGains"],trimValues["25%topLineGains"],trimValues["40%topLineGains"],trimValues["50%topLineGains"],trimValues["60%topLineGains"],trimValues["70%topLineGains"],trimValues["85%topLineGains"],trimValues["99.99%topLineGains"]];
	var y2 = [trimValues["5%costSavings"],trimValues["10%costSavings"],trimValues["15%costSavings"],trimValues["25%costSavings"],trimValues["40%costSavings"],trimValues["50%costSavings"],trimValues["60%costSavings"],trimValues["70%costSavings"],trimValues["85%costSavings"],trimValues["99.99%costSavings"]];
	var iEBITDA= [(trimValues["5%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["10%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["15%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["25%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["40%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["50%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["60%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["70%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["85%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["99.99%EBITDAImpact"]/EBITDAImpact)*100];

	function setXY(d, i) {
    return {x:xs[i], y:d};
    }

    var d1 = y1.map(setXY);
    var d2 = y2.map(setXY);
    
    var data = [];
    data[0] = {key: "Top Line Gains", values: d1, color:"#EC9138"};
    data[1] = {key: "Cost Savings", values: d2, color:"#5CA4B4"};
       
    $(".turnoverReduction").empty();
    $("#costSavings").empty();
    $("#gains").empty();
    $(".totalEBITDA").empty();
    $(".impacts").empty();
    
    
    $(".turnoverReduction").html("Turnover Reduction <button id='help'>?</button><div id='popUp' class='popUp'><div class='insidePopUp'><span class='close'>&times;</span><p>Reduce the number of employees who leave in their first year by using the Applicant Score to select better hires, the Employee Score to retain top performers, and the Market Score to source a better pool of candidates.</p></div></div><p style='font-size:20px;font-weight:bold;'>10% </p>" );
    var popUp = document.getElementById("popUp");
    var button = document.getElementById("help");
    var close = document.getElementsByClassName("close")[0];
    button.onclick = function() {
        popUp.style.display = "block";
    }
    close.onclick = function() {
        popUp.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == popUp) {
            popUp.style.display = "none";
        }
    }
    
  
    
    $("#gains").html("Top Line Gains <button id='help1'>?</button><div id='popUp1' class='popUp1'><div class='insidePopUp1'><span class='close1'>&times;</span><p>Added revenue from having slightly more tenured, more productive employees.</p></div></div><p style='margin-top:4px;color:#E87506;font-weight:bold;font-size:15px;'>$" + addCommas(trimValues["10%topLineGains"].toFixed(0)) + "</p>");
    var popUp1 = document.getElementById("popUp1");
    var button1 = document.getElementById("help1");
    var close1 = document.getElementsByClassName("close1")[0];
    button1.onclick = function() {
        popUp1.style.display = "block";
    }
    close1.onclick = function() {
        popUp1.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == popUp1) {
            popUp.style.display = "none";
        }
    }
    
    
    $("#costSavings").html("Cost Savings <button id='help2'>?</button><div id='popUp2' class='popUp2'><div class='insidePopUp2'><span class='close2'>&times;</span><p>Direct savings from hiring and training fewer people over the course of a year.</p></div></div><p style='margin-top:4px;color:#348CA2;font-weight:bold;font-size:15px;'>$" + addCommas(trimValues["10%costSavings"].toFixed(0)) + "</p>");
    var popUp2 = document.getElementById("popUp2");
    var button2 = document.getElementById("help2");
    var close2 = document.getElementsByClassName("close2")[0];
    button2.onclick = function() {
        popUp2.style.display = "block";
    }
    close2.onclick = function() {
        popUp2.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == popUp2) {
            popUp.style.display = "none";
        }
    }
    
    
    
    $(".totalEBITDA").append("Total EBITDA Improvement  <button id='help3'>?</button><div id='popUp3' class='popUp3'><div class='insidePopUp3'><span class='close3'>&times;</span><p>Total annual bottom line impact from a turnover reduction. Capture rates vary by industry and company, but modest turnover reductions have big impacts across the board.</p></div></div><p style='font-size:20px;font-weight:bold;'>$" + addCommas(trimValues["10%EBITDAImpact"].toFixed(0)) + "</p>"); 
    var popUp3 = document.getElementById("popUp3");
    var button3 = document.getElementById("help3");
    var close3 = document.getElementsByClassName("close3")[0];
    button3.onclick = function() {
        popUp3.style.display = "block";
    }
    close3.onclick = function() {
        popUp3.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == popUp3) {
            popUp.style.display = "none";
        }
    }
    
    
    
    $(".impacts").append("<td class='impactLabel'>EBITDA Impact</td>");
    for(var i=0; i<iEBITDA.length; i++) {
        $(".impacts").append("<td class='impact'>" + (iEBITDA[i]).toFixed(0) +"%</td>");
    }    
    $(".impacts").append("<td class='impactPadding'></td>");
    $(".chartDefault").hide();
    $(".chartContainerDiv").show();
    
    //console.log(data);
    d3.select("#tchart svg").datum(data).call(chart);
}


nv.addGraph(function() {
     chart = nv.models.multiBarChart()
 	.margin({left: 65, bottom: 50,top:350})
	.transitionDuration(350)
	.reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
	.rotateLabels(0)      //Angle to rotate x-axis labels.
	.showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
	.stacked(true) // default to stacked
        .groupSpacing(0.1) //Distance between each group of bars.
	.tooltip(function(key, x, y, e, graph) {
    	    return '<h3>' + key +  '</h3>' +
    	           '<p>' +  "$" + Number(y.slice(1,y.length-1)).toFixed(2) + "M" + ' on ' + x + '</p>';
    	  });
	
 	
    chart.xAxis.axisLabel("Turnover Reduction").tickFormat(function(d) {return d3.format("")(d) + "%" }).axisLabelDistance(25);
    chart.yAxis.axisLabel("Total EBITDA Improvement").tickFormat(function(d) {return d>=1000000?"$" + d/1000000 + " M" :d;}).axisLabelDistance(25);    
    nv.utils.windowResize(chart.update);
    d3.format("d");
    return chart;
});

function prevDrawGraph(trimValues) {
    var EBITDAImpact = trimValues["EBITDAImpact"];

    var xs = [-15,-10,-5,5,10,15];
	var y1 = [trimValues["-15%topLineGains"],trimValues["-10%topLineGains"],trimValues["-5%topLineGains"],trimValues["5%topLineGains"],trimValues["10%topLineGains"],trimValues["15%topLineGains"]];
	var y2 = [trimValues["-15%costSavings"],trimValues["-10%costSavings"],trimValues["-5%costSavings"],trimValues["5%costSavings"],trimValues["10%costSavings"],trimValues["15%costSavings"]];
	//var iEBITDA= [(trimValues["-15%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["-10%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["-5%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["5%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["10%EBITDAImpact"]/EBITDAImpact)*100,(trimValues["15%EBITDAImpact"]/EBITDAImpact)*100

	function setXY(d, i) {
    return {x:xs[i], y:d};
    }

    var d1 = y1.map(setXY);
    var d2 = y2.map(setXY);
    
    var data = [];
    data[0] = {key: "Top Line Gains", values: d1, color:"#EC9138"};
    data[1] = {key: "Cost Savings", values: d2, color:"#5CA4B4"};
       
    $(".prevturnoverReduction").empty();
    $("#prevcostSavings").empty();
    $("#prevgains").empty();
    $(".prevtotalEBITDA").empty();
    $(".previmpacts").empty();
    
    $(".prevturnoverReduction").html("Turnover Reduction " + "<p style='font-size:20px;font-weight:bold;'>10% </p>");
    $("#prevgains").html("Top Line Gains " + "<p style='margin-top:4px;color:#E87506;font-weight:bold;font-size:15px;'>$" + round(trimValues["10%topLineGains"].toFixed(0)) + "</p>");   
    $("#prevcostSavings").html("Cost Savings " + "<p style='margin-top:4px;color:#348CA2;font-weight:bold;font-size:15px;'>$" + round(trimValues["10%costSavings"].toFixed(0)) + "</p>");
    $(".prevtotalEBITDA").append("Total EBITDA Improvement "+ "<p style='font-size:20px;font-weight:bold;'>$" + round(trimValues["10%EBITDAImpact"].toFixed(0)) + "</p>");    
    $(".previmpacts").append("<td class='previmpactLabel'>EBITDA Impact</td>");
    // for(var i=0; i<iEBITDA.length; i++) {
    //     $(".previmpacts").append("<td class='previmpact'>" + (iEBITDA[i]).toFixed(0) +"%</td>");
    // }    
    $(".previmpacts").append("<td class='previmpactPadding'></td>");
    $("#prevChartDefault").hide();
    $(".prevchartContainerDiv").show();
    
    //console.log(data);
    d3.select("#prevtchart svg").datum(data).call(prevchart);
    //d3.selectAll("rect.nv-bar.negative").style("fill", "red");
    //fill-opacity: .4;
    d3.selectAll("rect.nv-bar.negative").style("fill-opacity", "0.4");
}

nv.addGraph(function() {
     prevchart = nv.models.multiBarChart()
 	.margin({left: 65, bottom: 50,top:350})
	.transitionDuration(350)
	.reduceXTicks(false)    //If 'false', every single x-axis tick label will be rendered.
	.rotateLabels(0)       //Angle to rotate x-axis labels.
	.showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
	.stacked(true)       // default to stacked
    .groupSpacing(0.1)  //Distance between each group of bars.
	.tooltip(function(key, x, y, e, graph) {
    	    if (y.substring(1,2) != "-") {
    	    	return '<h3>' + key +  '</h3>' +
    	           '<p>' +  "$" + Number(y.slice(1,y.length-1)).toFixed(3) + "M" + ' on ' + x + '</p>';
    	       }
    	    else{
    	    	return '<h3>' + key +  '</h3>' +
    	           '<p style="color:red;">' +  "$" + Number(y.slice(1,y.length-1)).toFixed(3) + "M" + ' on ' + x + '</p>';
    	    	}
    	    });
	
    prevchart.xAxis.axisLabel("Turnover Reduction").tickFormat(function(d) {return d3.format("")(d) + "%" }).axisLabelDistance(25);
    prevchart.yAxis.axisLabel("Total EBITDA Improvement").tickFormat(function(d) {return d>=1000000||d<=1000000?"$" + d/1000000 + " M" :d;}).axisLabelDistance(25); 
    prevchart.groupSpacing(0.5);   
    nv.utils.windowResize(prevchart.update);
    d3.format("d");
    return prevchart;
});										// 56,000,000

function addCommas(e) {
    if (null == e) return null;
    if (e.toString().length <= 3) return e.toString();
    var t = ""
        , o = e.toString().length - 3
        , n = e.toString().indexOf(".");
    n >= 0 && (t = e.toString().substring(n), o = n - 3);
    for (var a = o; a > 1 || a >= 1 && "-" !== e.toString().substring(0, 1); a -= 3) t = "," + e.toString().substring(a, a + 3) + t;
    return t = e.toString().substring(0, a + 3) + t
}

function round(e) {
	if (null==e) return null;
	if (e.toString().length <= 7) return e.toString();
	var t = addCommas(e);
	return t.replace(t.substring(t.indexOf(",")), "." + t.substring(t.indexOf(",") + 1, t.indexOf(",") + 3) + " M");
}
