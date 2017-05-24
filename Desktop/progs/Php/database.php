<?php
	$dbhost = "localhost";
	$dbuser = "colledu9_words";
	$dbpass = "^c@ll3ct";
	$conn = mysql_connect($dbhost, $dbuser, $dbpass);

	if(! $conn ) {
	die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("colledu9_spelling_words");
	$result = mysql_query("SELECT word FROM word_list ORDER BY RAND() LIMIT 1");
	$word = mysql_fetch_row($result)[0];
	mysql_close($conn);
	echo $word;
?>