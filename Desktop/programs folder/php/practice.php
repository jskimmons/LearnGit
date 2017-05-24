<?php
session_start();

$_SESSION['value'] = 6;

$_SESSION['array'] = array(6,7,8);

?>

<form action="run.php" method="post">
  <input type="submit" value="Run me now!">
</form>


