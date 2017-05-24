$(document).ready(function(){
	var currentPaperID = "";


	$(".popup2-container").hide();
	
	$("#popup2_close").click(function(e){
		if (!$(".popup2-wrapper").is(e.target) && $(".popup2-wrapper").has(e.target).length == 0) {
			$(".popup2-container").fadeOut();
		}
	});
	//////
	// $("#popup2_open").click(function(){
	//     $(".popup2-container").fadeIn();
	// });
	// //////
	// $("#popup1_close").click(function(e){
	//     if (!$(".popup1-video").is(e.target) && $(".popup1-video").has(e.target).length == 0) {
	//         $(".popup1-container").fadeOut();
	//         $(".popup1-video").get(0).currentTime = 0;
	//     }
	// });


	//Submit the email
	$("#submit-email").unbind("click");
	$("#submit-email").click(function(e){
		console.log("YO");
		var informationObject = JSON.stringify({companyName : $("#companyName").val() ,
												firstName : $("#firstName").val() ,
												lastName : $("#lastName").val() ,
												emailAddress : $("#EMail").val()});
		console.log(informationObject);
		$.ajax({
			type: "POST" , 
			url: "../backend/PaperHandler",
			data: {type: "submitEmail", personalInformation : informationObject},
			dataType: "json",
			success : function(data) {
				console.log(data);
				if (data != null && data.success != null && data.success == true) {
					console.log("Email successfully added.");
					// $("h3").text("blah.");
					// $("h3").css("color","#5FAA60");
					$(".popup2-container").fadeOut();

					$.ajax({
					   type: "POST",
						url: "../backend/PaperHandler",
						data: {type: "submitEmailPaperRequest" , personalInformation : informationObject , paperID : currentPaperID },
						dataType: "text",
						success: function(data){
							//errors go here
							console.log("HIII");
							var datastring = String(data);
							if (datastring.length >= 50) {
								console.log('Matches!');
							}
							else {
								console.log('Wut');
								eval(data)
							}
						}
					});
				}
				else{
					console.log("Email unsuccessfully added.");
					// $("h3").text("blah.");
					// $("h3").css("color","#FF0000");
				}
			}
		});
	});
	//Check if email was submitted
	
	$(".pdf-boxes").click(function(){
		currentPaperID = $( this).attr("id");
		console.log("YO");
		$.ajax({ 
			type: "POST", 
			url: "../backend/PaperHandler",
			data: {type: "checkIfEmailEntered",},
			dataType: "json",
			success : function(data) {
				console.log("Back with result from checking if e-mail entered.");
				console.log(data);
				//PDF is emailed to email provided
				if ( data != null && data.entered != null && data.entered == true ) {
					console.log("A valid e-mail was entered");

					var informationObject = JSON.stringify({companyName : $("#companyName").val() ,
															firstName : $("#firstName").val() ,
															lastName : $("#lastName").val() ,
															emailAddress : $("#EMail").val()});
					console.log(informationObject);
					$.ajax({
						type: "POST",
						url: "../backend/PaperHandler",
						data: {type: "submitEmailPaperRequest", personalInformation : informationObject , paperID : currentPaperID },
						dataType: 'text',
						success: function(data){
							//errors go here
							console.log("HIII");
							var datastring = String(data);
							if (datastring.length >= 50) {
								console.log('Matches!');
							}
							else {
								console.log('Wut');
								eval(data)
							}
						}
					});
				}
				//Prompt for email
				else {
					console.log("Request was not successful.");
					if ( data != null && data.message != null ) {
						console.log("Reason: " + data.message);
						
					}
					$(".popup2-container").fadeIn();

				}
			}
		});
	});
});

