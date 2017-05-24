<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sec"
    uri="http://www.springframework.org/security/tags"%>
<%@ page session="false"%>
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<title><spring:message code="message.updatePassword"></spring:message></title>
<style>
#updatepasswordbox{
	width:450px;
    margin-left: auto;
    margin-right: auto;
    margin-top:10%;
    -webkit-box-shadow: 5px 5px 15px rgba(0,0,0,0.4);	
}
.btn-info,.btn-info.active,.btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{
background-color:#A1CEA1;
border-color:#A1CEA1;
}
 #logobox {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-bottom : 20px;
    height: 100px;
    width : 100%;
    }
  img{
width:250px;
padding-top:35px;
}  
</style>
</head>
<body>
<sec:authorize access="hasRole('READ_PRIVILEGE')">
   <div class="container">
		<div id="updatepasswordbox">
				<div id="logobox"><a href="http://talenteck.com"><img src="resources/img/analytics/talent_Teck_logo.jpg"></a></div>
				<div style="padding-top: 10px" class="panel-body">
						<div style="margin-bottom: 15px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> 
							<input class="form-control" id="pass" name="password" type="password" value="" placeholder="Enter Your New Password" />
						</div>
						<div style="margin-bottom: 5px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> 
                    		<input class="form-control" id="passConfirm" type="password" value="" placeholder="Re-Enter Your New Password" />
                    		<span id="error" class="alert alert-danger" style="display:none"></span>
                    		
						</div>
							<div>
								<input class="btn btn-info btn-block" name="submit" onclick="savePass()" type="submit" value=<spring:message code="label.form.submit"></spring:message> />
							</div>
				</div>
		</div>
	</div>		
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type="text/javascript">
function savePass(){
    var pass = $("#pass").val();
    var valid = pass == $("#passConfirm").val();
    if(!valid) {
      $("#error").show();
      return;
    }
    $.post("<c:url value="/user/savePassword"></c:url>",{password: pass} ,function(data){
            window.location.href = "<c:url value="/login.html"></c:url>" + "?message="+data.message;
    })
    .fail(function(data) {
        window.location.href = "<c:url value="/login.html"></c:url>" + "?message=" + data.responseJSON.message;
    });
}
</script>    
</sec:authorize>
</body>

</html>