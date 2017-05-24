<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<fmt:setBundle basename="messages" />
<%@ page session="true"%>
<fmt:message key="message.password" var="noPass" />
<fmt:message key="message.username" var="noUser" />

<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<title><spring:message code="label.pages.home.title"></spring:message></title>
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
    <script src="//cdn.jsdelivr.net/jquery.ui.touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript">
    function validate() {
        if (document.f.j_username.value == ""
                && document.f.j_password.value == "") {
            alert("${noUser} & ${noPass}");
            document.f.j_username.focus();
            return false;
        }
        if (document.f.j_username.value == "") {
            alert("${noUser}");
            document.f.j_username.focus();
            return false;
        }
        if (document.f.j_password.value == "") {
            alert("${noPass}");
            document.f.j_password.focus();
            return false;
        }
    }
    $(document).ready(function(){
    	if ( screen.width < 1000 || screen.height < 600 ) {
    		var warningDiv = $('<div style="font-size: xx-small; text-align: center; color: #a94442; background-color: #f2dede; border-color: #ebccd1; height: 30px; padding: 10; font-weight: normal; font-style: oblique;"><span><i class="glyphicon glyphicon-info-sign"></i></span> WE RECOMMEND A FULL-SIZE SCREEN FOR BEST VIEWING EXPERIENCE.</div>');
    		$("#mobileWarningDiv").html(warningDiv);
    	}
    });
</script>

<style type="text/css">	
	
#loginbox{
	width: 400px;
    margin-left: auto;
    margin-right: auto;
    -webkit-box-shadow: 5px 5px 15px rgba(0,0,0,0.4);
    
	}	
#logobox {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 15%;
    margin-bottom : 20px;
    height: 100px;
    width : 100%;
    }
.panel-info {
    border-color: transparent;
    }
.btn-info,.btn-info.active,.btn-info.focus, .btn-info:active, .btn-info:focus, .btn-info:hover, .open>.dropdown-toggle.btn-info{
background-color:#A1CEA1;
border-color:#A1CEA1;
}
.panel{
margin:0px;
padding: 15px;
}
.panel-body{
padding:0px;
}
img{
width:250px;
padding-top:35px;
}
</style>

</head>
<body>
	<div class="container">
		<div id="loginbox" class="mainbox">
			<div id="logobox"><a href="http://talenteck.com"><img src="resources/img/analytics/talent_Teck_logo.png"></a></div>
			<div class="panel panel-info">
				<div class="panel-body">
					<div style="display: none" id="login-alert" class="alert alert-danger col-sm-12"></div>
					<form name='f' action="j_spring_security_check" method='POST' onsubmit="return validate();" class="form-horizontal">
						<c:if test="${param.error != null}">
							<c:choose>
								<c:when test="${SPRING_SECURITY_LAST_EXCEPTION.message == 'User is disabled'}">
									<div class="alert alert-danger"><spring:message code="auth.message.disabled"></spring:message>
									<a href="<c:url value="resendLink.html" />">Resend Code?</a></div>
								</c:when>
								<c:when test="${SPRING_SECURITY_LAST_EXCEPTION.message == 'User account has expired'}">
									<div class="alert alert-danger"><spring:message code="auth.message.expired"></spring:message></div>
								</c:when>
								<c:when test="${SPRING_SECURITY_LAST_EXCEPTION.message == 'blocked'}">
									<div class="alert alert-danger"><spring:message code="auth.message.blocked"></spring:message></div>
								</c:when>
								<c:when test="${SPRING_SECURITY_LAST_EXCEPTION.message == 'User credentials have expired'}">
									<div class="alert alert-danger">Your credentials have expired.Contact Admin</div>
								</c:when>
								
								<c:otherwise>
									<div class="alert alert-danger"><spring:message code="message.badCredentials"></spring:message></div>
								</c:otherwise>
							</c:choose>
						</c:if>
						
						<c:if test="${param.message != null}">
							<div class="alert alert-info">${param.message}</div>
						</c:if>
						
						<c:if test="${param.errorMsg == 'NoAccess'}">
							<div class="alert alert-danger"><spring:message code="auth.message.noAccess"></spring:message></div>
						</c:if>
						<c:if test="${param.errorMsg == 'SessionTimeOut'}">
							<div class="alert alert-danger">Session time out. Please login again.</div>
						</c:if>
						<div style="margin-bottom: 25px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span> 
							<input id="login-username" type="text" class="form-control" name='j_username' value="" placeholder="Email">
						</div>
						<div style="margin-bottom: 25px" class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> 
							<input id="login-password" type="password" class="form-control" name="j_password" placeholder="Password">
						</div>
						<div style="margin-top: 10px;margin-bottom: 10px">
							<div>
								<input class="btn btn-primary btn-block" name="submit" type="submit" value="Login" />
							</div>
						</div>
							<div>
				<div style="float: left; font-size:small;">Don't have an account!  <a href="<c:url value="registration.html" />"><spring:message code="label.form.loginSignUp"></spring:message></a></div>
				<div style="font-size: small;float:right;"><a href="<c:url value="forgotPassword.html" />"><spring:message code="message.resetPassword"></spring:message></a></div>
			</div>	
					</form>
				</div>
			</div>
			<div id="mobileWarningDiv"></div>
			</div>
		</div>
</body>
</html>