<html>
<head>
<title>Pick One</title>
</head>

<center><span style=font-family:Times;font-size:50px;> Pick One 		</span></center>
<hr>
<body>
<table style="width:100%">
<?php 
//open session to store data
session_start();

$_SESSION['image'] = array('a.jpeg','b.jpeg','c.jpeg','d.jpeg','e.jpeg','f.jpeg');
$_SESSION['i'] = count($_SESSION['image']);

$_SESSION['seen'] = array(); 
//populates seen array with 0's meaning no pictures have been seen
for ($x=0; $x<$_SESSION['i']; $x++){
	$_SESSION['seen'][$x]=0;
}

//Function to begin game
function startGame($array, $c){
	// two rand int
	$firstpic=rand(0,$c-1);
	$secondpic=rand(0,$c-1);

	//checks if two rand int are the same
	function checkSame(&$x, &$y, $z){
		if ($x==$y){
			$x=rand(0,$z-1);
			$y=rand(0,$z-1);
			checkSame($x,$y,$z);
		}
	}

	checkSame($firstpic, $secondpic, $c);

	function checkSeen(&$x, &$y, $z){
		
		if($_SESSION['seen'][$x]==1){
			$x=rand(0,$z-1);
			checkSeen($x, $y, $z);
		}
		if($_SESSION['seen'][$y]==1){
			$y=rand(0,$z-1);
			checkSeen($x, $y, $z);
		}
		
	}
	
	checkSeen($firstpic, $secondpic, $c);

echo '<td><center><img src="' . $array[$firstpic] . '" width="250" height="250"></center></td>';
	echo '<td><center><img src="' . $array[$secondpic] . '" width="250" height="250"></center></td>';

	$_SESSION['seen'][$firstpic]=1;
	$_SESSION['seen'][$secondpic]=1;


}
startGame($_SESSION['image'], $_SESSION['i']);
	 ?>
</table>
</body>
<form action="facemash.php" method="post">
  <input type="submit" value="Run me now!">
</form>
</html>