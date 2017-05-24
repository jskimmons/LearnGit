<!DOCTYPE html>
<html lang="en">
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>

<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.12/css/dataTables.bootstrap.min.css">
<!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"> -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"> 

</head>
<style>
.mainlayout {margin-top: 70px;}
.sidebar {float: left;width: 300px;}
</style>
<body>
	<div id="adminLayout">
		<div id="menubar"><%@ include file="menubar.jsp"%></div>
		<div id="mainlayout" class="mainlayout">
			<div id="sidebar" class="sidebar"><%@ include file="sidebar.jsp"%></div>
			<div id="main"  class="col-sm-9 col-md-9">
				<div class="main_container"></div>
			</div>
		</div>
	</div>
</body>
</html>