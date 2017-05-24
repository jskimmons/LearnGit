<%@page import="com.talenteck.ttanalytics.DatabaseReference"%>
<%@page import="java.util.HashMap"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
    uri="http://www.springframework.org/security/tags"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ page session="true"%>
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<title><spring:message code="label.pages.home.title"></spring:message></title>
</head>
<body>



<nav class="navbar navbar-default">
  <div class="container-fluid">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="<c:url value="/j_spring_security_logout" />"><spring:message code="label.pages.logout"></spring:message></a> </li>
      </ul>
    </div>
</nav>

    <div class="container">
          <sec:authorize access="hasRole('READ_PRIVILEGE')">Welcome ${param.user}
                <br />
            </sec:authorize>

            <sec:authorize access="hasRole('WRITE_PRIVILEGE')">
                <spring:message code="label.pages.admin.message"></spring:message>
                <br />
            </sec:authorize>
              <%
	           String[] databases = session.getAttribute("database").toString().split(",",-1);
           	   String dblist="";

               for(int i=0;i<databases.length;i++){
            	   
            		String db = new DatabaseReference().getDBCode(databases[i]);
             	  dblist = dblist + "<a href='/ttwebsite/analytics/landingpage.html?client=" + db + "'>"+ db +"</a><br>";
               }
               out.print(dblist);   %>
	
               
              <!--  
                     		   //out.print("Session ID: " + session.getId() +"<br>" 
          		 //  + "Session Attribute:role: " + session.getAttribute("role") + "<br>" 
         		  // + "Session Attribute:database: " + request.getSession(true).getAttribute("database")); 
         		  ${param.user}| SessionID:${pageContext.session.id}
	         <a class="btn btn-default" href="<c:url value="/admin.html" />"><spring:message code="label.pages.admin"></spring:message></a> -->
    </div>
</body>
</html>