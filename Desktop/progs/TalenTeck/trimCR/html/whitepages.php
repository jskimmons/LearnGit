<?php
// $servername = "localhost";
// $username = "username";
// $password = "password";
// $dbname = "myDB";

// // Create connection
// $conn = new mysqli($servername, $username, $password, $dbname);
// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// } 

// $sql = "INSERT INTO MyGuests (firstname, lastname, email)
// VALUES ('John', 'Doe', 'john@example.com')";

// if ($conn->query($sql) === TRUE) {
//     echo "New record created successfully";
//     $success = TRUE;
// } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
// }

// $conn->close();
$success = TRUE;
if (isset($_POST['submit'])) {
     $to = 'info@talenteck.com'; // Use your own email address
     $subject = 'Feedback from my site';

$message = 'Name: ' . $_POST['firstName'] . ' ' . $_POST['lastName'] . "\r\n";
$message .= 'Email: ' . $_POST['EMail']. "\r\n";
$message .= 'Company: ' . $_POST['companyName'] . "\r\n";
$message .= 'Company Industry: ' . $_POST['companyIndustry'] . "\r\n";
$message .= 'Company Title: ' . $_POST['companyTitle'] . "\r\n";
$message .= 'Message: ' . $_POST['query'];
$headers = "From: info@talenteck.com\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8';
$email = filter_input(INPUT_POST, 'EMail', FILTER_VALIDATE_EMAIL);
if ($email) {
   $headers .= "\r\nReply-To: $email";
}
$success = mail($to, $subject, $message, $headers, '‑finfo@talenteck.com');
}
?>


<!DOCTYPE HTML>
<html>
	<head>
	<meta charset="utf-8">
	<title>Test</title>
	<link href="css/style.css" rel="stylesheet" type="text/css" />
	<!-- <meta http-equiv="refresh" content="3;url=download.pdf">  -->
	<!--possibly put this back in url in meta tag before download.pdf: http://www.talenteck.com/ -->
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>
	</head>

	<body>
		<div class="center-panel">
			<img src="images/TTlogo.png" alt="">
			<?php if (isset($success) && $success) { ?>
				<!-- <h2>Thank you. You may now select a white paper.</h1> -->
				<h3>Please select a white paper.</h3>
				<div class="pdf-boxes">
					<a href="download.pdf"><span>
					<h5>Learning About the Employer-Employee Match: Referrals and Search Efficiency</h5>
					<p>Tavis Barr, Raicho Bojilov, Lalith Munasinghe</p>
					</span></a>
					<a href="download.pdf" download="download" alt="">
					
					<img src="extra/downloadicon.png" alt="">
					</a>
					<!-- <p>Not redirecting? Click <a href="download.pdf">here</a></p> -->
				</div>
				<div class="pdf-boxes">
					<a href="download.pdf"><span>
					<h5>Title Title Title Title Title Title</h5>
					<p>Author Author Author Author</p>
					</span></a>
					<a href="download.pdf" download="download" alt="">
					
					<img src="extra/downloadicon.png" alt="">
					</a>
					<!-- <p>Not redirecting? Click <a href="download.pdf">here</a></p> -->
				</div>
				<div class="pdf-boxes">
					<a href="download.pdf"><span>
					<h5>Title Title Title Title Title Title</h5>
					<p>Author Author Author Author</p>
					</span></a>
					<a href="download.pdf" download="download" alt="">
					
					<img src="extra/downloadicon.png" alt="">
					</a>
				</div>
				<div class="pdf-boxes">
					<a href="download.pdf"><span>
					<h5>Title Title Title Title Title Title</h5>
					<p>Author Author Author Author</p>
					</span></a>
					<a href="download.pdf" download="download" alt="">
					
					<img src="extra/downloadicon.png" alt="">
					</a>
					<!-- <p>Not redirecting? Click <a href="download.pdf">here</a></p> -->
				</div>
				<div class="pdf-boxes">
					<a href="download.pdf"><span>
					<h5>Title Title Title Title Title Title</h5>
					<p>Author Author Author Author</p>
					</span></a>
					<a href="download.pdf" download="download" alt="">
					
					<img src="extra/downloadicon.png" alt="">
					</a>
					<!-- <p>Not redirecting? Click <a href="download.pdf">here</a></p> -->
				</div>

			<?php } else { ?>
				<h1>Oops!</h1>
				<h2>Sorry, there was a problem sending your message. Click to return to homepage. </h2>
			<?php } ?>
		<div/>
	</body>
</html>