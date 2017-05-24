<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page session="false"%>
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<style>
.password-verdict {
	color: #000;
}
</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="<c:url value="/resources/pwstrength.js" />"></script>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<title><spring:message code="label.form.title"></spring:message></title>
</head>
<body>
	<div class="container">
		<div>
			<h1>Update User</h1>
			<br>
			<form  id="userForm" method="POST" enctype="utf8">

				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.firstName"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="firstName" value="${user.firstName}" required /></span> <span
						id="firstNameError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.lastName"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="lastName" value="${user.lastName}" required /></span> <span
						id="lastNameError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.middleName"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="middleName" value="${user.middleName}" required /></span> <span
						id="middleNameError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.workLocation"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="workLocation" value="${user.workLocation}" required /></span> <span
						id="workLocationError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.workCompany"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="workCompany" value="${user.workCompany}" required /></span> <span
						id="workCompanyError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.workTitle"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="workTitle" value="${user.workTitle}" required /></span> <span
						id="workTitleError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.passwordExpirydate"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="countryCode" value="${user.passwordExpirydate}" required /></span> <span
						id="countryCodeError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.phoneNumber"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="phoneNumber" value="${user.phoneNumber}" required /></span> <span
						id="phoneNumberError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>
				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.phoneType"></spring:message></label> <span
						class="col-sm-5"><input class="form-control"
						name="phoneType" value="${user.phoneType}" required /></span> <span
						id="phoneTypeError" class="alert alert-danger col-sm-4"
						style="display: none"></span>

				</div>

				<div class="form-group row">
					<label class="col-sm-3"><spring:message
							code="label.user.email"></spring:message></label> <span class="col-sm-5"><input
						type="email" class="form-control" name="email"
						value="${user.email}" required /></span> <span id="emailError"
						class="alert alert-danger col-sm-4" style="display: none"></span>

				</div>
				
                <br>
				<button type="submit" class="btn btn-primary">
					<spring:message code="label.form.submit"></spring:message>
				</button>
				</form>
				<br> <a href="<c:url value="login.html" />"><spring:message
						code="label.form.loginLink"></spring:message></a>
		</div>
	</div>

	<script type="text/javascript">
/*		$(document)
				.ready(
						function() {
							$('form').submit(function(event) {
								register(event);
							});

							$(":password")
									.keyup(
											function() {
												if ($("#password").val() != $(
														"#matchPassword").val()) {
													$("#globalError")
															.show()
															.html(
																	'<spring:message code="PasswordMatches.user"></spring:message>');
												} else {
													$("#globalError").html("")
															.hide();
												}
											});

							options = {
								common : {
									minChar : 8
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
						});*/

		function register(event) {
			event.preventDefault();
			/*$(".alert").html("").hide();
			$(".error-list").html("");
			if ($("#password").val() != $("#matchPassword").val()) {
				$("#globalError")
						.show()
						.html(
								'<spring:message code="PasswordMatches.user"></spring:message>');
				return;
			}*/
			var formData = $('form').serialize();
			$
					.post(
							"<c:url value="/user/update"/>",
							formData,
							function(data) {
								if (data.message == "success") {
									window.location.href = "<c:url value="/users"></c:url>";
								}

							})
					.fail(
							function(data) {
								/*if (data.responseJSON.error
										.indexOf("MailError") > -1) {
									window.location.href = "<c:url value="/emailError.html"></c:url>";
								} else if (data.responseJSON.error == "UserAlreadyExist") {
									$("#emailError").show().html(
											data.responseJSON.message);
								} else if (data.responseJSON.error
										.indexOf("InternalError") > -1) {
									window.location.href = "<c:url value="/login.html"></c:url>"
											+ "?message="
											+ data.responseJSON.message;
								} else {
									var errors = $
											.parseJSON(data.responseJSON.message);
									$.each(errors, function(index, item) {
										$("#" + item.field + "Error").show()
												.html(item.defaultMessage);
									});
									errors = $
											.parseJSON(data.responseJSON.error);
									$.each(errors, function(index, item) {
										$("#globalError").show().append(
												item.defaultMessage + "<br>");
									});
								} */
							});
		}
	</script>
</body>

</html>