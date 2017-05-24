var windowAspectMarketsGraph = "";
windowAspectMarketsGraph = ($(window).width() >= 768) ? "desktop" : "mobile";

var lowerBoxesHeight = $(window).height() - 51;
var lowerBoxesMobileHeight = $(window).height() - 311;

var firstGeneration = true;
var markersVisible = false;
var applicantsVisible = false;
var hiresVisible = false;
var goodHiresVisible = false;


if (lowerBoxesHeight < 627) {
	lowerBoxesHeight = 627;
}
if (lowerBoxesMobileHeight < 500) {
	lowerBoxesMobileHeight = 500;
}
$("#leftbar-div").css("height", lowerBoxesHeight + "px");
$("#display-area").css("height", lowerBoxesHeight + "px");
$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

underlineOnlyThisLink("#applicantLink");

deactivateTopbarLinks();
displayTableSpinner(windowAspectMarketsGraph);

var selectorButtonBox = $("<div></div>").attr('id', 'selectorButtonBox');

var titleDiv = $("<div></div>").attr("id","titleDiv").css("padding-bottom","10px").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF")
.html('<h2>Applicants</h2>');

var titleDescDiv = $("<div></div>").attr("id","titleDescDiv").css("background-color","#44494C").css("margin-top","0px").css("color","#FFFFFF").css("margin-bottom","15px").css("font-weight","lighter")
.html('<h4>Local labor market characteristics describe the recruitment pipeline and identify the markets for talent opportunity.</h4>');

if (linksTable.containsKey("markets") && linksTable.get("markets") === true) {
	var laborMarketButton = $("<button></button>").attr('id','laborMarketButton').attr('class', 'btn btn-default btn-block').text("Labor Markets").css("margin-bottom", "10px").css("padding", "10px").prop("disabled", true);
}

var applicantButton = $("<button></button>").attr('id', 'applicantButton').attr('class', 'btn btn-default btn-block').text("Applicants").css("margin-bottom", "10px").css("padding", "10px");

$(selectorButtonBox).append(titleDiv);
$(selectorButtonBox).append(titleDescDiv);
$(selectorButtonBox).append(applicantButton);
$(selectorButtonBox).append(laborMarketButton);

if (windowAspectMarketsGraph == "desktop") {
	$("#leftbar-div").html(selectorButtonBox);
} else {
	$("#leftbar-div-xs").html(selectorButtonBox);
}

disableMarketsGraphSelectors();

var selectorList = [];
var callCenterList = [];
var marketsRawTable = {};
var formattedTable = [];
var defaultSelectorName = "";
var defaultSelectorValue = "";
var selectorsEverDrawn = false;
var marketsGraphHashtable = new Hashtable({
	hashCode : selectionHashCode,
	equals : selectionIsEqual
});
var thisSelectionTable = [];
var selectorListReturned = false;
var graphReturned = false;
var callCenterInfo;
var callCenters = [];
var thisCity;
var cumSumOfPredictedVal;
var ceiledEightyPercentOfPredicted;

queryMarketsTableSelectors();

function queryMarketsTableSelectors() {
	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "getselectorsmarkets"
		},
		dataType : "json",
		success : function(data) {
			selectorList = data.selectorList;
			defaultSelectorName = data.defaultSelectorName;
			defaultSelectorValue = data.defaultSelectorValue;
			selectorListReturned = true;
			if (graphReturned) {
				redrawMarketsGraphSelectorBoxes();
				var selectionList = queryMarketsSelectorValues();
				refreshMarketsGraph(queryMarketsSelectorValues());
			}
		}
	});

	$.ajax({
		type : "POST",
		url : "../ReturnQuery",
		data : {
			type : "marketsgraph",
			selectorlist : selectorList,
		},
		dataType : "json",
		success : function(data) {
			marketsRawTable = data.rows;
			callCenters = data.callCenters;
			$.each(marketsRawTable, function() {
				marketsGraphHashtable
						.put(this.selectorValues, this.postalCodes);
			});
			graphReturned = true;
			if (selectorListReturned) {
				redrawMarketsGraphSelectorBoxes();
				var selectionList = queryMarketsSelectorValues();
				refreshMarketsGraph(queryMarketsSelectorValues());
			}
		}
	});

}

function redrawMarketsGraphSelectorBoxes() {
	//console.log(linksTable.entries());
	var activeSelectorsList = [];
	$(selectorList).each(function() {
		var defaultFound = false;
		var allSelected = false;

		if (this.selectorName != "Map" && this.selectorName !="Zip") {
			if (selectorsEverDrawn) {
				var usedDefaultValue = $("#" + this.selectorName+ " option:selected").val();
			} else {
				if (this.selectorName == defaultSelectorName) {
					var usedDefaultValue = defaultSelectorValue;
				} else {
					var usedDefaultValue = this.defaultValue;
					}
				}
			var thisSelector = $("<select></select>").attr("id", this.selectorName).attr("class","form-control marketsGraphSelect").attr("width", "200px").attr("defaultValue",usedDefaultValue);
			if (this.selectorName == defaultSelectorName) {
				var defaultValueHolder = defaultSelectorValue;
			} else {
				var defaultValueHolder = this.defaultValue;
				}
			var checkedSelectorName = this.selectorName;
			$(this.selectorValues).each(function() {
				var checkedSelectorValue = this.valueName;
				if (selectorsEverDrawn) {
					thisSelection = [];
					$(selectorList).each(function() {
						if (this.selectorName != checkedSelectorName) {
							thisSelection.push({selectorName : this.selectorName,selectorValue : $("#"+ this.selectorName + " option:selected").val()});
						} else {
							thisSelection.push({selectorName : checkedSelectorName,selectorValue : checkedSelectorValue});
							}
						});
					var checkedHashEntry = marketsGraphHashtable.get(thisSelection);

					var thisValue = $("<option></option>").attr("value",checkedSelectorValue).text(this.valueLabel);
					if (this.valueLabel.substring(0, 6) === "Select") {
						$(thisValue).attr("disabled",true);
						$(thisValue).prop("selected",false);
						}
					if (defaultFound === false && checkedSelectorValue == usedDefaultValue && this.valueLabel.substring(0,6) !== "Select") { // &&allSelected==false ) {
						$(thisValue).attr("selected","selected");
						$(thisValue).prop("selected",true);
						defaultFound = true;
						}
					$(thisSelector).append(thisValue);
					} else {
						var thisValue = $("<option></option>").attr("value",this.valueName).text(this.valueLabel);
						if (this.valueLabel.substring(0, 6) === "Select") {
							$(thisValue).attr("disabled",true);
							$(thisValue).prop("selected",false);
							}
						if (this.valueName == usedDefaultValue) {
							$(thisValue).attr("selected","selected");
							$(thisValue).prop("selected",true);
							}
						$(thisSelector).append(thisValue);
					}
				});
			activeSelectorsList.push(thisSelector);
			}
		});


	var titleDivDetached = $("#titleDiv").detach();
	var titleDescDivDetached = $("#titleDescDiv").detach();
	var laborMarketButtonDetached = $("#laborMarketButton").detach();
	var applicantButtonDetached = $("#applicantButton").detach();

	if (linksTable.containsKey("reports") && linksTable.get("reports") === true) {
		var reportsTableButtonDetached = $("#reportsTableButton").detach();
	}
	$(selectorButtonBox).html(titleDivDetached);
	$(selectorButtonBox).append(titleDescDivDetached);
	$(selectorButtonBox).append(applicantButtonDetached);
	$(selectorButtonBox).append(laborMarketButtonDetached);

	$.each(activeSelectorsList, function() {
		$(selectorButtonBox).append(this);
	});

	selectorsEverDrawn = true;
}

function selectionIsEqual(selection1, selection2) {
	if (selection1.length != selection2.length) {
		return false;
	}
	$(selection1).each(function() {
		var foundSelector = false;
		var checkSelectorName = this.selectorName;
		var checkSelectorValue = this.selectorValue;
		$(selection2).each(function() {
			if (checkSelectorName === this.selectorName) {
				if (checkSelectorValue !== this.selectorValue) {
					return false;
				}
				foundSelector = true;
			}
		});
		if (foundSelector == false) {
			return false;
		}
	});
	return true;

}

function selectionHashCode(selection) {
	return JSON.stringify(selection);
}

function getThisCallCenter(city) {
	var returnAttributes = [];
	
	$.each(callCenters, function() {
		var isParent = false;
		if (this.hasOwnProperty("parentLocations")) {
			$.each(this.parentLocations, function() {
				if (city.localeCompare(this) == 0) {
					isParent = true;
				}
			});
		}
		if (isParent) {
			returnAttributes.push(this);
		}
	});
	return returnAttributes;
}

function refreshMarketsGraph(selectorList) {
	firstGeneration = true;
	var modelSelected = selectorList[0]["selectorValue"];
	selectorList.splice(0, 1);
	thisCity = selectorList[0]["selectorValue"];
	callCenterInfo = getThisCallCenter(thisCity);
	thisSelectionTable = marketsGraphHashtable.get(selectorList);
	redrawMarketsGraph(modelSelected);
}

function queryMarketsSelectorValues() {
	// We've gotten rid of the time period selector, so we need to add it here.
	// var selectionList = [ {selectorName : "periodName" , selectorValue :
	// "All" } ];
	var selectionList = [];
	$(".marketsGraphSelect").each(function() {
		var selector = "#" + $(this).attr("id") + " option:selected";
		var thisSelection = {
			selectorName : $(this).attr("id"),
			selectorValue : $(selector).val()
		};
		selectionList.push(thisSelection);
	});
	return selectionList;
}

function disableMarketsGraphSelectors() {
	deactivateTopbarLinks();
	$(".marketsGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).prop("disabled", true);
	});
	$("#applicantButton").unbind();
	$("#applicantButton").prop("disabled", true);

	$("#marketsTableButton").unbind();
	$("#marketsGraphButton").unbind();
	$("#marketsTableButton").prop("disabled", true);
}

function enableMarketsGraphSelectors() {
	activateTopbarLinks();
	$(".marketsGraphSelect").each(function() {
		$(this).prop("disabled", false);
	});

	$("#applicantButton").prop("disabled", false);
	$("#marketsTableButton").prop("disabled", false);
}

function activateMarketsGraphSelectors() {
	$(".marketsGraphSelect").each(function() {
		$(this).unbind("change");
		$(this).change(function() {
			var selectorList = queryMarketsSelectorValues();
			refreshMarketsGraph(selectorList);
		});
	});

	$("#applicantButton").unbind("click");
	$("#applicantButton").click(function() {
		$.ajax({
			type : "GET",
			url : "../resources/js/analytics/applicanttable.js",
			dataType : "script"
		});
	});

	$("#marketsTableButton").unbind("click");
	$("#marketsTableButton").click(function() {
		$.ajax({
			type : "GET",
			url : "../resources/js/analytics/marketstable.js",
			dataType : "script"
		});
	});

	$("#marketsGraphButton").unbind("click");

}

function redrawMarketsGraph(modelSelected) {
	var citymap = {};
	var i = 0;
	
	var sortedSelectionTable = thisSelectionTable.slice(0);

	if (modelSelected == 'Good Hires') {
		var sorto = {
			predictedGoodHires : "desc"
		};
	} else if (modelSelected == 'Hires') {
		var sorto = {
			predictedHires : "desc"
		};
	} else {
		var sorto = {
			predictedApplicants : "desc"
		};
	}
	sortedSelectionTable.keySort(sorto);

	var totalPredicted = 0;
	$(sortedSelectionTable).each(function(index) {
		if(modelSelected == "Applicant"){
			totalPredicted +=this.predictedApplicants;
		} 
		else if(modelSelected == "Hires"){
			totalPredicted +=this.predictedHires
			}
		else{
			totalPredicted +=this.predictedGoodHires;
			}
	});
	var eightyPercentOfPredicted=Math.round(totalPredicted*0.8);
	
	ceiledEightyPercentOfPredicted = 0;
	totalPredicted=0;
	$(sortedSelectionTable).each(function(index) {
		if(modelSelected == "Applicant"){
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
				totalPredicted +=this.predictedApplicants;
				}
		} 
		else if(modelSelected == "Hires"){
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
			totalPredicted +=this.predictedHires;}
			}
		else{
			if(totalPredicted!=eightyPercentOfPredicted && totalPredicted<eightyPercentOfPredicted){
			totalPredicted +=this.predictedGoodHires;
			}
			}
	});
	ceiledEightyPercentOfPredicted=totalPredicted;		
	
	
	
	$.each(sortedSelectionTable, function() {
		citymap[++i] = {
			zip : this.postalCode,
			center : {
				lat : this.latitude,
				lng : this.longitude
			},
			r_app : this.actualApplicants,
			r_hires : this.actualHires,
			r_good : this.actualGoodHires,
			p_app : this.predictedApplicants,
			p_hires : this.predictedHires,
			p_good : this.predictedGoodHires,
			travelTime : this.traveltime,
			LaborForce : this.laborforce,
			t30rate : this.t30rate.toFixed(0) + "%",
			tcompetitors : this.totalcompetitors,
			saturation : this.saturation.toFixed(0) + "%",
			app_ref : (this.appliedreferred * 100).toFixed(0),
			hire_ref : (this.hiredreferred * 100).toFixed(0),
			ghire_ref : (this.ghirereferred * 100).toFixed(0),
			bad_hires : (this.t30rate * this.actualHires / 100).toFixed(0),
			under25 : this.under25 * 100,
			between25and50 : this.between25and50 * 100
		};
	});

	var chartContainerWidth = (windowAspectMarketsGraph == "mobile") ? $(window)
			.width() - 50
			: $(window).width() - 300;
	if (chartContainerWidth < 400) {
		chartContainerWidth = 400;
	}
	var chartWidth = (windowAspectMarketsGraph == "mobile") ? chartContainerWidth - 100
			: chartContainerWidth / 2 - 100;
	var lowerBoxesHeight = $(window).height() - 51;
	var lowerBoxesMobileHeight = $(window).height() - 311;

	if (lowerBoxesHeight < 627) {
		lowerBoxesHeight = 627;
	}
	if (lowerBoxesMobileHeight < 1000) {
		lowerBoxesMobileHeight = 1000;
	}
	var chartContainerHeight = (windowAspectMarketsGraph == "mobile") ? (lowerBoxesMobileHeight - 250) / 2: lowerBoxesHeight - 175;
	$("#menuDiv").detach();

	var menuDiv = $("<div></div>").attr("id", "menuDiv").css("height", "30px").css("width", chartContainerWidth + 20).attr("class","btn-group-justified");

	var menuItem2 = $('<a class="btn btn-default disabled">Map</a>').attr('id','marketsGraphButton');
	var menuItem1 = $('<a class="btn btn-default ">Table</a>').attr('id','marketsTableButton');
	menuDiv.append(menuItem1).append(menuItem2);

	var marketsGraphDiv = $("<div></div>").attr("id", "marketsGraphDiv").css("position", "absolute").css("top", "38px").css("left", "2.5%").css("z-index", "5").css("background-color", "#fff").css("border","1px solid #999").css("text-align", "center").css("font-family","Roboto,sans-serif").css("line-height", "30px").css("height", "95%").css("width", "95%");

	var panel = $("<div></div>").attr("id", "floatingPanel").css("position","absolute").css("top", "10px").css("left", "35%").css("z-index","5").css("background-color", "#fff").css("padding","0 10px 4px 10px").css("border", "1px solid #888").css("text-align", "center").css("font-family", "Roboto','sans-serif'").css("line-height", "30px").css("padding-left", "10px");

	var map = $("<div></div>").attr("id", "map").css("height", "100%").css("width", "100%");

	var toggleMarkersButton = $("<button type='button'> Markers </button>").attr("id", "toggleMarkersButton").attr('onclick','toggleMarkers()').attr('class', 'btn btn-default').attr("data-toggle", "button").css("margin-right", "8px").css("outline", "none").css("font-size", "12px").css("padding","0 10px 0 10px");
	var predictedButton = $("<input type=button value='Predicted' />").attr("id", "predictedButton").attr('onclick', 'togglePredictedCircle()').attr('class', 'btn btn-default').attr("data-toggle", "button").css("margin-right", "8px").css("outline", "none").css("font-size", "12px").css("padding","0 10px 0 10px");
	var actualButton = $("<input type=button value='Historical' />").attr("id", "actualButton").attr('onclick', 'toggleActualCircle()').attr('class', 'btn btn-default').attr("data-toggle", "button").css("margin-right", "8px").css("outline", "none").css("font-size", "12px").css("padding","0 10px 0 10px");

	$(panel).append(predictedButton);
	$(panel).append(actualButton);
	$(panel).append(toggleMarkersButton);

	// Attach first, otherwise AmCharts won't work....
	if (windowAspectMarketsGraph == "desktop") {
		$(marketsGraphDiv).append(panel);
		$(marketsGraphDiv).append(map);
		$("#display-area").html(menuDiv);
		$("#display-area").append(marketsGraphDiv);
	} else {
		$(marketsGraphDiv).append(panel);
		$(marketsGraphDiv).append(map);
		$("#display-area-xs").html(menuDiv);
		$("#display-area-xs").append(marketsGraphDiv);
	}
	var displayWidth = $(window).width() - 250;
	displayWidth = displayWidth + "px";
	$("#display-area").css("width", displayWidth);
	$("#leftbar-div").css("height", lowerBoxesHeight + "px");
	$("#display-area").css("height", lowerBoxesHeight + "px");
	$("#display-area-xs").css("height", lowerBoxesMobileHeight + "px");

	cumSumOfPredictedVal=0;
	$(map).html(initMap(modelSelected, citymap));
	if (firstGeneration) {
		firstGeneration = false;
		markersVisible = false;
		togglePredictedCircle();
		toggleActualCircle();
		setMapOnAll(false);
	}

	redrawMarketsGraphSelectorBoxes();
	addMarketsResizeListener(modelSelected);
	enableMarketsGraphSelectors();
	activateMarketsGraphSelectors();

}

function addMarketsResizeListener(modelselected) {
	$(window).off("resize");
	$(window).resize(function() {
		var localMarketsChartHolder, localSelectorButtonBox;
		var newWindowAspect = ($(window).width() >= 768) ? "desktop": "mobile";

		if (windowAspectMarketsGraph == "desktop" && newWindowAspect == "mobile") {
			localMarketsChartHolder = $("#marketsChartTable").detach();
			localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area-xs").append(localMarketsChartHolder);
			$("#leftbar-div-xs").html(localSelectorButtonBox);
				windowAspectMarketsGraph = "mobile";
		}
		if (windowAspectMarketsGraph != "desktop" && newWindowAspect == "desktop") {
			localMarketsChartHolder = $("#marketsChartTable").detach();
			localSelectorButtonBox = $("#selectorButtonBox").detach();
			$("#display-area").append(localMarketsChartHolder);
			$("#leftbar-div").html(localSelectorButtonBox);
			windowAspectMarketsGraph = "desktop";
		}
		var chartContainerWidth = (windowAspectMarketsGraph == "mobile") ? $(window).width() - 50 : $(window).width() - 300;
		if (chartContainerWidth < 400) {
			chartContainerWidth = 400;
		}
		var chartWidth = (windowAspectMarketsGraph == "mobile") ? chartContainerWidth - 100 : chartContainerWidth / 2 - 100;
		var lowerBoxesHeight = $(window).height() - 51;
		var lowerBoxesMobileHeight = $(window).height() - 311;
		
		if (lowerBoxesHeight < 500) {
			lowerBoxesHeight = 500;
		}
		if (lowerBoxesMobileHeight < 1000) {
			lowerBoxesMobileHeight = 1000;
		}
		var chartContainerHeight = (windowAspectMarketsGraph == "mobile") ? (lowerBoxesMobileHeight - 250) / 2 : lowerBoxesHeight - 175;
		$("#leftbar-div").css("height", lowerBoxesHeight + "px");
		$("#display-area").css("height",lowerBoxesHeight + "px");
		$("#display-area-xs").css("height",lowerBoxesMobileHeight + "px");
		$("#marketsChartTable").css("width",chartContainerWidth);
		$("#marketsChartDiv").css("width", chartWidth + "px");
		$("#marketsChartTR").css("height",chartContainerHeight + "px");
		$("#rocChartTR").css("height",chartContainerHeight + "px");
		$("#marketsChartTD").css("height",chartContainerHeight + "px");
		$("#rocChartTD").css("height",chartContainerHeight + "px");
		$("#marketsChartDiv").css("height",chartContainerHeight + "px");
		$("#rocChartDiv").css("height",chartContainerHeight + "px");
		
		var displayWidth = $(window).width() - 250;
		displayWidth = displayWidth + "px";
		$("#display-area").css("width", displayWidth);

		redrawMarketsGraph(modelselected);
						
		restoreMarkers();
		restorePredictedCircles();
		restoreActualCircles();
	});
};

// var lastOpenedInfoWindow = false;
	var markers = [];
	var actualCircles = [];
	var predictedCircles = [];

function initMap(modelSelected, citymap) {
	actualCircles=[];
	predictedCircles=[];
	
	var meanlong = 0.0;
	var meanlat = 0.0;
	var cnt = 0;
	var citycenter;
	var queryCondition = "ZIP IN (";

	for ( var city in citymap) {
		citycenter = citymap[city]["center"];
		if (citycenter["lat"] != -1 && citycenter["lat"] != -1) {
			meanlat = meanlat + citycenter["lat"];
			meanlong = meanlong + citycenter["lng"];
			cnt = cnt + 1;
		}
	}

	var latlng = new google.maps.LatLng(meanlat / cnt, meanlong / cnt);
	// Create the map.
	map = new google.maps.Map(document.getElementById('map'), {
		zoom : 10,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});

	var callicon = {
		url : "../resources/img/analytics/business1.png",
		//scaledSize : new google.maps.Size(32, 37)
		scaledSize : new google.maps.Size(33, 50)
	};

	for ( var city in citymap) {
		var icon;
		var predictedradius;
		var actualradius;

			icon = {
				url : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
				scaledSize : new google.maps.Size(30, 30)
			};
			
				predictedradius = modelSelected=="Good Hires"? (Math.sqrt(Math.abs(citymap[city].p_good)) * 500):modelSelected=="Hires"?(Math.sqrt(Math.abs(citymap[city].p_hires)) * 400):(Math.sqrt(Math.abs(citymap[city].p_app)) * 200);
				actualradius = modelSelected=="Good Hires"? (Math.sqrt(Math.abs(citymap[city].r_good)) * 500):modelSelected=="Hires"?(Math.sqrt(Math.abs(citymap[city].r_hires)) * 400):(Math.sqrt(Math.abs(citymap[city].r_app)) *200);
			
			var predictedVal = modelSelected=="Good Hires"? citymap[city].p_good :modelSelected=="Hires"?citymap[city].p_hires:citymap[city].p_app;

			cumSumOfPredictedVal+= predictedVal;
			
			if(cumSumOfPredictedVal<=ceiledEightyPercentOfPredicted){
				colorPredicted = '#0DB100';//green
				colorActual='#E87506';//orange

			}else{
				colorPredicted = '#44494C';//grey
				colorActual='#E87506';//orange

			}		
			/*if (citymap[city].index<=20) {
				//color1 = '#ffffff';//green
				colorPredicted = '#02955D';//light green
				//color3='#ffffff';//white
				colorActual='#E87506';//grey
			} else {
				//color1 = '#44494C';//dark grey
				colorPredicted = '#44494C';//grey
				//color3='#ffffff';//white
				colorActual='#E87506';//grey
			}*/
			var actualCircle = new google.maps.Circle({
				strokeColor : colorActual,
				strokeOpacity : 1,
				strokeWeight : 2,
				fillColor : '#ffffff',
				fillOpacity : 0,
				map : map,
				center : new google.maps.LatLng((citymap[city]["center"])["lat"],
						(citymap[city]["center"])["lng"]),
				radius : actualradius
			});
			var predictedCircle = new google.maps.Circle({
				strokeColor : colorPredicted,
				strokeOpacity : 0.1,
				strokeWeight : 2,
				fillColor : colorPredicted,
				fillOpacity : 0.5,
				map : map,
				center : new google.maps.LatLng((citymap[city]["center"])["lat"],
						(citymap[city]["center"])["lng"]),
				radius : predictedradius
			});

		var marker = new google.maps.Marker({
			position : new google.maps.LatLng((citymap[city]["center"])["lat"],
					(citymap[city]["center"])["lng"]),
			icon : icon,
			map : map,
			zIndex : google.maps.Marker.MAX_ZINDEX
		});

		if (citymap[city].TravelTime != 0) {
			queryCondition = queryCondition + citymap[city].zip + ",";
			markers.push(marker);
			createInfowindow(citymap, city, marker, modelSelected, colorPredicted,actualCircle, predictedCircle);
			actualCircles.push(actualCircle);
			predictedCircles.push(predictedCircle);

		}
	}

	for ( var i in callCenterInfo) {
		var callmarker = new google.maps.Marker({
			position : new google.maps.LatLng({
				lat : callCenterInfo[i].lat,
				lng : callCenterInfo[i].lng
			}),
			icon : callicon,
			map : map,
			zIndex : google.maps.Marker.MAX_ZINDEX + 1
		});
		createMapInfo(map, callmarker, callCenterInfo[i]);
	}

	queryCondition = queryCondition.slice(0, -1);
	queryCondition = queryCondition + ")";

	var layer = new google.maps.FusionTablesLayer({
		query : {
			select : 'geometry',
			from : '1Lae-86jeUDLmA6-8APDDqazlTOy1GsTXh28DAkw',
			where : queryCondition
		},
		styles : [ {
			polygonOptions : {
				fillColor : '#FFFFFF',
				fillOpacity : 0.2,
				clickable : false
			}
		} ],
		suppressInfoWindows : true
	});
	layer.setMap(map);
}

function createMapInfo(citymap, marker, callCenterInfo) {
	var contentString = '<div style="line-height: 20px;text-align:left">'
			+ '<div style="border-bottom-style:solid;font-size:16px"><b>Location:<div style="float:right;padding-left:40px;">'
			+ callCenterInfo.location
			+ '</b></div></div>'
			+ '<b>Average Headcount in Past Year</b><div style="float:right;padding-left:20px;"> '
			+ addCommas(callCenterInfo.averageHeadcount)
			+ '</div><br>'
			+ '<b>Hires Per Month</b><div style="float:right;padding-left:20px;"> '
			+ callCenterInfo.hiresPerMonth
			+ '</div><br>'
			+ '<b>30-Day Turnover Rate</b><div style="float:right;padding-left:20px;"> '
			+ (callCenterInfo.t30Rate * 100).toFixed(0)
			+ '%</div><br>'
			+ '<b>90-Day Turnover Rate</b><div style="float:right;padding-left:20px;"> '
			+ (callCenterInfo.t90Rate * 100).toFixed(0) + '%</div><br>'
			+ '</div>';

	var infowindow = new google.maps.InfoWindow({
		maxWidth : 250,
		position : marker.getPosition(),
	});

	google.maps.event.addListener(marker, 'click', (function(marker) {
		return function() {
			/*
			 * if (lastOpenedInfoWindow) { lastOpenedInfoWindow.close(); }
			 */
			infowindow.setContent(contentString);
			// lastOpenedInfoWindow = infowindow;

			infowindow.open(map, this);

		}
	})(marker));
}

function createInfowindow(citymap, city, marker, modelSelected, oppColor,actualCircle, predictedCircle) {
		var contentString = '<div style="line-height: 20px;text-align:left">'
				+'<div style="border-bottom-style:solid;font-size:16px"><b>Zipcode<div style="float:right;padding-left:40px;">'
				+ citymap[city].zip
				+ '</b></div></div>'
				+ '<b>Applicants</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].r_app
				+ '</div><br>'
				+ '<b>Hires</b><div style="float:right;padding-left:40px;">'
				+ citymap[city].r_hires
				+ '</div><br>'
				+ '<b>Good Hires</b><div style="float:right;padding-left:40px;">'
				+ citymap[city].r_good
				+ '</div><br>'
				+ '<b>Bad Hires</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].bad_hires
				+ '</div><br>'
				+ '<b>30-Day Turnover Rate</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].t30rate
				+ '</div><br>'
				+ '<b>Travel Time</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].travelTime
				+ ' min</div><br>'
				+ '<b>Labor Force</b> <div style="float:right;padding-left:40px;">'
				+ addCommas(citymap[city].LaborForce)
				+ ' </div><br>'
				+ '<b>Saturation</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].saturation
				+ '</div><br>'
				+ '<b>Competitor Seats</b><div style="float:right;padding-left:40px;"> '
				+ addCommas(citymap[city].tcompetitors)
				+ '</div><br>'
				+ '<b>Income Under $25k</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].under25.toFixed(0)
				+ "%"
				+ '</div><br>'
				+ '<b>Income $25k-$50k</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].between25and50.toFixed(0)
				+ "%"
				+ '</div><br>'
				+ '<b>Applicants Referred</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].app_ref
				+ '%</div><br>'
				+ '<b>Hires Referred</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].hire_ref
				+ '%</div><br>'
				+ '<b>Good Hires Referred</b><div style="float:right;padding-left:40px;"> '
				+ citymap[city].ghire_ref + '%</div><br>' 
				+'</div>';
	var infowindow = new google.maps.InfoWindow({
		maxWidth : 250,
		position : citymap[city].center,
	});

	google.maps.event.addListener(marker, 'click', (function(marker) {
		return function() {
			infowindow.setContent(contentString);
			infowindow.open(map, this);

		}
	})(marker));

	google.maps.event.addListener(actualCircle, 'click', (function(actualCircle) {
		return function() {
			infowindow.setContent(contentString);
			infowindow.open(map, this);

		}
	})(actualCircle));

	google.maps.event.addListener(actualCircle, 'click', (function(actualCircle) {
		return function() {
			infowindow.setContent(contentString);
			infowindow.open(map, this);

		}
	})(predictedCircle));
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setVisible(map);
	}
}

function toggleMarkers() {
	if (markersVisible) {
		setMapOnAll(false);
		markersVisible = false;
	} else {
		setMapOnAll(true);
		markersVisible = true;
	}
}

function togglePredictedCircle() {

	for (var i = 0; i < predictedCircles.length; i++) {
		predictedVisible = false;
		if (predictedCircles[i].getMap() === null) {
			predictedVisible = true;
			predictedCircles[i].setMap(map);
		}
		else
			predictedCircles[i].setMap(null);
	}
}

function toggleActualCircle() {
	for (var i = 0; i < actualCircles.length; i++) {
		actualVisible = false;
		if (actualCircles[i].getMap() === null) {
			actualVisible = true;
			actualCircles[i].setMap(map);
		}
		else
			actualCircles[i].setMap(null);
	}
}

function restoreMarkers() {
	setMapOnAll(markersVisible);
}

function restorePredictedCircles() {
	if(predictedVisible) {
		for (var i = 0; i < predictedCircles.length; i++) {
			predictedCircles[i].setMap(map);
		}
	} else {
		for (var i = 0; i < predictedCircles.length; i++) {
			predictedCircles[i].setMap(null);
		}
	}
}

function restoreActualCircles() {
	if(actualVisible) {
		for (var i = 0; i <actualCircles.length; i++) {
			actualCircles[i].setMap(map);
		}
	} else {
		for (var i = 0; i < actualCircles.length; i++) {
			actualCircles[i].setMap(null);
		}
	}
}

Array.prototype.keySort = function(keys) {
	if(keys!=0){

	keys = keys || {};

	var obLen = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	};

	var obIx = function(obj, ix) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (size == ix)
					return key;
				size++;
			}
		}
		return false;
	};

	var keySort = function(a, b, d) {
		d = d !== null ? d : 1;
		if (a == b)
			return 0;
		return a > b ? 1 * d : -1 * d;
	};

	var KL = obLen(keys);

	if (!KL)
		return this.sort(keySort);

	for ( var k in keys) {
		keys[k] = keys[k] == 'desc' || keys[k] == -1 ? -1 : (keys[k] == 'skip'
				|| keys[k] === 0 ? 0 : 1);
	}

	this.sort(function(a, b) {
		var sorted = 0, ix = 0;

		while (sorted === 0 && ix < KL) {
			var k = obIx(keys, ix);
			if (k) {
				var dir = keys[k];
				sorted = keySort(a[k], b[k], dir);
				ix++;
			}
		}
		return sorted;
	});
	}
	return this;
};
