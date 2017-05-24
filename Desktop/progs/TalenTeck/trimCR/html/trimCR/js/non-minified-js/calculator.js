
//Fiona: This is where the savings data will be stored for the chart
var savingsData = []


//Fiona: Chart object
var chart;

//Fiona: initialize chart object
nv.addGraph(function() {
	var chartHeight = 400; 
	var chartWidth = 400;
	chart = nv.models.lineChart()
				.margin({left: 50, bottom: 50})
				.useInteractiveGuideline(true)
				.showLegend(false)
				.transitionDuration(350)
				.showYAxis(true)
				.showXAxis(true);

	//y axis
	var formatyAxis = d3.format('d');

	var x = d3.scale.linear()
		.domain([0, 100])
		.range([0.01, chartWidth]);

	chart.yAxis.axisLabel('Annual Impact ($M USD)').tickFormat(d3.format(',')).axisLabelDistance(25);

	chart.margin({left:60});
	//x axis 
	chart.xAxis.axisLabel("Percent Decrease in Turnover (%)").tickFormat(d3.format(',r')).tickValues([0,10, 25, 50, 75, 100]).axisLabelDistance(25);
	
	//add id to an element being rendered

	chart.xAxis.scale().domain([0,100]);
	chart.forceX([0, 100]);

	

	
	
	return chart;
})


var total_locations = 1;

var input_rows = [
	"Employment",
	"Turnover",
	"Vacancy",
	"Training",
	"OnboardingCost",
	"TrainingCost",
	"Compensation",
	"Revenue"
];
// These correspond to all_rows, not input_rows, so first two are blank.
var input_tooltips = [
	"",
	"",
	"Total number of employees in a typical month, excluding executives. Note that this number is not expected to change as a result of turnover reduction.",
	"Average annual employee turnover rate; for every 100 new hires the number that exits the company within the first 365 days of employment",
	"After an employee leaves, average number of weeks the seat is vacant before a replacement employee is hired.",
	"Average number of training weeks; alternatively, the number of weeks a new hire is unproductive or non-billable ",
	"Total costs per hire associated with onboarding a new employee includes recruiting, testing, onboarding paperwork, interview and other assessment resources, including costs for candidates not hired.",
	"Total cost associated with training a new hire. Excludes cost of employee time; also excludes trainee's use of space and equipment that are normally used during his/her regular employment, but  includes direct and indirect expenses such as time cost for managers and trainers, as well as extra space and equipment that are used exclusively for training.",
	"Average compensation cost per employee per year, including regular and overtime pay; benefits; bonuses; in-kind allowances; payroll and other overhead taxes. Should be calculated in a consistent manner across locations and converted into US dollars if necessary.",
	"Total annual gross revenue from operations minus cost of materials and purchased services"
];


var all_rows = [
	"Title",
	"RemoveButton",
	"Employment",
	"Turnover",
	"Vacancy",
	"Training",
	"OnboardingCost",
	"TrainingCost",
	"Compensation",
	"Revenue",
	"CalculateButton"
	// "DesiredQuits",
	// "CurrentSeatTurnover",
	// "DesiredSeatTurnover",
	// "CurrentHires",
	// "DesiredHires",
	// "CurrentUnproductive",
	// "DesiredUnproductive",
	// "Reduction",
	// "CurrentTCosts",
	// "CurrentVCosts",
	// "DesiredTCosts",
	// "DesiredVCosts",
	// "Savings"
];

// var output_rows = [
// 	"DesiredQuits",
// 	"CurrentSeatTurnover",
// 	"DesiredSeatTurnover",
// 	"CurrentHires",
// 	"DesiredHires",
// 	"CurrentUnproductive",
// 	"DesiredUnproductive",
// 	"Reduction",
// 	"CurrentTCosts",
// 	"CurrentVCosts",
// 	"DesiredTCosts",
// 	"DesiredVCosts",
// 	"Savings"
// ];

var row_labels = [
	"Location",
	"",
	"Total&nbsp;Employees",
	"Current&nbsp;Quit&nbsp;Rate&nbsp;(%)", 
	"Weeks&nbsp;Vacancy", 
	"Weeks&nbsp;Training", 
	"Onboard Cost&nbsp;(USD)", 
	"Training Cost&nbsp;(USD)", 
	"Compensation&nbsp;(USD)" ,
 	"Value&nbsp;Added&nbsp;(M&nbsp;USD)",""
	// "Desired Annual Quit Rate",
	// "Current Seat Turnover Rate",
	// "Desired Seat Turnover Rate",
	// "Current Total Annual Hires",
	// "Desired Total Annual Hires",
	// "Current Unproductive Employees",
	// "Desired Unproductive Employees",
	// "Reduction of Hires",
	// "Current Turnover Costs",
	// "Current Vacancy Costs",
	// "Desired Turnover Costs",
	// "Desired Vacancy Costs",
	// "Annual Savings"
];


function remove_location(this_location_number) {
	if ( total_locations > 1 ) {

		var trlabel, this_tr, tdlabel , this_td , this_boxlabel , next_boxlabel, this_textbox , next_textbox , next_location;

		// First, shift higher-number columns left by one

		for ( location_counter = this_location_number ; location_counter < total_locations ; location_counter++ ) {

			next_location = location_counter + 1;

			for ( row = 0 ; row <= 7 ; row++ ) {
				
				this_boxlabel = "Location_" + location_counter + "_" + input_rows[row];
				next_boxlabel = "Location_" + next_location + "_" + input_rows[row];
			
				this_textbox = document.getElementById(this_boxlabel);
				next_textbox = document.getElementById(next_boxlabel);
				this_textbox.value = next_textbox.value;
			}

		}

			// Then, destroy the last column

		for ( row = 0 ; row < all_rows.length ; row++ ) {

			trlabel  = all_rows[row] + "TR";
			tdlabel  = "Location_" + total_locations + "_" + all_rows[row] + "TD";
			this_tr = document.getElementById(trlabel);
			this_td = document.getElementById(tdlabel);
			this_tr.removeChild(this_td);

		}

		total_locations -= 1;

		//Fiona: change inner HTML
		var locationcounter_td = document.getElementById("TotalLocationsTD");
		locationcounter_td.innerHTML = "Total Locations: " +total_locations;

		//If we're removing location 2, then get rid of the remove button for location 1
		//If we're adding the second location, turn on the remove label for the first 
		if ( total_locations == 1 ) {
			location_1_td_element = document.getElementById("Location_1_RemoveButtonTD");
			var new_removebutton = document.createElement("button");
			//Fiona: bootstrap button
			$(new_removebutton).addClass("btn btn-default btn-xs btn-transparent");
			new_removebutton.innerHTML = "&nbsp;"; // was "Remove"
			new_removebutton.addEventListener("click",remove_location_1);
			if ( location_1_td_element.childNodes[0] !== 'undefined' ) { 
				location_1_td_element.removeChild(location_1_td_element.childNodes[0]);
			}
			location_1_td_element.appendChild(new_removebutton);

		}

	}
}

function add_location() {
	if ( total_locations < 5 ) {
		total_locations += 1;


		//If we're adding the second location, turn on the remove label for the first 
		if ( total_locations == 2 ) {
			location_1_td_element = document.getElementById("Location_1_RemoveButtonTD");
			new_removebutton = document.createElement("button");
			//Fiona: bootstrap button
			$(new_removebutton).addClass("btn btn-default btn-xs");
			new_removebutton.innerHTML = "Remove"; // was "Remove"
			new_removebutton.addEventListener("click",remove_location_1);
			location_1_td_element.removeChild(location_1_td_element.childNodes[0]);
			location_1_td_element.appendChild(new_removebutton);

		}


		var trlabel = "";
		var tdlabel = "";
		var overall_tdlabel = "";
		var boxlabel = "";
		var new_textbox_td, new_textbox, textbox_tr , overall_textbox_td , new_removebutton_tdlabel;

		for ( row = 0 ; row < all_rows.length ; row++ ) {

			trlabel  = all_rows[row] + "TR";
			tdlabel  = "Location_" + total_locations + "_" + all_rows[row] + "TD";
			overall_tdlabel  = "Overall_" + all_rows[row] + "TD";

			new_textbox_td = document.createElement("td");
			$(new_textbox_td).addClass("inputTD");
			new_textbox_td.id = tdlabel;
			textbox_tr = document.getElementById(trlabel);
			overall_textbox_td = document.getElementById(overall_tdlabel);
			textbox_tr.insertBefore(new_textbox_td,overall_textbox_td);



		}

		var locationcounter_td = document.getElementById("TotalLocationsTD");
		locationcounter_td.innerHTML = "Total Locations: " +total_locations;



		for ( row = 0 ; row < input_rows.length ; row++ ) {

			trlabel  = input_rows[row] + "TR";
			tdlabel  = "Location_" + total_locations + "_" + input_rows[row] + "TD";
			overall_tdlabel  = "Overall_" + input_rows[row] + "TD";
			boxlabel = "Location_" + total_locations + "_" + input_rows[row];

			new_textbox_td = document.getElementById(tdlabel);
			new_textbox = document.createElement("input");
			new_textbox.type = "text";
			new_textbox.size = "6";
			new_textbox.name = boxlabel;
			new_textbox.id = boxlabel;
			new_textbox_td.appendChild(new_textbox);

		}

			// Add the title

		tdlabel = "Location_" + total_locations + "_TitleTD";
		var new_location_td = document.getElementById(tdlabel);
		var new_location_text = document.createTextNode("Location "+total_locations);
		new_location_td.appendChild(new_location_text);
		var location_tr = document.getElementById("TitleTR");
		var location_overall_td = document.getElementById("Overall_TitleTD");
		location_tr.insertBefore(new_location_td,location_overall_td);
			
			// Add the remove button

		tdlabel = "Location_" + total_locations + "_RemoveButtonTD";
		var new_removebutton_td = document.getElementById(tdlabel);
		var new_removebutton = document.createElement("button");
		//Fiona: bootstrap button 
		$(new_removebutton).addClass("btn btn-default btn-xs");
		new_removebutton.innerHTML = "Remove";
		switch( total_locations ) {
			case 2:
				new_removebutton.addEventListener("click",remove_location_2);
			break;
			case 3:
				new_removebutton.addEventListener("click",remove_location_3);
			break;
			case 4:
				new_removebutton.addEventListener("click",remove_location_4);
			break;
			case 5:
				new_removebutton.addEventListener("click",remove_location_5);
			break;
		}

		new_removebutton_td.appendChild(new_removebutton);



	}
}

function remove_location_1() {
	remove_location(1);
}
function remove_location_2() {
	remove_location(2);
}
function remove_location_3() {
	remove_location(3);
}
function remove_location_4() {
	remove_location(4);
}
function remove_location_5() {
	remove_location(5);
}


function insert_rows() {

	var tr_element , tr_label , label_td_element , label_td_label , label_anchor_element , label_text_element , text_contents, location_1_td_element , location_1_td_label , overall_td_element , overall_td_label , boxlabel , new_textbox , new_removebutton , new_location_text;
	var table_element = document.getElementById("secondTable");

	// Add TR element, label element, location 1 element, and overall element for each row

	for ( row = 0 ; row < all_rows.length ; row++ ) {

		tr_label = all_rows[row] + "TR";
		label_td_label = all_rows[row] + "LabelTD";
		location_1_td_label = "Location_1_" + all_rows[row] + "TD";
		overall_td_label = "Overall_" + all_rows[row] + "TD";

		tr_element = document.createElement("tr");
		tr_element.id = tr_label;
		label_td_element = document.createElement("td");
		label_td_element.id = label_td_label;
		if ( input_tooltips[row] != "" ) {
			label_anchor_element = document.createElement("A");
			//label_anchor_element.setAttribute("href","#");
			label_anchor_element.setAttribute("class","tooltip-show");
			label_anchor_element.setAttribute("data-toggle","tooltip");
			label_anchor_element.setAttribute("title",input_tooltips[row]);
			label_anchor_element.setAttribute("tabindex",-1);
			label_anchor_element.innerHTML = row_labels[row];
			label_td_element.appendChild(label_anchor_element);
		}
		else {
			label_text_element = document.createTextNode(row_labels[row]);
			label_td_element.appendChild(label_text_element);
		}
		tr_element.appendChild(label_td_element);

		//location 1 add
		location_1_td_element = document.createElement("td");
		$(location_1_td_element).addClass("inputTD");
		location_1_td_element.id = location_1_td_label;
		tr_element.appendChild(location_1_td_element);
		//location_1_td_element.style.width = '10px';

		overall_td_element = document.createElement("td");
		overall_td_element.id = overall_td_label;
		tr_element.appendChild(overall_td_element);
		table_element.appendChild(tr_element);


	}

	//Add the calculate button

	var calculate_button_td = document.getElementById("CalculateButtonLabelTD");
	calculate_button_td.innerHTML = "<button type=\"button\" id=\"calculate-button\" class=\"btn success btn-default btn-calculate\" onclick=\"update_values()\" style=\"width: 90%; padding: 4px; \">Calculate</button>";

		// Then add a text box for the input rows

	for ( row = 0 ; row < input_rows.length ; row++ ) {

		location_1_td_label = "Location_1_" + input_rows[row] + "TD";
		location_1_td_element = document.getElementById(location_1_td_label);

		boxlabel = "Location_1_" + input_rows[row];

		if ( row == 0 ) {
			up_boxlabel = "calculate-button";
			left_boxlabel = "calculate-button";
		}
		else {
			up_boxlabel = "Location_1_" + input_rows[row-1];
			left_boxlabel = "Location_1_" + input_rows[row-1];
		}
		if ( row == input_rows.length - 1 ) {
			down_boxlabel = boxlabel;
			right_boxlabel = boxlabel;
		}
		else {
			down_boxlabel = "Location_1_" + input_rows[row+1];
			right_boxlabel = "Location_1_" + input_rows[row+1];
		}

		new_textbox = document.createElement("input");
		new_textbox.type = "text";
		new_textbox.size = "6";
		new_textbox.name = boxlabel;
		new_textbox.id = boxlabel;

		new_textbox.setAttribute("upboxlabel",up_boxlabel);
		new_textbox.setAttribute("leftboxlabel",left_boxlabel);
		new_textbox.setAttribute("rightboxlabel",right_boxlabel);
		new_textbox.setAttribute("downboxlabel",down_boxlabel);

		new_textbox.onkeyup = function(event) {
			uplabel = this.getAttribute("upboxlabel");
			leftlabel = this.getAttribute("leftboxlabel");
			rightlabel = this.getAttribute("rightboxlabel");
			downlabel = this.getAttribute("downboxlabel");
			switch (event.keyCode) {
				case 9:  // tab
					//document.getElementById("TotalLocationsTD").innerHTML = "Tab";
					if(event.shiftKey) {
						document.getElementById(leftlabel).focus();
				    	}
					else {
						//document.getElementById("TotalLocationsTD").innerHTML = rightlabel;
						document.getElementById(rightlabel).focus();
					}
				break;

				case 37: //left arrow
					//document.getElementById("TotalLocationsTD").innerHTML = leftlabel;
					document.getElementById(leftlabel).focus();
				break;
				case 38: //up arrow
					//document.getElementById("TotalLocationsTD").innerHTML = uplabel;
					document.getElementById(uplabel).focus();
				break;
				case 39: //right arrow
					//document.getElementById("TotalLocationsTD").innerHTML = rightlabel;
					document.getElementById(rightlabel).focus();
				break;
				case 40: //down arrow
					//document.getElementById("TotalLocationsTD").innerHTML = downlabel;
					document.getElementById(downlabel).focus();
				break;
			}
		}
		new_textbox.onkeydown = function(event) {
			if ( event.keyCode == 9 ) {
				event.preventDefault();
			}
		}


		location_1_td_element.appendChild(new_textbox);
		//location_1_td_element.setAttribute("width","20px");


	}

	//Then add the remove button

	location_1_td_element = document.getElementById("Location_1_RemoveButtonTD");
	new_removebutton = document.createElement("button");
	//Fiona: bootstrap button -- but shouldn't be there if there's just one location
	$(new_removebutton).addClass("btn btn-default btn-xs btn-transparent");
	new_removebutton.innerHTML = "&nbsp;"; // was "Remove"
	new_removebutton.setAttribute("tabindex",-1);
	//new_removebutton.addEventListener("click",remove_location_1);
	location_1_td_element.appendChild(new_removebutton);

	//And then the text for the labels

	location_1_td_element = document.getElementById("Location_1_TitleTD");
	new_location_text = document.createTextNode("Location 1");
	location_1_td_element.appendChild(new_location_text);

	overall_td_element = document.getElementById("Overall_TitleTD");
	new_location_text = document.createTextNode("Overall");
	overall_td_element.appendChild(new_location_text);
		

}


var savings = [];
var finalSavings = [];



function update_values() {

	// First, put the current values in a big long query

	var query = "Total_Locations=" + total_locations;
	var this_box_contents = "";
	var this_box_label , this_box_element , xhr;
	var transformed_value;
		
	for ( row = 0 ; row < input_rows.length ; row++ ) {

		for ( this_location = 1 ; this_location <= total_locations ; this_location++ ) {

			this_box_label = "Location_" + this_location + "_" + input_rows[row];
			this_box_element = document.getElementById(this_box_label);
			if (Number(this_box_element.value) != NaN) {
				switch ( input_rows[row] ) {
					case "Turnover":
						transformed_value = this_box_element.value/100;
						query = query + "&" + "Location_" + this_location + "_" + input_rows[row] + "=" + transformed_value;
					break;
					case "Revenue":
						transformed_value = this_box_element.value*1000000;
						query = query + "&" + "Location_" + this_location + "_" + input_rows[row] + "=" + transformed_value;
					break;
					default:
						query = query + "&" + "Location_" + this_location + "_" + input_rows[row] + "=" + this_box_element.value;
					break;
				}

			}
		}	

	}

	// Debugging:
	// document.getElementById("TotalLocationsTD").innerHTML = query;

	xhr = new XMLHttpRequest();

	// Now define what to do when the response is returned

	xhr.onreadystatechange=function() {

		var rownode , cellnode , celltag , locationlabel, output_tdlabel , output_td , itemnode , obsnode, graphindex , graphoutput, decimalplace , roundedoutput;
		

		if (xhr.readyState==4 && xhr.status==200) {



			var xmldoc = xhr.responseXML;
			// For debugging XML output:
			//var myresponsetext = xhr.responseText;
			//myresponsetext = myresponsetext.replace(/</g,"&lt;");
			//myresponsetext = myresponsetext.replace(/>/g,"&gt;");
			//document.getElementById("TitleLabelTD").innerHTML= "\"" + myresponsetext + "\"";
			// for ( row = 0 ; row < output_rows.length ; row++ ) {
			// 	rownode = xmldoc.getElementsByTagName(output_rows[row])[0];

			// 	for ( this_location = 1 ; this_location <= total_locations ; this_location++ ) {

			// 		celltag = "Location_" + this_location;
			// 		cellnode=rownode.getElementsByTagName(celltag)[0];
			// 		if ( typeof cellnode.childNodes[0] === 'undefined' ) {
			// 			cellvalue = ""
			// 		}
			// 		else {
			// 			cellvalue = cellnode.childNodes[0].nodeValue;
			// 		}


			// 		switch( output_rows[row] ) {
			// 			case "Employment":
			// 			case "CurrentHires":
			// 			case "DesiredHires":
			// 			cellvalue = Math.floor(cellvalue);

			// 			break;
			// 			case "Turnover":
			// 			case "DesiredQuits":
			// 			case "CurrentSeatTurnover":
			// 			case "DesiredSeatTurnover":
			// 			case "CurrentUnproductive":
			// 			case "DesiredUnproductive":
			// 			case "Reduction":
			// 			cellvalue = Math.floor(cellvalue*1000)/10 + "%";
							
			// 			break;
			// 			case "Vacancy":
			// 			case "Training":
			// 			cellvalue = Math.floor(cellvalue*10)/10;
							
			// 			break;
			// 			case "OnboardingCost":
			// 			case "TrainingCost":
			// 			case "Revenue":
			// 			case "CurrentTCosts":
			// 			case "CurrentVCosts":
			// 			case "DesiredTCosts":
			// 			case "DesiredVCosts":
			// 			case "Savings":
			// 			case "Compensation":
			// 			cellvalue = "$" + Math.floor(cellvalue);
							
			// 			break;

			// 			default:							
			// 			cellvalue = Math.floor(cellvalue*10)/10;
			// 			break;
			// 		}

			// 		output_tdlabel = "Location_" + this_location + "_" + output_rows[row] + "TD";
			// 		output_td = document.getElementById(output_tdlabel);
			// 		output_td.innerHTML = cellvalue;

			// 	}
			// }

			// // The overall rows

			for ( row = 0 ; row < all_rows.length ; row++ ) {

				if ( all_rows[row] != "Title" && all_rows[row] != "RemoveButton" 
				     && all_rows[row] != "CalculateButton") {
					output_tdlabel = "Overall_" + all_rows[row] + "TD";
					rownode = xmldoc.getElementsByTagName(all_rows[row])[0];
					cellnode=rownode.getElementsByTagName("Overall")[0];
					if ( typeof cellnode.childNodes[0] === 'undefined' ) {
						cellvalue = ""
					}
					else {
						cellvalue = cellnode.childNodes[0].nodeValue;
					}
					switch( all_rows[row] ) {
						case "Employment":
						case "CurrentHires":
						case "DesiredHires":
						cellvalue = addCommas(Math.floor(cellvalue));

						break;
						case "Turnover":
						case "DesiredQuits":
						case "CurrentSeatTurnover":
						case "DesiredSeatTurnover":
						case "CurrentUnproductive":
						case "DesiredUnproductive":
						case "Reduction":
						cellvalue = addCommas((Math.floor(cellvalue*1000)/10)) + "%";
						
						break;
						case "Vacancy":
						case "Training":
						cellvalue = addCommas(Math.floor(cellvalue*10)/10);
						
						break;
						case "Revenue":
						case "CurrentTCosts":
						case "CurrentVCosts":
						case "DesiredTCosts":
						case "DesiredVCosts":
						case "Savings":
						cellvalue = "$" + addCommas(0.1*Math.floor(cellvalue)/100000) + " M";
							
						break;
						case "OnboardingCost":
						case "TrainingCost":
						case "Compensation":
						cellvalue = "$" + addCommas(Math.floor(cellvalue));
						break;

						default:							
						cellvalue = addCommas(Math.floor(cellvalue*10)/10);
						break;
					}


					output_td = document.getElementById(output_tdlabel);
					output_td.innerHTML = cellvalue;
				}

			}

			var index = 0;
			var stop = 0;
			while (stop == 0) {

				itemnode = xmldoc.getElementsByTagName("datapoint")[index];
				if ( itemnode != null ) {
					obsnode=itemnode.getElementsByTagName("reduction")[0];
					if ( typeof obsnode.childNodes[0] === 'undefined' ) {
						graphindex = "obsnodenull ";
					}
					else {
						graphindex = obsnode.childNodes[0].nodeValue;
						obsnode=itemnode.getElementsByTagName("savings")[0];
						if ( typeof obsnode.childNodes[0] === 'undefined' ) {
							graphoutput = "outputnodenull ";
						}
						else{
							graphoutput = obsnode.childNodes[0].nodeValue;
							// The rounding doesn't always work properly so this is a kludge
							roundedoutput = String(0.1*Math.floor(graphoutput/100000));
							decimalplace = roundedoutput.indexOf(".");
							if ( decimalplace >= 0 ) {
								roundedoutput = roundedoutput.substring(0,decimalplace+2);
							}
							savings[graphindex] = Number(roundedoutput);
							// savings[graphindex] = graphoutput;

						}


					}

						index++;
				}
				else {
					stop = 1;
				}

			}

			//Fiona: make "savings" values into integers and push onto new array
			var newDataArray = [];
			for (var index in savings) {
				newDataArray.push({x: index, y: parseFloat(savings[index])});
			}


			//Fiona: variables for new graph
			var newdata = {
				values: newDataArray,
				key: "Annual Impact (M$)",
				color:"#458258"
			}

			//Fiona: add to empty savingsData array 
			savingsData = [];
			savingsData.push(newdata);
			savingsData.sort();

			//Fiona: create new chart from savingsData array
			$("#ChartTD").html('<div id="chart"><svg></svg></div>');
			d3.select('#chart svg').datum(savingsData).call(chart);
			//Fiona: update chart
			nv.utils.windowResize(chart.update);

			$(".tick").each(function(){
				$(this).css("opacity","0.5");
				console.log("Opacity: " + $(this).css("opacity"));
			});
			$("#calculatorResults")[0].scrollIntoView(false);

			//Debugging:
			//document.getElementById("TitleLabelTD").innerHTML = savings.join(" * ");

		}

	}

	xhr.open('POST', 'js/turnover_calculator.php');
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(query);
}



function addCommas(thisValue){
	if (thisValue == null ) {
		return null;
	}
	if (thisValue.toString().length <= 3) {
		return thisValue.toString();
	} 
	var returnString = "";
	var lastPosition = thisValue.toString().length - 3;
	var decimalPlace = thisValue.toString().indexOf(".");
	if ( decimalPlace >= 0 ) {
		returnString = thisValue.toString().substring(decimalPlace)
		lastPosition = decimalPlace - 3;
	}
	for ( var i = lastPosition ; i > 1 || (i >= 1 && thisValue.toString().substring(0,1) !== "-" ) ; i = i - 3 ) {
		returnString = "," + thisValue.toString().substring(i,i+3) + returnString;
	}
	returnString = thisValue.toString().substring(0,i+3) + returnString;
	return returnString;
}



	

