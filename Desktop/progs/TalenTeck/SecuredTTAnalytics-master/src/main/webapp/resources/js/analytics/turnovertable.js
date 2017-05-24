/**
 * 
 */


//No reason for the background to leak past the bottom of the page, unless the page is really short


var windowAspectTurnoverTable = "";
windowAspectTurnoverTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

//These quantities are pretty much fixed in this table
var lowerBoxesHeight = $(window).height - 241;

$("#leftbar-div").css("height",lowerBoxesHeight+"px");
$("#display-area").css("height",lowerBoxesHeight+"px");
$("#display-area-xs").css("height","300px");

underlineOnlyThisLink("#turnoverLink");


// Show a "loading" animation


displayTableSpinner(windowAspectTurnoverTable);



// First develop the selector box

var selectorButtonBox = $("<div></div>").attr('id','selectorButtonBox');
		
var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Turnover</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Turnover rates of new hires and current employees, and tenure distribution of employees.</h4>');

$(selectorButtonBox).append(titleDiv).append(titleDescDiv);

if ( windowAspectTurnoverTable == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
}
else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableTurnoverTableSelectors();

//Initialize global variables to hold the data

var separationPeriodSelector , tenurePeriodSelector , separationByTenurePeriodSelector;
var separationPeriodDefaultValue , tenurePeriodDefaultValue , separationByTenurePeriodDefaultValue;
var fullSeparationTable = [];
var fullTenureTable = [];
var fullSeparationByTenureTable = [];
var rawSeparationByTenureTable = [];
var separationPeriodLabel = "";
var tenurePeriodLabel = "";
var separationByTenurePeriodLabel = "";

var separationPeriodSelectorReturned = false;
var tenurePeriodSelectorReturned = false;
var separationByTenurePeriodSelectorReturned = false;

var separationFilterNameArray = [];
var tenureFilterNameArray = [];
var separationByTenureFilterNameArray = [];

var turnoverRateSelector = $("<select></select>").attr("id","turnoverRateSelector")
							.attr("class","form-control turnoverTableSelect").css("width","200px")
							.html('<option value="t365" disabled>Choose Turnover Rate</option>'+
									'<option value="t30">30-Day</option>'+
									'<option value="t60">60-Day</option>'+
									'<option value="t90">90-Day</option>'+
									'<option value="t180">180-Day</option>'+
									'<option value="t365" selected>365-Day</option>');
	


$.ajax({ type: "POST" ,
		url: "../ReturnQuery" , 
		data: { type : "getperiodlistseparation" } ,
		dataType: "json" ,
		success: function(data) {
			//console.log(data);
			separationPeriodSelector = $("<select></select>").attr("id","separationPeriodSelector")
			.attr("class","form-control turnoverTableSelect").attr("width","220px")
			.attr("defaultValue",data.defaultValue);
			var defaultValue = $("<option></option>").attr("value",data.defaultValue)
						.text("Select Time Period").attr("disabled",true);
			separationPeriodDefaultValue = data.defaultValue;
			$(separationPeriodSelector).append(defaultValue);
			$(data.periods).each( function() {
				/* Kludge: If last month is not Jan or July, there is an extra period in the graph
				 * that should not appear in the table
				 */
				if ( this.periodName.toString().substring(0,4) == data.defaultValue.toString().substring(0,4) ||
						this.periodName.toString().substring(5,7) == "01" ||
						this.periodName.toString().substring(5,7) == "07" ) {
					var thisValue = $("<option></option>").attr("value",this.periodName)
					.text(this.periodLabel);
					if ( this.periodName == data.defaultValue) {
						$(thisValue).attr("selected","selected");
					}
					$(separationPeriodSelector).append(thisValue);
					
				}
			});
			//Okay, we have the selectors; add them to the page
			separationPeriodSelectorReturned = true;
			if ( tenurePeriodSelectorReturned && separationByTenurePeriodSelectorReturned ) {
				refreshTurnoverTable(tenurePeriodDefaultValue,separationPeriodDefaultValue,separationByTenurePeriodDefaultValue,"t365");
			}
		}
});

$.ajax({ type: "POST" ,
	url: "../ReturnQuery" , 
	data: { type : "getperiodlisttenure" } ,
	dataType: "json" ,
	success: function(data) {
		//console.log(data);
		tenurePeriodSelector = $("<select></select>").attr("id","tenurePeriodSelector")
		.attr("class","form-control turnoverTableSelect").attr("width","220px")
		.attr("defaultValue",data.defaultValue);
		var defaultValue = $("<option></option>").attr("value",data.defaultValue)
					.text("Select Time Period").attr("disabled","true");
		tenurePeriodDefaultValue = data.defaultValue;
		$(tenurePeriodSelector).append(defaultValue);
		$(data.periods).each( function() {
			/* Kludge: If last month is not Jan or July, there is an extra period in the graph
			 * that should not appear in the table
			 */
			if ( this.periodName.toString().substring(0,4) == data.defaultValue.toString().substring(0,4) ||
					this.periodName.toString().substring(5,7) == "01" ||
					this.periodName.toString().substring(5,7) == "07" ) {
				var thisValue = $("<option></option>").attr("value",this.periodName)
				.text(this.periodLabel);
				if ( this.periodName == data.defaultValue) {
					$(thisValue).attr("selected","selected");
				}
				$(tenurePeriodSelector).append(thisValue);
				
			}
		});
		//Okay, we have the selectors; add them to the page
		tenurePeriodSelectorReturned = true;
		if ( separationPeriodSelectorReturned && separationByTenurePeriodSelectorReturned ) {
			refreshTurnoverTable(tenurePeriodDefaultValue,separationPeriodDefaultValue,separationByTenurePeriodDefaultValue,"t365");
		}
	}
});

$.ajax({ type: "POST" ,
	url: "../ReturnQuery" , 
	data: { type : "getperiodlistseparationbytenure" } ,
	dataType: "json" ,
	success: function(data) {
		//console.log(data);
		separationByTenurePeriodSelector = $("<select></select>").attr("id","separationByTenurePeriodSelector")
		.attr("class","form-control turnoverTableSelect").attr("width","220px")
		.attr("defaultValue",data.defaultValue);
		var defaultValue = $("<option></option>").attr("value",data.defaultValue)
					.text("Select Time Period").attr("disabled",true);
		$(separationByTenurePeriodSelector).append(defaultValue);
		separationByTenurePeriodDefaultValue = data.defaultValue;
		$(data.periods).each( function() {
			var thisValue = $("<option></option>").attr("value",this.periodName)
			.text(this.periodLabel);
			if ( this.periodName == data.defaultValue) {
				$(thisValue).attr("selected","selected");
			}
			$(separationByTenurePeriodSelector).append(thisValue);
		});
		//Okay, we have the selectors; add them to the page
		separationByTenurePeriodSelectorReturned = true;
		if ( separationPeriodSelectorReturned && tenurePeriodSelectorReturned ) {
			refreshTurnoverTable(tenurePeriodDefaultValue,separationPeriodDefaultValue,separationByTenurePeriodDefaultValue,"t365");
		}
	}
});


function refreshTurnoverTable(tenurePeriodSelection,separationPeriodSelection,separationByTenurePeriodSelection,turnoverRate) {
	
	var separationTableReturned = false;
	var tenureTableReturned = false;
	var separationByTenureTableReturned = false;
	//console.log("Selections are: " + tenurePeriodSelection + ", " + separationPeriodSelection + ", " + separationByTenurePeriodSelection);
	
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationtable" , 
    			period : separationPeriodSelection
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullSeparationTable = [];
    		separationPeriodLabel = data.periodLabel;
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() {
    					var allElement = {
    							filterName: "All",
    							filterValue: "All",
    							t30 : toPercent(this.t30,this.t30 + 1),
    							t60 : toPercent(this.t60,this.t60 + 1),
    							t90 : toPercent(this.t90,this.t90 + 1),
    							t180 : toPercent(this.t180,this.t180 + 1),
    							t365 : toPercent(this.t365,this.t365 + 1)
    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullSeparationTable.unshift(allElement);
    				
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
	    			$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
    							t30 : toPercent(this.t30,this.t30 + 1),
    							t60 : toPercent(this.t60,this.t60 + 1),
    							t90 : toPercent(this.t90,this.t90 + 1),
    							t180 : toPercent(this.t180,this.t180 + 1),
    							t365 : toPercent(this.t365,this.t365 + 1)
    					};
    					fullSeparationTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullSeparationTable);
			separationTableReturned = true;
			if ( tenureTableReturned && separationByTenureTableReturned ) {
				redrawTurnoverTable();
			}
    	}
    });
			

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "tenuretable" , 
    			period : tenurePeriodSelection
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullTenureTable = [];
    		tenurePeriodLabel = data.periodLabel;
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() {
    					var allElement = {
    						filterName: "All",
    						filterValue: "All",
							t0to30 : toPercent(this.t0to30,this.t0to30 + 1),
							t31to60 : toPercent(this.t31to60,this.t31to60 + 1),
							t61to90 : toPercent(this.t61to90,this.t61to90 + 1),
							t91to180 : toPercent(this.t91to180,this.t91to180 + 1),
							t181to365 : toPercent(this.t181to365,this.t181to365 + 1),
							t366plus : toPercent(this.t366plus,this.t366plus + 1),
       						n :  addCommas(this.n)
    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullTenureTable.unshift(allElement);
    				
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
	    			$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
    							t0to30 : toPercent(this.t0to30,this.t0to30 + 1),
    							t31to60 : toPercent(this.t31to60,this.t31to60 + 1),
    							t61to90 : toPercent(this.t61to90,this.t61to90 + 1),
    							t91to180 : toPercent(this.t91to180,this.t91to180 + 1),
    							t181to365 : toPercent(this.t181to365,this.t181to365 + 1),
    							t366plus : toPercent(this.t366plus,this.t366plus + 1),
           						n :  addCommas(this.n)
    					};
    					fullTenureTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullTenureTable);
			tenureTableReturned = true;
			if ( separationTableReturned && separationByTenureTableReturned ) {
				redrawTurnoverTable();
			}
    	}
    });


    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationbytenuretable" , 
    			period : separationByTenurePeriodSelection,
    			turnoverrate: turnoverRate
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullSeparationByTenureTable = [];
    		separationByTenurePeriodLabel = data.periodLabel;
    		rawSeparationByTenureTable = data.filterList;
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() { 
    					var allElement = {
    						filterName: "All",
    						filterValue: "All",
      						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
       	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
       	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
       	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
       	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
       	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
       	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullSeparationByTenureTable.unshift(allElement);
    				
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
	    			$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
          						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
           	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
           	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
           	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
           	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
           	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
           	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
    					};
    					fullSeparationByTenureTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullSeparationByTenureTable);
			separationByTenureTableReturned = true;
			if ( separationTableReturned && tenureTableReturned ) {
				redrawTurnoverTable();
			}
    	}
    });
}
    
function redrawTurnoverTable() {   

	windowAspectTurnoverTable = ( $(window).width() >= 768 ) ? "desktop" : "mobile";

	var tableContainerWidth = (windowAspectTurnoverTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -305;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}

	tableContainerHeight = $(window).height() - 111;
	tableContainerMobileHeight = "1150px";
	displayAreaHeight = $(window).height() - 51;
	displayAreaMobileHeight = "1200px";
	var movingWidth = (windowAspectTurnoverTable === "desktop") ?  tableContainerWidth - 200 : tableContainerWidth - 220;
	
	var tenureTableLength = fullTenureTable.length + 1;
	//var visibleColumns = Math.min(Math.floor(tableContainerWidth/100) - 2,tenureTableLength);
	
	var turnoverTable = $("<table></table>")
		.attr("class","table")
		.css("width",tableContainerWidth+"px")
		.css("height",tableContainerHeight+"px")
		.attr("id","turnoverTable");
	var turnoverTbody = $("<tbody></tbody>")
		.attr("id","turnoverTbody")
		.css("height",tableContainerHeight+"px")
		.css("overflow-y","scroll")
		.css("position","absolute")
		.css("width",tableContainerWidth+"px");
	$(turnoverTable).append(turnoverTbody);

	var separationFixedTable = $("<table></table>").attr("class","table").css("width","220px").attr("id","separationFixedTable");
	var separationFixedTbody = $("<tbody></tbody>").attr("id","separationFixedTbody");
	$(separationFixedTable).append(separationFixedTbody);

	var separationMovingTable = $("<table></table>").attr("class","table").css("width",movingWidth+"px").attr("id","separationMovingTable");
	var separationMovingTbody = $("<tbody></tbody>").attr("id","separationMovingTbody").css("overflow-y","visible").css("overflow-x","scroll")
						.css("width",movingWidth+"px").css("position","absolute");
	$(separationMovingTable).append(separationMovingTbody);

	var separationTitleTR = $("<tr></tr>").attr("id","separationTitleTR");
	$(separationPeriodSelector).css("line-height","14px").css("height","auto").css("padding","2px");
	var separationPeriodSelectorTD = $("<td></td>").attr("id","separationPeriodSelectorTD").html(separationPeriodSelector).css("width","300px").css("background-color","#AAAAAA").css("padding-top","5px").css("padding-bottom","4px");
	var separationTitleTD = $("<td></td>").attr("id","separationTitleTD").html('<h4 style="margin: 0px;">New Hire Turnover Rate</h4>').css("padding","3px").css("background-color","#AAAAAA").css("margin","0px").css("text-align","center").css("vertical-align","middle");//.attr("colspan",visibleColumns-1)
	$(separationTitleTR).html(separationPeriodSelectorTD).append(separationTitleTD);
	$(turnoverTbody).append(separationTitleTR);
	
	var separationSubTitleFixedTR = $("<tr></tr>").css("background-color","FFFFFF");
	var separationSecondSelectorTD = $("<td></td>").html('<h4 style="margin: 0px;">&nbsp;</h4>').css("width","120px").css("background-color","FFFFFF");
	var allTD = $("<td></td>").css("width","100px").css("text-align","center").css("background-color","FFFFFF");//.css("position","absolute").css("left","200px");//.css("background-color","#999999")//.html('<h4 style="margin: 0px;">All</h4>');
	$(separationSubTitleFixedTR).html(separationSecondSelectorTD).append(allTD);
	$(separationFixedTbody).append(separationSubTitleFixedTR);

	var separationSubTitleMovingTR = $("<tr></tr>");
	var thisFilterColumns = 1;
	var lighter = 0;
	var filterBGColor = "#FFFFFF";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		if ((fullSeparationTable[i]).filterName == thisFilterName ) {
			thisFilterColumns++;
		}
		else {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"SeparationTitleTD")
					.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'SeparationSpan">' + thisFilterName + '</span></h4>')
					.css("text-align","center").css("background-color",filterBGColor).css("border-left","1px solid #eeeeee");
				$(separationSubTitleMovingTR).append(thisFilterTitle);
			}
			thisFilterName = (fullSeparationTable[i]).filterName;
			thisFilterColumns = 1;
			lighter = 1-lighter;
		}
	}
	if ( lighter == 1){
		filterBGColor = "#FFFFFF";
	}
	else {
		filterBGColor = "#FFFFFF";
	}
	var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"SeparationTitleTD")
							.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'SeparationSpan">' + thisFilterName + '</span></h4>')
							.css("text-align","center").css("background-color",filterBGColor).css("border-left","1px solid #eeeeee");
	$(separationSubTitleMovingTR).append(thisFilterTitle);
	$(separationMovingTbody).append(separationSubTitleMovingTR);

	var separationColumnTitleFixedTR = $("<tr></tr>");
	var separationCategoryTitleTD = $("<td></td>").html("<b>Turnover Rate</b>").css("width","120px").css("height","100%").css("background-color","#FFFFFF").css("text-align","right").css("padding-right","15px");//.css("position","absolute").css("left","0px");;
	var allBlankTD = $("<td><b>All</b></td>").css("width","100px").css("background-color","#FFFFFF").css("text-align","right").css("padding-right","15px");
	$(separationColumnTitleFixedTR).html(separationCategoryTitleTD).append(allBlankTD);
	$(separationFixedTbody).append(separationColumnTitleFixedTR);

	var separationColumnTitleMovingTR = $("<tr></tr>");
	var thisFilterColumns = 1;
	var lighter = 1;
	var filterBGColor = "#FFFFFF";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var filterIsNew = false;
		if ((fullSeparationTable[i]).filterName != thisFilterName ) {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				
			}
			var newFilter = {filterName : (fullSeparationTable[i]).filterName , filterStart : i };
			separationFilterNameArray.push(newFilter);
			thisFilterName = (fullSeparationTable[i]).filterName;
			lighter = 1-lighter;
			filterIsNew = true;
		}
		var thisColumnTitleTD = $("<td></td>").attr("id",(fullSeparationTable[i]).filterValue+"TitleTD").attr("class","filterTitleTD")
		.html("<b>" + (fullSeparationTable[i]).filterValue + "</b>").css("background-color",filterBGColor).css("text-align","right").css("padding-right","15px");
//		.css("width","100px").css("text-align","center").css("white-space","nowrap").css("padding-left","15px").css("padding-right","15px");
		if ( filterIsNew == true ) {
			$(thisColumnTitleTD).css("border-left","1px solid #eeeeee");

		}
		$(separationColumnTitleMovingTR).append(thisColumnTitleTD);
	}
	separationFilterNameArray.push({filterName: "" , filterStart : fullSeparationTable.length });
	$(separationMovingTbody).append(separationColumnTitleMovingTR);

	var separationT30FixedTR = $("<tr></tr>");
	var separationT30TitleTD = $("<td></td>").html("30-Day").css("width","120px").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT30TD = $("<td></td>").html((fullSeparationTable[0]).t30).css("text-align","right").css("padding-right","15px");//.css("width","100px").css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationT30FixedTR).html(separationT30TitleTD).append(allT30TD);

	var separationT30MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var thisColumnT30TD = $("<td></td>").html((fullSeparationTable[i]).t30).attr("class","separationDataTD").css("text-align","right").css("padding-right","15px")
		//.css("background-color","#ffffff").css("width","100px").css("text-align","right").css("padding-right","30px");
		$(separationT30MovingTR).append(thisColumnT30TD);
	}

	var separationT60FixedTR = $("<tr></tr>");
	var separationT60TitleTD = $("<td></td>").html("60-Day").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT60TD = $("<td></td>").html((fullSeparationTable[0]).t60).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationT60FixedTR).html(separationT60TitleTD).append(allT60TD);

	var separationT60MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var thisColumnT60TD = $("<td></td>").html((fullSeparationTable[i]).t60).attr("class","separationDataTD").css("text-align","right").css("padding-right","15px");
							//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationT60MovingTR).append(thisColumnT60TD);
	}

	var separationT90FixedTR = $("<tr></tr>");
	var separationT90TitleTD = $("<td></td>").html("90-Day").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT90TD = $("<td></td>").html((fullSeparationTable[0]).t90).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationT90FixedTR).html(separationT90TitleTD).append(allT90TD);

	var separationT90MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var thisColumnT90TD = $("<td></td>").html((fullSeparationTable[i]).t90).attr("class","separationDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationT90MovingTR).append(thisColumnT90TD);
	}

	var separationT180FixedTR = $("<tr></tr>");
	var separationT180TitleTD = $("<td></td>").html("180-Day").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT180TD = $("<td></td>").html((fullSeparationTable[0]).t180).css("text-align","right").css("padding-right","15px");
	//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationT180FixedTR).html(separationT180TitleTD).append(allT180TD);

	var separationT180MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var thisColumnT180TD = $("<td></td>").html((fullSeparationTable[i]).t180).attr("class","separationDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationT180MovingTR).append(thisColumnT180TD);
	}

	var separationT365FixedTR = $("<tr></tr>");
	var separationT365TitleTD = $("<td></td>").html("365-Day").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT365TD = $("<td></td>").html((fullSeparationTable[0]).t365).css("font-weight", "bold").css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationT365FixedTR).html(separationT365TitleTD).append(allT365TD);

	var separationT365MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationTable.length ; i++ ) {
		var thisColumnT365TD = $("<td></td>").html((fullSeparationTable[i]).t365).attr("class","separationDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationT365MovingTR).append(thisColumnT365TD);
	}

	$(separationFixedTbody).append(separationT365FixedTR);
	$(separationFixedTbody).append(separationT180FixedTR);
	$(separationFixedTbody).append(separationT90FixedTR);
	$(separationFixedTbody).append(separationT60FixedTR);
	$(separationFixedTbody).append(separationT30FixedTR);
	
	$(separationMovingTbody).append(separationT365MovingTR);
	$(separationMovingTbody).append(separationT180MovingTR);
	$(separationMovingTbody).append(separationT90MovingTR);
	$(separationMovingTbody).append(separationT60MovingTR);
	$(separationMovingTbody).append(separationT30MovingTR);

	
	var separationSplitTR = $("<tr></tr>");
	var separationFixedTableTD = $("<td></td>").html(separationFixedTable).css("padding","0px");
	var separationMovingTableTD = $("<td></td>").html(separationMovingTable).css("padding","0px");
	$(separationSplitTR).append(separationFixedTableTD).append(separationMovingTableTD);
	$(turnoverTbody).append(separationSplitTR);

	var bufferTR = $("<tr><td colspan=2>&nbsp;</td></tr>");
	$(turnoverTbody).append(bufferTR);	

	var separationByTenureFixedTable = $("<table></table>").attr("id","separationByTenureFixedTable").attr("class","table").css("width","220px");
	var separationByTenureFixedTbody = $("<tbody></tbody>").attr("id","separationByTenureFixedTbody");
	$(separationByTenureFixedTable).append(separationByTenureFixedTbody);

	var separationByTenureMovingTable = $("<table></table>").attr("id","separationByTenureMovingTable").attr("class","table").css("width",movingWidth+"px");
	var separationByTenureMovingTbody = $("<tbody></tbody>").attr("id","separationByTenureMovingTbody").css("overflow-y","visible").css("overflow-x","scroll")
						.css("width",movingWidth+"px").css("position","absolute");
	$(separationByTenureMovingTable).append(separationByTenureMovingTbody);

	var titleTurnoverRate = "365";
	var extractedTurnoverRate = $("#turnoverRateSelector option:selected").val();
	if ( extractedTurnoverRate !== undefined && extractedTurnoverRate !== null ) {
		titleTurnoverRate = extractedTurnoverRate.substring(1);
	}

	
	var separationByTenureTitleTR = $("<tr></tr>");
	$(separationByTenurePeriodSelector).css("line-height","14px").css("height","auto").css("padding","2px");
	var separationByTenurePeriodSelectorTD = $("<td></td>").html(separationByTenurePeriodSelector)
									.css("width","200px").css("background-color","#AAAAAA")
									.css("padding-top","5px").css("padding-bottom","4px");
	var separationByTenureTitleTD = $("<td></td>").attr("id","separationByTenureTitleTD")
							.html('<h4 style="margin: 0px;">Employee Turnover Rate</h4>') 
							.css("padding","5px").css("background-color","#AAAAAA").css("margin","0px")
							.css("text-align","center").css("vertical-align","middle");
	$(separationByTenureTitleTR).html(separationByTenurePeriodSelectorTD).append(separationByTenureTitleTD);
	$(turnoverTbody).append(separationByTenureTitleTR);
	
	var separationByTenureSubTitleFixedTR = $("<tr></tr>").attr("id","separationByTenureSubTitleFixedTR");
	$(turnoverRateSelector).css("line-height","14px").css("height","auto").css("padding","2px").css("background-color","FFFFFF");
	var separationByTenureSecondSelectorTD = $("<td></td>").html(turnoverRateSelector).css("width","220px").attr("colspan",2)
												.css("padding-top","5px").css("padding-bottom","4px");
	//var allTD = $("<td></td>").css("width","100px")
	//			.css("text-align","center");
	$(separationByTenureSubTitleFixedTR).html(separationByTenureSecondSelectorTD);//.append(allTD);
	$(separationByTenureFixedTbody).append(separationByTenureSubTitleFixedTR);

	var separationByTenureSubTitleMovingTR = $("<tr></tr>").attr("id","separationByTenureSubTitleMovingTR");
	var thisFilterColumns = 1;
	var lighter = 0;
	var filterBGColor = "#80ff80";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		if ((fullSeparationByTenureTable[i]).filterName == thisFilterName ) {
			thisFilterColumns++;
		}
		else {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"SeparationByTenureTitleTD")
				.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'SeparationByTenureSpan">' + thisFilterName + '</span></h4>')
					.css("text-align","center").css("background-color",filterBGColor).css("vertical-align","middle")
					.css("border-left","1px solid #eeeeee");
				$(separationByTenureSubTitleMovingTR).append(thisFilterTitle);
			}
			thisFilterName = (fullSeparationByTenureTable[i]).filterName;
			thisFilterColumns = 1;
			lighter = 1-lighter;
		}
	}
	if ( lighter == 1){
		filterBGColor = "#FFFFFF";
	}
	else {
		filterBGColor = "#FFFFFF";
	}
	var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"SeparationByTenureTitleTD")
	.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'SeparationByTenureSpan">' + thisFilterName + '</span></h4>')
	.css("text-align","center").css("background-color",filterBGColor).css("vertical-align","middle")
	.css("border-left","1px solid #eeeeee");
	$(separationByTenureSubTitleMovingTR).append(thisFilterTitle);
	$(separationByTenureMovingTbody).append(separationByTenureSubTitleMovingTR);

	var separationByTenureColumnTitleFixedTR = $("<tr></tr>");
	var separationByTenureCategoryTitleTD = $("<td></td>").html("<b>Tenure (Days)</b>").css("text-align","right").css("padding-right","15px");//.css("width","120px").css("background-color","#FFFFFF");//.css("position","absolute").css("left","0px");;
	var allBlankTD = $("<td><b>All</b></td>").css("width","100px").css("background-color","#FFFFFF").css("text-align","right").css("padding-right","15px");
	$(separationByTenureColumnTitleFixedTR).html(separationByTenureCategoryTitleTD).append(allBlankTD);
	$(separationByTenureFixedTbody).append(separationByTenureColumnTitleFixedTR);

	var separationByTenureColumnTitleMovingTR = $("<tr></tr>");
	var thisFilterColumns = 1;
	var lighter = 1;
	var filterBGColor = "#FFFFFF";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var filterIsNew = false;
		if ((fullSeparationByTenureTable[i]).filterName != thisFilterName ) {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				
			}
			var newFilter = {filterName : (fullSeparationByTenureTable[i]).filterName , filterStart : i };
			separationByTenureFilterNameArray.push(newFilter);
			thisFilterName = (fullSeparationByTenureTable[i]).filterName;
			filterIsNew = true;
			lighter = 1-lighter;
		}
		var thisColumnTitleTD = $("<td></td>").attr("id",(fullSeparationByTenureTable[i]).filterValue+"SeparationByTenureTitleTD").attr("class","filterTitleTD")
								.html("<b>" + (fullSeparationByTenureTable[i]).filterValue + "</b>")
								.css("width","100px").css("background-color",filterBGColor).css("text-align","right").css("padding-right","15px");
								//.css("text-align","center").css("white-space","nowrap").css("padding-left","15px").css("padding-right","15px");
		
		if ( filterIsNew == true ) {
			$(thisColumnTitleTD).css("border-left","1px solid #eeeeee");

		}
	
		$(separationByTenureColumnTitleMovingTR).append(thisColumnTitleTD);
	}
	separationByTenureFilterNameArray.push({filterName: "" , filterStart : fullTenureTable.length });
	$(separationByTenureMovingTbody).append(separationByTenureColumnTitleMovingTR);

	var separationByTenureT0To30FixedTR = $("<tr></tr>");
	var separationByTenureT0To30TitleTD = $("<td></td>").html("0-30").css("width","120px").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT0To30TD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation0to30).css("text-align","right").css("padding-right","15px");
					//.css("width","100px").css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT0To30FixedTR).html(separationByTenureT0To30TitleTD).append(allT0To30TD);

	var separationByTenureT0To30MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT0To30TD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation0to30).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("width","100px").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT0To30MovingTR).append(thisColumnT0To30TD);
	}

	var separationByTenureT31To60FixedTR = $("<tr></tr>");
	var separationByTenureT31To60TitleTD = $("<td></td>").html("31-60").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT31To60TD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation31to60).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT31To60FixedTR).html(separationByTenureT31To60TitleTD).append(allT31To60TD);

	var separationByTenureT31To60MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT31To60TD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation31to60).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
							//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT31To60MovingTR).append(thisColumnT31To60TD);
	}

	var separationByTenureT61To90FixedTR = $("<tr></tr>");
	var separationByTenureT61To90TitleTD = $("<td></td>").html("61-90").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT61To90TD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation61to90).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT61To90FixedTR).html(separationByTenureT61To90TitleTD).append(allT61To90TD);

	var separationByTenureT61To90MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT61To90TD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation61to90).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT61To90MovingTR).append(thisColumnT61To90TD);
	}

	var separationByTenureT91To180FixedTR = $("<tr></tr>");
	var separationByTenureT91To180TitleTD = $("<td></td>").html("91-180").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT91To180TD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation91to180).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT91To180FixedTR).html(separationByTenureT91To180TitleTD).append(allT91To180TD);

	var separationByTenureT91To180MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT91To180TD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation91to180).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT91To180MovingTR).append(thisColumnT91To180TD);
	}

	var separationByTenureT181To365FixedTR = $("<tr></tr>");
	var separationByTenureT181To365TitleTD = $("<td></td>").html("181-365").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT181To365TD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation181to365).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT181To365FixedTR).html(separationByTenureT181To365TitleTD).append(allT181To365TD);

	var separationByTenureT181To365MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT181To365TD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation181to365).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT181To365MovingTR).append(thisColumnT181To365TD);
	}

	var separationByTenureT366PlusFixedTR = $("<tr></tr>");
	var separationByTenureT366PlusTitleTD = $("<td></td>").html("Over 365").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT366PlusTD = $("<td></td>").html((fullSeparationByTenureTable[0]).separation366plus).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(separationByTenureT366PlusFixedTR).html(separationByTenureT366PlusTitleTD).append(allT366PlusTD);

	var separationByTenureT366PlusMovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnT366PlusTD = $("<td></td>").html((fullSeparationByTenureTable[i]).separation366plus).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureT366PlusMovingTR).append(thisColumnT366PlusTD);
	}

	var separationByTenureAllFixedTR = $("<tr></tr>").attr("id","separationByTenureAllFixedTR");
	var separationByTenureAllTitleTD = $("<td></td>").html("Average").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allAllTD = $("<td></td>").html((fullSeparationByTenureTable[0]).separationAll).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("font-weight","bold").css("text-align","right").css("padding-right","30px");
	$(separationByTenureAllFixedTR).html(separationByTenureAllTitleTD).append(allAllTD);


	var separationByTenureAllMovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullSeparationByTenureTable.length ; i++ ) {
		var thisColumnAllTD = $("<td></td>").html((fullSeparationByTenureTable[i]).separationAll).attr("class","separationByTenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(separationByTenureAllMovingTR).append(thisColumnAllTD);
	}

	$(separationByTenureFixedTbody).append(separationByTenureAllFixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT0To30FixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT31To60FixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT61To90FixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT91To180FixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT181To365FixedTR);
	$(separationByTenureFixedTbody).append(separationByTenureT366PlusFixedTR);

	$(separationByTenureMovingTbody).append(separationByTenureAllMovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT0To30MovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT31To60MovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT61To90MovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT91To180MovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT181To365MovingTR);
	$(separationByTenureMovingTbody).append(separationByTenureT366PlusMovingTR);
	
	var separationByTenureSplitTR = $("<tr></tr>").attr("id","separationByTenureSplitTR");
	var separationByTenureFixedTableTD = $("<td></td>").html(separationByTenureFixedTable).css("padding","0px");
	var separationByTenureMovingTableTD = $("<td></td>").html(separationByTenureMovingTable).css("padding","0px");
	$(separationByTenureSplitTR).append(separationByTenureFixedTableTD).append(separationByTenureMovingTableTD);
	$(turnoverTbody).append(separationByTenureSplitTR);

	
	
	var bufferTR = $("<tr><td colspan=2>&nbsp;</td></tr>");
	$(turnoverTbody).append(bufferTR);

	
	var tenureFixedTable = $("<table></table>").attr("id","tenureFixedTable").attr("class","table").css("width","220px");
	var tenureFixedTbody = $("<tbody></tbody>").attr("id","tenureFixedTbody");
	$(tenureFixedTable).append(tenureFixedTbody);

	var tenureMovingTable = $("<table></table>").attr("id","tenureMovingTable").attr("class","table").css("width",movingWidth+"px");
	var tenureMovingTbody = $("<tbody></tbody>").attr("id","tenureMovingTbody").css("overflow-y","visible").css("overflow-x","scroll")
						.css("width",movingWidth+"px").css("position","absolute");
	$(tenureMovingTable).append(tenureMovingTbody);

	var tenureTitleTR = $("<tr></tr>");
	$(tenurePeriodSelector).css("line-height","14px").css("height","auto").css("padding","2px");
	var tenurePeriodSelectorTD = $("<td></td>").html(tenurePeriodSelector).css("width","300px").css("background-color","#AAAAAA").css("padding-top","5px").css("padding-bottom","4px");
	var tenureTitleTD = $("<td></td>").attr("id","tenureTitleTD").html('<h4 style="margin: 0px;">Distribution of Employee Tenure</h4>').css("padding","5px").css("background-color","#AAAAAA").css("margin","0px").css("text-align","center").css("vertical-align","middle");
	$(tenureTitleTR).html(tenurePeriodSelectorTD).append(tenureTitleTD);
	$(turnoverTbody).append(tenureTitleTR);
	
	var tenureSubTitleFixedTR = $("<tr></tr>");
	var tenureSecondSelectorTD = $("<td></td>").html('<h4 style="margin: 0px;">&nbsp;</h4>').css("width","120px");
	var allTD = $("<td></td>").css("width","100px").css("text-align","center");
	$(tenureSubTitleFixedTR).html(tenureSecondSelectorTD).append(allTD);
	$(tenureFixedTbody).append(tenureSubTitleFixedTR);

	var tenureSubTitleMovingTR = $("<tr></tr>");
	var thisFilterColumns = 1;
	var lighter = 0;
	var filterBGColor = "#FFFFFF";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		if ((fullTenureTable[i]).filterName == thisFilterName ) {
			thisFilterColumns++;
		}
		else {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"TenureTitleTD")
				.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'TenureSpan">' + thisFilterName + '</span></h4>').css("text-align","right").css("padding-right","15px")
					//.css("text-align","center")
					.css("background-color",filterBGColor).css("border-left","1px solid #eeeeee");
				$(tenureSubTitleMovingTR).append(thisFilterTitle);
			}
			thisFilterName = (fullTenureTable[i]).filterName;
			thisFilterColumns = 1;
			lighter = 1-lighter;
		}
	}
	if ( lighter == 1){
		filterBGColor = "#FFFFFF";
	}
	else {
		filterBGColor = "#FFFFFF";
	}
	var thisFilterTitle = $("<td></td>").attr("colspan",thisFilterColumns).attr("id",thisFilterName+"TenureTitleTD")
	.html('<h4 style="margin: 0px;"><span id="' + thisFilterName + 'TenureSpan">' + thisFilterName + '</span></h4>')
	.css("text-align","center").css("background-color",filterBGColor).css("border-left","1px solid #eeeeee");
	$(tenureSubTitleMovingTR).append(thisFilterTitle);
	$(tenureMovingTbody).append(tenureSubTitleMovingTR);

	var tenureColumnTitleFixedTR = $("<tr></tr>");
	var tenureCategoryTitleTD = $("<td></td>").html("<b>Tenure (Days)</b>").css("background-color","#FFFFFF").css("text-align","right").css("padding-right","15px");
	var allBlankTD = $("<td><b>All</b></td>").css("background-color","#FFFFFF").css("text-align","right").css("padding-right","15px");
	$(tenureColumnTitleFixedTR).html(tenureCategoryTitleTD).append(allBlankTD);
	$(tenureFixedTbody).append(tenureColumnTitleFixedTR);

	var tenureColumnTitleMovingTR = $("<tr></tr>");
	var thisFilterColumns = 1;
	var lighter = 1;
	var filterBGColor = "#FFFFFF";
	var thisFilterName = "";
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var filterIsNew = false;
		if ((fullTenureTable[i]).filterName != thisFilterName ) {
			if ( thisFilterName != "" ) {
				if ( lighter == 1){
					filterBGColor = "#FFFFFF";
				}
				else {
					filterBGColor = "#FFFFFF";
				}
				
			}
			var newFilter = {filterName : (fullTenureTable[i]).filterName , filterStart : i };
			tenureFilterNameArray.push(newFilter);
			thisFilterName = (fullTenureTable[i]).filterName;
			lighter = 1-lighter;
			filterIsNew = true;
		}
		var thisColumnTitleTD = $("<td></td>").attr("id",(fullTenureTable[i]).filterValue+"TenureTitleTD").attr("class","filterTitleTD")
								.html("<b>" + (fullTenureTable[i]).filterValue + "</b>")
								.css("width","100px").css("background-color",filterBGColor).css("text-align","right").css("padding-right","15px");
								//.css("text-align","center").css("white-space","nowrap").css("padding-left","15px");//.css("padding-right","15px");
		if ( filterIsNew == true ) {
			$(thisColumnTitleTD).css("border-left","1px solid #eeeeee");

		}
		$(tenureColumnTitleMovingTR).append(thisColumnTitleTD);
	}
	tenureFilterNameArray.push({filterName: "" , filterStart : fullTenureTable.length });
	$(tenureMovingTbody).append(tenureColumnTitleMovingTR);

	var tenureT0To30FixedTR = $("<tr></tr>");
	var tenureT0To30TitleTD = $("<td></td>").html("0-30").css("width","120px").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT0To30TD = $("<td></td>").html((fullTenureTable[0]).t0to30).css("text-align","right").css("padding-right","15px");
					//.css("width","100px").css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT0To30FixedTR).html(tenureT0To30TitleTD).append(allT0To30TD);
	$(tenureFixedTbody).append(tenureT0To30FixedTR);

	var tenureT0To30MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT0To30TD = $("<td></td>").html((fullTenureTable[i]).t0to30).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("width","100px").css("text-align","right").css("padding-right","30px");
		$(tenureT0To30MovingTR).append(thisColumnT0To30TD);
	}
	$(tenureMovingTbody).append(tenureT0To30MovingTR);

	var tenureT31To60FixedTR = $("<tr></tr>");
	var tenureT31To60TitleTD = $("<td></td>").html("31-60").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT31To60TD = $("<td></td>").html((fullTenureTable[0]).t31to60).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT31To60FixedTR).html(tenureT31To60TitleTD).append(allT31To60TD);
	$(tenureFixedTbody).append(tenureT31To60FixedTR);

	var tenureT31To60MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT31To60TD = $("<td></td>").html((fullTenureTable[i]).t31to60).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
							//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(tenureT31To60MovingTR).append(thisColumnT31To60TD);
	}
	$(tenureMovingTbody).append(tenureT31To60MovingTR);

	var tenureT61To90FixedTR = $("<tr></tr>");
	var tenureT61To90TitleTD = $("<td></td>").html("61-90").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT61To90TD = $("<td></td>").html((fullTenureTable[0]).t61to90).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT61To90FixedTR).html(tenureT61To90TitleTD).append(allT61To90TD);
	$(tenureFixedTbody).append(tenureT61To90FixedTR);

	var tenureT61To90MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT61To90TD = $("<td></td>").html((fullTenureTable[i]).t61to90).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(tenureT61To90MovingTR).append(thisColumnT61To90TD);
	}
	$(tenureMovingTbody).append(tenureT61To90MovingTR);

	var tenureT91To180FixedTR = $("<tr></tr>");
	var tenureT91To180TitleTD = $("<td></td>").html("91-180").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT91To180TD = $("<td></td>").html((fullTenureTable[0]).t91to180).css("text-align","right").css("padding-right","15px");
					//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT91To180FixedTR).html(tenureT91To180TitleTD).append(allT91To180TD);
	$(tenureFixedTbody).append(tenureT91To180FixedTR);

	var tenureT91To180MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT91To180TD = $("<td></td>").html((fullTenureTable[i]).t91to180).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(tenureT91To180MovingTR).append(thisColumnT91To180TD);
	}
	$(tenureMovingTbody).append(tenureT91To180MovingTR);

	var tenureT181To365FixedTR = $("<tr></tr>");
	var tenureT181To365TitleTD = $("<td></td>").html("181-365").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT181To365TD = $("<td></td>").html((fullTenureTable[0]).t181to365).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT181To365FixedTR).html(tenureT181To365TitleTD).append(allT181To365TD);
	$(tenureFixedTbody).append(tenureT181To365FixedTR);

	var tenureT181To365MovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT181To365TD = $("<td></td>").html((fullTenureTable[i]).t181to365).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(tenureT181To365MovingTR).append(thisColumnT181To365TD);
	}
	$(tenureMovingTbody).append(tenureT181To365MovingTR);

	var tenureT366PlusFixedTR = $("<tr></tr>");
	var tenureT366PlusTitleTD = $("<td></td>").html("Over 365").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allT366PlusTD = $("<td></td>").html((fullTenureTable[0]).t366plus).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureT366PlusFixedTR).html(tenureT366PlusTitleTD).append(allT366PlusTD);
	$(tenureFixedTbody).append(tenureT366PlusFixedTR);

	var tenureT366PlusMovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnT366PlusTD = $("<td></td>").html((fullTenureTable[i]).t366plus).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
		$(tenureT366PlusMovingTR).append(thisColumnT366PlusTD);
	}
	$(tenureMovingTbody).append(tenureT366PlusMovingTR);

	var tenureNFixedTR = $("<tr></tr>");
	var tenureNTitleTD = $("<td></td>").html("<b>Employees</b>").css("background-color","#ffffff").css("text-align","right").css("padding-right","15px");
	var allNTD = $("<td></td>").html((fullTenureTable[0]).n).css("text-align","right").css("padding-right","15px");
						//.css("background-color","#ffffff").css("text-align","right").css("padding-right","30px");
	$(tenureNFixedTR).html(tenureNTitleTD).append(allNTD);
	$(tenureFixedTbody).append(tenureNFixedTR);

	var tenureNMovingTR = $("<tr></tr>");
	for ( var i= 1 ; i < fullTenureTable.length ; i++ ) {
		var thisColumnNTD = $("<td></td>").html((fullTenureTable[i]).n).attr("class","tenureDataTD").css("text-align","right").css("padding-right","15px");
								//.css("background-color","#ffffff".css("text-align","right").css("padding-right","30px");
		$(tenureNMovingTR).append(thisColumnNTD);
	}
	$(tenureMovingTbody).append(tenureNMovingTR);

	
	
	
	var tenureSplitTR = $("<tr></tr>");
	var tenureFixedTableTD = $("<td></td>").html(tenureFixedTable).css("padding","0px");
	var tenureMovingTableTD = $("<td></td>").html(tenureMovingTable).css("padding","0px");
	$(tenureSplitTR).append(tenureFixedTableTD).append(tenureMovingTableTD);
	$(turnoverTbody).append(tenureSplitTR);

	
	

	
	turnoverTableDiv = $("<div></div>").attr("id","turnoverTableDiv")
		.css("height",tableContainerHeight).css("width",tableContainerWidth + "px").css("vertical-align","middle")
		.css("display","inline-block").css("margin-top","30px").css("margin-left","25px").css("margin-right","25px");


	var menuDiv = $("<div></div>").attr("id","menuDiv")
			.css("height","30px").attr("class","btn-group-justified");
	
	var menuItem1 = $('<a class="btn btn-default disabled">Table</a>').attr('id','turnoverTableButton');
	var menuItem2 = $('<a class="btn btn-default ">Graph</a>').attr('id','turnoverGraphButton');
	menuDiv.append(menuItem1).append(menuItem2);
	
	if ( windowAspectTurnoverTable == "desktop") {
		var displayWidth = $( window ).width() - 225;
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
   		$("#display-area").append(turnoverTableDiv).css("width",displayWidth).css("height",displayAreaHeight);
   		$("#leftbar-div").css("height",displayAreaHeight);
	}
	else {
		var displayWidth = $( window ).width();
		displayWidth = displayWidth + "px";
		$("#menuDiv").css("width",displayWidth);
		$("#display-area").html(menuDiv);
   		$("#display-area-xs").append(turnoverTableDiv).css("width",displayWidth);
   		$("#display-area-xs").css("height",displayAreaMobileHeight);
   		$("#turnoverTableDiv").css("height",tableContainerMobileHeight);
	}

	$(turnoverTableDiv).html(turnoverTable);
	
	//Equalize column widths to max.  Remember 30px padding.
	
	var maxColumnWidth = 0;
	$(".filterTitleTD").each(function() {
		if ( $(this).width() + 30 > maxColumnWidth ) {
			maxColumnWidth = $(this).width() + 30;
		}
	});
	//console.log("Maxcolumnwidth is " + maxColumnWidth);
	$(".filterTitleTD").each(function() {
		$(this).css("min-width",maxColumnWidth );
		//console.log($(this).attr("id") + " width is " + $(this).css("width"));
	});
	/*$(".separationDataTD").each(function() {
		$(this).css("min-width",maxColumnWidth );
		//console.log($(this).attr("id") + " width is " + $(this).css("width"));
	});*/
	
	//The second selector causes a height imbalance so we fix that here.
	$("#separationByTenureSubTitleMovingTR").css("height",$("#separationByTenureSubTitleFixedTR").height() + "px");
	addTurnoverTableResizeListener();
	enableTurnoverTableSelectors();
	activateTurnoverTableSelectors();
	centerSeparationFilterLabels();
	centerTenureFilterLabels();
	centerSeparationByTenureFilterLabels();

    	

}
			

function centerSeparationFilterLabels() {

	var tableContainerWidth = (windowAspectTurnoverTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -315;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var movingTableContainerWidth = tableContainerWidth - 300;
	
	var scrollPosition = $("#separationMovingTbody").scrollLeft();
	for (var i = 0 ; i < separationFilterNameArray.length - 1 ; i++  ) {
		thisFilterStart = 100*((separationFilterNameArray[i]).filterStart-1) - scrollPosition;
		thisFilterEnd = 100*((separationFilterNameArray[i+1]).filterStart-1) - scrollPosition;
		if (thisFilterEnd > 0 && thisFilterStart < movingTableContainerWidth ) {
			var textWidth = $("#" + (separationFilterNameArray[i]).filterName + "SeparationSpan").width();
			var startOnPage = Math.max(thisFilterStart , 0);
			var endOnPage = Math.min(thisFilterEnd,movingTableContainerWidth);
			var leftMargin = startOnPage - thisFilterStart + (endOnPage - startOnPage - textWidth)/2;
			$("#"+(separationFilterNameArray[i]).filterName+"SeparationTitleTD").css("text-align","left").css("padding-left",leftMargin+"px");
		}
	}
}

function centerTenureFilterLabels() {

	var tableContainerWidth = (windowAspectTurnoverTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -315;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var movingTableContainerWidth = tableContainerWidth - 300;
	
	var scrollPosition = $("#tenureMovingTbody").scrollLeft();
	for (var i = 0 ; i < tenureFilterNameArray.length - 1 ; i++  ) {
		thisFilterStart = 100*((tenureFilterNameArray[i]).filterStart-1) - scrollPosition;
		thisFilterEnd = 100*((tenureFilterNameArray[i+1]).filterStart-1) - scrollPosition;
		if (thisFilterEnd > 0 && thisFilterStart < movingTableContainerWidth ) {
			var textWidth = $("#" + (tenureFilterNameArray[i]).filterName + "TenureSpan").width();
			var startOnPage = Math.max(thisFilterStart , 0);
			var endOnPage = Math.min(thisFilterEnd,movingTableContainerWidth);
			var leftMargin = startOnPage - thisFilterStart + (endOnPage - startOnPage - textWidth)/2;
			$("#"+(tenureFilterNameArray[i]).filterName+"TenureTitleTD").css("text-align","left").css("padding-left",leftMargin+"px");
		}
	}
}

function centerSeparationByTenureFilterLabels() {

	var tableContainerWidth = (windowAspectTurnoverTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -315;
	if ( tableContainerWidth < 450 ) {
		tableContainerWidth = 450;
	}
	var movingTableContainerWidth = tableContainerWidth - 300;
	
	var scrollPosition = $("#separationByTenureMovingTbody").scrollLeft();
	for (var i = 0 ; i < separationByTenureFilterNameArray.length - 1 ; i++  ) {
		thisFilterStart = 100*((separationByTenureFilterNameArray[i]).filterStart-1) - scrollPosition;
		thisFilterEnd = 100*((separationByTenureFilterNameArray[i+1]).filterStart-1) - scrollPosition;
		if (thisFilterEnd > 0 && thisFilterStart < movingTableContainerWidth ) {
			var textWidth = $("#" + (separationByTenureFilterNameArray[i]).filterName + "SeparationByTenureSpan").width();
			var startOnPage = Math.max(thisFilterStart , 0);
			var endOnPage = Math.min(thisFilterEnd,movingTableContainerWidth);
			var leftMargin = startOnPage - thisFilterStart + (endOnPage - startOnPage - textWidth)/2;
			$("#"+(separationByTenureFilterNameArray[i]).filterName+"SeparationByTenureTitleTD").css("text-align","left").css("padding-left",leftMargin+"px");
		}
	}
}


//Only the graph/table selectors are visible during reload, the rest are 
//inside the graph and get destroyed first
function disableTurnoverTableSelectors() {
	deactivateTopbarLinks();
	$("#turnoverGraphButton").unbind("click");
	$("#turnoverGraphButton").prop("disabled",true);

}

function enableTurnoverTableSelectors() {
	activateTopbarLinks();
	$("#turnoverGraphButton").prop("disabled",false);
}

function addTurnoverTableResizeListener() {
	   $(window).off("resize");
	   $(window).resize(function() {
		var newWindowAspect = ( $(window).width() >= 768 ) ? "desktop" : "mobile";
		//console.log(windowAspectTurnoverTable + " and new is " + newWindowAspect + "</p>");

		
		if ( windowAspectTurnoverTable == "desktop" && newWindowAspect == "mobile" ) {
			//console.log("<p>Resizing to mobile</p>");
	   		//var headcountTableHolder = $("#headcountTableDiv");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area-xs").html(menuHolder);
			var turnoverTableHolder = $("#turnoverTableDiv").detach();
			$("#display-area-xs").append(turnoverTableHolder);
			$("#leftbar-div-xs").html(selectorButtonBox);
			windowAspectTurnoverTable = "mobile";
		}
		if ( windowAspectTurnoverTable != "desktop" && newWindowAspect == "desktop" ) {
			//console.log("<p>Resizing to desktop</p>");
			var menuHolder = $("#menuDiv").detach();
			$("#display-area").html(menuHolder);
			var turnoverTableHolder = $("#turnoverTableDiv").detach();
			$("#display-area").append(turnoverTableHolder);
			$("#leftbar-div").html(selectorButtonBox);
			windowAspectTurnoverTable = "desktop";
		}
		
		var tableContainerWidth = (windowAspectTurnoverTable == "mobile" ) ?  $( window ).width() - 50 : $( window ).width() -315;
		if ( tableContainerWidth < 450 ) {
			tableContainerWidth = 450;
		}

		tableContainerHeight = "1150px";
		var tableContainerMobileHeight = "1150px";
		displayAreaHeight = "1260px";
		displayAreaMobileHeight = "1260px";

				if ( windowAspectTurnoverTable == "desktop") {
			var displayWidth = $( window ).width() - 250;
			displayWidth = displayWidth + "px";
			$("#display-area").css("width",displayWidth).css("height",displayAreaHeight);
			$("#menuDiv").css("width",displayWidth);
		}
		else {
			var displayWidth = $( window ).width();
			displayWidth = displayWidth + "px";
			$("#display-area-xs").css("width",displayWidth);
			$("#menuDiv").css("width",displayWidth);

		}
		
		redrawTurnoverTable();
		adjustTopbarPadding();
	
	});
}


function activateTurnoverTableSelectors() {
	$("#separationPeriodSelector").unbind("change");
	$("#separationPeriodSelector").change(function() {
		requeryAndRefreshSeparationTable();
	});
	$("#tenurePeriodSelector").unbind("change");
	$("#tenurePeriodSelector").change(function() {
		requeryAndRefreshTenureTable();
	});
	$("#separationByTenurePeriodSelector").unbind("change");
	$("#separationByTenurePeriodSelector").change(function() {
		requeryAndRefreshSeparationByTenureTable();
	});
	$("#turnoverRateSelector").unbind("change");
	$("#turnoverRateSelector").change(function() {
		refreshSeparationByTenureTable();
	});
	$("#turnoverGraphButton").click(function() {
		$.ajax({type: "GET",url: "../resources/js/analytics/turnovergraph.js",dataType: "script"});
	});
	$("#separationMovingTbody").on("scroll",function(){
		centerSeparationFilterLabels();
	});
	$("#tenureMovingTbody").on("scroll",function(){
		centerTenureFilterLabels();
	});
	$("#separationByTenureMovingTbody").on("scroll",function(){
		centerSeparationByTenureFilterLabels();
	});

}


function requeryAndRefreshSeparationTable() {

	
	disableTurnoverTableSelectors();
	$(".separationDataTD").each(function() {
		$(this).html("&nbsp;");
	});
	displayTurnoverSubTableSpinner($("#separationMovingTable"));
	fullSeparationTable = [];

    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationtable" , 
    			period : $("#separationPeriodSelector option:selected").val()
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullSeparationTable = [];
    		separationPeriodLabel = data.periodLabel;
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() {
    					var allElement = {
    							filterName: "All",
    							filterValue: "All",
        						t30 : toPercent( this.t30 ,  this.t30 + 1),
        						t60 : toPercent( this.t60 , this.t60 + 1),
        						t90 : toPercent( this.t90 , this.t90 + 1),
        						t180 : toPercent( this.t180 , this.t180 + 1),
        						t365 : toPercent( this.t365 , this.t365 + 1)
    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullSeparationTable.unshift(allElement);
    				
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
    				$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
        						t30 : toPercent( this.t30 ,  this.t30 + 1),
        						t60 : toPercent( this.t60 , this.t60 + 1),
        						t90 : toPercent( this.t90 , this.t90 + 1),
        						t180 : toPercent( this.t180 , this.t180 + 1),
        						t365 : toPercent( this.t365 , this.t365 + 1)
    					};
    					fullSeparationTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullSeparationTable);
			redrawTurnoverTable();
    	}
    });

	
}


function requeryAndRefreshTenureTable() {

	
	disableTurnoverTableSelectors();
	$(".tenureDataTD").each(function() {
		$(this).html("&nbsp;");
	});
	displayTurnoverSubTableSpinner($("#tenureMovingTable"));
	fullTenureTable = [];
	
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "tenuretable" , 
    			period : $("#tenurePeriodSelector option:selected").val()
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullTenureTable = [];
    		tenurePeriodLabel = data.periodLabel;
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() {
    					var allElement = {
    						filterName: "All",
    						filterValue: "All",
    						t0to30 : toPercent( this.t0to30 ,  this.t0to30 + 1),
    						t31to60 : toPercent( this.t31to60 , this.t31to60 + 1),
    						t61to90 : toPercent( this.t61to90 , this.t61to90 + 1),
    						t91to180 : toPercent( this.t91to180 , this.t91to180 + 1),
    						t181to365 : toPercent( this.t181to365 , this.t181to365 + 1),
    						t366plus :  toPercent( this.t366plus , this.t366plus + 1),
       						n : addCommas(this.n)
       					    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullTenureTable.unshift(allElement);
    				
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
    				$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
        						t0to30 : toPercent( this.t0to30 ,  this.t0to30 + 1),
        						t31to60 : toPercent( this.t31to60 , this.t31to60 + 1),
        						t61to90 : toPercent( this.t61to90 , this.t61to90 + 1),
        						t91to180 : toPercent( this.t91to180 , this.t91to180 + 1),
        						t181to365 : toPercent( this.t181to365 , this.t181to365 + 1),
        						t366plus :  toPercent( this.t366plus , this.t366plus + 1),
           						n :  addCommas(this.n)
    					};
    					fullTenureTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullTenureTable);
			redrawTurnoverTable();
    	}
    });

}

function requeryAndRefreshSeparationByTenureTable() {

	
	disableTurnoverTableSelectors();
	$(".separationByTenureDataTD").each(function() {
		$(this).html("&nbsp;");
	});
	displayTurnoverSubTableSpinner($("#separationByTenureMovingTable"));
	fullSeparationByTenureTable = [];
	
    $.ajax({ type: "POST" ,
    	url: "../ReturnQuery" , 
    	data: { type : "separationbytenuretable" , 
    			period : $("#separationByTenurePeriodSelector option:selected").val(),
			  } , 
    	dataType: "json" ,
    	success: function(data) {
    		//console.log(data);
    		fullSeparationByTenureTable = [];
    		separationByTenurePeriodLabel = data.periodLabel;
    		turnoverRate = $("#turnoverRateSelector option:selected").val();
    		$(data.filterList).each( function(){
    			if ( this.filterName == "All" ) {
    				$(this.filterValues).each( function() {
    					var allElement = {
    						filterName: "All",
    						filterValue: "All",
      						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
       	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
       	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
       	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
       	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
       	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
       	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
    					};
    					//Array.prototype.unshift.apply(fullSeparationTable, allElement);
    					fullSeparationByTenureTable.unshift(allElement);
 
 
    					
    				});
    			}
    			else {
    				var currentFilterName = this.filterName;
	    			var sortedFilterValues = this.filterValues.sort(function(a,b) { return (a.filterValue).localeCompare(b.filterValue)  })
    				$(sortedFilterValues).each( function() {
    					var allElement = {
    							filterName: currentFilterName,
    							filterValue: this.filterValue,
          						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
           	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
           	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
           	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
           	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
           	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
           	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
        					};
    					fullSeparationByTenureTable.push(allElement);
    				
    				});
    				
    			}
    		});
    		//console.log(fullSeparationByTenureTable);
			redrawTurnoverTable();
    	}
    });

}


function refreshSeparationByTenureTable() {

	
	disableTurnoverTableSelectors();
	$(".separationByTenureDataTD").each(function() {
		$(this).html("&nbsp;");
	});
	displayTurnoverSubTableSpinner($("#separationByTenureMovingTable"));
	fullSeparationByTenureTable = [];
	fullSeparationByTenureTable = [];
	//console.log(rawSeparationByTenureTable);
	turnoverRate = $("#turnoverRateSelector option:selected").val();
	$(rawSeparationByTenureTable).each( function(){
		if ( this.filterName == "All" ) {
			$(this.filterValues).each( function() {
				var allElement = {
					filterName: "All",
					filterValue: "All",
						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
				};
				//Array.prototype.unshift.apply(fullSeparationTable, allElement);
				fullSeparationByTenureTable.unshift(allElement);


				
			});
		}
		else {
			var currentFilterName = this.filterName;
			$(this.filterValues).each( function() {
				var allElement = {
						filterName: currentFilterName,
						filterValue: this.filterValue,
  						separation0to30 : toPercent( this[turnoverRate + "_0to30"] , this[turnoverRate + "_0to30"]+ 1),
   	       				separation31to60 : toPercent( this[turnoverRate + "_31to60"] , this[turnoverRate + "_31to60"]+ 1) ,
   	       				separation61to90 : toPercent( this[turnoverRate + "_61to90"] , this[turnoverRate + "_61to90"]+ 1) ,
   	       				separation91to180 : toPercent( this[turnoverRate + "_91to180"] , this[turnoverRate + "_91to180"]+ 1) ,
   	       				separation181to365 : toPercent( this[turnoverRate + "_181to365"] , this[turnoverRate + "_181to365"]+ 1),
   	       				separation366plus :  toPercent( this[turnoverRate + "_366plus"] , this[turnoverRate + "_366plus"]+ 1),
   	       				separationAll :  toPercent( this[turnoverRate + "_all"] , this[turnoverRate + "_all"]+ 1)
					};
				fullSeparationByTenureTable.push(allElement);
			
			});
		}
			
	});
	
	//console.log(fullSeparationByTenureTable);
	redrawTurnoverTable();

}


function displayTurnoverSubTableSpinner(table) {
	//console.log("Applicant table file: kinda trying to speak!");
	var spinnerMargin = (windowAspectTurnoverTable == "mobile" ) ?  ($( window ).width())/2 -80 : Math.max(($( window ).width())/2 - 400,100);
	var textMargin = Math.max(spinnerMargin - 400,0);
	$("#spinnerDiv").detach();

	var spinnerDiv = $("<div></div>").attr("id","spinnerDiv")
					.css("position","relative").css("margin-left",spinnerMargin + "px").css("margin-top","0px");
	$(table).append(spinnerDiv);

	var opts = {
			lines: 13 // The number of lines to draw
			, length: 12 // The length of each line
			, width: 14 // The line thickness
			, radius: 12 // The radius of the inner circle
			, scale: 0.5 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#555555' // #rgb or #rrggbb or array of colors
			, opacity: 0.25 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '60px' // Top position relative to parent
			, left: '100px' //spinnerMargin // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
	};
	var target = document.getElementById('spinnerDiv');
	var spinner = new Spinner(opts).spin(target);
	$("#spinnerDiv").append('<h2 style="margin-top: 100px; margin-left: 0px; color: #555555;">Refreshing table....</h2>');
}


