
<head>
<link rel="stylesheet" href="animations.css">
<title>
PALS - Navigation Tool
</title>
<body bgcolor=#49E487>
<style type="text/css">
.button {
   border-top: 1px solid #96d1f8;
   background: #65a9d7;
   background: -webkit-gradient(linear, left top, left bottom, from(#3e779d), to(#65a9d7));
   background: -webkit-linear-gradient(top, #3e779d, #65a9d7);
   background: -moz-linear-gradient(top, #3e779d, #65a9d7);
   background: -ms-linear-gradient(top, #3e779d, #65a9d7);
   background: -o-linear-gradient(top, #3e779d, #65a9d7);
   padding: 20px 40px;
   -webkit-border-radius: 0px;
   -moz-border-radius: 0px;
   border-radius: 0px;
   -webkit-box-shadow: rgba(0,0,0,1) 0 1px 0;
   -moz-box-shadow: rgba(0,0,0,1) 0 1px 0;
   box-shadow: rgba(0,0,0,1) 0 1px 0;
   text-shadow: rgba(0,0,0,.4) 0 1px 0;
   color: white;
   font-size: 24px;
   font-family: Georgia, serif;
   text-decoration: none;
   vertical-align: middle;
   width:50%;
   height: 10%;
   float:right;
   position:relative;
   
   
   }
.button:hover {
   border-top-color: #28597a;
   background: #28597a;
   color: #ccc;
   }
.button:active {
   border-top-color: #1b435e;
   background: #1b435e;
   }


   </style>
   </head>
  

<?php 
session_start(); 

//base html for head section and background color
function safe($value) {
	return mysql_real_escape_string($value);
}


//we are back in... so check out penis
if (isset($_POST['answer']))  {
	$answerFrom=$_POST['answer']; //get the hidden answer
               //check the contents back....
	$inIt=1;
	$correctStatus=0;

	$area=$_SESSION['area'];
	$a1=$_SESSION['a1'];
	$a2=$_SESSION['a2'];
	$a3=$_SESSION['a3'];
	$a4=$_SESSION['a4'];
	$seen=$_SESSION['seen'];
      $i=$_SESSION['i'];
	$image=$_SESSION['image'];
	$rightAnswer=$_SESSION['rightAnswer'];
	$question=$_SESSION['question'];
      $thisOne=$_SESSION['thisOne'];


	echo "<h1 class= \"bounceInDown animated\"> Welcome new user $area  ! </h2>";  
      
	$conf['server'] = 'localhost'; //the db resides on the local host -- the server we are using....
	$conf['db'] = 'PALS_Find'; //add the  database name here
	$conf['user'] = 'pals_find'; //add the  db admin login here admin_
	$conf['pass'] = 'maxStripes,1'; //add the  password here 
 
	// Connect To DB server
	$dbh = mysql_connect($conf['server'],$conf['user'],$conf['pass']);
	if (!$dbh) {
    	die("Cannot Connect to DB...."); 
	}

	$db=mysql_select_db($conf['db'],$dbh);
	if (!$db) {
    		die("Cannot Select DB...."); 
	}

	 $myDate=date("l jS \of F Y h:i:s A"); //date...
      if (strcmp($answerFrom,"correct")==0) {

		echo( "<embed name='sound_file' src='correct.mp3' loop='false' hidden='true' autostart='true'/>");

		$correctStatus=1;
		//good game massage.. start new game
           echo "<h1 class=\"swing animated infinite \">GOOD JOB!</h2>";

		//call function
           //log it....

	
           $sql="INSERT into `stats` values ('$area','$myDate','right','0')";
		$res = mysql_query($sql,$dbh);

           
           doIt(); //call function to set up new stuff
      }
	else {
		$correctStatus=0;

		echo( "<embed name='sound_file' src='wrong.mp3' loop='false' hidden='true' autostart='true'/>");

		//bad choice message.. continue game
		//call function
           //log it...
		echo "<h1 class= \"shake animated infinite \">WRONG ANSWER!</h2>";

           $sql="INSERT into `stats` values ('$area','$myDate','wrong','0')";
		$res = mysql_query($sql,$dbh);

		/*print_r($image);
		print_r($question);
		print_r($rightAnswer);
		print_r($a1);
		print_r($a2);
		print_r($a3);
		print_r($a4); */

           doItWrong(); //stay here...
	}
}
else {
	$correctStatus=2;
	$inIt=0;
}


if ($inIt == 0) {
	$conf['server'] = 'localhost'; //the db resides on the local host -- the server we are using....
	$conf['db'] = 'PALS_Find'; //add the  database name here
	$conf['user'] = 'pals_find'; //add the  db admin login here admin_
	$conf['pass'] = 'maxStripes,1'; //add the  password here 
 
	// Connect To DB server
	$dbh = mysql_connect($conf['server'],$conf['user'],$conf['pass']);
	if (!$dbh) {
    	die("Cannot Connect to DB...."); 
	}

	$db=mysql_select_db($conf['db'],$dbh);
	if (!$db) {
    		die("Cannot Select DB...."); 
	}




	//bring in field names from html doc..
	$area = safe($_POST['area']);	//must accept the form args from the html form calling
	$questions= $_POST['questions'];//must accept the form args from the html form calling
	$questions2= $_POST['questions2'];//must accept the form args from the html form calling

	//echo"$area<br>";
	//echo"$questions<br>";
	//echo"$questions2<br>";
	//lowercase bruh
	$area=strtolower($area);
 
	//check to see if there.... use student id -- login is table name..
	$sql = "SELECT * FROM login WHERE id = '$area'";  //this is sql command to check your login table
	$res = mysql_query($sql,$dbh);

	if(mysql_num_rows($res)>0){	//we got a hit....need to check if in db .. update or insert...
           	echo "<h1 class= \"bounceInDown animated\"> Welcome back user $area  ! </h2>";

		
	 $_SESSION['area']=$area;
	}
	else{
		echo "<h1 class= \"bounceInDown animated\"> Welcome back user $area  ! </h2>";
		$sql="INSERT into `login` values ('$area')";
		$res = mysql_query($sql,$dbh);

		$_SESSION['area']=$area;

                                  
		//bells and whistles		
	}
}




if ($inIt == 0) {
	//set a counter to keep track of questions
	$counter=0;
	$i=0;

	$image=array(); //will be string
	$rightAnswer=array(); //will be string
	$question=array(); //will be string
	$seen=array(); //will be bool
	$a1=array();
	$a2=array();
	$a3=array();
	$a4=array();

	//save the arrays in session ids...
      //......*************************************************
      $_SESSION['area']=$area;
	$_SESSION['a1']=$a1;
	$_SESSION['a2']=$a2;
	$_SESSION['a3']=$a3;
	$_SESSION['a4']=$a4;
	$_SESSION['image']=$image;
	$_SESSION['seen']=$seen;
	$_SESSION['image']=$image;
	$_SESSION['rightAnswer']=$rightAnswer;
	$_SESSION['question']=$question;	
      $_SESSION['thisOne']=$thisOne;	


	$sql="SELECT * FROM coreData";
	$res = mysql_query($sql,$dbh);
	echo mysql_error();

	if(mysql_num_rows($res)>0) {	
		//get info from table into arrays
		//via while loop
		while ($myrow = mysql_fetch_array($res)) {
			$image[$i]=$myrow['image'];
			$question[$i]=$myrow['question'];
			$rightAnswer[$i]=$myrow['answer'];
			$a1[$i]=$myrow['a1'];
			$a2[$i]=$myrow['a2'];
			$a3[$i]=$myrow['a3'];
			$a4[$i]=$myrow['a4'];
			$seen[$i]=0;
			$i++;
		} //close while loop...
	/* print_r($image);
	print_r($question);
	print_r($rightAnswer);
	print_r($a1);
	print_r($a2);
	print_r($a3);
	print_r($seen);
	echo "<br> I = $i";
      */
	
	}
	else {
		die("Sorry... Fatal Error.. No Info In Core Data.. Contact Admin.");

	}
}

if ($inIt == 0) 
{doIt();}

//now write a function to do the work
//pick random record...
function doIt() {

   //but we need to check if this random  has 
   //been seen... arrays and vars from above must be global
   //so that this function can see
   global $seen;
   global $i;
   global $question;
   global $image;
   global $a1, $a2, $a3, $a4;
   global $rightAnswer;

   //check -- are we done.. is seen table all seen?
   $y=0;
   for ($x=0; $x < $i; $x++) {
        if ($seen[$x] == 0) {
			$y=1;
			break;
        }
   }
   if ($y == 0) {
	die("<h1 class=\"pulse animated infinite\">CONGRATULATIONS</h1> <b><b><b><b><b><b> <h1 class=\"jello animated infinite\">YOU WIN!</h1>");
   }
    $_SESSION['a1']=$a1;
    $_SESSION['a2']=$a2;
	$_SESSION['a3']=$a3;
	$_SESSION['a4']=$a4;
    $_SESSION['i']=$i; //i needs to be stored..
	$_SESSION['image']=$image;	
	$_SESSION['rightAnswer']=$rightAnswer;
	$_SESSION['question']=$question;	
      

   $y=0;
   while ($y == 0) {
   	//get a random set..
   	$thisOne=rand(0,$i-1);  //get a rand one..

   	//make sure not seen already... 
   	if ($seen[$thisOne] == 0) {
		$y=1;
	}          
   	
   }

	
   // ***CLASS --> html code needs to be inside this echo to
   // make better -- bigger -- color etc. USE CSS ON BUTTONS IF NEEDED	
    $seen[$thisOne]=1;

   $_SESSION['thisOne']=$thisOne;	
   $_SESSION['seen']=$seen;	
   echo "<center> <img align=center src=images/$image[$thisOne]>";
   echo "<hr>";
   echo "<B> <font face=arial size=3>";
   echo "<h1 class=\"bounceInUp animated \">$question[$thisOne]</h2>";
   echo "<hr>";

   //put up the question buttons....
   // ***CLASS --> html code needs to be inside this echo to
   // make better -- bigger -- color etc. USE CSS ON BUTTONS IF NEEDED	
  

echo "<form> <input type=hidden> </form>";
   if (strcmp($a1[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a1 name=a1 method=post action=pals_find9.php?answer=1><input type=submit name=a1 id=a1 value=\"$a1[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a1 name=a1 method=post action=pals_find9.php?answer=0><input type=submit name=a1 id=a1 value=\"$a1[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a2[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a2 name=a2 method=post action=pals_find9.php?answer=1><input type=submit name=a2 id=a2 value=\"$a2[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a2 name=a2 method=post action=pals_find9.php?answer=0><input type=submit name=a2 id=a2 value=\"$a2[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a3[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a3 name=a3 method=post action=pals_find9.php?answer=1><input type=submit name=a3 id=a3 value=\"$a3[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a3 name=a3 method=post action=pals_find9.php?answer=0><input type=submit name=a3 id=a3 value=\"$a3[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a4[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a4 name=a4 method=post action=pals_find9.php?answer=1><input type=submit name=a4 id=a4 value=\"$a4[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a4 name=a4 method=post action=pals_find9.php?answer=0><input type=submit name=a4 id=a4 value=\"$a4[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

} //end of function


//this is stripped down version of above
//it simply re-displays current set...
function doItWrong() {
	
   // arrays and vars from above must be global
   //so that this function can see
   global $seen;
   global $i;
   global $question;
   global $image;
   global $a1, $a2, $a3, $a4;
   global $rightAnswer;
   global $thisOne;  

   
   // ***CLASS --> html code needs to be inside this echo to
   // make better -- bigger -- color etc. USE CSS ON BUTTONS IF NEEDED	

   echo "<center> <img align=center src=images/$image[$thisOne]>";
   echo "<hr>";
   echo "<B> <font face=arial size=3>";
   echo "<h1 class=\"bounceInUp animated \">$question[$thisOne]</h2>";
   echo "<hr>";

   //put up the question buttons....

   // ***CLASS --> html code needs to be inside this echo to
   // make better -- bigger -- color etc. USE CSS ON BUTTONS IF NEEDED	
echo "<form> <input type=hidden> </form>";
   if (strcmp($a1[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a1 name=a1 method=post action=pals_find9.php?answer=1><input type=submit name=a1 id=a1 value=\"$a1[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a1 name=a1 method=post action=pals_find9.php?answer=0><input type=submit name=a1 id=a1 value=\"$a1[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a2[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a2 name=a2 method=post action=pals_find9.php?answer=1><input type=submit name=a2 id=a2 value=\"$a2[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a2 name=a2 method=post action=pals_find9.php?answer=0><input type=submit name=a2 id=a2 value=\"$a2[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a3[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a3 name=a3 method=post action=pals_find9.php?answer=1><input type=submit name=a3 id=a3 value=\"$a3[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a3 name=a3 method=post action=pals_find9.php?answer=0><input type=submit name=a3 id=a3 value=\"$a3[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }

   if (strcmp($a4[$thisOne],$rightAnswer[$thisOne])==0) {
   	echo "<form id=a4 name=a4 method=post action=pals_find9.php?answer=1><input type=submit name=a4 id=a4 value=\"$a4[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=correct></form>";
   }
   else {
	echo "<form id=a4 name=a4 method=post action=pals_find9.php?answer=0><input type=submit name=a4 id=a4 value=\"$a4[$thisOne]\"class=button>";
        echo "<input type=hidden name=answer id=answer value=wrong></form>";
   }  

} //end of function



?>












