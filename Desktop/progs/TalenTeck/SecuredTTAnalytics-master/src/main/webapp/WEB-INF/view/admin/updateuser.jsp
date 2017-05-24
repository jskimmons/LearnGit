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
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">Edit User</h4>
					</div>
				<div class="modal-body">
						<form id="userForm" method="POST" enctype="utf8">
							<c:set var="userroles" value="${map['user'].roles}"/>	
							<c:set var="userdb" value="${map['userDB']}"/>													
							<input class="form-control" type="hidden" name="id" value="${map['user'].id}" /> 
							<input class="form-control" type="hidden" name="createdDate" value="${map['user'].createdDate}" /> 
							<input class="form-control" type="hidden" name="password" value="${map['user'].password}" />
							<input class="form-control" type="hidden" name="tokenExpired" value="${map['user'].tokenExpired}" />
							<input class="form-control" type="hidden" name="matchingPassword" value="${map['user'].password}" />

							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.email"></spring:message></label> 
								<span class="col-sm-6"><input type="email" class="form-control" name="email" value="${map['user'].email}" readonly="true" /></span> 
							</div>
							
							<c:choose>
   							<c:when test="${map['user'].enabled}">
   									<div class="form-group row">
   									<label class="col-sm-4"><spring:message code="label.user.enabled"></spring:message></label> 
   									<span class="col-sm-1"> <input type="checkbox" name="enabled" checked /></span> 
									</div>
   							</c:when> 
   							<c:when test="${map['user'].enabled}">
   									<div class="form-group row">
   									<label class="col-sm-4"><spring:message code="label.user.enabled"></spring:message></label> 
   									<span class="col-sm-1"><input type="checkbox" name="enabled" /></span> 
									</div>
   							</c:when>
							</c:choose>
							
							 <div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.passwordExpirydate"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="passwordExpirydate" value="${map['user'].passwordExpirydate}" readonly /></span> 
								<span id="passwordExpirydateError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div> 		
														
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.firstName"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="firstName" value="${map['user'].firstName}" required /></span> 
								<span id="firstNameError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>

							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.middleName"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="middleName" value="${map['user'].middleName}" required /></span> 
								<span id="middleNameError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
							
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.lastName"></spring:message></label> 
								<span class="col-sm-6"> <input class="form-control" name="lastName" value="${map['user'].lastName}" required /></span> 
								<span id="lastNameError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>

							
						<div class="form-group row">
						 	<label class="col-sm-4"><spring:message code="label.user.databasee"></spring:message></label> 
							<span class="col-sm-6">
							<c:forEach var="db" items = "${map['dbList']}" >
							<c:choose>
		 						<c:when test="${fn:contains(userdb,db)}">
									<input type=checkbox name="databasee" value="${db}" checked>${db}<BR>							
 								</c:when>
 								<c:otherwise>
									<input type=checkbox name="databasee" value="${db}" >${db}<BR>							
 								</c:otherwise>
 							</c:choose>		
							</c:forEach>							
          					</span> 
						</div>
							
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.workLocation"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="workLocation" value="${user.workLocation}" required /></span> 
								<span id="workLocationError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
							
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.workCompany"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="workCompany" value="${map['user'].workCompany}" required /></span> 
								<span id="workCompanyError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
							
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.workTitle"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="workTitle" value="${user.workTitle}" required /></span> 
								<span id="workTitleError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>

							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.internationalCode"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="internationalCode" value="${map['user'].internationalCode}" required /></span> 
								<span id="internationalCodeError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
							
							<div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.phoneNumber"></spring:message></label> 
								<span class="col-sm-6"><input class="form-control" name="phoneNumber" value="${map['user'].phoneNumber}" required /></span> 
								<span id="phoneNumberError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
							
							 <div class="form-group row">
								<label class="col-sm-4"><spring:message code="label.user.phoneType"></spring:message></label> 
								<span class="col-sm-6">
								<select class="form-control" name="phoneType">
										<option value="Home" <c:if test="${map['user'].phoneType eq 'Home'}"> selected </c:if>>Home</option>
										<option value="Work" <c:if test="${map['user'].phoneType eq 'Work'}"> selected </c:if>>Work</option>
										<option value="Mobile" <c:if test="${map['user'].phoneType eq 'Mobile'}"> selected </c:if>>Mobile</option>									
								</select>								
								</span> 
								<span id="phoneTypeError" class="alert alert-danger col-sm-4" style="display: none"></span>
							</div>
						
						<div class="form-group row">
						 	<label class="col-sm-4"><spring:message code="label.user.role"></spring:message></label> 
							<span class="col-sm-6">
		 						<c:forEach var="roleList" items="${map['roleList']}">
		 						<c:choose>
		 							<c:when test="${fn:contains(userroles,roleList.name)}">
 										<input type=checkbox name="roless" value="${roleList.name}" checked> ${roleList.name} <BR>
 									</c:when>
 									<c:otherwise>
 									 	<input type=checkbox name="roless" value="${roleList.name}" > ${roleList.name} <BR>
 									 </c:otherwise>
 								</c:choose>									
 								</c:forEach>
           					</span> 
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