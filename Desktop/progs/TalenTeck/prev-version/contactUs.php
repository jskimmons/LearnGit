<?php
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
  <title>Test</title>
  <link href="css/style.css" rel="stylesheet" type="text/css" />
  </head>
    <body>
      <div class="contactUs">
      <div class="formSubmitted">
      <?php if (isset($success) && $success) { ?>
      <h1>Thank You</h1>
      <h2>Your message has been sent. Click to return to homepage.</h2>
      <a href="index.html"><img src="images/TTlogo2.png">
      <?php } else { ?>
      <h1>Oops!</h1>
      <h2>Sorry, there was a problem sending your message. Click to return to homepage. </h2>
      <a href="index.html"><img src="images/TTlogo2.png">
      <?php } ?>
      <div/>
      <div/>
  </body>
</html>


