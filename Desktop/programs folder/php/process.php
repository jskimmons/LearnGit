<form method = "POST">
  New Username:<br>
  <input type="text" name="nUsername">
  <br>
  New Password:<br>
  <input type="text" name="nPassword">
  <input id="button" type="submit" name="submit" value="submit">
</form>
<?php	
$nUsername = $_POST[nUsername];
$nPassword = $_POST[nPassword];	
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
$sql2 = "INSERT INTO Login VALUES ('$nUsername','$nPassword');";
$que = mysql_query($sql2,$dbh);
?>