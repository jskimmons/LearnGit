<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>


<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

<style>
.password-verdict {
	color: #000;
}
</style>
<script>
	
	$(document).ready(function() {			
		$('#myModal').on('shown.bs.modal', function(e) {
		});

		$('.modal').on('hidden.bs.modal', function(e) {
			$(".modal").remove();
			$('.modal-backdrop').remove();
		    $(".main_container").load("viewusers.html");

		});

		$('#submit').click(function(event) {
			register(event);
		});
		
		$("#editRole").click(function(){
			var values = $.map($('select'), function(e) { return e.value; }).join(',');
			alert("val"+values);

		});
	});

	function register(event) {
		event.preventDefault();
		var formData = $('#userForm').serializeArray();
		$.post(
						"<c:url value="/admin/users/update"/>"
						,formData,
						function(data) {
							if (data.message == "success") {
								alert('User updated successfully' );
								$(".modal").modal("hide");
								$(".modal").remove();
								$('.modal-backdrop').remove();
							    $(".main_container").load("viewusers.html");
							}
						}).fail(function(data) {
				});
	}
</script>
</head>

<body>
	<security:authorize access="isAuthenticated()"> authenticated as <security:authentication property="principal.username" />
		<div id="myModal" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">New User</h4>
					</div>
				<div class="modal-body">
						<form id="userForm" method="POST" enctype="utf8">
	<div class="container">
		<div id="signupbox">
					<div id="logobox"><a href="http://talenteck.com"><img src="resources/img/analytics/talent_Teck_logo.jpg"></a></div>
			<div class="panel panel-info">
				<div class="panel-heading">
					<div style="float:right;">Already have an account? <a href="<c:url value="login.html" />">Login</a></div>
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
				</form>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="submit" id="submit" class="btn btn-primary">Save</button>
				</div>
			</div>
		</div>
	</div>
</security:authorize>
</body>
</html>