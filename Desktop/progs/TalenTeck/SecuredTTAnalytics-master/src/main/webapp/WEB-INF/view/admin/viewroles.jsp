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
 	$('#roles').DataTable({ 
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
             	<table id="roles" class="table table-bordred table-striped" cellspacing="0" width="100%"> 
              		<thead>
              		<tr>
                   		<td>Name</td>
                   		<td>Privileges</td>
                   		<td>Edit</td> 
                   		<td>Delete</td>
                   		</tr>
            		</thead>
    				<tbody>  
    					<c:forEach var="role" items="${roleList}">
							<tr>
								<td>${role.key}</td>
								<td>${role.value}</td>
								
								<spring:url value="/admin/roles/delete/${role.key}" var="deleteUrl" />
								<spring:url value="/admin/roles/update/${role.key}" var="updateUrl" /> 
								<td><a class="btn btn-primary pull-right modellink up " data-toggle="modal" data-target="#myModal" name='${updateUrl}'>Edit</a></td>
								<td><a class="btn btn-primary pull-right modellink del" data-toggle="modal" data-target="#myModal" name='${deleteUrl}'>Delete</a></td>		
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
