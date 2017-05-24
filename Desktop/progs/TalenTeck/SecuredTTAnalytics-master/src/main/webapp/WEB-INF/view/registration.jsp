<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page session="false"%>

<html>

<head>
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<style>
.password-verdict {
	color: #000;
}

.btn-info,.btn-info.active,.btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{
background-color:#A1CEA1;
border-color:#A1CEA1;
}
.alert-danger {
	background-color: #f5f5f5;
	border-color: #f5f5f5;
	padding: 0px;
	margin: 0px;
	border: 0px;
}
 #logobox {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    height: 100px;
    width : 100%;
    }
 #signupbox{
	width:540px;
	margin-left: auto;
    margin-right: auto;	
    margin-top: 5%;
   -webkit-box-shadow: 5px 5px 15px rgba(0,0,0,0.4);
}

.progress {
	margin-bottom: 0px;
}

ol, ul {
	margin-bottom: 0px;
	font-size: 12px;
	padding-left: 18px;
}   

.panel-default {
	border-color: rgba(221, 221, 221, 0.01);
	border-width: 8px;
	padding: 5px;
	background-color: #f5f5f5;
	color: #747977;
}
.panel-info>.panel-heading {
font-size:small;
background-color:transparent;
border-color:transparent;
}
.panel-info{
border-color:transparent;

}
img{
width:250px;
padding-top:35px;
}
</style>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="<c:url value="/resources/pwstrength.js" />"></script>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<title><spring:message code="label.form.title"></spring:message></title>
</head>

<body>
	<div class="container">
		<div id="signupbox">
					<div id="logobox"><a href="http://talenteck.com"><img src="resources/img/analytics/talent_Teck_logo.jpg"></a></div>
			<div class="panel panel-info">
				<div class="panel-heading">
					<div style="float:right;">Already have an account?     <a href="<c:url value="login.html" />">Login</a></div>
				</div>
				<div class="panel-body">
					<form name="signup" id="signup" method="POST" enctype="utf8">
						<div class="panel-default">
							Enter Your Name
							<div class="row">
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="firstName" id="firstName" class="form-control input-sm" value="" placeholder="*First Name" /> 
										<span id="firstNameError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="middleName" id="middleName" class="form-control input-sm" placeholder="Middle Name" /> 
										<!--  <span id="middleNameError" class="alert alert-danger input-sm" style="display: none"></span>-->
									</div>
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="lastName" id="lastName" class="form-control input-sm" value="" placeholder="*Last Name" /> 
										<span id="lastNameError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
							</div>
						</div>
						<br>

						<div class="panel-default">
							<span>Create Your Talenteck Account</span>
							<div class="form-group">
								<input type="email" name="email" id="email" class="form-control input-sm" value="" placeholder="*Email" />
								<span id="emailError" class="alert alert-danger input-sm" style="display: none"></span>
							</div>

							<div class="row">
								<div class="col-xs-6 col-sm-6 col-md-6">
									<div class="form-group">
										<input type="password" name="password" id="password" class="form-control input-sm" value="" placeholder="*Password" />
										<span id="passwordError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
								<div class="col-xs-6 col-sm-6 col-md-6">
									<div class="form-group">
										<input type="password" name="matchingPassword" id="matchPassword" class="form-control input-sm" value="" placeholder="*Re-Enter Password" /> 
										<span id="globalError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
							</div>
						</div>
						<br>

						<div class="panel-default">
							Enter Your Work Details
							<div class="row">
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="workLocation" id="workLocation" class="form-control input-sm" value="" placeholder="Work Location" /> 
											<!-- <span id="workLocationError" class="alert alert-danger input-sm" style="display: none"></span>-->
									</div>
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="workCompany" id="workCompany" class="form-control input-sm" value="" placeholder="*Work Company" /> 
										<span id="workCompanyError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<input type="text" name="workTitle" id="workTitle" class="form-control input-sm" value="" placeholder="Work Title" /> 
										<!--  <span id="workTitleError" class="alert alert-danger input-sm" style="display: none"></span>-->
									</div>
								</div>
							</div>
						</div>
						<br>

						<div class="panel-default">
							Enter Your Contact Details
							<div class="row">
								<div class="col-xs-4 col-sm-4 col-md-4">
									<div class="form-group">
										<select name="phoneType" id="phoneType" class="form-control input-sm">
										<option value="Home">Home</option>
										<option value="Work">Work</option>
										<option value="Mobile">Mobile</option>
										</select>
										<span id="phoneTypeError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
								<!--  <div class="col-xs-2 col-sm-2 col-md-2">
									<div class="form-group">
										<input type="text" name="internationalCode" id="internationalCode" class="form-control input-sm" placeholder="Code" /> 
										<span id="internationalCodeError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div> -->
								<div class="col-xs-6 col-sm-6 col-md-6">
									<div class="form-group">
										<input type="text" name="phoneNumber" id="phoneNumber" class="form-control input-sm" value="" placeholder="Phone Number" /> 
										<span id="phoneNumError" class="alert alert-danger input-sm" style="display: none"></span>
									</div>
								</div>
							</div>
						</div>
						<br>
						<input type="submit" class="btn btn-info btn-block" value="Register" />
					</form>
				</div>
			</div>
		</div>
	</div>

	<script type="text/javascript">
	$(document).ready(function() {
		$('form').submit(function(event) {
			if(validate(event)){
				var formData= $('form').serialize();
    $.post("<c:url value="/user/registration"/>",formData ,function(data){
        if(data.message == "success"){
            window.location.href = "<c:url value="/login.html"></c:url>" + "?message=<spring:message code='message.regSucc'></spring:message>" ;
        }
        
    })
    .fail(function(data) {
        if(data.responseJSON.error.indexOf("MailError") > -1)
        {
            window.location.href = "<c:url value="/emailError.html"></c:url>";
        }
        else if(data.responseJSON.error == "UserAlreadyExist"){
            $("#emailError").show().html(data.responseJSON.message);
        }
        else if(data.responseJSON.error.indexOf("InternalError") > -1){
            window.location.href = "<c:url value="/login.html"></c:url>" + "?message=" + data.responseJSON.message;
        }
        else{
        	var errors = $.parseJSON(data.responseJSON.message);
            $.each( errors, function( index,item ){
                $("#"+item.field+"Error").show().html(item.defaultMessage);
            });
            errors = $.parseJSON(data.responseJSON.error);
            $.each( errors, function( index,item ){
                $("#globalError").show().append(item.defaultMessage+"<br>");
            });
        }
    });
   }		
});
		
		$(":input").keyup(function() {
			var input1 = $(this);
		  	$("#" + input1.attr('name') +"Error").hide();
			$('.progress').show();
		   						});
	
	$(":password").keyup(function() {
		if ($("#password").val() != $("#matchPassword").val()) {
			$("#globalError").show().html('<spring:message code="PasswordMatches.user"></spring:message>');
		} else {
			$("#globalError").html("").hide();
			   }
	});
	 $("#phoneNumber").keypress(function (e) {
	     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	        $("#phoneNumError").html("Digits Only").show().fadeOut("slow");
	        return false;
	    }
	   });
	
	options = {
			common : {
				minChar : 8,
				onKeyUp:checkPass
				},
			ui : {
				showVerdictsInsideProgressBar : true,
				showErrors : true,
				errorMessages : {
				wordLength : '<spring:message code="error.wordLength"/>',
				wordNotEmail : '<spring:message code="error.wordNotEmail"/>',
				wordSequences : '<spring:message code="error.wordSequences"/>',
				wordLowercase : '<spring:message code="error.wordLowercase"/>',
				wordUppercase : '<spring:message code="error.wordUppercase"/>',
				wordOneNumber : '<spring:message code="error.wordOneNumber"/>',
				wordOneSpecialChar : '<spring:message code="error.wordOneSpecialChar"/>'
								}
				 }
			};
 $('#password').pwstrength(options);

  function checkPass(event, result){
	  $('#passwordError').val(result.score);
  }

		
	});
	
	function validate(event) {
		event.preventDefault();
		$(".alert").html("").hide();
		$(".error-list").html("");
		
		if($('#firstName').val().length==0){
			$("#firstNameError").show().html('*Required');
			return false;
		}
		if($('#lastName').val().length==0){
			$("#lastNameError").show().html('*Required');
			return false;
		}
		if($('#email').val().length==0){
			$("#emailError").show().html('*Required');
			return false;
		}
		if($('#password').val().length==0){
			$("#passwordError").show().html('*Required');
			return false;
		}
		if($('#matchPassword').val().length==0){
			$("#globalError").show().html('*Required');
			return false;
		}

		if($('#workCompany').val().length==0){
			$("#workCompanyError").show().html('*Required');
			return false;
		}
		
		
		/*$('form input').each(function(index){  
			var input1 = $(this);
			var err=false;
			if(input1.attr('name')=='firstName' || input1.attr('name')=='lastName' || input1.attr('name')=='email' || input1.attr('name')=='workCompany'){
				if(input1.val().length == 0){
					err=true;
					$("#" + input1.attr('name') +"Error").show().html("*Required");
				}
			}
			});*/

	    if (parseInt($('#passwordError').val()) <26 ) {
			$("#passwordError").show().html('Does not meet minimum reqirements');
	      return false;
	    } 
		
		if ($("#password").val() != $("#matchPassword").val()) {
			$("#globalError").show().html('<spring:message code="PasswordMatches.user"></spring:message>');
			return false;
		}
		return true;			
	}
	</script>
</body>
</html>







