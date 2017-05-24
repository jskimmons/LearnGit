 <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
 <%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
    
<html>
<head>
<title>Web Users</title>
<style>
.container{width:1100px;}
.toolbar {
    float: left;
}
#users tr td{border-width:1px;
border-style:solid;
border-color:#ddd;
}

.jumbotron{
height:10px;
}
</style>
<script>
$(document).ready(function() {	
 	$('#users').DataTable({ 
    	"bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false, 
        "iDisplayLength": 10,
        "dom": '<"toolbar">frtip'
	});
    $("div.toolbar").html('<button id="newTag" onclick="newTag()" >New</button>');


    $('.modellink').click(function(e) {
    	var url=$(this).attr('name');
        $('.modal-container').load(url,function(result){
            $('#myModal').modal({show:true});
        });

    });
});

</script>
</head>
<body>
<div class="container" >
 <div class="row">
       <div class="col-md-12">
       		 <div class="table_users">
				<div class="modal-container"></div> 
             	<table id="users" class="table table-bordred table-striped" cellspacing="0" width="100%"> 
              		<thead>
              		<tr>
                   		<td>Privileges</td>
                   		<td>Edit</td> 
                   		<td>Delete</td>
                   		</tr>
            		</thead>
    				<tbody>  
    					<c:forEach var="privilege" items="${privilegeList}">
							<tr>
								<td>${privilege.name}</td>
								<spring:url value="/admin/privileges/delete/${user.id}" var="deleteUrl" />
								<spring:url value="/admin/privileges/update/${user.id}" var="updateUrl" /> 
								<td><a class="btn btn-primary pull-right modellink" data-toggle="modal" data-target="#myModal" name='${updateUrl}'>Edit</a></td>
								<td><a class="btn btn-primary pull-right modellink" data-toggle="modal" data-target="#myModal" name='${deleteUrl}'>Delete</a></td>		
   						</tr>
   						 </c:forEach>
   						
    				</tbody>       
				</table>
     		</div>          
 		</div> 
	</div> 
</div>
</body>
</html>
