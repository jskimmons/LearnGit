<?php

//taking username and password 
//from html form
$Username=$_POST[username];
$Password= $_POST[password];


//database login info
$server="localhost";
$username="root";
$password="root";

//creating databse handler
$dbh = mysql_connect($server,$username,$password);

//check connection
if ($dbh -> connect_error){
	die("Connection to Database failed");
}

$db=mysql_select_db("CoreData",$dbh);
if (!$db) {
    die("Cannot Select DB....");
}
?>
<?php
//check username and password in datbase
$sql = "SELECT * FROM Login WHERE Username = '$Username' and Password ='$Password'";
$res = mysql_query($sql,$dbh);


if(mysql_num_rows($res)>0){  //we got a hit....need to check if in db .. update or insert...
	echo "Welcome, " . $Username;
}
else{
	echo "Invalid Username and Password";
	include("register.html");
}
?>
