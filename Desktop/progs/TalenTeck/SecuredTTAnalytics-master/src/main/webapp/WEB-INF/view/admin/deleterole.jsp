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
		    $(".main_container").load("viewroles.html");

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
						"<c:url value="/admin/roles/update"/>"
						,formData,
						function(data) {
							if (data.message == "success") {
								alert('Role updated successfully' );
								$(".modal").modal("hide");
								$(".modal").remove();
								$('.modal-backdrop').remove();
							    $(".main_container").load("viewroles.html");
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
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">Delete Role</h4>
					</div>
				<div class="modal-body">
						<form id="userForm" method="POST" enctype="utf8">
							<input class="form-control" type="hidden" name="roleName" value="${map['roleName']}" /> 
							<c:set var="roleprivileges" value="${role.users}"/>	
							

							<div class="form-group row">
								Deleting this role also removes users from this group Yes/No
							</div>
						
						<div class="form-group row">
						 	<label class="col-sm-4"><spring:message code="label.user.name"></spring:message></label> 
							<span class="col-sm-6">
		 						<c:forEach var="userList" items="${map['userList']}">
 										<input type=checkbox name="privilegess" value="${userList.email}" checked> ${userList.email} <BR>								
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