<?php header("HTTP/1.1 404 Internal Server Error"); ?>
<?php include 'detect-mobile.php'; ?>
<?php echo file_get_contents("html/header.html"); ?>
<?php echo file_get_contents("html/nav.html"); ?>
<?php echo file_get_contents("html/404.html"); ?>
<?php echo file_get_contents("html/footer.html"); ?>