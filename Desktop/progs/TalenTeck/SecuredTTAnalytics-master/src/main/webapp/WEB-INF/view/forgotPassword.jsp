<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page session="false"%>
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<title><spring:message code="message.resetPassword"></spring:message></title>
<style>
	#forgotpasswordbox{
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

<div class="container">
		<div id="forgotpasswordbox" style="" class="mainbox">
		<div id="logobox"><a href="http://talenteck.com"> <img src="resources/img/analytics/talent_Teck_logo.jpg"></a></div>
				<div class="panel-body">
						<div style="margin-bottom: 25px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span> 
							<input class="form-control" id="email" name="email" type="email" value="" placeholder="Enter your registered Email Address" />
						</div>
						<div style="margin-top: 10px" class="form-group">
							<div>							
								<input class="btn btn-info btn-block" name="submit" type="submit" onclick="resetPass()" value="Send" />
							</div>
						</div>
					<div style="font-size: small;font-weight:400;float:right;padding-top:9px;">Remember your password?      <a href="<c:url value="login.html" />">Sign In</a></div>			
				</div>
			</div>
		</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type="text/javascript">
function resetPass(){
    var email = $("#email").val();
    $.post("<c:url value="/user/resetPassword"></c:url>",{email: email} ,function(data){
            window.location.href = "<c:url value="/login.html"></c:url>" + "?message=" + data.message;
    })
    .fail(function(data) {
    	if(data.responseJSON.error.indexOf("MailError") > -1)
        {
            window.location.href = "<c:url value="/emailError.html"></c:url>";
        }
        else{
            window.location.href = "<c:url value="/login.html"></c:url>" + "?message=" + data.responseJSON.message;
        }
    });
}

$(document).ajaxStart(function() {
    $("title").html("LOADING ...");
});
</script>
</body>

</html>