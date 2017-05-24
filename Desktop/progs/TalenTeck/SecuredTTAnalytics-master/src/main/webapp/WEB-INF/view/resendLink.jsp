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
<title><spring:message code="message.resetPassword"></spring:message></title>
<style>
	label {
		padding-left:0;
	}
	.container{
		margin:0px;
		padding:0px;
	}
	#resendlinkbox{
	margin-top: 50px; 
	width:450px;
	background-color:#d9edf7;
	padding-top: 15px;
	padding-bottom: 15px;
	border-radius: 8px;
	}
	.panel-info {
    border-color: #d9edf7;
    }
      .panel-heading {
    padding: 10px 2px;
    }
    .panel-title{
    font-weight:500;
    }
</style>
</head>
<body>

<div class="container">
		<div id="resendlinkbox" style="" 
		class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
			<div class="panel panel-info">
				<div class="panel-heading">
					<div class="panel-title">Resend Link</div>
			</div>
				<div class="panel-body">
						<div style="margin-bottom: 25px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span> 
							<input class="form-control" id="email" name="email" type="email" value="" placeholder="Enter your registered Email Address" />
						</div>
						<div style="margin-top: 10px" class="form-group">
							<div class="col-sm-12 controls">							
								<input class="btn btn-info btn-block" name="submit" type="submit" onclick="resendLink()" value="Reset Password" />
							</div>
						</div>
				</div>
			</div>
		</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type="text/javascript">
function resendLink(){
    var email = $("#email").val();
    $.get("<c:url value="/user/resendLink"></c:url>",{email: email} ,function(data){
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